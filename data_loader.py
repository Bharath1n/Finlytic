import pandas as pd
import requests
from io import StringIO, BytesIO
from bs4 import BeautifulSoup
import re
# Map filenames (without path) to Google Drive file IDs
CSV_FILE_IDS = {
    "credit_risk_data_cleaned.csv": "1tWeheLt8_O3hh_ob0Gjv0qVrkz1w-G32",
    "credit_risk_data_encoded.csv": "1qSlId-TsvhEf0-z6cxId2wPS06s80MAJ",
    "credit_risk_dataset.csv": "1qCrl_hCmLZBc2J1uJC-1A_8IgIvRbKvC",
    "creditcard_with_descriptions.csv": "1tAcb4wKlA4NGLQj-sr-o2zvm0TB3q1ap",
    "creditcard.csv": "1lDx9r5H-6PtrqENttG6Gerr2V3VbNsk4",
    "finbert_labels.csv": "1HOLc0DFDg0VwNv0GOPj6cIuyItrazqnf",
    "loan_data.csv": "1EXZNwivA3gmTE9RHWpwHEgvX9yV3qNo5",
    "finbert_embeddings.npy":"1Qq3VQDRvB8lhrQopb7kkB3XTha9q3sYT"
}

# Save the original pd.read_csv
_original_read_csv = pd.read_csv

def read_csv(filepath_or_buffer, *args, **kwargs):
    import os

    filename = os.path.basename(filepath_or_buffer)

    # If file is in the map, load from Google Drive
    if filename in CSV_FILE_IDS:
        file_id = CSV_FILE_IDS[filename]
        base_url = "https://drive.google.com/uc"
        session = requests.Session()
        params = {
            "export": "download",
            "id": file_id
        }
        response = session.get(base_url, params=params, stream=True)

        # Check if response is HTML (likely a virus scan warning)
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
                    form_params = {}
                    for inp in download_form.find_all("input", {"type": "hidden"}):
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
                        raise Exception(f"Unable to find download confirmation token or form for {filename}. Ensure the file is shared publicly with 'Anyone with the link'.")

            else:
                params["confirm"] = token
                response = session.get(base_url, params=params, stream=True)

        if response.status_code != 200:
            raise ValueError(f"Failed to download {filename}: {response.status_code} - {response.text}")

        # Use BytesIO to accumulate binary chunks
        file_content = BytesIO()
        for chunk in response.iter_content(chunk_size=32768):
            if chunk:
                file_content.write(chunk)
        file_content.seek(0)
        # Decode the entire content to string and pass to StringIO
        content = file_content.getvalue().decode('utf-8')
        return _original_read_csv(StringIO(content), *args, **kwargs)

    # Otherwise, load normally
    return _original_read_csv(filepath_or_buffer, *args, **kwargs)

# Replace pandas read_csv with our version
pd.read_csv = read_csv