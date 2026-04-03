from flask import Blueprint, request, jsonify

from services.recommendation_engine import (
    predict_investment_type,
    generate_allocation,
    estimate_annual_return
)
from services.projection_engine import (
    calculate_projected_corpus,
    suggest_required_sip,
    generate_goal_status,
    generate_projection_series
)
from services.insights_engine import generate_personalized_recommendations

recommendation_bp = Blueprint("recommendation", __name__,url_prefix="/recommendation")


@recommendation_bp.route("/predict", methods=["POST"])
def predict_investment():
    try:
        data = request.get_json()

        required_fields = [
            "monthly_income",
            "monthly_expenses",
            "current_savings",
            "monthly_sip",
            "financial_goal",
            "time_horizon_years",
            "risk_profile",
            "income_stability"
        ]

        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        predicted_type, derived_metrics = predict_investment_type(data)
        allocation = generate_allocation(predicted_type)
        annual_return = estimate_annual_return(predicted_type)

        projected_corpus = calculate_projected_corpus(
            data["current_savings"],
            data["monthly_sip"],
            annual_return,
            data["time_horizon_years"]
        )
        projection_series = generate_projection_series(
            data["current_savings"],
            data["monthly_sip"],
            annual_return,
            data["time_horizon_years"]
        )
        suggested_required_sip = suggest_required_sip(
            data["financial_goal"],
            data["current_savings"],
            annual_return,
            data["time_horizon_years"]
        )

        goal_status = generate_goal_status(projected_corpus, data["financial_goal"])

        recommendations = generate_personalized_recommendations(
            data,
            derived_metrics,
            predicted_type
        )

        return jsonify({
            "recommended_investment_type": predicted_type,
            "allocation": allocation,
            "annual_return_assumption": annual_return,
            "projected_corpus": projected_corpus,
            "goal_status": goal_status,
            "suggested_required_sip": suggested_required_sip,
            "derived_metrics": derived_metrics,
            "personalized_recommendations": recommendations,
            "projection_series": projection_series
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500