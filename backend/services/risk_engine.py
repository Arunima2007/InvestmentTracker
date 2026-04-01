"""
Risk Profiling Engine
Computes a numerical risk score and maps it to a risk level (low / medium / high).
"""


# ---------- Weights for each factor ----------
SAVINGS_RATIO_WEIGHT = 0.50
STABILITY_WEIGHT = 0.25
TOLERANCE_WEIGHT = 0.25

STABILITY_SCORES = {
    "stable": 1.0,
    "moderate": 0.5,
    "unstable": 0.2,
}

TOLERANCE_SCORES = {
    "high": 1.0,
    "medium": 0.5,
    "low": 0.2,
}


def compute_risk_score(
    monthly_income: float,
    monthly_expenses: float,
    income_stability: str = "stable",
    risk_tolerance: str = "medium",
) -> dict:
    """
    Compute a composite risk score between 0 and 1.

    Factors:
      1. Savings ratio  = (income - expenses) / income
      2. Income stability  (stable / moderate / unstable)
      3. Self-reported risk tolerance (low / medium / high)

    Returns
    -------
    dict with keys: risk_score (float), risk_level (str)
    """
    # --- Guard against zero/negative income ---
    if monthly_income <= 0:
        return {"risk_score": 0.0, "risk_level": "low"}

    savings_ratio = max(0, (monthly_income - monthly_expenses) / monthly_income)

    stability = STABILITY_SCORES.get(income_stability, 0.5)
    tolerance = TOLERANCE_SCORES.get(risk_tolerance, 0.5)

    risk_score = round(
        savings_ratio * SAVINGS_RATIO_WEIGHT
        + stability * STABILITY_WEIGHT
        + tolerance * TOLERANCE_WEIGHT,
        4,
    )

    # --- Map score to level ---
    if risk_score >= 0.65:
        risk_level = "high"
    elif risk_score >= 0.40:
        risk_level = "medium"
    else:
        risk_level = "low"

    return {"risk_score": risk_score, "risk_level": risk_level}
