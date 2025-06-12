import pickle
import pandas as pd
import os
from preprocessing import preprocess_input

MODEL_DIR = os.path.join("backend", "model")
MODEL_PATH = os.path.join(MODEL_DIR, "credit_model.pkl")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.pkl")
ENCODERS_PATH = os.path.join(MODEL_DIR, "encoders.pkl")

try:
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    with open(SCALER_PATH, 'rb') as f:
        scaler = pickle.load(f)
    with open(ENCODERS_PATH, 'rb') as f:
        encoders = pickle.load(f)
except FileNotFoundError as e:
    raise RuntimeError(f"Model file not found: {e}")

def predict(data):
    try:
        df = pd.DataFrame([data])
        df = preprocess_input(df, scaler, encoders)
        prediction = model.predict(df)[0]
        probability = model.predict_proba(df)[0]
        return prediction, probability
    except Exception as e:
        raise ValueError(f"Prediction error: {str(e)}")