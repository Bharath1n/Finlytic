Fin-Lytic: AI-Powered Financial Insights Web App

Fin-Lytic is a full-stack, AI-enhanced web application designed to deliver advanced financial insights through loan default prediction, credit risk analysis, and an interactive chatbot.
Built with a robust architecture that integrates machine learning models, conversational AI, and a responsive frontend, Fin-Lytic is engineered for real-world deployment and practical financial decision-making support.

Table of Contents

-Project Overview
-Core Features
-System Architecture
-Model and Tool Selection
-Setup and Deployment
-Performance Considerations
-Limitations
-Future Enhancements
-Contributing
-License
-Contact
-Links

Project Overview

Fin-Lytic addresses the need for data-driven financial decision-making by leveraging AI to provide actionable insights.
The platform integrates:

-Gemini API for advanced conversational AI capabilities.
-Machine Learning Models for fast, accurate predictions and chatbot intelligence.
-React + FastAPI stack for seamless user experience and backend efficiency.
-Designed for financial professionals and individuals, Fin-Lytic offers tools for risk assessment, loan prediction, and AI-powered conversational assistance.

Core Features

🔮 Loan Default Prediction: Uses ML models to predict loan default risk based on user inputs (age, income, loan amount, etc.).
📊 Credit Risk Classification: Assigns risk levels (High, Medium, Low) with data-driven analysis.
🤖 AI Chatbot (Multi-Mode):
    -General Mode: Budgeting & credit management queries.
    -Loan Prediction Mode: Forecasts loan defaults.
    -Credit Risk Mode: Provides in-depth financial risk assessment.
📈 Interactive Dashboard: Visualizes financial metrics such as default rates, income stats, and predictions.
🎨 Responsive UI: Light/dark mode, Framer Motion animations, and Lucide React icons.
⚡ Performance & Stability: Rate limiting (~5 chatbot requests/minute) and modular design separating frontend, backend, AI, and data storage.

System Architecture

graph TD
    A[User Input: Web UI] --> B[Authentication Node (Authgear)]
    A --> C[Data Input Node]
    B --> D[Session Management Node]
    C --> E[Prediction Node (ML Models)]
    C --> F[Chatbot Node (Gemini API)]
    E --> G[Risk Assessment Node]
    F --> G
    G --> H[Dashboard Rendering Node]
    H --> I[Output: Visualized Data]
    I --> J[SQLite Storage]
    K[Checkpointing (Memory)] --> B
    K --> C
    K --> E
    K --> F
    K --> G
    K --> H

Model and Tool Selection

Gemini API: Conversational AI for chatbot.
Scikit-learn: Training & deploying ML models.
LSTM & FinBERT: Time-series & financial text analysis.
FastAPI: High-performance backend with async capabilities.
React + Tailwind CSS: Modern responsive frontend.
Framer Motion & Lucide React: Smooth animations & icons.
Authgear: Secure authentication & session management.

Setup and Deployment
Prerequisites

Node.js v18+
Python 3.9+
Git
Gemini API Key (Google Cloud)
Authgear Client ID & Endpoint

Clone & Setup
git clone https://github.com/Bharath1n/Finlytic.git
cd Finlytic

Backend Setup
cd backend
python3 -m venv venv
source venv\Scripts\activate
pip install -r requirements.txt
echo "GEMINI_API_KEY=your_key" > .env
uvicorn main:app --reload --port 8000

Frontend Setup
cd frontend
npm install
npm run dev   # Opens at http://localhost:5137

Deployment

Vercel (Frontend):Add a vercel.json file:
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}


Render (Backend):Set runtime to Python & add environment variables.Start command:
uvicorn app.api:api_app --host 0.0.0.0 --port $PORT


Performance Considerations

Latency: ~2–5s for predictions & chatbot responses.
Resource Usage: Optimized with rate limiting.
Cost Efficiency: ~$0.01–0.03/session (Gemini API).

Limitations

API rate limits (Gemini & Authgear).
SQLite storage (not ideal for production scaling).
Cold starts on free-tier Render deployments.

Future Enhancements

Async processing for faster responses.
Multi-model support for higher accuracy.
Transition from SQLite → PostgreSQL.
Comprehensive end-to-end testing.

Contributing

-Fork the repository.
-Create a feature branch:
    git checkout -b feature-name
-Commit changes & push:
    git push origin feature-name
-Open a Pull Request.
-Report issues via GitHub Issues.


License
This project is licensed under the MIT License.
Contact

📧 Email: bharath.n208@gmail.com

Links

🌐 Frontend: https://finlytic.vercel.app
⚙️ Backend: https://finlytic.onrender.com
💻 GitHub Repo: https://github.com/Bharath1n/Finlytic
