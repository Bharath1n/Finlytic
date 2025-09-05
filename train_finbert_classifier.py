import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import precision_recall_curve, auc
from sklearn.model_selection import train_test_split
import pickle
import os

# Paths
embeddings_path = "data/finbert_embeddings.npy"
labels_path = "data/finbert_labels.csv"
model_dir = "backend/model"
classifier_path = os.path.join(model_dir, "finbert_classifier.pkl")

# Load data
embeddings = np.load(embeddings_path)
labels = pd.read_csv(labels_path)['Class'].values

# Split data
X_train, X_test, y_train, y_test = train_test_split(embeddings, labels, test_size=0.2, random_state=42, stratify=labels)

# Train logistic regression
classifier = LogisticRegression(class_weight='balanced', random_state=42)
classifier.fit(X_train, y_train)

# Evaluate
y_pred_prob = classifier.predict_proba(X_test)[:, 1]
precision, recall, _ = precision_recall_curve(y_test, y_pred_prob)
auprc = auc(recall, precision)
print(f"FinBERT Classifier AUPRC: {auprc:.4f}")

# Save model
os.makedirs(model_dir, exist_ok=True)
with open(classifier_path, 'wb') as f:
    pickle.dump(classifier, f)
print(f"FinBERT classifier saved to {classifier_path}")