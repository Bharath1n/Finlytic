from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()

model = joblib.load("credit_model.pkl")
scaler = joblib.load("scaler.pkl")

class InputData(BaseModel):
    Age: int
    Income: float
    LoanAmount: float
    CreditScore: int
    MonthsEmployed: int
    NumCreditLines: int
    InterestRate: float
    LoanTerm: int
    DTIRatio: float
    Education: int
    EmploymentType: int
    MaritalStatus: int
    HasMortgage: int
    HasDependents: int
    LoanPurpose: int
    HasCoSigner: int

@app.post("/predict")
def predict(data: InputData):
    raw = data.dict()
    df = pd.DataFrame([raw])
    scaled = scaler.transform(df)
    prediction = model.predict(scaled)[0]
    probability = model.predict_proba(scaled).tolist()

    return {
        "prediction": int(prediction),
        "probability": probability
    }

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
