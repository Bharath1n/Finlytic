import pandas as pd
import numpy as np

# Load the dataset
df = pd.read_csv('data/credit_risk_dataset.csv')
print("Original Dataset Shape:", df.shape)

# Step 1: Handle missing values
numeric_cols = ['person_age', 'person_income', 'person_emp_length', 'loan_amnt', 
                'loan_int_rate', 'loan_percent_income', 'cb_person_cred_hist_length']
for col in numeric_cols:
    df[col] = df[col].fillna(df[col].median())

# Categorical columns
categorical_cols = ['person_home_ownership', 'loan_intent', 'loan_grade', 'cb_person_default_on_file']
for col in categorical_cols:
    df[col] = df[col].fillna(df[col].mode()[0])

# Target column: Drop rows with missing 'loan_status'
df = df.dropna(subset=['loan_status'])

# Step 2: Remove duplicates
df = df.drop_duplicates()
print("Shape after removing duplicates:", df.shape)

# Step 3: Fix data types
df['person_age'] = df['person_age'].astype(float)
df['person_income'] = df['person_income'].astype(float)
df['person_emp_length'] = df['person_emp_length'].astype(float)
df['loan_amnt'] = df['loan_amnt'].astype(float)
df['loan_int_rate'] = df['loan_int_rate'].astype(float)
df['loan_percent_income'] = df['loan_percent_income'].astype(float)
df['cb_person_cred_hist_length'] = df['cb_person_cred_hist_length'].astype(float)
df['person_home_ownership'] = df['person_home_ownership'].astype(str).str.lower().str.strip()
df['loan_intent'] = df['loan_intent'].astype(str).str.lower().str.strip()
df['loan_grade'] = df['loan_grade'].astype(str).str.lower().str.strip()
df['cb_person_default_on_file'] = df['cb_person_default_on_file'].astype(str).str.lower().str.strip()
df['loan_status'] = df['loan_status'].astype(int)

# Step 4: Validate categorical columns
valid_home_ownership = ['rent', 'own', 'mortgage', 'other']
valid_loan_intent = ['personal', 'education', 'medical', 'venture', 'homeimprovement', 'debtconsolidation']
valid_loan_grade = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
valid_default_on_file = ['y', 'n']
df = df[df['person_home_ownership'].isin(valid_home_ownership)]
df = df[df['loan_intent'].isin(valid_loan_intent)]
df = df[df['loan_grade'].isin(valid_loan_grade)]
df = df[df['cb_person_default_on_file'].isin(valid_default_on_file)]
print("Shape after validating categorical columns:", df.shape)

# Step 5: Handle outliers (using IQR for numeric columns)
for col in numeric_cols:
    Q1 = df[col].quantile(0.25)
    Q3 = df[col].quantile(0.75)
    IQR = Q3 - Q1
    df = df[~((df[col] < (Q1 - 1.5 * IQR)) | (df[col] > (Q3 + 1.5 * IQR)))]

print("Shape after removing outliers:", df.shape)

# Step 6: Save the cleaned dataset
df.to_csv('data/credit_risk_data_cleaned.csv', index=False)
print("Cleaned dataset saved as 'data/credit_risk_data_cleaned.csv'")