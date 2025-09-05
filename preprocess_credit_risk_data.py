import pandas as pd
from sklearn.preprocessing import LabelEncoder
import pickle
import os
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ensure output directory exists
output_dir = "backend/model"
os.makedirs(output_dir, exist_ok=True)

# Load data with error handling
input_path = "data/credit_risk_data_cleaned.csv"
try:
    df = pd.read_csv(input_path)
    logger.info(f"Successfully loaded {input_path}")
except FileNotFoundError:
    logger.error(f"Input file {input_path} not found.")
    raise
except Exception as e:
    logger.error(f"Error loading {input_path}: {str(e)}")
    raise

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
    if col not in df.columns:
        logger.error(f"Column {col} not found in the dataset.")
        raise ValueError(f"Missing column: {col}")
    try:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        label_encoders[col] = le
        # Save encoder with full path
        encoder_path = os.path.join(output_dir, f"le_{col}.pkl")
        with open(encoder_path, "wb") as f:
            pickle.dump(le, f)
        logger.info(f"Saved encoder to {encoder_path}")
    except Exception as e:
        logger.error(f"Error processing {col}: {str(e)}")
        raise

# Save encoded data with error handling
output_data_path = "data/credit_risk_data_encoded.csv"
os.makedirs(os.path.dirname(output_data_path), exist_ok=True)
try:
    df.to_csv(output_data_path, index=False)
    logger.info(f"Saved encoded data to {output_data_path}")
except Exception as e:
    logger.error(f"Error saving encoded data to {output_data_path}: {str(e)}")
    raise

# Print encoder classes for verification
for col, le in label_encoders.items():
    logger.info(f"{col}: {le.classes_}")