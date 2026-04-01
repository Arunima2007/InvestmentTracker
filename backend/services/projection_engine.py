"""
Wealth Projection Engine
Uses compound interest + monthly SIP to project year-by-year corpus growth.
"""

from typing import List


def project_wealth(
    current_savings: float,
    monthly_sip: float,
    annual_return: float,
    years: int,
) -> dict:
    """
    Compute year-by-year wealth projection.

    Formula (each year):
      corpus = previous_corpus * (1 + annual_return) + (monthly_sip * 12)

    Parameters
    ----------
    current_savings  : lump-sum starting amount
    monthly_sip      : amount invested every month
    annual_return    : expected annual return as a decimal (e.g. 0.10 for 10 %)
    years            : projection horizon

    Returns
    -------
    dict with keys:
        projections       – list of {year, corpus, total_invested, gains}
        final_corpus      – corpus at the end of the horizon
        total_invested    – total money put in (savings + all SIPs)
        total_gains       – final_corpus - total_invested
        suggested_monthly – a heuristic suggestion for monthly investment
    """
    projections: List[dict] = []
    corpus = current_savings
    total_invested = current_savings
    monthly_rate = annual_return / 12

    for year in range(1, years + 1):
        # Apply monthly compounding for 12 months
        for _ in range(12):
            corpus = corpus * (1 + monthly_rate) + monthly_sip
        total_invested += monthly_sip * 12

        projections.append({
            "year": year,
            "corpus": round(corpus, 2),
            "total_invested": round(total_invested, 2),
            "gains": round(corpus - total_invested, 2),
        })

    # Heuristic: suggest saving at least 20 % of monthly income
    # (caller should pass income if they want a better suggestion)
    suggested_monthly = round(monthly_sip * 1.2, 2) if monthly_sip > 0 else 5000

    return {
        "projections": projections,
        "final_corpus": round(corpus, 2),
        "total_invested": round(total_invested, 2),
        "total_gains": round(corpus - total_invested, 2),
        "suggested_monthly": suggested_monthly,
    }
