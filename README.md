# Credit Risk Assessment using LIME - Explainable AI Dashboard

A full-stack, machine learning-powered web application for credit risk assessment with **LIME (Local Interpretable Model-agnostic Explanations)** transparency. Designed for practical enterprise risk management and academic B.Tech AI/ML capstone demonstrations.

---

## 📌 Project Overview

Traditional machine learning credit scorecards often act as opaque "black boxes," leaving loan applicants and regulatory bodies in the dark about why an application was approved or denied. Under regulations like the **EU GDPR (Article 22 - Right to Explanation)** and the **US Equal Credit Opportunity Act (ECOA)**, financial institutions are legally required to provide Adverse Action Notices detailing exact rejection drivers.

This project bridges that gap by:
1. Predicting credit risk (**Low Risk** vs **High Risk**) using a balanced **Logistic Regression** model and a 200-tree **Random Forest** benchmark.
2. Employing **LIME Tabular Explanations** to extract individualized local feature contributions (both risk-increasing and protective factors) for every single prediction.
3. Providing an executive fintech dashboard with audit logging into a local SQLite database.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Recharts, Lucide Icons, React Router DOM |
| **Styling** | Custom Dark-Fintech Design System (Vanilla CSS with Glassmorphism) |
| **Backend API** | Python 3.13, FastAPI, Uvicorn, Pydantic |
| **Machine Learning** | Scikit-learn (ColumnTransformer, StandardScaler, OneHotEncoder, LogisticRegression, RandomForest) |
| **Explainable AI (XAI)** | LIME (`LimeTabularExplainer`) |
| **Database** | SQLite3 (Persistent audit registry & JSON explanations) |
| **Dataset** | German Credit Dataset (UCI Machine Learning Repository, 1,000 samples) |

---

## 📂 Project Architecture

```
Credit Risk/
├── backend/
│   ├── app.py                  # FastAPI REST endpoints & CORS
│   ├── train_model.py          # ML pipeline (load, preprocess, train, evaluate, serialize)
│   ├── predict.py              # Prediction inference module
│   ├── explain.py              # LIME Tabular Explainer generator
│   ├── preprocessing.py        # Feature engineering & ColumnTransformer
│   ├── database.py             # SQLite audit registry operations
│   ├── create_data.py          # UCI German Credit dataset generator
│   ├── requirements.txt        # Python backend dependencies
│   ├── data/
│   │   ├── german_credit.csv   # 1,000 samples dataset
│   │   └── predictions.db      # SQLite database
│   └── models/
│       ├── logistic_model.pkl  # Trained Logistic Regression
│       ├── random_forest_model.pkl # Trained Random Forest
│       ├── preprocessor.pkl    # Serialized ColumnTransformer
│       ├── training_data.pkl   # Training distribution summary for LIME
│       └── metrics.json        # Test set evaluation metrics
│
├── frontend/
│   ├── index.html              # App entry HTML with SEO tags
│   ├── package.json            # Node.js dependencies & scripts
│   ├── vite.config.js          # Vite config
│   └── src/
│       ├── main.jsx            # React root
│       ├── App.jsx             # Router & app state
│       ├── index.css           # Global dark-fintech styling system
│       ├── api/
│       │   └── api.js          # Axios API service client
│       ├── components/
│       │   ├── Sidebar.jsx
│       │   ├── Navbar.jsx
│       │   ├── StatCard.jsx
│       │   ├── RiskBadge.jsx
│       │   ├── LimeChart.jsx
│       │   ├── ConfusionMatrix.jsx
│       │   ├── CustomerForm.jsx
│       │   └── PredictionResult.jsx
│       └── pages/
│           ├── Dashboard.jsx
│           ├── Assessment.jsx
│           ├── LimeExplanation.jsx
│           ├── ModelPerformance.jsx
│           ├── CustomerProfiles.jsx
│           └── About.jsx
│
└── README.md
```

---

## 🚀 Step-by-Step Setup & Running Guide

### 1. Backend Setup

Open a terminal in `backend/`:

```powershell
cd backend

# Install dependencies
pip install -r requirements.txt

# (Optional) Generate or update dataset
python create_data.py

# Train the models and generate evaluation metrics
python train_model.py

# Start the FastAPI server
uvicorn app:app --reload --port 8000
```

Backend API will be accessible at: `http://localhost:8000`
Interactive Swagger API documentation: `http://localhost:8000/docs`

---

### 2. Frontend Setup

Open a second terminal in `frontend/`:

```powershell
cd frontend

# Install Node modules
npm install

# Start Vite development server
npm run dev
```

Frontend application will open at: `http://localhost:5173`

---

## 📊 Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/predict` | Predicts risk, generates LIME explanation, and logs to SQLite |
| `POST` | `/api/explain` | Generates standalone LIME explanation |
| `GET` | `/api/model-metrics` | Returns accuracy, precision, recall, F1, ROC-AUC & confusion matrix |
| `GET` | `/api/prediction-history` | Fetches historical applicant audit records |
| `GET` | `/api/prediction/{id}` | Retrieves a specific audit record with LIME weights |
| `GET` | `/api/sample-profiles` | Provides preset test personas (Low Risk, High Risk, Borderline) |
| `GET` | `/api/health` | Health check and model readiness probe |

---

## 🎓 Viva Voce & Academic Defense Highlights

1. **Why LIME over standard feature importance?**
   * Global feature importance tells us which features are important on average across 1,000 customers. LIME tells us exactly why *Applicant X* with a specific age, loan amount, and duration was rejected.
2. **How does LIME compute local weights?**
   * LIME generates synthetic perturbations around the customer vector, evaluates the black-box prediction probability for each perturbation, applies exponential distance weighting $\pi_x(z)$, and fits a local ridge/linear regression surrogate model.
3. **Why Logistic Regression?**
   * Logistic Regression provides well-calibrated probabilities, prevents overfitting on moderate tabular datasets, and is compliant with central banking regulatory standards.
4. **Type I vs Type II Errors in Credit Risk:**
   * **Type II Error (False Negative / predicting Low Risk for a defaulter)** is significantly more expensive because the bank loses the entire principal amount.

---

## 📄 License
MIT License. Built for research, academic demonstrations, and practical AI applications.
