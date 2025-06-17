from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
import pandas as pd
import pickle
from preprocessing import preprocess_input
import google.generativeai as genai
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv
import os
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI()

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    logger.error("❌ GEMINI_API_KEY not found in environment variables.")
    raise EnvironmentError("GEMINI_API_KEY is missing in the .env file.")

# Optional: choose model from env
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)
chat_model = genai.GenerativeModel(GEMINI_MODEL)

MODEL_DIR = "backend/model"
MODEL_PATH = os.path.join(MODEL_DIR, "loan_model.pkl")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.pkl")
CREDIT_RISK_MODEL_PATH = os.path.join(MODEL_DIR, "credit_risk_model.pkl")
CREDIT_RISK_SCALER_PATH = os.path.join(MODEL_DIR, "credit_risk_scaler.pkl")

try:
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
    if not os.path.exists(SCALER_PATH):
        raise FileNotFoundError(f"Scaler file not found at {SCALER_PATH}")
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    with open(SCALER_PATH, 'rb') as f:
        scaler = pickle.load(f)
except Exception as e:
    logger.error(f"Error loading model/scaler: {e}", exc_info=True)
    raise ValueError(f"Failed to load model or scaler: {str(e)}")

try:
    if not os.path.exists(CREDIT_RISK_MODEL_PATH):
        raise FileNotFoundError(f"Credit risk model file not found at {CREDIT_RISK_MODEL_PATH}")
    if not os.path.exists(CREDIT_RISK_SCALER_PATH):
        raise FileNotFoundError(f"Credit risk scaler file not found at {CREDIT_RISK_SCALER_PATH}")
    with open(CREDIT_RISK_MODEL_PATH, 'rb') as f:
        credit_risk_model = pickle.load(f)
    with open(CREDIT_RISK_SCALER_PATH, 'rb') as f:
        credit_risk_scaler = pickle.load(f)
except Exception as e:
    logger.error(f"Error loading credit risk model/scaler: {e}", exc_info=True)
    raise ValueError(f"Failed to load credit risk model or scaler: {str(e)}")

class ChatInput(BaseModel):
    message: str

class LoanInput(BaseModel):
    Age: int
    Income: float
    LoanAmount: float
    CreditScore: int
    MonthsEmployed: int
    NumCreditLines: int
    InterestRate: float
    LoanTerm: int
    DTIRatio: float
    Education: str
    EmploymentType: str
    MaritalStatus: str
    HasMortgage: str
    HasDependents: str
    LoanPurpose: str
    HasCoSigner: str

    @field_validator('Education')
    @classmethod
    def validate_education(cls, v: str) -> str:
        valid = ['high school', 'bachelor', "master's", 'phd']
        if v.lower() not in valid:
            raise ValueError(f"Education must be one of {valid}")
        return v.lower()

    @field_validator('EmploymentType')
    @classmethod
    def validate_employment(cls, v: str) -> str:
        valid = ['full-time', 'part-time', 'self-employed', 'unemployed']
        if v.lower() not in valid:
            raise ValueError(f"EmploymentType must be one of {valid}")
        return v.lower()

    @field_validator('MaritalStatus')
    @classmethod
    def validate_marital(cls, v: str) -> str:
        valid = ['single', 'married', 'divorced']
        if v.lower() not in valid:
            raise ValueError(f"MaritalStatus must be one of {valid}")
        return v.lower()

    @field_validator('HasMortgage', 'HasDependents', 'HasCoSigner')
    @classmethod
    def validate_yes_no(cls, v: str) -> str:
        valid = ['yes', 'no']
        if v.lower() not in valid:
            raise ValueError(f"Value must be one of {valid}")
        return v.lower()

    @field_validator('LoanPurpose')
    @classmethod
    def validate_purpose(cls, v: str) -> str:
        valid = ['auto', 'business', 'education', 'home', 'other']
        if v.lower() not in valid:
            raise ValueError(f"LoanPurpose must be one of {valid}")
        return v.lower()

class CreditRiskInput(BaseModel):
    person_age: float
    person_income: float
    person_home_ownership: str
    person_emp_length: float
    loan_intent: str
    loan_grade: str
    loan_amnt: float
    loan_int_rate: float
    loan_percent_income: float
    cb_person_default_on_file: str
    cb_person_cred_hist_length: float

    @field_validator('person_home_ownership')
    @classmethod
    def validate_home_ownership(cls, v: str) -> str:
        valid = ['rent', 'own', 'mortgage', 'other']
        if v.lower() not in valid:
            raise ValueError(f"Home ownership must be one of {valid}")
        return v.lower()

    @field_validator('loan_intent')
    @classmethod
    def validate_loan_intent(cls, v: str) -> str:
        valid = ['personal', 'education', 'medical', 'venture', 'homeimprovement', 'debtconsolidation']
        if v.lower() not in valid:
            raise ValueError(f"Loan intent must be one of {valid}")
        return v.lower()

    @field_validator('loan_grade')
    @classmethod
    def validate_loan_grade(cls, v: str) -> str:
        valid = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
        if v.lower() not in valid:
            raise ValueError(f"Loan grade must be one of {valid}")
        return v.lower()

    @field_validator('cb_person_default_on_file')
    @classmethod
    def validate_default_on_file(cls, v: str) -> str:
        valid = ['y', 'n']
        if v.lower() not in valid:
            raise ValueError(f"Default on file must be one of {valid}")
        return v.lower()

@app.post("/predict/")
async def predict_loan_default(input_data: LoanInput):
    try:
        input_dict = input_data.dict()
        df = pd.DataFrame([input_dict])
        processed_input = preprocess_input(df, scaler, model_type='loan_default')
        prediction = model.predict(processed_input)[0]
        probability = model.predict_proba(processed_input)[0][1]
        return {
            "prediction": int(prediction),
            "probability": float(probability)
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=f"Invalid input: {str(ve)}")
    except Exception as e:
        logger.error(f"Error in predict_loan_default: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@app.post("/credit_risk/")
async def predict_credit_risk(input_data: CreditRiskInput):
    try:
        input_dict = input_data.dict()
        processed_input = preprocess_input(input_dict, scaler=credit_risk_scaler, model_type='credit_risk')
        prediction = credit_risk_model.predict([processed_input])[0]
        probability = credit_risk_model.predict_proba([processed_input])[0][1]
        if probability > 0.7:
            risk_category = "High Risk"
        elif probability > 0.3:
            risk_category = "Medium Risk"
        else:
            risk_category = "Low Risk"
        return {
            "credit_risk_prediction": risk_category,
            "credit_risk_probability": float(probability)
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=f"Invalid input: {str(ve)}")
    except Exception as e:
        logger.error(f"Error in predict_credit_risk: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@app.post("/chat/")
@limiter.limit("5/minute")
async def chat_with_ai(input_data: ChatInput, request: Request):
    try:
        user_message = input_data.message
        response = chat_model.generate_content(
            [
                {
                    "role": "user",
                    "parts": [
                        {
                            "text": (
                                "You are a financial assistant specializing in loan default and credit risk analysis. "
                                "Provide concise, accurate, and helpful responses to user queries about financial risks, loans, credit scores, or related topics. "
                                "Use **Markdown formatting** in your responses:\n"
                                "- Use headings (##)\n"
                                "- Bold key terms\n"
                                "- Bullet points for clarity\n\n"
                                "If the query is unrelated, politely redirect the user to ask about financial topics.\n\n"
                                f"User: {user_message}"
                            )
                        }
                    ]
                }
            ],
            generation_config={
                "max_output_tokens": 150,
                "temperature": 0.7,
            }
        )
        return {"content": response.text.strip()}
    except Exception as e:
        logger.error(f"Error in chat_with_ai: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error processing chat request: {str(e)}")
            
try:
    df = pd.read_csv("data/loan_data.csv")
    if df.empty:
        raise ValueError("Dataset is empty")
except Exception as e:
    logger.error(f"Error loading dataset: {e}", exc_info=True)
    raise ValueError(f"Failed to load dataset: {str(e)}")

@app.get("/stats/")
async def get_stats():
    try:
        stats = {
            "averageAge": float(df['Age'].mean()),
            "averageIncome": float(df['Income'].mean()),
            "averageLoanAmount": float(df['LoanAmount'].mean()),
            "defaultRate": float(df['Default'].mean() * 100),
            "defaultDistribution": [
                int(df['Default'].value_counts().get(0, 0)),
                int(df['Default'].value_counts().get(1, 0))
            ],
            "educationDistribution": df['Education'].value_counts().to_dict(),
            "loanPurposeDistribution": df['LoanPurpose'].value_counts().to_dict(),
            "employmentTypeDistribution": df['EmploymentType'].value_counts().to_dict(),
            "maritalStatusDistribution": df['MaritalStatus'].value_counts().to_dict(),
            "dtiDistribution": pd.cut(
                df["DTIRatio"],
                bins=[0, 0.2, 0.4, 0.6, 0.8, 1.0],
                labels=["0-0.2", "0.2-0.4", "0.4-0.6", "0.6-0.8", "0.8-1.0"]
            ).value_counts().sort_index().to_dict()
        }
        logger.debug("Loan default stats computed successfully")
        return stats
    except Exception as e:
        logger.error(f"Error in get_stats: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error calculating stats: {str(e)}")

@app.get("/credit_risk_stats/")
async def get_credit_risk_stats():
    try:
        logger.debug("Loading credit_risk_data_encoded.csv")
        data = pd.read_csv("data/credit_risk_data_encoded.csv")
        logger.debug(f"CSV loaded. Columns: {data.columns.tolist()}")

        logger.debug("Loading LabelEncoders")
        with open("backend/model/le_person_home_ownership.pkl", "rb") as f:
            le_home = pickle.load(f)
        with open("backend/model/le_loan_intent.pkl", "rb") as f:
            le_intent = pickle.load(f)
        with open("backend/model/le_loan_grade.pkl", "rb") as f:
            le_grade = pickle.load(f)
        with open("backend/model/le_cb_person_default_on_file.pkl", "rb") as f:
            le_default = pickle.load(f)
        logger.debug("LabelEncoders loaded")

        logger.debug("Decoding distributions")
        home_dist = {le_home.inverse_transform([int(k)])[0]: v for k, v in data["person_home_ownership"].value_counts().to_dict().items()}
        intent_dist = {le_intent.inverse_transform([int(k)])[0]: v for k, v in data["loan_intent"].value_counts().to_dict().items()}
        grade_dist = {le_grade.inverse_transform([int(k)])[0]: v for k, v in data["loan_grade"].value_counts().to_dict().items()}
        default_dist = {le_default.inverse_transform([int(k)])[0]: v for k, v in data["cb_person_default_on_file"].value_counts().to_dict().items()}
        logger.debug("Distributions decoded")

        logger.debug("Computing loan_percent_income distribution")
        loan_percent_dist = pd.cut(
            data["loan_percent_income"],
            bins=[0, 0.2, 0.4, 0.6, 0.8, 1.0],
            labels=["0-0.2", "0.2-0.4", "0.4-0.6", "0.6-0.8", "0.8-1.0"]
        ).value_counts().sort_index().to_dict()
        logger.debug(f"Loan percent income distribution: {loan_percent_dist}")

        stats = {
            "averageAge": float(data["person_age"].mean()),
            "averageIncome": float(data["person_income"].mean()),
            "averageLoanAmount": float(data["loan_amnt"].mean()),
            "defaultRate": float(data["loan_status"].mean() * 100),
            "defaultDistribution": [int((data["loan_status"] == 0).sum()), int((data["loan_status"] == 1).sum())],
            "homeOwnershipDistribution": home_dist,
            "loanIntentDistribution": intent_dist,
            "loanGradeDistribution": grade_dist,
            "defaultOnFileDistribution": default_dist,
            "loanPercentIncomeDistribution": loan_percent_dist,
        }
        logger.debug("Stats computed successfully")
        return stats
    except Exception as e:
        logger.error(f"Error in credit_risk_stats: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error calculating credit risk stats: {str(e)}")
    
@app.get("/")
async def health_check():
    return {"status": "healthy"}