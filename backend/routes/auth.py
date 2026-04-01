"""
Authentication routes – signup & login.
Issues JWT access tokens on successful authentication.
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models import db
from models.user import User

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.route("/signup", methods=["POST"])
def signup():
    """
    Register a new user.

    Request JSON:
        { "name": str, "email": str, "password": str }

    Returns:
        201 on success with JWT token
        400 if email already exists or fields missing
    """
    data = request.get_json(silent=True) or {}
    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    # --- Validation ---
    if not all([name, email, password]):
        return jsonify({"error": "name, email, and password are required"}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 400

    # --- Create user ---
    user = User(name=name, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    return jsonify({
        "message": "Account created successfully",
        "token": token,
        "user": user.to_dict(),
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Authenticate user and return JWT token.

    Request JSON:
        { "email": str, "password": str }

    Returns:
        200 with token on success
        401 on invalid credentials
    """
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": user.to_dict(),
    }), 200
