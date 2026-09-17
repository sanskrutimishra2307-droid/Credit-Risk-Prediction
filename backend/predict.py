"""
predict.py — Prediction logic for credit risk assessment.

Loads saved model + preprocessor and returns structured prediction results.
"""

import os
import numpy as np
import joblib

from preprocessing import prepare_input, load_preprocessor

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")


def _load_model(model_name: str = "logistic"):
    if model_name == "random_forest":
        path = os.path.join(MODELS_DIR, "random_forest_model.pkl")
    else:
        path = os.path.join(MODELS_DIR, "logistic_model.pkl")
    return joblib.load(path)


def predict_risk(raw_input: dict, model_name: str = "logistic") -> dict:
    """
    Predict credit risk for a single customer.

    Returns
    -------
    dict with keys:
        prediction : str   "Low Risk" or "High Risk"
        probability: float  probability of High Risk (class 1)
        label      : int    0 or 1
    """
    preprocessor = load_preprocessor()
    model = _load_model(model_name)

    X = prepare_input(raw_input, preprocessor)
    proba = model.predict_proba(X)[0]        # [P(low), P(high)]
    label = int(np.argmax(proba))

    return {
        "prediction": "High Risk" if label == 1 else "Low Risk",
        "probability": round(float(proba[1]), 4),   # P(High Risk)
        "confidence": round(float(max(proba)) * 100, 2),
        "label": label,
        "probabilities": {
            "low_risk": round(float(proba[0]), 4),
            "high_risk": round(float(proba[1]), 4),
        },
    }
