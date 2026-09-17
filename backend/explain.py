"""
explain.py — LIME explanation generator for individual credit risk predictions.

Uses LimeTabularExplainer to create local, human-readable explanations.
"""

import os
import numpy as np
import joblib
from lime.lime_tabular import LimeTabularExplainer

from preprocessing import prepare_input, load_preprocessor, ALL_FEATURES

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")


def _load_training_data() -> dict:
    """Load the saved training data summary used to initialise LIME."""
    path = os.path.join(MODELS_DIR, "training_data.pkl")
    return joblib.load(path)


def _load_model(model_name: str = "logistic"):
    if model_name == "random_forest":
        path = os.path.join(MODELS_DIR, "random_forest_model.pkl")
    else:
        path = os.path.join(MODELS_DIR, "logistic_model.pkl")
    return joblib.load(path)


def generate_explanation(raw_input: dict, model_name: str = "logistic", num_features: int = 10) -> dict:
    """
    Generate a LIME local explanation for a single customer prediction.

    Parameters
    ----------
    raw_input : dict
        Raw customer feature values.
    model_name : str
        Which model to explain ("logistic" or "random_forest").
    num_features : int
        Number of top features to include in the explanation.

    Returns
    -------
    dict with keys:
        features          : list of {feature, weight, direction}
        positive_factors  : list (factors increasing High Risk)
        negative_factors  : list (factors decreasing High Risk / protective)
        intercept         : float
        prediction_local  : list of class probabilities from LIME's local model
        raw_explanation   : list of (feature_condition, weight) tuples
    """
    # Load artefacts
    preprocessor = load_preprocessor()
    model = _load_model(model_name)
    td = _load_training_data()

    X_train = td["X_train"]
    feature_names = td["feature_names"]
    class_names = td["class_names"]

    # Preprocess the single instance
    X_instance = prepare_input(raw_input, preprocessor)[0]  # 1-D array

    # Create LIME explainer
    explainer = LimeTabularExplainer(
        training_data=X_train,
        feature_names=feature_names,
        class_names=class_names,
        mode="classification",
        discretize_continuous=True,
        random_state=42,
    )

    # Generate explanation — explain class 1 (High Risk)
    explanation = explainer.explain_instance(
        data_row=X_instance,
        predict_fn=model.predict_proba,
        num_features=num_features,
        labels=(1,),
    )

    # Extract feature contributions for class 1 (High Risk)
    raw_exp = explanation.as_list(label=1)
    
    local_pred_val = None
    if hasattr(explanation, 'local_pred') and explanation.local_pred is not None:
        try:
            local_pred_val = round(float(explanation.local_pred[0]), 4)
        except Exception:
            pass

    intercept_val = None
    if hasattr(explanation, 'intercept') and explanation.intercept is not None:
        try:
            intercept_val = round(float(explanation.intercept[1]), 4) if 1 in explanation.intercept else round(float(explanation.intercept[0]), 4)
        except Exception:
            pass

    features = []
    positive_factors = []   # increase High Risk
    negative_factors = []   # decrease High Risk (protective)

    for feature_condition, weight in raw_exp:
        entry = {
            "feature": feature_condition,
            "weight": round(float(weight), 4),
            "direction": "High Risk" if weight > 0 else "Low Risk",
        }
        features.append(entry)

        if weight > 0:
            positive_factors.append(entry)
        else:
            negative_factors.append(entry)

    # Sort by absolute weight
    positive_factors.sort(key=lambda x: -abs(x["weight"]))
    negative_factors.sort(key=lambda x: -abs(x["weight"]))

    return {
        "features": features,
        "positive_factors": positive_factors,
        "negative_factors": negative_factors,
        "intercept": intercept_val,
        "local_pred": local_pred_val,
        "raw_explanation": [(f, round(float(w), 4)) for f, w in raw_exp],
    }
