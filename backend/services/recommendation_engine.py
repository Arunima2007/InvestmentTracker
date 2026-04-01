"""
Investment Recommendation Engine
Maps a risk level to an asset-allocation strategy.
"""

# ---------- Allocation templates ----------
ALLOCATIONS = {
    "low": {
        "bonds": 70,
        "equity": 30,
    },
    "medium": {
        "equity": 50,
        "bonds": 30,
        "mutual_funds": 20,
    },
    "high": {
        "equity": 80,
        "high_risk_assets": 20,
    },
}

ALLOCATION_DESCRIPTIONS = {
    "low": (
        "A conservative portfolio focused on capital preservation. "
        "Ideal for risk-averse investors or short time horizons."
    ),
    "medium": (
        "A balanced portfolio blending growth and stability. "
        "Good for investors with moderate risk appetite."
    ),
    "high": (
        "An aggressive growth portfolio. "
        "Suitable for investors with high risk tolerance and a long time horizon."
    ),
}

# Approximate expected annual returns per asset class (used for projections)
ASSET_RETURNS = {
    "bonds": 0.06,
    "equity": 0.12,
    "mutual_funds": 0.10,
    "high_risk_assets": 0.18,
}


def get_recommendation(risk_level: str) -> dict:
    """
    Return the recommended asset allocation for the given risk level.

    Returns
    -------
    dict with keys: risk_level, allocation (dict), description (str),
                    expected_annual_return (float)
    """
    risk_level = risk_level.lower()
    allocation = ALLOCATIONS.get(risk_level, ALLOCATIONS["medium"])
    description = ALLOCATION_DESCRIPTIONS.get(risk_level, ALLOCATION_DESCRIPTIONS["medium"])

    # Weighted blended return
    blended_return = sum(
        (pct / 100) * ASSET_RETURNS.get(asset, 0.08)
        for asset, pct in allocation.items()
    )

    return {
        "risk_level": risk_level,
        "allocation": allocation,
        "description": description,
        "expected_annual_return": round(blended_return, 4),
    }
