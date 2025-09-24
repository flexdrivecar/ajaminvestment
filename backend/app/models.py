from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"

class KYCStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class InvestmentCategory(str, Enum):
    STOCKS_EQUITIES = "stocks_equities"
    PRIVATE_EQUITY = "private_equity"
    VENTURE_CAPITAL = "venture_capital"
    HEDGE_FUNDS = "hedge_funds"
    REAL_ESTATE = "real_estate"
    COMMODITIES = "commodities"
    CRYPTOCURRENCIES = "cryptocurrencies"
    HIGH_YIELD_BONDS = "high_yield_bonds"
    RENEWABLE_ENERGY = "renewable_energy"

class TransactionType(str, Enum):
    DEPOSIT = "deposit"
    WITHDRAWAL = "withdrawal"
    INVESTMENT = "investment"
    PROFIT = "profit"

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    country: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: str
    email: EmailStr
    first_name: str
    last_name: str
    country: str
    phone: Optional[str] = None
    role: UserRole = UserRole.USER
    kyc_status: KYCStatus = KYCStatus.PENDING
    is_active: bool = True
    balance: float = 0.0
    created_at: datetime
    updated_at: datetime
    hashed_password: Optional[str] = None

class KYCDocument(BaseModel):
    id: str
    user_id: str
    document_type: str
    file_path: str
    status: KYCStatus = KYCStatus.PENDING
    uploaded_at: datetime
    reviewed_at: Optional[datetime] = None
    reviewer_id: Optional[str] = None
    notes: Optional[str] = None

class InvestmentCategoryInfo(BaseModel):
    category: InvestmentCategory
    name: str
    description: str
    expected_return_min: float
    expected_return_max: float
    risk_level: str
    minimum_investment: float
    details: Dict[str, Any]

class Investment(BaseModel):
    id: str
    user_id: str
    category: InvestmentCategory
    amount: float
    expected_return: float
    start_date: datetime
    end_date: Optional[datetime] = None
    current_value: float
    profit_loss: float
    status: str = "active"
    created_at: datetime

class Portfolio(BaseModel):
    user_id: str
    total_invested: float
    current_value: float
    total_profit_loss: float
    roi_percentage: float
    investments: List[Investment]

class Transaction(BaseModel):
    id: str
    user_id: str
    type: TransactionType
    amount: float
    description: str
    status: str = "completed"
    created_at: datetime
    investment_id: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None
