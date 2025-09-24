from typing import Dict, List, Optional
from datetime import datetime, timedelta
import uuid
from .models import User, Investment, Transaction, KYCDocument, InvestmentCategory, InvestmentCategoryInfo, UserRole, KYCStatus, TransactionType

class InMemoryDatabase:
    def __init__(self):
        self.users: Dict[str, User] = {}
        self.investments: Dict[str, Investment] = {}
        self.transactions: Dict[str, Transaction] = {}
        self.kyc_documents: Dict[str, KYCDocument] = {}
        self.user_emails: Dict[str, str] = {}  # email -> user_id mapping
        self._init_investment_categories()
    
    def _init_investment_categories(self):
        self.investment_categories = {
            InvestmentCategory.STOCKS_EQUITIES: InvestmentCategoryInfo(
                category=InvestmentCategory.STOCKS_EQUITIES,
                name="Stocks & Equities (Growth-Oriented)",
                description="Investments in emerging market stocks, tech & innovation companies, and small-cap stocks with high growth potential.",
                expected_return_min=8.0,
                expected_return_max=15.0,
                risk_level="Medium-High",
                minimum_investment=1000.0,
                details={
                    "focus_areas": ["Emerging Markets (India, Vietnam, Nigeria)", "Tech & Innovation (AI, biotech, EVs, fintech)", "Small-Cap Growth Companies"],
                    "investment_horizon": "3-7 years",
                    "liquidity": "High"
                }
            ),
            InvestmentCategory.PRIVATE_EQUITY: InvestmentCategoryInfo(
                category=InvestmentCategory.PRIVATE_EQUITY,
                name="Private Equity",
                description="Investments in private companies through buyouts, growth capital, and distressed asset turnarounds.",
                expected_return_min=15.0,
                expected_return_max=25.0,
                risk_level="High",
                minimum_investment=50000.0,
                details={
                    "strategies": ["Buyouts", "Growth Capital", "Distressed Asset Turnarounds"],
                    "investment_horizon": "5-10 years",
                    "liquidity": "Low (long lock-up periods)"
                }
            ),
            InvestmentCategory.VENTURE_CAPITAL: InvestmentCategoryInfo(
                category=InvestmentCategory.VENTURE_CAPITAL,
                name="Venture Capital (Startups)",
                description="Early-stage funding for technology, healthcare, green energy, and fintech startups with 10x+ return potential.",
                expected_return_min=10.0,
                expected_return_max=50.0,
                risk_level="Very High",
                minimum_investment=25000.0,
                details={
                    "sectors": ["Technology", "Healthcare", "Green Energy", "Fintech"],
                    "stage": "Early-stage companies",
                    "success_examples": ["Uber, Airbnb, Stripe-type opportunities"]
                }
            ),
            InvestmentCategory.HEDGE_FUNDS: InvestmentCategoryInfo(
                category=InvestmentCategory.HEDGE_FUNDS,
                name="Hedge Funds (Alternative Strategies)",
                description="Complex strategies including long/short equity, global macro, and event-driven trades designed to outperform in any market condition.",
                expected_return_min=12.0,
                expected_return_max=20.0,
                risk_level="High",
                minimum_investment=100000.0,
                details={
                    "strategies": ["Long/Short Equity", "Global Macro", "Event-Driven Trades"],
                    "goal": "Outperform markets in any condition",
                    "track_record": "15-20% annualized returns over decades"
                }
            ),
            InvestmentCategory.REAL_ESTATE: InvestmentCategoryInfo(
                category=InvestmentCategory.REAL_ESTATE,
                name="Real Estate (High-Growth Markets)",
                description="Commercial real estate and development projects in rapidly developing cities with high IRR potential.",
                expected_return_min=12.0,
                expected_return_max=20.0,
                risk_level="Medium-High",
                minimum_investment=10000.0,
                details={
                    "markets": ["Dubai", "Nairobi", "Singapore", "Other emerging cities"],
                    "types": ["Commercial Real Estate", "Development Projects"],
                    "focus": "High IRR (Internal Rate of Return)"
                }
            ),
            InvestmentCategory.COMMODITIES: InvestmentCategoryInfo(
                category=InvestmentCategory.COMMODITIES,
                name="Commodities & Natural Resources",
                description="Investments in gold, precious metals, oil & gas projects, and critical minerals for EV/battery demand.",
                expected_return_min=8.0,
                expected_return_max=25.0,
                risk_level="Medium-High",
                minimum_investment=5000.0,
                details={
                    "categories": ["Gold & Precious Metals", "Oil & Gas Projects", "Critical Minerals (Lithium, Coltan, Cobalt)"],
                    "drivers": ["Inflation hedge", "Commodity booms", "EV/battery demand surge"]
                }
            ),
            InvestmentCategory.CRYPTOCURRENCIES: InvestmentCategoryInfo(
                category=InvestmentCategory.CRYPTOCURRENCIES,
                name="Cryptocurrencies & Blockchain Assets",
                description="Bitcoin & Ethereum long-term holdings, DeFi projects, stablecoin lending, and tokenized assets.",
                expected_return_min=8.0,
                expected_return_max=30.0,
                risk_level="Very High",
                minimum_investment=1000.0,
                details={
                    "assets": ["Bitcoin & Ethereum", "DeFi Projects", "Stablecoin Lending", "NFTs & Tokenized Assets"],
                    "yields": "8-20%+ from DeFi lending",
                    "volatility": "High volatility, high potential returns"
                }
            ),
            InvestmentCategory.HIGH_YIELD_BONDS: InvestmentCategoryInfo(
                category=InvestmentCategory.HIGH_YIELD_BONDS,
                name="High-Yield Bonds (Junk Bonds)",
                description="Corporate bonds with lower credit ratings but higher interest rates, popular in U.S. and European markets.",
                expected_return_min=8.0,
                expected_return_max=12.0,
                risk_level="Medium",
                minimum_investment=5000.0,
                details={
                    "markets": ["U.S. and European corporate bonds"],
                    "characteristics": ["Lower credit ratings", "Higher fixed-income returns"],
                    "target_audience": "Investors seeking high fixed-income returns"
                }
            ),
            InvestmentCategory.RENEWABLE_ENERGY: InvestmentCategoryInfo(
                category=InvestmentCategory.RENEWABLE_ENERGY,
                name="Renewable Energy & Infrastructure",
                description="Solar, wind, and hydro projects backed by government incentives, attracting ESG-focused global investors.",
                expected_return_min=12.0,
                expected_return_max=18.0,
                risk_level="Medium",
                minimum_investment=10000.0,
                details={
                    "projects": ["Solar", "Wind", "Hydro"],
                    "backing": "Government incentives and subsidies",
                    "appeal": "ESG-focused global investors"
                }
            )
        }
    
    def create_user(self, user_data: dict) -> User:
        user_id = str(uuid.uuid4())
        now = datetime.utcnow()
        
        user = User(
            id=user_id,
            email=user_data["email"],
            first_name=user_data["first_name"],
            last_name=user_data["last_name"],
            country=user_data["country"],
            phone=user_data.get("phone"),
            role=UserRole.USER,
            kyc_status=KYCStatus.PENDING,
            is_active=True,
            balance=0.0,
            created_at=now,
            updated_at=now
        )
        
        if "hashed_password" in user_data:
            user.hashed_password = user_data["hashed_password"]
        
        self.users[user_id] = user
        self.user_emails[user_data["email"]] = user_id
        return user
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        user_id = self.user_emails.get(email)
        if user_id:
            return self.users.get(user_id)
        return None
    
    def get_user_by_id(self, user_id: str) -> Optional[User]:
        return self.users.get(user_id)
    
    def update_user(self, user_id: str, updates: dict) -> Optional[User]:
        if user_id in self.users:
            user = self.users[user_id]
            for key, value in updates.items():
                if hasattr(user, key):
                    setattr(user, key, value)
            user.updated_at = datetime.utcnow()
            return user
        return None
    
    def create_investment(self, user_id: str, category: InvestmentCategory, amount: float) -> Investment:
        investment_id = str(uuid.uuid4())
        now = datetime.utcnow()
        
        category_info = self.investment_categories[category]
        expected_return = (category_info.expected_return_min + category_info.expected_return_max) / 2
        
        investment = Investment(
            id=investment_id,
            user_id=user_id,
            category=category,
            amount=amount,
            expected_return=expected_return,
            start_date=now,
            current_value=amount,
            profit_loss=0.0,
            status="active",
            created_at=now
        )
        
        self.investments[investment_id] = investment
        return investment
    
    def get_user_investments(self, user_id: str) -> List[Investment]:
        return [inv for inv in self.investments.values() if inv.user_id == user_id]
    
    def create_transaction(self, user_id: str, transaction_type: TransactionType, amount: float, description: str, investment_id: Optional[str] = None) -> Transaction:
        transaction_id = str(uuid.uuid4())
        now = datetime.utcnow()
        
        transaction = Transaction(
            id=transaction_id,
            user_id=user_id,
            type=transaction_type,
            amount=amount,
            description=description,
            status="completed",
            created_at=now,
            investment_id=investment_id
        )
        
        self.transactions[transaction_id] = transaction
        return transaction
    
    def get_user_transactions(self, user_id: str) -> List[Transaction]:
        return [txn for txn in self.transactions.values() if txn.user_id == user_id]
    
    def get_investment_categories(self) -> List[InvestmentCategoryInfo]:
        return list(self.investment_categories.values())
    
    def get_investment_category(self, category: InvestmentCategory) -> Optional[InvestmentCategoryInfo]:
        return self.investment_categories.get(category)

db = InMemoryDatabase()
