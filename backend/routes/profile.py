"""
Profile routes – save / update financial profile + get risk assessment.
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db
from models.user import User
from services.risk_engine import compute_risk_score

profile_bp = Blueprint("profile", __name__)


@profile_bp.route("/profile", methods=["POST"])
@jwt_required()
def save_profile():
    """
    Save or update the authenticated user's financial profile.

    Request JSON (all optional individually, but all needed for recommendations):
        {
            "monthly_income": float,
            "monthly_expenses": float,
            "current_savings": float,
            "financial_goal": str,
            "time_horizon": int,
            "risk_tolerance": str,        # low / medium / high
            "income_stability": str,      # stable / moderate / unstable
            "monthly_sip": float
        }

    Side-effects:
        Computes and stores risk_score and risk_level on the user record.

    Returns:
        200 with updated user profile
    """
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json(silent=True) or {}

    # --- Update only provided fields ---
    field_map = {
        "monthly_income": float,
        "monthly_expenses": float,
        "current_savings": float,
        "financial_goal": str,
        "time_horizon": int,
        "risk_tolerance": str,
        "income_stability": str,
        "monthly_sip": float,
    }
    for field, cast in field_map.items():
        if field in data:
            setattr(user, field, cast(data[field]))

    # --- Compute risk score if enough data is present ---
    if user.monthly_income is not None and user.monthly_expenses is not None:
        risk = compute_risk_score(
            monthly_income=user.monthly_income,
            monthly_expenses=user.monthly_expenses,
            income_stability=user.income_stability or "stable",
            risk_tolerance=user.risk_tolerance or "medium",
        )
        user.computed_risk_score = risk["risk_score"]
        user.computed_risk_level = risk["risk_level"]

    db.session.commit()

    return jsonify({
        "message": "Profile updated",
        "user": user.to_dict(),
    }), 200


@profile_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    """Return the authenticated user's profile."""
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"user": user.to_dict()}), 200
