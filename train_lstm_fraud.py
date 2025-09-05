import pandas as pd
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import SMOTE
from sklearn.metrics import precision_recall_curve, auc
from sklearn.utils import resample
import os
import pickle

# Set random seed
torch.manual_seed(42)
np.random.seed(42)

# Load dataset
df = pd.read_csv("data/creditcard.csv")
X = df.drop('Class', axis=1).values
y = df['Class'].values

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Sample for training to manage memory
def sample_data(X_scaled, y, n_samples=50000):
    fraud_indices = np.where(y == 1)[0]
    non_fraud_indices = np.where(y == 0)[0]
    non_fraud_sample = np.random.choice(non_fraud_indices, n_samples//2, replace=False)
    fraud_sample = np.random.choice(fraud_indices, min(len(fraud_indices), n_samples//2), replace=True)
    sample_indices = np.concatenate([non_fraud_sample, fraud_sample])
    return X_scaled[sample_indices], y[sample_indices]

X_sample, y_sample = sample_data(X_scaled, y)


# Handle class imbalance with SMOTE
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X_sample, y_sample)

# Reshape for LSTM [samples, timesteps, features]
X_resampled = X_resampled.reshape(X_resampled.shape[0], 1, X_resampled.shape[1])

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X_resampled, y_resampled, test_size=0.2, random_state=42, stratify=y_resampled
)

# Convert to PyTorch tensors
X_train_tensor = torch.FloatTensor(X_train)
y_train_tensor = torch.FloatTensor(y_train)
X_test_tensor = torch.FloatTensor(X_test)
y_test_tensor = torch.FloatTensor(y_test)

# Create DataLoader
train_dataset = TensorDataset(X_train_tensor, y_train_tensor)
test_dataset = TensorDataset(X_test_tensor, y_test_tensor)
train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=64)

# Define LSTM model
class LSTMFraudClassifier(nn.Module):
    def __init__(self, input_dim, hidden_dim, num_layers):
        super(LSTMFraudClassifier, self).__init__()
        self.lstm = nn.LSTM(input_dim, hidden_dim, num_layers, batch_first=True)
        self.fc = nn.Linear(hidden_dim, 1)
        self.sigmoid = nn.Sigmoid()
    
    def forward(self, x):
        _, (hn, _) = self.lstm(x)
        out = self.fc(hn[-1])
        out = self.sigmoid(out)
        return out

# Initialize model
input_dim = X_train.shape[2]
hidden_dim = 64
num_layers = 2
model = LSTMFraudClassifier(input_dim, hidden_dim, num_layers)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# Loss and optimizer
criterion = nn.BCELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

# Training loop with early stopping
num_epochs = 50
best_auprc = 0
patience = 5
patience_counter = 0
for epoch in range(num_epochs):
    model.train()
    for inputs, labels in train_loader:
        inputs, labels = inputs.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(inputs).squeeze()
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
    
    # Evaluate
    model.eval()
    y_pred_prob = []
    val_loss = 0
    with torch.no_grad():
        for inputs, labels in test_loader:
            inputs, labels = inputs.to(device), labels.to(device)
            outputs = model(inputs).squeeze()
            val_loss += criterion(outputs, labels).item()
            y_pred_prob.extend(outputs.cpu().numpy())
    
    val_loss /= len(test_loader)
    precision, recall, _ = precision_recall_curve(y_test, y_pred_prob)
    auprc = auc(recall, precision)
    print(f"Epoch {epoch+1}/{num_epochs}, Val Loss: {val_loss:.4f}, AUPRC: {auprc:.4f}")
    
    # Early stopping
    if auprc > best_auprc:
        best_auprc = auprc
        patience_counter = 0
        torch.save(model.state_dict(), "backend/model/lstm_fraud_model_best.pth")
    else:
        patience_counter += 1
        if patience_counter >= patience:
            print("Early stopping triggered")
            break

# Save model and scaler
os.makedirs("backend/model", exist_ok=True)
torch.save(model.state_dict(), "backend/model/lstm_fraud_model.pth")
with open("backend/model/fraud_scaler.pkl", "wb") as f:
    pickle.dump(scaler, f)
print("LSTM model and scaler saved to backend/model/")