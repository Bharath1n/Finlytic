import pandas as pd
import pickle
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# Paths
DATA_PATH = "data/loan_data.csv"
MODEL_DIR = "backend/model"

# Load data
df = pd.read_csv(DATA_PATH)

# Feature and target separation
features = [
    'Age', 'Income', 'LoanAmount', 'CreditScore', 'MonthsEmployed',
    'NumCreditLines', 'InterestRate', 'LoanTerm', 'DTIRatio',
    'Education', 'EmploymentType', 'MaritalStatus', 'HasMortgage',
    'HasDependents', 'LoanPurpose', 'HasCoSigner'
]
target = 'Default'

X = df[features].copy()
y = df[target]

# Define numeric columns (all features for scaling, as categorical are pre-encoded)
numeric_cols = features  # All features are treated as numeric since categorical are integers

# Cast all features to float64
X[numeric_cols] = X[numeric_cols].astype('float64')

# Scale features
scaler = StandardScaler()
X[numeric_cols] = scaler.fit_transform(X[numeric_cols])

# Train model
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)

# Save model and scaler
os.makedirs(MODEL_DIR, exist_ok=True)
with open(os.path.join(MODEL_DIR, "loan_model.pkl"), 'wb') as f:
    pickle.dump(model, f)
with open(os.path.join(MODEL_DIR, "scaler.pkl"), 'wb') as f:
    pickle.dump(scaler, f)