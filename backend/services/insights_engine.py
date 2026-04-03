def generate_personalized_recommendations(data, derived, predicted_type):
    recommendations = []

    expense_ratio = derived["expense_ratio"]
    financial_buffer = derived["financial_buffer"]
    goal_feasibility_ratio = derived["goal_feasibility_ratio"]
    surplus_after_sip = derived["surplus_after_sip"]
    savings_to_goal_ratio = derived["savings_to_goal_ratio"]
    investment_capacity_ratio = derived["investment_capacity_ratio"]

    time_horizon = data["time_horizon_years"]
    risk_profile = data["risk_profile"]
    income_stability = data["income_stability"]

    if expense_ratio > 0.75:
        recommendations.append(
            "Your monthly expenses consume a high share of income. Reducing non-essential spending can improve your investment capacity."
        )

    if financial_buffer < 3:
        recommendations.append(
            "Your emergency savings buffer is limited. Building a stronger reserve can improve financial security before taking higher-risk positions."
        )

    if goal_feasibility_ratio < 0.5:
        recommendations.append(
            "Your current SIP may be too low for your goal timeline. Increasing SIP or extending the time horizon may improve goal achievement."
        )
    elif goal_feasibility_ratio >= 1:
        recommendations.append(
            "Your current SIP is well aligned with your target goal and supports steady long-term progress."
        )

    if surplus_after_sip < 0:
        recommendations.append(
            "Your current expenses and SIP exceed a comfortable monthly surplus. A more sustainable SIP level may be helpful."
        )
    elif surplus_after_sip > 20000:
        recommendations.append(
            "You have a strong monthly surplus after investing, which supports disciplined long-term wealth creation."
        )

    if savings_to_goal_ratio < 0.1:
        recommendations.append(
            "Your current savings are still a small fraction of your goal, so consistent SIP contributions will be important."
        )

    if investment_capacity_ratio > 0.6:
        recommendations.append(
            "A large share of your disposable income is already being invested, which shows strong commitment but requires careful cash-flow planning."
        )

    if time_horizon >= 10 and predicted_type in ["Growth", "Aggressive"]:
        recommendations.append(
            "Your long investment horizon supports growth-oriented investing and allows greater benefit from compounding."
        )

    if time_horizon <= 3 and predicted_type in ["Conservative", "Balanced"]:
        recommendations.append(
            "Since your investment horizon is short, a stable and lower-volatility investment mix may be more suitable."
        )

    if income_stability == 0:
        recommendations.append(
            "Lower income stability suggests maintaining liquidity and following a more balanced investment approach."
        )
    elif income_stability == 2:
        recommendations.append(
            "Your stable income profile supports more consistent investing over time."
        )

    if risk_profile == 2 and predicted_type == "Conservative":
        recommendations.append(
            "Although your selected risk preference is high, your financial profile currently supports a more conservative strategy."
        )

    if risk_profile == 0 and predicted_type in ["Growth", "Aggressive"]:
        recommendations.append(
            "Your finances support stronger growth potential, but your stated risk preference suggests starting gradually."
        )

    if not recommendations:
        recommendations.append(
            "Your financial profile is reasonably aligned with the recommended strategy."
        )

    return recommendations[:5]
