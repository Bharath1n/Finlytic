import pandas as pd
from sklearn.preprocessing import LabelEncoder
import pickle
import os

# Ensure output directory exists
os.makedirs("backend/model", exist_ok=True)

# Load data
df = pd.read_csv("data/credit_risk_data_cleaned.csv")

# Define categorical columns
categorical_cols = [
    "person_home_ownership",
    "loan_intent",
    "loan_grade",
    "cb_person_default_on_file"
]

# Initialize and apply LabelEncoders
label_encoders = {}
for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le
    # Save encoder
    with open(f"backend/model/le_{col}.pkl", "wb") as f:
        pickle.dump(le, f)

# Save encoded data
df.to_csv("data/credit_risk_data_encoded.csv", index=False)

# Print encoder classes for verification
for col, le in label_encoders.items():
    print(f"{col}: {le.classes_}")