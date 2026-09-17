"""
app.py — FastAPI application for Credit Risk Assessment using LIME.

Endpoints:
    POST  /api/predict           — Predict risk + generate LIME explanation
    POST  /api/explain           — Generate LIME explanation only
    GET   /api/model-metrics     — Return model evaluation metrics
    GET   /api/prediction-history — Return recent predictions
    GET   /api/prediction/{id}   — Return a specific prediction
    GET   /api/sample-profiles   — Return preset sample customer profiles
"""

import os, json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional

from predict import predict_risk
from explain import generate_explanation
from database import insert_prediction, get_history, get_prediction_by_id

# ──────────────────────────────────────────────────────────────────────────────
# App setup
# ──────────────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="Credit Risk Assessment API",
    description="ML-based credit risk prediction with LIME explanations",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")

# ──────────────────────────────────────────────────────────────────────────────
# Request / response schemas
# ──────────────────────────────────────────────────────────────────────────────

class CustomerInput(BaseModel):
    age: int = Field(..., ge=18, le=100, description="Customer age")
    sex: str = Field(..., description="male / female")
    job: int = Field(..., ge=0, le=3, description="Job skill level 0-3")
    housing: str = Field(..., description="own / rent / free")
    saving_accounts: str = Field(..., description="little / moderate / quite rich / rich / unknown")
    checking_account: str = Field(..., description="little / moderate / rich / unknown")
    credit_amount: int = Field(..., ge=0, description="Credit amount in DM")
    duration: int = Field(..., ge=1, le=72, description="Loan duration in months")
    purpose: str = Field(..., description="Purpose of the loan")
    model: Optional[str] = Field("logistic", description="logistic / random_forest")


class PredictResponse(BaseModel):
    id: str
    prediction: str
    probability: float
    confidence: float
    probabilities: dict
    explanation: dict
    input_data: dict


# ──────────────────────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────────────────────

def _check_model_exists():
    if not os.path.exists(os.path.join(MODELS_DIR, "logistic_model.pkl")):
        raise HTTPException(
            status_code=503,
            detail="Model not trained yet. Run `python train_model.py` first.",
        )


# ──────────────────────────────────────────────────────────────────────────────
# Endpoints
# ──────────────────────────────────────────────────────────────────────────────

@app.post("/api/predict", response_model=PredictResponse)
def predict(customer: CustomerInput):
    """Predict credit risk and generate LIME explanation."""
    _check_model_exists()

    raw = customer.model_dump(exclude={"model"})
    model_name = customer.model or "logistic"

    try:
        result = predict_risk(raw, model_name=model_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

    try:
        explanation = generate_explanation(raw, model_name=model_name, num_features=10)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LIME explanation error: {str(e)}")

    # Store in history
    pid = insert_prediction(
        input_data=raw,
        prediction=result["prediction"],
        probability=result["probability"],
        confidence=result["confidence"],
        explanation=explanation,
    )

    return PredictResponse(
        id=pid,
        prediction=result["prediction"],
        probability=result["probability"],
        confidence=result["confidence"],
        probabilities=result["probabilities"],
        explanation=explanation,
        input_data=raw,
    )


@app.post("/api/explain")
def explain(customer: CustomerInput):
    """Generate LIME explanation without storing prediction."""
    _check_model_exists()

    raw = customer.model_dump(exclude={"model"})
    model_name = customer.model or "logistic"

    try:
        explanation = generate_explanation(raw, model_name=model_name, num_features=10)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LIME explanation error: {str(e)}")

    return explanation


@app.get("/api/model-metrics")
def model_metrics():
    """Return stored model evaluation metrics."""
    metrics_path = os.path.join(MODELS_DIR, "metrics.json")
    if not os.path.exists(metrics_path):
        raise HTTPException(
            status_code=503,
            detail="Metrics not available. Run `python train_model.py` first.",
        )
    with open(metrics_path) as f:
        return json.load(f)


@app.get("/api/prediction-history")
def prediction_history(limit: int = 50):
    """Return recent prediction history."""
    return get_history(limit=limit)


@app.get("/api/prediction/{prediction_id}")
def get_single_prediction(prediction_id: str):
    """Return a specific prediction with its LIME explanation."""
    result = get_prediction_by_id(prediction_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return result


@app.get("/api/sample-profiles")
def sample_profiles():
    """Return preset sample customer profiles for demonstration."""
    return [
        {
            "name": "Profile A — Low Risk",
            "description": "Stable employment, reasonable loan, good savings",
            "data": {
                "age": 42,
                "sex": "male",
                "job": 2,
                "housing": "own",
                "saving_accounts": "quite rich",
                "checking_account": "rich",
                "credit_amount": 1500,
                "duration": 12,
                "purpose": "radio/TV",
            },
        },
        {
            "name": "Profile B — High Risk",
            "description": "Young, high credit, poor savings, long duration",
            "data": {
                "age": 22,
                "sex": "female",
                "job": 0,
                "housing": "rent",
                "saving_accounts": "little",
                "checking_account": "little",
                "credit_amount": 12000,
                "duration": 48,
                "purpose": "car",
            },
        },
        {
            "name": "Profile C — Borderline",
            "description": "Mixed characteristics, moderate values",
            "data": {
                "age": 35,
                "sex": "male",
                "job": 1,
                "housing": "rent",
                "saving_accounts": "moderate",
                "checking_account": "little",
                "credit_amount": 5000,
                "duration": 24,
                "purpose": "furniture/equipment",
            },
        },
    ]


@app.get("/api/health")
def health():
    return {"status": "ok", "model_ready": os.path.exists(os.path.join(MODELS_DIR, "logistic_model.pkl"))}
