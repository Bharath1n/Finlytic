from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
import pandas as pd
import pickle
import torch
import torch.nn as nn
import numpy as np
from preprocessing import preprocess_input
import google.generativeai as genai
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv
import os
import logging
import sqlite3
import time
import uvicorn
from model_loader import load_from_drive

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

load_dotenv()
app = FastAPI()
DB_PATH = os.getenv("DB_PATH", "chat_history.db")
DATABASE_URL = f"sqlite+aiosqlite:///{DB_PATH}"
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

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
genai.configure(api_key=GEMINI_API_KEY)
chat_model = genai.GenerativeModel(GEMINI_MODEL)

MODEL_DIR = "backend/model"
MODEL_PATH = os.path.join(MODEL_DIR, "loan_model.pkl")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.pkl")
CREDIT_RISK_MODEL_PATH = os.path.join(MODEL_DIR, "credit_risk_model.pkl")
CREDIT_RISK_SCALER_PATH = os.path.join(MODEL_DIR, "credit_risk_scaler.pkl")
FRAUD_MODEL_PATH = os.path.join(MODEL_DIR, "lstm_fraud_model.pth")
FRAUD_SCALER_PATH = os.path.join(MODEL_DIR, "fraud_scaler.pkl")

try:
    model = load_from_drive("loan_model.pkl")
    scaler = load_from_drive("scaler.pkl")
except Exception as e:
    logger.error(f"Error loading model/scaler: {e}", exc_info=True)
    raise ValueError(f"Failed to load model or scaler: {str(e)}")

try:
    credit_risk_model = load_from_drive("credit_risk_model.pkl")
    credit_risk_scaler = load_from_drive("credit_risk_scaler.pkl")
except Exception as e:
    logger.error(f"Error loading credit risk model/scaler: {e}", exc_info=True)
    raise ValueError(f"Failed to load credit risk model or scaler: {str(e)}")

class LSTMFraudClassifier(nn.Module):
    def __init__(self, input_dim, hidden_dim, num_layers):
        super(LSTMFraudClassifier, self).__init__()
        self.lstm = nn.LSTM(input_dim, hidden_dim, num_layers, batch_first=True)
        self.fc = nn.Linear(hidden_dim, 1)
        self.sigmoid = nn.Sigmoid()
    
    def forward(self, x):
        _, (hn, _) = self.lstm(x)
        out = self.fc(hn[-1])
        out = self.sigmoid(out)
        return out

try:
    fraud_model = LSTMFraudClassifier(input_dim=30, hidden_dim=64, num_layers=2)
    fraud_model.load_state_dict(load_from_drive("lstm_fraud_model.pth", is_torch=True))
    fraud_model.eval()
    fraud_scaler = load_from_drive("fraud_scaler.pkl")
except Exception as e:
    logger.error(f"Error loading fraud model/scaler: {e}", exc_info=True)
    raise ValueError(f"Failed to load fraud model or scaler: {str(e)}")

class ChatInput(BaseModel):
    session_id: str
    user_id: str | None
    mode: str
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

class FraudInput(BaseModel):
    Time: float
    V1: float
    V2: float
    V3: float
    V4: float
    V5: float
    V6: float
    V7: float
    V8: float
    V9: float
    V10: float
    V11: float
    V12: float
    V13: float
    V14: float
    V15: float
    V16: float
    V17: float
    V18: float
    V19: float
    V20: float
    V21: float
    V22: float
    V23: float
    V24: float
    V25: float
    V26: float
    V27: float
    V28: float
    Amount: float

@app.post("/fraud/")
async def predict_fraud(input_data: FraudInput):
    try:
        input_array = np.array([[
            input_data.Time, input_data.V1, input_data.V2, input_data.V3, input_data.V4,
            input_data.V5, input_data.V6, input_data.V7, input_data.V8, input_data.V9,
            input_data.V10, input_data.V11, input_data.V12, input_data.V13, input_data.V14,
            input_data.V15, input_data.V16, input_data.V17, input_data.V18, input_data.V19,
            input_data.V20, input_data.V21, input_data.V22, input_data.V23, input_data.V24,
            input_data.V25, input_data.V26, input_data.V27, input_data.V28, input_data.Amount
        ]])
        input_scaled = fraud_scaler.transform(input_array)
        input_tensor = torch.FloatTensor(input_scaled).reshape(1, 1, -1)
        with torch.no_grad():
            output = fraud_model(input_tensor)
            probability = output.item()
        prediction = "Fraud" if probability > 0.5 else "Not Fraud"
        return {
            "fraud_prediction": prediction,
            "fraud_probability": probability
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/predict/")
async def predict_loan_default(input_data: LoanInput,):
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
        risk_category = "High Risk" if probability > 0.7 else "Medium Risk" if probability > 0.3 else "Low Risk"

        return {
            "credit_risk_prediction": risk_category,
            "credit_risk_probability": float(probability)
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=f"Invalid input: {str(ve)}")
    except Exception as e:
        logger.error(f"Error in predict_credit_risk: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""CREATE TABLE IF NOT EXISTS chat_history (
        session_id TEXT,
        user_id TEXT,
        mode TEXT,
        message TEXT,
        response TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )""")
    conn.commit()
    conn.close()

init_db()

@app.post("/chat/")
@limiter.limit("20/minute")
async def chat_with_ai(input_data: ChatInput, request: Request):
    try:
        user_message = input_data.message

        prompt = ""
        if user_message.startswith("Loan Default Prediction:"):
            prompt = (
                "You are a financial assistant specializing in loan default prediction. "
                "Explain model outputs (e.g., prediction: 0 = No Default, 1 = Default, probability) or guide users to provide inputs like Age, Income, LoanAmount, CreditScore, etc. "
                "If asked about inputs, list the required fields: Age, Income, LoanAmount, CreditScore, MonthsEmployed, NumCreditLines, InterestRate, LoanTerm, DTIRatio, Education, EmploymentType, MaritalStatus, HasMortgage, HasDependents, LoanPurpose, HasCoSigner. "
                "Use **Markdown Formatting**:\n"
                "- Use headings (##)\n"
                "- Bold key terms\n"
                "- Bullet points for clarity\n\n"
                f"User: {user_message.replace('Loan Default Prediction:', '').strip()}"
            )
        elif user_message.startswith("Credit Risk Assessment:"):
            prompt = (
                "You are a credit risk expert. Explain risk categories (High/Medium/Low, based on probability: >0.7 High, 0.3-0.7 Medium, <0.3 Low) or guide users to input data like person_age, person_income, loan_intent, etc. "
                "If asked about inputs, list the required fields: person_age, person_income, person_home_ownership, person_emp_length, loan_intent, loan_grade, loan_amnt, loan_int_rate, loan_percent_income, cb_person_default_on_file, cb_person_cred_hist_length. "
                "Use **Markdown Formatting**:\n"
                "- Use headings (##)\n"
                "- Bold key terms\n"
                "- Bullet points for clarity\n\n"
                f"User: {user_message.replace('Credit Risk Assessment:', '').strip()}"
            )
        elif user_message.startswith("Fraud Detection:"):
            prompt = (
                "You are a financial fraud detection expert. Explain fraud prediction outputs (e.g., Not Fraud or Fraud, probability) or guide users to input transaction data like Time, Amount, and features V1-V28. "
                "If asked about inputs, list the required fields: Time, V1, V2, ..., V28, Amount. "
                "Answer all queries related to fraud detection, including transaction details and patterns."
                "Use **Markdown Formatting**:\n"
                "- Use headings (##)\n"
                "- Bold key terms\n"
                "- Bullet points for clarity\n\n"
                f"User: {user_message.replace('Fraud Detection:', '').strip()}"
            )
        else:
            prompt = (
                "You are a financial assistant specializing in general financial advice. "
                "Provide concise, accurate responses about budgeting, credit scores, loans, or related topics. "
                "Use a knowledge base with FAQs like:\n"
                "- **Credit Score**: A number from 300-850 indicating creditworthiness.\n"
                "- **Loan Basics**: Loans are borrowed funds repaid with interest over time.\n"
                "If the query is unrelated, politely redirect to financial topics. "
                "Use **Markdown Formatting**:\n"
                "- Use headings (##)\n"
                "- Bold key terms\n"
                "- Bullet points for clarity\n\n"
                f"User: {user_message}"
            )

        response = chat_model.generate_content(
            [{"role": "user", "parts": [{"text": prompt}]}],
            generation_config={"max_output_tokens": 500, "temperature": 0.7}
        )
        response_text = response.text.strip()
        max_retries = 5
        for attempt in range(max_retries):
            try:
                conn = sqlite3.connect(DB_PATH, timeout=10)
                c = conn.cursor()
                c.execute(
                    "INSERT INTO chat_history (session_id, user_id, mode, message, response) VALUES (?, ?, ?, ?, ?)",
                    (input_data.session_id, input_data.user_id, input_data.mode, input_data.message, response_text)
                )
                conn.commit()
                conn.close()
                break
            except sqlite3.OperationalError as e:
                if "database is locked" in str(e) and attempt < max_retries - 1:
                    time.sleep(0.1 * (2 ** attempt))
                    continue
                logger.error(f"Error saving chat history in chat_with_ai: {e}", exc_info=True)
                raise HTTPException(status_code=500, detail=f"Error saving chat history: {str(e)}")
            except sqlite3.DatabaseError as e:
                logger.error(f"Error saving chat history in chat_with_ai: {e}", exc_info=True)
                raise HTTPException(status_code=500, detail=f"Error saving chat history: {str(e)}")

        return {"content": response_text}
    except Exception as e:
        logger.error(f"Error in chat_with_ai: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error processing chat request: {str(e)}")

@app.post("/chat_history/")
async def save_chat_history(input_data: ChatInput, response: str):
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute(
            "INSERT INTO chat_history (session_id, user_id, mode, message, response) VALUES (?, ?, ?, ?, ?)",
            (input_data.session_id, input_data.user_id, input_data.mode, input_data.message, response)
        )
        conn.commit()
        conn.close()
        return {"status": "saved"}
    except Exception as e:
        logger.error(f"Error in save_chat_history: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error saving chat history: {str(e)}")

@app.get("/chat_history/{session_id}/{mode}")
async def get_chat_history(session_id: str, mode: str):
    max_retries = 5
    for attempt in range(max_retries):
        try:
            conn = sqlite3.connect(DB_PATH, timeout=10)
            c = conn.cursor()
            c.execute("SELECT message, response, timestamp FROM chat_history WHERE session_id = ? AND mode = ?", (session_id, mode))
            history = c.fetchall()
            conn.close()
            if not history:
                raise HTTPException(status_code=404, detail="Chat history not found")
            return [{"message": h[0], "response": h[1], "timestamp": h[2]} for h in history]
        except sqlite3.OperationalError as e:
            if "database is locked" in str(e) and attempt < max_retries - 1:
                time.sleep(0.1 * (2 ** attempt))
                continue
            logger.error(f"Error in get_chat_history: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Error retrieving chat history: {str(e)}")
        except sqlite3.DatabaseError as e:
            logger.error(f"Error in get_chat_history: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Error retrieving chat history: {str(e)}")

@app.delete("/chat_history/{session_id}/{mode}")
async def delete_chat_history(session_id: str, mode: str):
    max_retries = 5
    for attempt in range(max_retries):
        try:
            conn = sqlite3.connect(DB_PATH, timeout=10)
            c = conn.cursor()
            c.execute("DELETE FROM chat_history WHERE session_id = ? AND mode = ?", (session_id, mode))
            conn.commit()
            conn.close()
            return {"status": "deleted"}
        except sqlite3.OperationalError as e:
            if "database is locked" in str(e) and attempt < max_retries - 1:
                time.sleep(0.1 * (2 ** attempt))
                continue
            logger.error(f"Error in delete_chat_history: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Error deleting chat history: {str(e)}")
        except sqlite3.DatabaseError as e:
            logger.error(f"Error in delete_chat_history: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Error deleting chat history: {str(e)}")
    return {"status": "error"}

        
@app.get("/stats/")
async def get_stats():
    try:
        df = pd.read_csv("data/loan_data.csv")
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

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host=host, port=port, reload=True)