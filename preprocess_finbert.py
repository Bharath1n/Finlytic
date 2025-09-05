import pandas as pd
import torch
from transformers import AutoTokenizer, AutoModel
import numpy as np
from tqdm import tqdm
from sklearn.utils import resample
import logging
import os

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Paths
input_path = "data/creditcard_with_descriptions.csv"
embeddings_path = "data/finbert_embeddings.npy"
labels_path = "data/finbert_labels.csv"

# Ensure output directories exist
os.makedirs(os.path.dirname(embeddings_path), exist_ok=True)
os.makedirs(os.path.dirname(labels_path), exist_ok=True)

# Sample dataset to reduce memory usage
def sample_data(df, n_samples=20000):
    try:
        fraud = df[df['Class'] == 1]
        non_fraud = df[df['Class'] == 0]
        non_fraud_sample = resample(non_fraud, n_samples=n_samples//2, random_state=42)
        fraud_sample = resample(fraud, n_samples=min(len(fraud), n_samples//2), random_state=42, replace=True)
        return pd.concat([non_fraud_sample, fraud_sample]).sample(frac=1, random_state=42)
    except KeyError:
        logger.error("Column 'Class' not found in the dataset.")
        raise
    except Exception as e:
        logger.error(f"Error sampling data: {str(e)}")
        raise

# Load and sample dataset
try:
    df = pd.read_csv(input_path, usecols=['Description', 'Class'])
    logger.info(f"Successfully loaded {input_path}")
    df_sample = sample_data(df)
    descriptions = df_sample['Description'].str.lower().tolist()
    labels = df_sample['Class'].values
except FileNotFoundError:
    logger.error(f"Input file {input_path} not found.")
    raise
except Exception as e:
    logger.error(f"Error processing {input_path}: {str(e)}")
    raise

# Initialize FinBERT
try:
    tokenizer = AutoTokenizer.from_pretrained("ProsusAI/finbert")
    model = AutoModel.from_pretrained("ProsusAI/finbert")
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    model.eval()
    logger.info("FinBERT model initialized successfully")
except Exception as e:
    logger.error(f"Error initializing FinBERT: {str(e)}")
    raise

# Generate embeddings
def get_finbert_embeddings(texts, batch_size=8):
    embeddings = []
    for i in tqdm(range(0, len(texts), batch_size), desc="Generating embeddings"):
        batch_texts = texts[i:i + batch_size]
        try:
            inputs = tokenizer(
                batch_texts,
                padding=True,
                truncation=True,
                max_length=128,
                return_tensors="pt"
            ).to(device)
            with torch.no_grad():
                outputs = model(**inputs)
                batch_embeddings = outputs.last_hidden_state[:, 0, :].cpu().numpy()
            embeddings.append(batch_embeddings)
            del inputs, outputs
            torch.cuda.empty_cache()
        except Exception as e:
            logger.error(f"Error processing batch at index {i}: {str(e)}")
            raise
    return np.vstack(embeddings)

# Generate and save embeddings
try:
    embeddings = get_finbert_embeddings(descriptions)
    np.save(embeddings_path, embeddings)
    logger.info(f"FinBERT embeddings saved to {embeddings_path}")
    pd.DataFrame({'Class': labels}).to_csv(labels_path, index=False)
    logger.info(f"Labels saved to {labels_path}")
except Exception as e:
    logger.error(f"Error saving embeddings or labels: {str(e)}")
    raise

print(f"FinBERT embeddings saved to {embeddings_path}, labels to {labels_path}")