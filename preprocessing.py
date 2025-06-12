import pandas as pd
import numpy as np

# Categorical mappings
CATEGORICAL_MAPPINGS = {
    'Education': {
        'high school': 0, 'bachelor': 1, 'master': 2, 'phd': 3
    },
    'EmploymentType': {
        'full-time': 0, 'part-time': 1, 'self-employed': 2, 'unemployed': 3
    },
    'MaritalStatus': {
        'single': 0, 'married': 1, 'divorced': 2
    },
    'HasMortgage': {
        'no': 0, 'yes': 1
    },
    'HasDependents': {
        'no': 0, 'yes': 1
    },
    'LoanPurpose': {
        'auto': 0, 'business': 1, 'education': 2, 'home': 3, 'other': 4
    },
    'HasCoSigner': {
        'no': 0, 'yes': 1
    }
}

def preprocess_input(df, scaler):
    # Define feature order
    feature_order = [
        'Age', 'Income', 'LoanAmount', 'CreditScore', 'MonthsEmployed',
        'NumCreditLines', 'InterestRate', 'LoanTerm', 'DTIRatio',
        'Education', 'EmploymentType', 'MaritalStatus', 'HasMortgage',
        'HasDependents', 'LoanPurpose', 'HasCoSigner'
    ]
    
    df_encoded = df.copy()
    
    # Handle categorical columns
    categorical_cols = [
        'Education', 'EmploymentType', 'MaritalStatus', 'HasMortgage',
        'HasDependents', 'LoanPurpose', 'HasCoSigner'
    ]
    
    for col in categorical_cols:
        if col in df.columns:
            # Convert input to lowercase and strip
            df_encoded.loc[:, col] = df[col].astype(str).str.lower().str.strip()
            # Validate and map to integers
            mapping = CATEGORICAL_MAPPINGS[col]
            invalid_values = df_encoded[col][~df_encoded[col].isin(mapping.keys())].unique()
            if len(invalid_values) > 0:
                raise ValueError(f"Invalid values for {col}: {invalid_values}")
            df_encoded.loc[:, col] = df_encoded[col].map(mapping).astype('float64')
    
    # Handle numeric columns
    numeric_cols = [
        'Age', 'Income', 'LoanAmount', 'CreditScore', 'MonthsEmployed',
        'NumCreditLines', 'InterestRate', 'LoanTerm', 'DTIRatio'
    ]
    
    for col in numeric_cols:
        if col in df_encoded.columns:
            df_encoded.loc[:, col] = pd.to_numeric(df_encoded[col], errors='coerce')
            if df_encoded[col].isna().any():
                raise ValueError(f"Invalid numeric values in {col}")
            df_encoded.loc[:, col] = df_encoded[col].astype('float64')
    
    # Scale all features
    df_encoded = df_encoded[feature_order]
    df_encoded.loc[:, feature_order] = scaler.transform(df_encoded)
    
    return df_encoded