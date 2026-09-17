"""
preprocessing.py — Credit Risk Data Preprocessing Pipeline

Handles:
- Missing value imputation
- Categorical encoding (OneHotEncoder)
- Numerical scaling (StandardScaler)
- Provides a consistent ColumnTransformer pipeline
"""

import pandas as pd
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
import joblib
import os

# ---------------------------------------------------------------------------
# Feature definitions (German Credit – Kaggle-clean version)
# ---------------------------------------------------------------------------

NUMERICAL_FEATURES = [
    "age",
    "credit_amount",
    "duration",
]

CATEGORICAL_FEATURES = [
    "sex",
    "job",
    "housing",
    "saving_accounts",
    "checking_account",
    "purpose",
]

ALL_FEATURES = NUMERICAL_FEATURES + CATEGORICAL_FEATURES

TARGET = "risk"

# ---------------------------------------------------------------------------
# Preprocessor builder
# ---------------------------------------------------------------------------

def build_preprocessor() -> ColumnTransformer:
    """Build a ColumnTransformer that imputes, scales & encodes features."""

    numerical_pipeline = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
    ])

    categorical_pipeline = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="constant", fill_value="unknown")),
        ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numerical_pipeline, NUMERICAL_FEATURES),
            ("cat", categorical_pipeline, CATEGORICAL_FEATURES),
        ],
        remainder="drop",
    )

    return preprocessor


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def load_dataset(path: str = None) -> pd.DataFrame:
    """Load the German Credit CSV and normalise the target column."""
    if path is None:
        path = os.path.join(os.path.dirname(__file__), "data", "german_credit.csv")

    df = pd.read_csv(path)

    # Normalise target → 0 = low risk (good), 1 = high risk (bad)
    if TARGET in df.columns:
        df[TARGET] = df[TARGET].map({"good": 0, "bad": 1})
    return df


def get_feature_names(preprocessor: ColumnTransformer) -> list[str]:
    """Return human-readable feature names after transformation."""
    names: list[str] = []

    # Numerical features keep their names
    names.extend(NUMERICAL_FEATURES)

    # Categorical features get expanded by OneHotEncoder
    cat_pipeline = preprocessor.named_transformers_["cat"]
    encoder: OneHotEncoder = cat_pipeline.named_steps["encoder"]
    cat_names = encoder.get_feature_names_out(CATEGORICAL_FEATURES).tolist()
    names.extend(cat_names)

    return names


def save_preprocessor(preprocessor: ColumnTransformer, path: str = None):
    if path is None:
        path = os.path.join(os.path.dirname(__file__), "models", "preprocessor.pkl")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    joblib.dump(preprocessor, path)


def load_preprocessor(path: str = None) -> ColumnTransformer:
    if path is None:
        path = os.path.join(os.path.dirname(__file__), "models", "preprocessor.pkl")
    return joblib.load(path)


def prepare_input(raw: dict, preprocessor: ColumnTransformer) -> np.ndarray:
    """Convert a single raw input dict into a preprocessed numpy array."""
    df = pd.DataFrame([raw])
    # Ensure correct column order
    for col in ALL_FEATURES:
        if col not in df.columns:
            df[col] = np.nan
    df = df[ALL_FEATURES]
    return preprocessor.transform(df)
