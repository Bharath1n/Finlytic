import pandas as pd

# Map filenames (without path) to Google Drive file IDs
CSV_FILE_IDS = {
    "credit_risk_data_cleaned.csv": "1tWeheLt8_O3hh_ob0Gjv0qVrkz1w-G32",
    "credit_risk_data_encoded.csv": "1qSlId-TsvhEf0-z6cxId2wPS06s80MAJ",
    "credit_risk_dataset.csv": "1qCrl_hCmLZBc2J1uJC-1A_8IgIvRbKvC",
    "creditcard_with_descriptions.csv": "1tAcb4wKlA4NGLQj-sr-o2zvm0TB3q1ap",
    "creditcard.csv": "1lDx9r5H-6PtrqENttG6Gerr2V3VbNsk4",
    "finbert_labels.csv": "1HOLc0DFDg0VwNv0GOPj6cIuyItrazqnf",
    "loan_data.csv": "1EXZNwivA3gmTE9RHWpwHEgvX9yV3qNo5",
    # Note: finbert_embeddings.npy is not a CSV, so it won't work with pd.read_csv
}

# Save the original pd.read_csv
_original_read_csv = pd.read_csv

def read_csv(filepath_or_buffer, *args, **kwargs):
    import os

    filename = os.path.basename(filepath_or_buffer)

    # If file is in the map, load from Google Drive
    if filename in CSV_FILE_IDS:
        file_id = CSV_FILE_IDS[filename]
        url = f"https://drive.google.com/uc?export=download&id={file_id}"
        return _original_read_csv(url, *args, **kwargs)
    
    # Otherwise, load normally
    return _original_read_csv(filepath_or_buffer, *args, **kwargs)

# Replace pandas read_csv with our version
pd.read_csv = read_csv