from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from datetime import datetime
import os
from dotenv import load_dotenv
import logging
import asyncio

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    logger.error("DATABASE_URL not found in .env file")
    raise EnvironmentError("DATABASE_URL is missing in the .env file")

# Create async engine with connection timeout and pool settings
engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    connect_args={"timeout": 10},
    pool_size=5,
    max_overflow=10
)
AsyncSessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

# Models (unchanged)
class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=True)
    model_type = Column(String, nullable=False)
    input_data = Column(Text, nullable=False)
    prediction = Column(String, nullable=False)
    probability = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True, nullable=False)
    user_id = Column(String, index=True, nullable=True)
    mode = Column(String, nullable=False)
    role = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class LoanDefaultStats(Base):
    __tablename__ = "loan_default_stats"
    id = Column(Integer, primary_key=True, index=True)
    averageAge = Column(Float, nullable=False)
    averageIncome = Column(Float, nullable=False)
    averageLoanAmount = Column(Float, nullable=False)
    defaultRate = Column(Float, nullable=False)
    defaultDistribution = Column(Text, nullable=False)
    educationDistribution = Column(Text, nullable=False)
    loanPurposeDistribution = Column(Text, nullable=False)
    employmentTypeDistribution = Column(Text, nullable=False)
    maritalStatusDistribution = Column(Text, nullable=False)
    dtiDistribution = Column(Text, nullable=False)

class CreditRiskStats(Base):
    __tablename__ = "credit_risk_stats"
    id = Column(Integer, primary_key=True, index=True)
    averageAge = Column(Float, nullable=False)
    averageIncome = Column(Float, nullable=False)
    averageLoanAmount = Column(Float, nullable=False)
    defaultRate = Column(Float, nullable=False)
    defaultDistribution = Column(Text, nullable=False)
    homeOwnershipDistribution = Column(Text, nullable=False)
    loanIntentDistribution = Column(Text, nullable=False)
    loanGradeDistribution = Column(Text, nullable=False)
    defaultOnFileDistribution = Column(Text, nullable=False)
    loanPercentIncomeDistribution = Column(Text, nullable=False)

async def init_db():
    retries = 3
    for attempt in range(retries):
        try:
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
            logger.info("Database tables created successfully")
            return
        except Exception as e:
            logger.warning(f"Attempt {attempt + 1}/{retries} failed: {e}")
            if attempt < retries - 1:
                await asyncio.sleep(2)
            else:
                logger.error(f"Error creating database tables: {e}", exc_info=True)
                raise e from e 
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception as e:
            logger.error(f"Database session error: {e}", exc_info=True)
            await session.rollback()
            raise e
        finally:
            await session.close()
async def close_db():
    await AsyncSessionLocal().close()
async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
async def drop_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)