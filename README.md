Fin-Lytic: AI-Powered Financial Analysis Platform
Fin-Lytic is a web application that provides financial insights through loan default prediction, credit risk assessment, and an AI-driven chatbot. Built with a React frontend and a FastAPI backend, it leverages machine learning models and the Gemini API to deliver accurate predictions and user-friendly financial advice.
Features

Loan Default Prediction: Predicts the likelihood of loan default based on user inputs (e.g., Age, Income, Loan Amount).
Credit Risk Assessment: Evaluates credit risk (High/Medium/Low) using financial and personal data.
AI Financial Assistant: A chatbot with three modes:
General: Answers broad financial questions (e.g., budgeting, credit scores).
Loan Prediction: Provides insights on loan default risks and model outputs.
Credit Risk: Explains credit risk categories and guides data input.


Responsive UI: Features a hamburger menu for mobile devices and light/dark theme support.
Data Visualizations: Dashboard displays statistical insights from loan and credit risk datasets.
Rate Limiting: Ensures API stability with a 5 requests/minute limit for the chatbot.

Tech Stack
Frontend

React: JavaScript library for building the UI.
Vite: Fast build tool for development and production.
Tailwind CSS: Utility-first CSS framework for styling.
Framer Motion: Animations for the chatbot and hamburger menu.
Lucide React: Icon library for UI elements.
React Router: Client-side routing.
Axios: HTTP client for API requests.
React Markdown: Renders Markdown in the chatbot.

Backend

FastAPI: High-performance Python web framework.
Pandas & Scikit-learn: Data processing and machine learning models.
Google Generative AI: Powers the chatbot via the Gemini API.
SlowAPI: Rate limiting for API endpoints.
Python Dotenv: Manages environment variables.
Uvicorn: ASGI server for running FastAPI.

Prerequisites

Node.js (v18 or higher)
Python (3.9 or higher)
Git
Gemini API Key (obtain from Google Cloud Console)
A GitHub account for deployment

Setup Instructions
1. Clone the Repository
git clone https://github.com/your-username/fin-lytic.git
cd fin-lytic

2. Backend Setup

Navigate to the backend directory:
cd backend

Create a virtual environment and activate it:
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

Install dependencies:
pip install -r requirements.txt

Create a .env file in the backend/ directory:
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash

Ensure model/ and data/ directories contain the required files (listed above).
Run the backend:
uvicorn main:app --reload --port 8000

3. Frontend Setup

Navigate to the frontend:cd frontend

Install dependencies:npm install

Run the frontend:npm run dev

Open http://localhost:5137 in your browser.

4. Verify Setup

Test the backend:
Health check: http://localhost:8000/
Chatbot: POST http://localhost:8000/chat/ with { "message": "What is a credit score?" }


Test the frontend:
Check the hamburger menu on mobile view (<768px).
Open the chatbot and test all modes.
Submit loan/credit risk predictions via forms or chatbot.

Usage

Navigate the App:

Use the hamburger menu on mobile devices.
Switch between light/dark themes via the toggle.
Access pages: Home, Dashboard, Loan Prediction, Credit Risk, Info, Chatbot.

Chatbot:

General Mode: Ask financial questions (e.g., “How to improve credit score?”).
Loan Prediction Mode: Query default risks or input data (e.g., “Predict loan for Age: 30, Income: 50000…”).
Credit Risk Mode: Assess risk levels or input data (e.g., “Assess for Age: 25, Income: 40000…”).
Use quick reply buttons for common queries.
Clear chat history with the “Clear Chat” button.

Predictions:

Use forms on /loan and /credit-risk for structured inputs.
Alternatively, input data via the chatbot in prediction modes.

Dashboard:

View statistical insights (e.g., average income, default rates) from /stats/ and /credit_risk_stats/.


Troubleshooting

Backend Errors:

Model Files Missing: Ensure model/ and data/ are in the repository.
Gemini API Failure: Verify GEMINI_API_KEY in .env or Render.
Rate Limit (429): Wait 1 minute or increase slowapi limit in main.py.

Frontend Errors:

Blank Screen: Check DevTools (F12 > Console) for errors.
Chatbot Not Working: Ensure backend URL is correct in Chatbot.jsx.

Contributing

Fork the repository.
Create a feature branch: git checkout -b feature-name
Commit changes: git commit -m "Add feature"
Push to the branch: git push origin feature-name
Open a Pull Request.

License
This project is licensed under the MIT License.
Contact
For issues or inquiries, open a GitHub issue or contact the maintainer at [bharath.n208@gmail.com].