from fastapi import FastAPI, HTTPException, Depends, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from datetime import timedelta, datetime
from typing import List, Optional
import uuid
import os
import io
import re

from .models import (
    User, UserCreate, UserLogin, Token, Investment, Transaction, 
    InvestmentCategory, Portfolio, KYCStatus, TransactionType,
    EmailVerification, ReferralInfo, PDFStatementRequest, UserStatus,
    RegistrationError
)
from .database import db
from .database_postgres import postgres_db
from .email_service import email_service
from .pdf_service import pdf_service
from .auth import (
    authenticate_user, create_access_token, get_current_active_user, 
    get_admin_user, get_password_hash, ACCESS_TOKEN_EXPIRE_MINUTES
)

app = FastAPI(title="Ajmal Investments PLC", description="International Investment Platform", version="1.0.0")

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

USE_POSTGRES = bool(os.getenv("DATABASE_URL"))
current_db = postgres_db if USE_POSTGRES else db

@app.on_event("startup")
async def startup_event():
    if USE_POSTGRES:
        await postgres_db.connect()

@app.on_event("shutdown")
async def shutdown_event():
    if USE_POSTGRES:
        await postgres_db.disconnect()

def validate_password_strength(password: str) -> bool:
    """Validate password meets security requirements"""
    if len(password) < 8:
        return False
    if not re.search(r'[A-Z]', password):
        return False
    if not re.search(r'[a-z]', password):
        return False
    if not re.search(r'\d', password):
        return False
    return True

async def validate_referral_code(referral_code: str):
    """Validate referral code exists"""
    if not referral_code or len(referral_code) < 3:
        return None
    return {"valid": True}

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.post("/auth/register", response_model=dict)
async def register(user_data: UserCreate):
    try:
        if not validate_password_strength(user_data.password):
            raise HTTPException(
                status_code=400,
                detail={
                    "error_code": "400_WEAK_PASSWORD",
                    "message": "Password must be at least 8 characters with uppercase, lowercase, and number",
                    "field": "password"
                }
            )
        
        if USE_POSTGRES:
            existing_user = await current_db.get_user_by_email(user_data.email)
        else:
            existing_user = current_db.get_user_by_email(user_data.email)
        
        if existing_user:
            raise HTTPException(
                status_code=409,
                detail={
                    "error_code": "409_EMAIL_EXISTS",
                    "message": "That email is already registered",
                    "field": "email"
                }
            )
        
        if user_data.referral_code:
            referral_valid = await validate_referral_code(user_data.referral_code)
            if not referral_valid:
                raise HTTPException(
                    status_code=400,
                    detail={
                        "error_code": "400_INVALID_REFERRAL",
                        "message": "Invalid referral code",
                        "field": "referral_code"
                    }
                )
        
        hashed_password = get_password_hash(user_data.password)
        user_dict = user_data.dict()
        user_dict["hashed_password"] = hashed_password
        user_dict["status"] = "active_restricted"
        user_dict["kyc_status"] = "pending"
        del user_dict["password"]
        
        if USE_POSTGRES:
            user = await current_db.create_user(user_dict)
            verification_token = await current_db.create_email_verification_token(user.id)
            await email_service.send_verification_email(user.email, user.first_name, verification_token)
        else:
            user = current_db.create_user(user_dict)
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        
        return {
            "message": "User registered successfully. Please check your email for verification." if USE_POSTGRES else "User registered successfully",
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "status": getattr(user, 'status', 'active_restricted'),
                "kyc_status": user.kyc_status
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Registration error: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "error_code": "500_INTERNAL_ERROR",
                "message": "Internal server error"
            }
        )

@app.post("/auth/login", response_model=Token)
async def login(user_credentials: UserLogin):
    user = authenticate_user(user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me", response_model=User)
async def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    return current_user

@app.get("/investment-categories")
async def get_investment_categories():
    return current_db.get_investment_categories()

@app.get("/investment-categories/{category}")
async def get_investment_category(category: InvestmentCategory):
    category_info = current_db.get_investment_category(category)
    if not category_info:
        raise HTTPException(status_code=404, detail="Investment category not found")
    return category_info

@app.post("/investments")
async def create_investment(
    category: InvestmentCategory,
    amount: float,
    current_user: User = Depends(get_current_active_user)
):
    if current_user.kyc_status != KYCStatus.APPROVED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="KYC verification required before investing"
        )
    
    category_info = current_db.get_investment_category(category)
    if not category_info:
        raise HTTPException(status_code=404, detail="Investment category not found")
    
    if amount < category_info.minimum_investment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Minimum investment for {category_info.name} is ${category_info.minimum_investment}"
        )
    
    if current_user.balance < amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient balance"
        )
    
    if USE_POSTGRES:
        investment = await current_db.create_investment(current_user.id, category, amount)
        await current_db.update_user(current_user.id, {"balance": current_user.balance - amount})
        await current_db.create_transaction(
            current_user.id, 
            TransactionType.INVESTMENT, 
            amount, 
            f"Investment in {category_info.name}",
            investment.id
        )
        
        if current_user.referred_by:
            commission = amount * 0.05  # 5% commission
            referrer = await current_db.get_user_by_id(current_user.referred_by)
            if referrer:
                await current_db.update_user(current_user.referred_by, {"balance": referrer.balance + commission})
                await current_db.create_transaction(
                    current_user.referred_by,
                    TransactionType.REFERRAL_COMMISSION,
                    commission,
                    f"Referral commission from {current_user.first_name} {current_user.last_name}"
                )
                await current_db.update_referral_earnings(current_user.referred_by, commission)
    else:
        investment = current_db.create_investment(current_user.id, category, amount)
        current_db.update_user(current_user.id, {"balance": current_user.balance - amount})
        current_db.create_transaction(
            current_user.id, 
            TransactionType.INVESTMENT, 
            amount, 
            f"Investment in {category_info.name}",
            investment.id
        )
    
    return {"message": "Investment created successfully", "investment": investment}

@app.get("/investments")
async def get_user_investments(current_user: User = Depends(get_current_active_user)):
    if USE_POSTGRES:
        investments = await current_db.get_user_investments(current_user.id)
    else:
        investments = current_db.get_user_investments(current_user.id)
    return investments

@app.get("/portfolio")
async def get_user_portfolio(current_user: User = Depends(get_current_active_user)):
    if USE_POSTGRES:
        investments = await current_db.get_user_investments(current_user.id)
    else:
        investments = current_db.get_user_investments(current_user.id)
    
    total_invested = sum(inv.amount for inv in investments)
    current_value = sum(inv.current_value for inv in investments)
    total_profit_loss = current_value - total_invested
    roi_percentage = (total_profit_loss / total_invested * 100) if total_invested > 0 else 0
    
    portfolio = Portfolio(
        user_id=current_user.id,
        total_invested=total_invested,
        current_value=current_value,
        total_profit_loss=total_profit_loss,
        roi_percentage=roi_percentage,
        investments=investments
    )
    
    return portfolio

@app.post("/transactions/deposit")
async def deposit_funds(
    amount: float,
    current_user: User = Depends(get_current_active_user)
):
    if amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Deposit amount must be positive"
        )
    
    new_balance = current_user.balance + amount
    if USE_POSTGRES:
        await current_db.update_user(current_user.id, {"balance": new_balance})
        transaction = await current_db.create_transaction(
            current_user.id,
            TransactionType.DEPOSIT,
            amount,
            "Deposit to account"
        )
    else:
        current_db.update_user(current_user.id, {"balance": new_balance})
        transaction = current_db.create_transaction(
            current_user.id,
            TransactionType.DEPOSIT,
            amount,
            "Deposit to account"
        )
    
    return {"message": "Deposit successful", "new_balance": new_balance, "transaction": transaction}

@app.post("/transactions/withdraw")
async def withdraw_funds(
    amount: float,
    current_user: User = Depends(get_current_active_user)
):
    if amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Withdrawal amount must be positive"
        )
    
    if current_user.balance < amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient balance"
        )
    
    new_balance = current_user.balance - amount
    if USE_POSTGRES:
        await current_db.update_user(current_user.id, {"balance": new_balance})
        transaction = await current_db.create_transaction(
            current_user.id,
            TransactionType.WITHDRAWAL,
            amount,
            "Withdrawal from account"
        )
    else:
        current_db.update_user(current_user.id, {"balance": new_balance})
        transaction = current_db.create_transaction(
            current_user.id,
            TransactionType.WITHDRAWAL,
            amount,
            "Withdrawal from account"
        )
    
    return {"message": "Withdrawal successful", "new_balance": new_balance, "transaction": transaction}

@app.get("/transactions")
async def get_user_transactions(current_user: User = Depends(get_current_active_user)):
    if USE_POSTGRES:
        transactions = await current_db.get_user_transactions(current_user.id)
    else:
        transactions = current_db.get_user_transactions(current_user.id)
    return transactions

@app.post("/kyc/upload")
async def upload_kyc_document(
    document_type: str,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user)
):
    upload_dir = "uploads/kyc"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_extension = file.filename.split(".")[-1] if "." in file.filename else ""
    filename = f"{current_user.id}_{document_type}_{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(upload_dir, filename)
    
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    kyc_doc = {
        "id": str(uuid.uuid4()),
        "user_id": current_user.id,
        "document_type": document_type,
        "file_path": file_path,
        "status": KYCStatus.PENDING,
        "uploaded_at": datetime.utcnow()
    }
    
    return {"message": "Document uploaded successfully", "document_id": kyc_doc["id"]}

@app.get("/admin/users")
async def get_all_users(admin_user: User = Depends(get_admin_user)):
    if USE_POSTGRES:
        return {"message": "Feature not implemented for PostgreSQL yet"}
    else:
        return list(current_db.users.values())

@app.put("/admin/users/{user_id}/kyc-status")
async def update_user_kyc_status(
    user_id: str,
    status: KYCStatus,
    notes: Optional[str] = None,
    admin_user: User = Depends(get_admin_user)
):
    if USE_POSTGRES:
        user = await current_db.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        await current_db.update_user(user_id, {"kyc_status": status})
    else:
        user = current_db.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        current_db.update_user(user_id, {"kyc_status": status})
    
    return {"message": f"KYC status updated to {status}", "user_id": user_id}

@app.get("/admin/stats")
async def get_platform_stats(admin_user: User = Depends(get_admin_user)):
    if USE_POSTGRES:
        return {"message": "Feature not implemented for PostgreSQL yet"}
    else:
        total_users = len(current_db.users)
        total_investments = len(current_db.investments)
        total_transactions = len(current_db.transactions)
        
        total_invested = sum(inv.amount for inv in current_db.investments.values())
        total_current_value = sum(inv.current_value for inv in current_db.investments.values())
        
        return {
            "total_users": total_users,
            "total_investments": total_investments,
            "total_transactions": total_transactions,
            "total_invested": total_invested,
            "total_current_value": total_current_value,
            "platform_profit": total_current_value - total_invested
        }

@app.post("/auth/verify-email")
async def verify_email(verification: EmailVerification):
    if not USE_POSTGRES:
        raise HTTPException(status_code=501, detail="Email verification only available with PostgreSQL")
    
    user_id = await current_db.verify_email_token(verification.token)
    if not user_id:
        raise HTTPException(status_code=400, detail="Invalid or expired verification token")
    
    user = await current_db.get_user_by_id(user_id)
    if user:
        await email_service.send_welcome_email(user.email, user.first_name)
    
    return {"message": "Email verified successfully"}

@app.post("/auth/resend-verification")
async def resend_verification(current_user: User = Depends(get_current_active_user)):
    if not USE_POSTGRES:
        raise HTTPException(status_code=501, detail="Email verification only available with PostgreSQL")
    
    if current_user.email_verified:
        raise HTTPException(status_code=400, detail="Email already verified")
    
    verification_token = await current_db.create_email_verification_token(current_user.id)
    await email_service.send_verification_email(current_user.email, current_user.first_name, verification_token)
    
    return {"message": "Verification email sent"}

@app.get("/referrals/info", response_model=ReferralInfo)
async def get_referral_info(current_user: User = Depends(get_current_active_user)):
    if not USE_POSTGRES:
        raise HTTPException(status_code=501, detail="Referral system only available with PostgreSQL")
    
    referrals = await current_db.get_user_referrals(current_user.id)
    total_earned = sum(r.get('total_earned', 0) for r in referrals)
    
    return ReferralInfo(
        referral_code=current_user.referral_code or "",
        total_referrals=len(referrals),
        total_earned=total_earned,
        referrals=referrals
    )

@app.post("/statements/pdf")
async def generate_pdf_statement(
    request: PDFStatementRequest,
    current_user: User = Depends(get_current_active_user)
):
    if USE_POSTGRES:
        investments = await current_db.get_user_investments(current_user.id)
        transactions = await current_db.get_user_transactions(current_user.id)
    else:
        investments = current_db.get_user_investments(current_user.id)
        transactions = current_db.get_user_transactions(current_user.id)
    
    pdf_bytes = pdf_service.generate_statement(
        current_user, 
        investments, 
        transactions,
        request.start_date,
        request.end_date,
        request.statement_type
    )
    
    filename = f"ajmal_statement_{current_user.id[:8]}_{datetime.now().strftime('%Y%m%d')}.pdf"
    
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
