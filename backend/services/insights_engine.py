"""
AI Insights Engine (rule-based)
Generates personalised, actionable insights based on the user's financial profile.
"""

from typing import List


def generate_insights(
    monthly_income: float,
    monthly_expenses: float,
    current_savings: float,
    monthly_sip: float,
    risk_level: str,
    time_horizon: int,
    financial_goal: str,
) -> List[dict]:
    """
    Return a list of insight objects: { type, icon, message }.
    type can be "warning", "tip", "success", or "info".
    """
    insights: List[dict] = []
    savings_ratio = (monthly_income - monthly_expenses) / monthly_income if monthly_income > 0 else 0

    # --- Savings ratio insights ---
    if savings_ratio < 0.10:
        insights.append({
            "type": "warning",
            "icon": "⚠️",
            "message": (
                f"You're saving only {savings_ratio:.0%} of your income. "
                "Aim for at least 20% to build a solid financial cushion."
            ),
        })
    elif savings_ratio < 0.20:
        insights.append({
            "type": "tip",
            "icon": "💡",
            "message": (
                f"Your savings rate is {savings_ratio:.0%}. "
                "Try to push it above 20% for long-term wealth creation."
            ),
        })
    else:
        insights.append({
            "type": "success",
            "icon": "🎉",
            "message": (
                f"Great job! You're saving {savings_ratio:.0%} of your income. "
                "Keep it up!"
            ),
        })

    # --- Emergency fund check ---
    emergency_months = current_savings / monthly_expenses if monthly_expenses > 0 else 0
    if emergency_months < 3:
        insights.append({
            "type": "warning",
            "icon": "🛡️",
            "message": (
                f"Your emergency fund covers only {emergency_months:.1f} months of expenses. "
                "Try to build at least 3–6 months of expenses as a safety net before investing aggressively."
            ),
        })
    elif emergency_months >= 6:
        insights.append({
            "type": "success",
            "icon": "✅",
            "message": (
                f"You have a healthy emergency fund covering {emergency_months:.1f} months. "
                "You can confidently allocate more towards investments."
            ),
        })

    # --- SIP suggestion ---
    ideal_sip = monthly_income * 0.20
    if monthly_sip < ideal_sip * 0.5:
        insights.append({
            "type": "tip",
            "icon": "📈",
            "message": (
                f"Increasing your monthly SIP to ₹{ideal_sip:,.0f} (20% of income) "
                "could significantly boost your long-term returns."
            ),
        })

    sip_bump = monthly_sip + 2000
    if monthly_sip > 0:
        insights.append({
            "type": "info",
            "icon": "🚀",
            "message": (
                f"Bumping your SIP by ₹2,000 to ₹{sip_bump:,.0f}/month could "
                "add a meaningful difference to your corpus over "
                f"{time_horizon} years thanks to compounding."
            ),
        })

    # --- Risk vs horizon mismatch ---
    if risk_level == "high" and time_horizon < 5:
        insights.append({
            "type": "warning",
            "icon": "⏳",
            "message": (
                "High-risk investments need time to recover from market dips. "
                "With a short horizon, consider a more balanced allocation."
            ),
        })
    if risk_level == "low" and time_horizon > 10:
        insights.append({
            "type": "tip",
            "icon": "🔑",
            "message": (
                "With a long time horizon, you can afford to take slightly more risk "
                "for potentially higher returns."
            ),
        })

    # --- Goal-specific tips ---
    goal_tips = {
        "retirement": "Start early and stay consistent — even small SIPs compound massively over decades.",
        "house": "Consider a balanced mix of equity and debt funds to protect your down-payment goal.",
        "travel": "For short-term goals like travel, keep a portion in liquid or ultra-short-term funds.",
        "education": "Education costs rise ~10% annually. Factor in inflation when planning your target corpus.",
        "emergency": "Park your emergency fund in high-yield savings or liquid mutual funds for easy access.",
        "wedding": "For medium-term goals, a balanced portfolio helps grow savings while limiting downside risk.",
    }
    if financial_goal in goal_tips:
        insights.append({
            "type": "info",
            "icon": "🎯",
            "message": goal_tips[financial_goal],
        })

    return insights
