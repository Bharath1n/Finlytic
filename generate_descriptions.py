import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

# Paths
input_path = "data/creditcard.csv"
output_path = "data/creditcard_with_descriptions.csv"
chunk_size = 50000  # Process 50k rows at a time

# Function to generate synthetic transaction descriptions
def generate_description(row):
    amount = row['Amount']
    time = row['Time']
    is_fraud = row['Class']
    
    # Categorize amount
    amount_cat = "small" if amount < 50 else "medium" if amount < 500 else "large"
    
    # Convert time (seconds) to time of day
    base_time = datetime(2023, 9, 1)
    transaction_time = base_time + timedelta(seconds=time)
    hour = transaction_time.hour
    time_cat = "midnight" if 0 <= hour < 6 else "morning" if 6 <= hour < 12 else "afternoon" if 12 <= hour < 18 else "evening"
    
    # Define transaction types
    transaction_types = ["online purchase", "in-store purchase", "ATM withdrawal", "international transfer"]
    transaction_type = np.random.choice(transaction_types)
    
    # Generate description
    descriptions = [
        f"{'Suspicious' if is_fraud else 'Regular'} {amount_cat} {transaction_type} at {time_cat}",
        f"{'Unauthorized' if is_fraud else 'Standard'} {amount_cat} {transaction_type} during {time_cat}",
        f"{'Fraudulent' if is_fraud else 'Normal'} {amount_cat} {transaction_type} in {time_cat}"
    ]
    
    return np.random.choice(descriptions)

# Process dataset in chunks
if not os.path.exists(output_path):
    first_chunk = True
    for chunk in pd.read_csv(input_path, chunksize=chunk_size):
        chunk['Description'] = chunk.apply(generate_description, axis=1)
        mode = 'w' if first_chunk else 'a'
        chunk.to_csv(output_path, mode=mode, index=False, header=first_chunk)
        first_chunk = False
    print(f"Augmented dataset saved to {output_path}")
else:
    print(f"Augmented dataset already exists at {output_path}")