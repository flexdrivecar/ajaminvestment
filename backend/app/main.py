from fastapi import FastAPI, HTTPException, Depends, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta, datetime
from typing import List, Optional
import uuid
import os

from .models import (
    User, UserCreate, UserLogin, Token, Investment, Transaction, 
    InvestmentCategory, Portfolio, KYCStatus, TransactionType
)
from .database import db
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

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.post("/auth/register", response_model=dict)
async def register(user_data: UserCreate):
    if db.get_user_by_email(user_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = get_password_hash(user_data.password)
    user_dict = user_data.dict()
    user_dict["hashed_password"] = hashed_password
    del user_dict["password"]
    
    user = db.create_user(user_dict)
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {
        "message": "User registered successfully",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "kyc_status": user.kyc_status
        }
    }

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
    return db.get_investment_categories()

@app.get("/investment-categories/{category}")
async def get_investment_category(category: InvestmentCategory):
    category_info = db.get_investment_category(category)
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
    
    category_info = db.get_investment_category(category)
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
    
    investment = db.create_investment(current_user.id, category, amount)
    
    db.update_user(current_user.id, {"balance": current_user.balance - amount})
    
    db.create_transaction(
        current_user.id, 
        TransactionType.INVESTMENT, 
        amount, 
        f"Investment in {category_info.name}",
        investment.id
    )
    
    return {"message": "Investment created successfully", "investment": investment}

@app.get("/investments")
async def get_user_investments(current_user: User = Depends(get_current_active_user)):
    investments = db.get_user_investments(current_user.id)
    return investments

@app.get("/portfolio")
async def get_user_portfolio(current_user: User = Depends(get_current_active_user)):
    investments = db.get_user_investments(current_user.id)
    
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
    db.update_user(current_user.id, {"balance": new_balance})
    
    transaction = db.create_transaction(
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
    db.update_user(current_user.id, {"balance": new_balance})
    
    transaction = db.create_transaction(
        current_user.id,
        TransactionType.WITHDRAWAL,
        amount,
        "Withdrawal from account"
    )
    
    return {"message": "Withdrawal successful", "new_balance": new_balance, "transaction": transaction}

@app.get("/transactions")
async def get_user_transactions(current_user: User = Depends(get_current_active_user)):
    transactions = db.get_user_transactions(current_user.id)
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
    return list(db.users.values())

@app.put("/admin/users/{user_id}/kyc-status")
async def update_user_kyc_status(
    user_id: str,
    status: KYCStatus,
    notes: Optional[str] = None,
    admin_user: User = Depends(get_admin_user)
):
    user = db.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.update_user(user_id, {"kyc_status": status})
    
    return {"message": f"KYC status updated to {status}", "user_id": user_id}

@app.get("/admin/stats")
async def get_platform_stats(admin_user: User = Depends(get_admin_user)):
    total_users = len(db.users)
    total_investments = len(db.investments)
    total_transactions = len(db.transactions)
    
    total_invested = sum(inv.amount for inv in db.investments.values())
    total_current_value = sum(inv.current_value for inv in db.investments.values())
    
    return {
        "total_users": total_users,
        "total_investments": total_investments,
        "total_transactions": total_transactions,
        "total_invested": total_invested,
        "total_current_value": total_current_value,
        "platform_profit": total_current_value - total_invested
    }
