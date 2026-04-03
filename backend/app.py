"""
InvestWise API – main application entry point.
Creates the Flask app, registers blueprints, and initialises extensions.
"""

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import Config
from models import db
from routes.auth import auth_bp
from routes.profile import profile_bp
from routes.recommendation import recommendation_bp


def create_app() -> Flask:
    """Application factory."""
    app = Flask(__name__)
    app.config.from_object(Config)

    # --- Extensions ---
    CORS(app, resources={r"/*": {"origins": "*"}})
    JWTManager(app)
    db.init_app(app)

    # --- Blueprints ---
    app.register_blueprint(auth_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(recommendation_bp)

    # --- Create tables on first request context ---
    with app.app_context():
        db.create_all()

    # --- Health check ---
    @app.route("/health")
    def health():
        return {"status": "ok"}, 200
    print(app.url_map)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5001)
