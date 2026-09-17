"""
database.py — Lightweight SQLite storage for prediction history.
"""

import os, json, sqlite3, uuid
from datetime import datetime, timezone

DB_PATH = os.path.join(os.path.dirname(__file__), "data", "predictions.db")


def _get_conn() -> sqlite3.Connection:
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("""
        CREATE TABLE IF NOT EXISTS predictions (
            id          TEXT PRIMARY KEY,
            timestamp   TEXT NOT NULL,
            input_data  TEXT NOT NULL,
            prediction  TEXT NOT NULL,
            probability REAL NOT NULL,
            confidence  REAL NOT NULL,
            explanation TEXT
        )
    """)
    conn.commit()
    return conn


def insert_prediction(
    input_data: dict,
    prediction: str,
    probability: float,
    confidence: float,
    explanation: dict | None = None,
) -> str:
    """Insert a prediction record. Returns the generated ID."""
    conn = _get_conn()
    pid = str(uuid.uuid4())[:8].upper()
    conn.execute(
        """INSERT INTO predictions
           (id, timestamp, input_data, prediction, probability, confidence, explanation)
           VALUES (?, ?, ?, ?, ?, ?, ?)""",
        (
            pid,
            datetime.now(timezone.utc).isoformat(),
            json.dumps(input_data),
            prediction,
            probability,
            confidence,
            json.dumps(explanation) if explanation else None,
        ),
    )
    conn.commit()
    conn.close()
    return pid


def get_history(limit: int = 50) -> list[dict]:
    """Return the most recent predictions."""
    conn = _get_conn()
    rows = conn.execute(
        "SELECT * FROM predictions ORDER BY timestamp DESC LIMIT ?", (limit,)
    ).fetchall()
    conn.close()

    results = []
    for r in rows:
        entry = dict(r)
        entry["input_data"] = json.loads(entry["input_data"])
        if entry["explanation"]:
            entry["explanation"] = json.loads(entry["explanation"])
        # Extract top influencing factor
        if entry["explanation"] and entry["explanation"].get("features"):
            feats = entry["explanation"]["features"]
            top = max(feats, key=lambda x: abs(x["weight"]))
            entry["top_factor"] = top["feature"]
        else:
            entry["top_factor"] = "N/A"
        results.append(entry)
    return results


def get_prediction_by_id(pid: str) -> dict | None:
    """Return a single prediction by ID."""
    conn = _get_conn()
    row = conn.execute("SELECT * FROM predictions WHERE id = ?", (pid,)).fetchone()
    conn.close()
    if row is None:
        return None
    entry = dict(row)
    entry["input_data"] = json.loads(entry["input_data"])
    if entry["explanation"]:
        entry["explanation"] = json.loads(entry["explanation"])
    return entry
