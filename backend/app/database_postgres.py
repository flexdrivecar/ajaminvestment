import os
import asyncpg
import asyncio
from typing import Dict, List, Optional
from datetime import datetime, timedelta
import uuid
import json
from .models import User, Investment, Transaction, KYCDocument, InvestmentCategory, InvestmentCategoryInfo, UserRole, KYCStatus, TransactionType

class PostgreSQLDatabase:
    def __init__(self):
        self.pool = None
        self.investment_categories = self._init_investment_categories()
    
    async def connect(self):
        """Initialize database connection pool"""
        database_url = os.getenv("DATABASE_URL", "postgresql://ajmal_user:ajmal_password@localhost:5432/ajmal_investments")
        self.pool = await asyncpg.create_pool(database_url, min_size=1, max_size=10)
        await self._create_tables()
    
    async def disconnect(self):
        """Close database connection pool"""
        if self.pool:
            await self.pool.close()
    
    async def _create_tables(self):
        """Create database tables if they don't exist"""
        async with self.pool.acquire() as conn:
            await conn.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    email VARCHAR(255) UNIQUE NOT NULL,
                    hashed_password VARCHAR(255) NOT NULL,
                    first_name VARCHAR(100) NOT NULL,
                    last_name VARCHAR(100) NOT NULL,
                    country VARCHAR(100) NOT NULL,
                    phone VARCHAR(20),
                    role VARCHAR(20) DEFAULT 'user',
                    kyc_status VARCHAR(20) DEFAULT 'pending',
                    is_active BOOLEAN DEFAULT true,
                    balance DECIMAL(15,2) DEFAULT 0.00,
                    referral_code VARCHAR(20) UNIQUE,
                    referred_by UUID REFERENCES users(id),
                    email_verified BOOLEAN DEFAULT false,
                    email_verification_token VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            await conn.execute('''
                CREATE TABLE IF NOT EXISTS investments (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    user_id UUID NOT NULL REFERENCES users(id),
                    category VARCHAR(50) NOT NULL,
                    amount DECIMAL(15,2) NOT NULL,
                    expected_return DECIMAL(5,2) NOT NULL,
                    current_value DECIMAL(15,2) NOT NULL,
                    profit_loss DECIMAL(15,2) DEFAULT 0.00,
                    status VARCHAR(20) DEFAULT 'active',
                    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            await conn.execute('''
                CREATE TABLE IF NOT EXISTS transactions (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    user_id UUID NOT NULL REFERENCES users(id),
                    type VARCHAR(20) NOT NULL,
                    amount DECIMAL(15,2) NOT NULL,
                    description TEXT,
                    status VARCHAR(20) DEFAULT 'completed',
                    investment_id UUID REFERENCES investments(id),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            await conn.execute('''
                CREATE TABLE IF NOT EXISTS kyc_documents (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    user_id UUID NOT NULL REFERENCES users(id),
                    document_type VARCHAR(50) NOT NULL,
                    file_path VARCHAR(500) NOT NULL,
                    status VARCHAR(20) DEFAULT 'pending',
                    admin_notes TEXT,
                    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    reviewed_at TIMESTAMP
                )
            ''')
            
            await conn.execute('''
                CREATE TABLE IF NOT EXISTS referrals (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    referrer_id UUID NOT NULL REFERENCES users(id),
                    referred_id UUID NOT NULL REFERENCES users(id),
                    commission_rate DECIMAL(5,2) DEFAULT 5.00,
                    total_earned DECIMAL(15,2) DEFAULT 0.00,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(referrer_id, referred_id)
                )
            ''')
            
            await conn.execute('''
                CREATE TABLE IF NOT EXISTS email_verifications (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    user_id UUID NOT NULL REFERENCES users(id),
                    token VARCHAR(255) NOT NULL,
                    expires_at TIMESTAMP NOT NULL,
                    used BOOLEAN DEFAULT false,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            await conn.execute('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)')
            await conn.execute('CREATE INDEX IF NOT EXISTS idx_investments_user_id ON investments(user_id)')
            await conn.execute('CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id)')
            await conn.execute('CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id)')
    
    def _init_investment_categories(self):
        """Initialize investment categories (same as in-memory version)"""
        return {
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
    
    async def create_user(self, user_data: dict) -> User:
        """Create a new user"""
        async with self.pool.acquire() as conn:
            referral_code = str(uuid.uuid4())[:8].upper()
            
            referred_by = None
            if 'referral_code' in user_data and user_data['referral_code']:
                referrer = await conn.fetchrow(
                    "SELECT id FROM users WHERE referral_code = $1",
                    user_data['referral_code']
                )
                if referrer:
                    referred_by = referrer['id']
            
            user_id = await conn.fetchval('''
                INSERT INTO users (email, hashed_password, first_name, last_name, country, phone, referral_code, referred_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id
            ''', user_data["email"], user_data["hashed_password"], user_data["first_name"], 
                user_data["last_name"], user_data["country"], user_data.get("phone"), 
                referral_code, referred_by)
            
            if referred_by:
                await conn.execute('''
                    INSERT INTO referrals (referrer_id, referred_id)
                    VALUES ($1, $2)
                ''', referred_by, user_id)
            
            return await self.get_user_by_id(str(user_id))
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        async with self.pool.acquire() as conn:
            row = await conn.fetchrow("SELECT * FROM users WHERE email = $1", email)
            if row:
                return User(**dict(row))
            return None
    
    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID"""
        async with self.pool.acquire() as conn:
            row = await conn.fetchrow("SELECT * FROM users WHERE id = $1", uuid.UUID(user_id))
            if row:
                return User(**dict(row))
            return None
    
    async def update_user(self, user_id: str, updates: dict) -> Optional[User]:
        """Update user information"""
        async with self.pool.acquire() as conn:
            set_clauses = []
            values = []
            param_count = 1
            
            for key, value in updates.items():
                set_clauses.append(f"{key} = ${param_count}")
                values.append(value)
                param_count += 1
            
            values.append(uuid.UUID(user_id))
            
            await conn.execute(f'''
                UPDATE users 
                SET {", ".join(set_clauses)}, updated_at = CURRENT_TIMESTAMP
                WHERE id = ${param_count}
            ''', *values)
            
            return await self.get_user_by_id(user_id)
    
    async def create_investment(self, user_id: str, category: InvestmentCategory, amount: float) -> Investment:
        """Create a new investment"""
        async with self.pool.acquire() as conn:
            category_info = self.investment_categories[category]
            expected_return = (category_info.expected_return_min + category_info.expected_return_max) / 2
            
            investment_id = await conn.fetchval('''
                INSERT INTO investments (user_id, category, amount, expected_return, current_value)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id
            ''', uuid.UUID(user_id), category.value, amount, expected_return, amount)
            
            row = await conn.fetchrow("SELECT * FROM investments WHERE id = $1", investment_id)
            return Investment(**dict(row))
    
    async def get_user_investments(self, user_id: str) -> List[Investment]:
        """Get all investments for a user"""
        async with self.pool.acquire() as conn:
            rows = await conn.fetch("SELECT * FROM investments WHERE user_id = $1 ORDER BY created_at DESC", uuid.UUID(user_id))
            return [Investment(**dict(row)) for row in rows]
    
    async def create_transaction(self, user_id: str, transaction_type: TransactionType, amount: float, description: str, investment_id: Optional[str] = None) -> Transaction:
        """Create a new transaction"""
        async with self.pool.acquire() as conn:
            investment_uuid = uuid.UUID(investment_id) if investment_id else None
            
            transaction_id = await conn.fetchval('''
                INSERT INTO transactions (user_id, type, amount, description, investment_id)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id
            ''', uuid.UUID(user_id), transaction_type.value, amount, description, investment_uuid)
            
            row = await conn.fetchrow("SELECT * FROM transactions WHERE id = $1", transaction_id)
            return Transaction(**dict(row))
    
    async def get_user_transactions(self, user_id: str) -> List[Transaction]:
        """Get all transactions for a user"""
        async with self.pool.acquire() as conn:
            rows = await conn.fetch("SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC", uuid.UUID(user_id))
            return [Transaction(**dict(row)) for row in rows]
    
    def get_investment_categories(self) -> List[InvestmentCategoryInfo]:
        """Get all investment categories"""
        return list(self.investment_categories.values())
    
    def get_investment_category(self, category: InvestmentCategory) -> Optional[InvestmentCategoryInfo]:
        """Get specific investment category"""
        return self.investment_categories.get(category)
    
    async def create_email_verification_token(self, user_id: str) -> str:
        """Create email verification token"""
        async with self.pool.acquire() as conn:
            token = str(uuid.uuid4())
            expires_at = datetime.utcnow() + timedelta(hours=24)
            
            await conn.execute('''
                INSERT INTO email_verifications (user_id, token, expires_at)
                VALUES ($1, $2, $3)
            ''', uuid.UUID(user_id), token, expires_at)
            
            return token
    
    async def verify_email_token(self, token: str) -> Optional[str]:
        """Verify email token and return user_id if valid"""
        async with self.pool.acquire() as conn:
            row = await conn.fetchrow('''
                SELECT user_id FROM email_verifications 
                WHERE token = $1 AND expires_at > CURRENT_TIMESTAMP AND used = false
            ''', token)
            
            if row:
                await conn.execute('''
                    UPDATE email_verifications SET used = true WHERE token = $1
                ''', token)
                
                await conn.execute('''
                    UPDATE users SET email_verified = true WHERE id = $1
                ''', row['user_id'])
                
                return str(row['user_id'])
            return None
    
    async def get_user_referrals(self, user_id: str) -> List[dict]:
        """Get referral information for a user"""
        async with self.pool.acquire() as conn:
            rows = await conn.fetch('''
                SELECT r.*, u.first_name, u.last_name, u.email, u.created_at as referred_date
                FROM referrals r
                JOIN users u ON r.referred_id = u.id
                WHERE r.referrer_id = $1
                ORDER BY r.created_at DESC
            ''', uuid.UUID(user_id))
            
            return [dict(row) for row in rows]
    
    async def update_referral_earnings(self, referrer_id: str, amount: float):
        """Update referral earnings"""
        async with self.pool.acquire() as conn:
            await conn.execute('''
                UPDATE referrals 
                SET total_earned = total_earned + $1
                WHERE referrer_id = $2
            ''', amount, uuid.UUID(referrer_id))

postgres_db = PostgreSQLDatabase()
