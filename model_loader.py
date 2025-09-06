import pickle
import torch
from io import BytesIO
import requests
from bs4 import BeautifulSoup
import re

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
    
    base_url = "https://drive.google.com/uc"
    session = requests.Session()
    params = {
        "export": "download",
        "id": file_id
    }
    response = session.get(base_url, params=params, stream=True)
    
    # If no Content-Disposition, it's likely the warning page - handle confirmation
    if "content-disposition" not in response.headers:
        token = None
        for k, v in response.cookies.items():
            if k.startswith("download_warning"):
                token = v
                break
        
        if not token:
            soup = BeautifulSoup(response.text, "html.parser")
            download_form = soup.find("form", {"id": "download-form"})
            if download_form and download_form.get("action"):
                download_url = download_form["action"]
                hidden_inputs = download_form.find_all("input", {"type": "hidden"})
                form_params = {}
                for inp in hidden_inputs:
                    if inp.get("name") and inp.get("value") is not None:
                        form_params[inp["name"]] = inp["value"]
                response = session.get(download_url, params=form_params, stream=True)
            else:
                match = re.search(r'confirm=([0-9A-Za-z-_]+)', response.text)
                if match:
                    token = match.group(1)
                    params["confirm"] = token
                    response = session.get(base_url, params=params, stream=True)
                else:
                    raise Exception("Unable to find download confirmation token or form. Ensure the file is shared publicly with 'Anyone with the link'.")
        else:
            params["confirm"] = token
            response = session.get(base_url, params=params, stream=True)
    
    # Load the content into memory
    content = BytesIO()
    for chunk in response.iter_content(chunk_size=32768):
        if chunk:
            content.write(chunk)
    content.seek(0)
    
    if response.status_code != 200:
        raise ValueError(f"Failed to download {file_name}: {response.status_code} - {content.read().decode('utf-8')}")
    
    if is_torch:
        return torch.load(content, map_location=torch.device('cpu'))
    else:
        return pickle.load(content)