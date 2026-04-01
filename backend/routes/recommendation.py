"""
Recommendation & projection routes.
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from services.recommendation_engine import get_recommendation
from services.projection_engine import project_wealth
from services.insights_engine import generate_insights

recommendation_bp = Blueprint("recommendation", __name__)


@recommendation_bp.route("/recommendation", methods=["GET"])
@jwt_required()
def recommendation():
    """
    Return investment allocation recommendation based on the user's
    computed risk level.

    Returns 200 with allocation data, or 400 if profile is incomplete.
    """
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return jsonify({"error": "User not found"}), 404

    if not user.profile_complete():
        return jsonify({"error": "Please complete your financial profile first"}), 400

    risk_level = user.computed_risk_level or user.risk_tolerance or "medium"
    rec = get_recommendation(risk_level)

    return jsonify({"recommendation": rec}), 200


@recommendation_bp.route("/projection", methods=["POST"])
@jwt_required()
def projection():
    """
    Compute wealth projection.

    Optionally accepts overrides in the request body for "What If" mode:
        { "monthly_sip": float, "risk_level": str }

    Falls back to the user's saved profile values when overrides are absent.
    """
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return jsonify({"error": "User not found"}), 404

    if not user.profile_complete():
        return jsonify({"error": "Please complete your financial profile first"}), 400

    data = request.get_json(silent=True) or {}

    # Allow "What If" overrides
    monthly_sip = data.get("monthly_sip", user.monthly_sip or 0)
    risk_level = data.get("risk_level", user.computed_risk_level or user.risk_tolerance or "medium")

    rec = get_recommendation(risk_level)
    annual_return = rec["expected_annual_return"]

    proj = project_wealth(
        current_savings=user.current_savings or 0,
        monthly_sip=float(monthly_sip),
        annual_return=annual_return,
        years=user.time_horizon or 10,
    )

    # Generate insights
    insights = generate_insights(
        monthly_income=user.monthly_income,
        monthly_expenses=user.monthly_expenses,
        current_savings=user.current_savings or 0,
        monthly_sip=float(monthly_sip),
        risk_level=risk_level,
        time_horizon=user.time_horizon or 10,
        financial_goal=user.financial_goal or "",
    )

    return jsonify({
        "projection": proj,
        "recommendation": rec,
        "insights": insights,
    }), 200
