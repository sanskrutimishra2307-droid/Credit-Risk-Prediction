"""
train_model.py — Train Logistic Regression + Random Forest on German Credit data

Usage:
    python train_model.py

Outputs (in ./models/):
    logistic_model.pkl
    random_forest_model.pkl
    preprocessor.pkl
    metrics.json
    training_data.pkl          ← used by LIME explainer
"""

import os, json, warnings
import numpy as np
import pandas as pd
import joblib

from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
)

from preprocessing import (
    load_dataset,
    build_preprocessor,
    save_preprocessor,
    get_feature_names,
    ALL_FEATURES,
    TARGET,
)

warnings.filterwarnings("ignore")

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(MODELS_DIR, exist_ok=True)


def evaluate(model, X_test, y_test) -> dict:
    """Compute classification metrics."""
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    cm = confusion_matrix(y_test, y_pred).tolist()

    return {
        "accuracy": round(accuracy_score(y_test, y_pred), 4),
        "precision": round(precision_score(y_test, y_pred, zero_division=0), 4),
        "recall": round(recall_score(y_test, y_pred, zero_division=0), 4),
        "f1_score": round(f1_score(y_test, y_pred, zero_division=0), 4),
        "roc_auc": round(roc_auc_score(y_test, y_prob), 4),
        "confusion_matrix": cm,
    }


def main():
    print("=" * 60)
    print("  Credit Risk Model Training Pipeline")
    print("=" * 60)

    # 1. Load dataset -------------------------------------------------------
    print("\n[1/7] Loading dataset ...")
    df = load_dataset()
    print(f"      Loaded {len(df)} samples, {df.shape[1]} columns")
    print(f"      Target distribution:\n{df[TARGET].value_counts().to_string()}")

    # 2. Split features / target --------------------------------------------
    X = df[ALL_FEATURES]
    y = df[TARGET]

    # 3. Train / test split -------------------------------------------------
    print("\n[2/7] Splitting into train / test (80/20, stratified) ...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y,
    )
    print(f"      Train: {len(X_train)}  |  Test: {len(X_test)}")

    # 4. Build & fit preprocessor -------------------------------------------
    print("\n[3/7] Building preprocessing pipeline ...")
    preprocessor = build_preprocessor()
    X_train_processed = preprocessor.fit_transform(X_train)
    X_test_processed = preprocessor.transform(X_test)

    feature_names = get_feature_names(preprocessor)
    print(f"      {len(feature_names)} features after encoding")

    # 5. Train models -------------------------------------------------------
    print("\n[4/7] Training Logistic Regression ...")
    lr = LogisticRegression(max_iter=1000, random_state=42, class_weight="balanced")
    lr.fit(X_train_processed, y_train)

    print("[5/7] Training Random Forest ...")
    rf = RandomForestClassifier(
        n_estimators=200, max_depth=10, random_state=42, class_weight="balanced"
    )
    rf.fit(X_train_processed, y_train)

    # 6. Evaluate -----------------------------------------------------------
    print("\n[6/7] Evaluating models ...")
    lr_metrics = evaluate(lr, X_test_processed, y_test)
    rf_metrics = evaluate(rf, X_test_processed, y_test)

    print("\n  Logistic Regression:")
    for k, v in lr_metrics.items():
        if k != "confusion_matrix":
            print(f"    {k:>12s}: {v}")

    print("\n  Random Forest:")
    for k, v in rf_metrics.items():
        if k != "confusion_matrix":
            print(f"    {k:>12s}: {v}")

    # Random Forest feature importance (global)
    rf_importance = dict(
        zip(feature_names, [round(float(v), 4) for v in rf.feature_importances_])
    )
    # Sort descending
    rf_importance = dict(sorted(rf_importance.items(), key=lambda x: -x[1]))

    # 7. Save artefacts -----------------------------------------------------
    print("\n[7/7] Saving models & artefacts ...")

    joblib.dump(lr, os.path.join(MODELS_DIR, "logistic_model.pkl"))
    joblib.dump(rf, os.path.join(MODELS_DIR, "random_forest_model.pkl"))
    save_preprocessor(preprocessor)

    # Save a copy of the processed training data for LIME
    joblib.dump(
        {
            "X_train": X_train_processed,
            "feature_names": feature_names,
            "class_names": ["Low Risk", "High Risk"],
        },
        os.path.join(MODELS_DIR, "training_data.pkl"),
    )

    # Save metrics
    metrics = {
        "logistic_regression": lr_metrics,
        "random_forest": rf_metrics,
        "feature_importance": rf_importance,
        "feature_names": feature_names,
        "train_size": len(X_train),
        "test_size": len(X_test),
    }
    with open(os.path.join(MODELS_DIR, "metrics.json"), "w") as f:
        json.dump(metrics, f, indent=2)

    print(f"      Saved to {MODELS_DIR}/")
    print("\n[OK] Training complete. You can now start the API server.")


if __name__ == "__main__":
    main()
