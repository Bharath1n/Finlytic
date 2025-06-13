import pandas as pd
import numpy as np
import pickle

# Categorical mappings for loan default
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

# Loading encoders for credit risk
credit_risk_encoders = {}
for col in ['person_home_ownership', 'loan_intent', 'loan_grade', 'cb_person_default_on_file']:
    try:
        with open(f'backend/model/le_{col}.pkl', 'rb') as f:
            credit_risk_encoders[col] = pickle.load(f)
    except FileNotFoundError:
        raise ValueError(f"Credit risk encoder for {col} not found in backend/model")

def preprocess_input(data, scaler, model_type='loan_default'):
    if model_type == 'loan_default':
        # Handle DataFrame input for loan default
        if isinstance(data, pd.DataFrame):
            df = data.copy()
        else:
            df = pd.DataFrame([data])
        
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
            if col in df_encoded.columns:
                # Convert input to lowercase and strip
                df_encoded.loc[:, col] = df_encoded[col].astype(str).str.lower().str.strip()
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
        
        # Ensure all features are present
        for feature in feature_order:
            if feature not in df_encoded.columns:
                raise ValueError(f"Missing feature: {feature}")
        
        # Scale all features
        df_encoded = df_encoded[feature_order]
        df_encoded.loc[:, feature_order] = scaler.transform(df_encoded)
        
        return df_encoded
    
    elif model_type == 'credit_risk':
        # Handle dict input for credit risk
        if not isinstance(data, dict):
            raise ValueError("Credit risk input must be a dictionary")
        
        input_dict = data.copy()
        
        # Validate and encode categorical variables
        for col in ['person_home_ownership', 'loan_intent', 'loan_grade', 'cb_person_default_on_file']:
            valid_values = credit_risk_encoders[col].classes_.tolist()
            if input_dict[col].lower().strip() not in [v.lower() for v in valid_values]:
                raise ValueError(f"Invalid {col}. Must be one of {valid_values}")
            input_dict[col] = credit_risk_encoders[col].transform([input_dict[col].lower().strip()])[0]
        
        # Order features
        features = [
            'person_age', 'person_income', 'person_home_ownership', 'person_emp_length',
            'loan_intent', 'loan_grade', 'loan_amnt', 'loan_int_rate',
            'loan_percent_income', 'cb_person_default_on_file', 'cb_person_cred_hist_length'
        ]
        
        # Validate numeric features
        numeric_cols = [
            'person_age', 'person_income', 'person_emp_length', 'loan_amnt',
            'loan_int_rate', 'loan_percent_income', 'cb_person_cred_hist_length'
        ]
        for col in numeric_cols:
            try:
                input_dict[col] = float(input_dict[col])
            except (ValueError, TypeError):
                raise ValueError(f"Invalid numeric value for {col}: {input_dict[col]}")
        
        # Create input array
        processed_input = [input_dict[feature] for feature in features]
        
        # Scale features
        processed_input = scaler.transform([processed_input])[0]
        return processed_input
    
    else:
        raise ValueError(f"Invalid model_type: {model_type}")