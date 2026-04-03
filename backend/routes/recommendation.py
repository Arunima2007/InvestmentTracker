from flask import Blueprint, request, jsonify

from services.recommendation_engine import (
    predict_investment_type,
    generate_allocation,
    estimate_annual_return,
    generate_top_factors,
    build_context,
    adjust_recommendation,
    get_adjustment_reason
)
from services.projection_engine import (
    calculate_projected_corpus,
    suggest_required_sip,
    generate_goal_status,
    generate_projection_series,
    calculate_goal_probability
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

        predicted_type, derived_metrics, confidence = predict_investment_type(data)
        context = build_context(data, derived_metrics)
        adjusted_type = adjust_recommendation(predicted_type, context)
        adjustment_reason = get_adjustment_reason(predicted_type, adjusted_type, context)
        allocation = generate_allocation(adjusted_type)
        annual_return = estimate_annual_return(adjusted_type)

        projection_series = generate_projection_series(
            data["current_savings"],
            data["monthly_sip"],
            annual_return,
            data["time_horizon_years"]
        )

        projected_corpus = calculate_projected_corpus(
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
        goal_probability = calculate_goal_probability(projected_corpus, data["financial_goal"])

        recommendations = generate_personalized_recommendations(
            data,
            derived_metrics,
            adjusted_type
        )

        top_factors = generate_top_factors(data, derived_metrics)

        comparison = {
            "base_recommendation": predicted_type,
            "adjusted_recommendation": adjusted_type,
            "goal_status": goal_status,
            "projected_corpus": projected_corpus
        }

        return jsonify({
            "recommended_investment_type": adjusted_type,
            "base_recommendation": predicted_type,
            "adjustment_reason": adjustment_reason,
            "confidence": confidence,
            "allocation": allocation,
            "annual_return_assumption": annual_return,
            "projected_corpus": projected_corpus,
            "goal_status": goal_status,
            "goal_probability": goal_probability,
            "suggested_required_sip": suggested_required_sip,
            "derived_metrics": derived_metrics,
            "personalized_recommendations": recommendations,
            "projection_series": projection_series,
            "top_factors": top_factors,
            "scenario_comparison": comparison
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500