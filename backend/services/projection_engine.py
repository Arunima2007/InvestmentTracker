def calculate_projected_corpus(current_savings, monthly_sip, annual_return, years):
    monthly_rate = annual_return / 12
    months = years * 12

    future_savings = current_savings * ((1 + annual_return) ** years)

    if monthly_rate > 0:
        future_sip = monthly_sip * (((1 + monthly_rate) ** months - 1) / monthly_rate) * (1 + monthly_rate)
    else:
        future_sip = monthly_sip * months

    return round(future_savings + future_sip, 2)


def suggest_required_sip(financial_goal, current_savings, annual_return, years):
    monthly_rate = annual_return / 12
    months = years * 12

    future_current_savings = current_savings * ((1 + annual_return) ** years)
    remaining_goal = max(0, financial_goal - future_current_savings)

    if months == 0:
        return round(remaining_goal, 2)

    if monthly_rate == 0:
        required_sip = remaining_goal / months
    else:
        required_sip = remaining_goal / ((((1 + monthly_rate) ** months - 1) / monthly_rate) * (1 + monthly_rate))

    return round(max(0, required_sip), 2)


def generate_goal_status(projected_corpus, financial_goal):
    if financial_goal <= 0:
        return "Invalid Goal"

    ratio = projected_corpus / financial_goal

    if ratio >= 1:
        return "On Track"
    elif ratio >= 0.75:
        return "Moderately On Track"
    return "Goal At Risk"
def generate_projection_series(current_savings, monthly_sip, annual_return, years):
    projections = []
    corpus = current_savings
    total_invested = current_savings
    monthly_rate = annual_return / 12

    for year in range(1, years + 1):
        for _ in range(12):
            corpus = corpus * (1 + monthly_rate) + monthly_sip
            total_invested += monthly_sip

        projections.append({
            "year": year,
            "corpus": round(corpus, 2),
            "total_invested": round(total_invested, 2)
        })

    return projections
def calculate_goal_probability(projected_corpus, financial_goal):
    if financial_goal <= 0:
        return 0.0

    probability = projected_corpus / financial_goal
    probability = max(0.0, min(1.0, probability))
    return round(probability, 2)
