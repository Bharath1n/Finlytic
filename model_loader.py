import pickle
import torch
from io import BytesIO
import requests

# Map filenames to Google Drive file IDs (fill in the actual IDs)
MODEL_FILE_IDS = {
    "credit_risk_model.pkl": "1EmrI97zNn7_hDWZChAIFdE-8P21Mxsrp",
    "credit_risk_scaler.pkl": "1hU2SoZSOGFsZ2T1erfVzytFPV25rNYHH",
    "fraud_scaler.pkl": "1uiG7VTvbVCBbkQvChVuwH68CyghqNow8",
    "le_cb_person_default_on_file.pkl": "1pC1cB6Q9GjlCewdBrXHpQIFTbtt7jKZz",
    "le_loan_grade.pkl": "1dgI8vN5Gv-uo9nyCI-w537rsZdOajtxJ",
    "le_loan_intent.pkl": "1xFP4fmKPdAh42u3q1TTVx_vivEOSzRzA",
    "le_person_home_ownership.pkl": "1ytGLcli4ha7U6jV_KLNzXPeL0V52JF6o",
    "loan_model.pkl": "1wgFVXQQmGVQw6qCjN9HYWBBZqrM2Z1Qz",
    "lstm_fraud_model.pth": "1o1nAMcHtK7afWqQeCncS8XRpN1HG2_Za",
    "scaler.pkl": "1qq8hP4-RAXX2iIKhhmTDYGybc6xjngYQ",
}

def load_from_drive(file_name, is_torch=False):
    file_id = MODEL_FILE_IDS.get(file_name)
    if not file_id:
        raise ValueError(f"No file ID found for {file_name}")
    url = f"https://drive.google.com/uc?export=download&id={file_id}"
    response = requests.get(url)
    if response.status_code != 200:
        raise ValueError(f"Failed to download {file_name}: {response.status_code}")
    content = BytesIO(response.content)
    if is_torch:
        return torch.load(content, map_location=torch.device('cpu'))
    else:
        return pickle.load(content)