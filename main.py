from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
import pandas as pd
import pickle
import os
from preprocessing import preprocess_input

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for dev; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths
MODEL_DIR = "backend/model"
MODEL_PATH = os.path.join(MODEL_DIR, "loan_model.pkl")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.pkl")

# Load model and scaler
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
    print(f"Error loading model/scaler: {e}")
    raise ValueError(f"Failed to load model or scaler: {str(e)}")

# Pydantic model
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
        valid = ['high school', 'bachelor', 'master\'s', 'phd']
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

# Prediction endpoint
@app.post("/predict/")
async def predict_loan_default(input_data: LoanInput):
    try:
        # Convert input to DataFrame
        input_dict = input_data.dict()
        df = pd.DataFrame([input_dict])
        
        # Preprocess input
        processed_input = preprocess_input(df, scaler)
        
        # Predict
        prediction = model.predict(processed_input)[0]
        probability = model.predict_proba(processed_input)[0][1]
        
        return {
            "prediction": int(prediction),
            "probability": float(probability)
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=f"Invalid input: {str(ve)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

# Load dataset for stats
try:
    df = pd.read_csv("data/loan_data.csv")
    if df.empty:
        raise ValueError("Dataset is empty")
except Exception as e:
    print(f"Error loading dataset: {e}")
    raise ValueError(f"Failed to load dataset: {str(e)}")

# Stats endpoint
@app.get("/stats/")
async def get_stats():
    try:
        stats = {
            "averageAge": float(df['Age'].mean()),
            "averageIncome": float(df['Income'].mean()),
            "averageLoanAmount": float(df['LoanAmount'].mean()),
            "defaultRate": float(df['Default'].mean() * 100),

            # For pie chart
            "defaultDistribution": [
                int(df['Default'].value_counts().get(0, 0)),
                int(df['Default'].value_counts().get(1, 0))
            ],

            # For bar charts
            "educationDistribution": df['Education'].value_counts().to_dict(),
            "loanPurposeDistribution": df['LoanPurpose'].value_counts().to_dict(),
            "employmentTypeDistribution": df['EmploymentType'].value_counts().to_dict(),
            "maritalStatusDistribution": df['MaritalStatus'].value_counts().to_dict(),

            # For histogram-like DTI bins
            "dtiDistribution": pd.cut(
                df["DTIRatio"],
                bins=[0, 0.2, 0.4, 0.6, 0.8, 1.0],
                labels=["0-0.2", "0.2-0.4", "0.4-0.6", "0.6-0.8", "0.8-1.0"]
            ).value_counts().sort_index().to_dict()
        }

        return stats

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating stats: {str(e)}")
    
# Health check
@app.get("/")
async def health_check():
    return {"status": "healthy"}