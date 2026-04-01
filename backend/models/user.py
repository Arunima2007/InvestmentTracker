"""
User database model.
Stores authentication credentials and financial profile data.
"""

from datetime import datetime
from models import db
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model):
    """User model with authentication and financial profile fields."""
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    name = db.Column(db.String(100), nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # --- Financial profile fields ---
    monthly_income = db.Column(db.Float, nullable=True)
    monthly_expenses = db.Column(db.Float, nullable=True)
    current_savings = db.Column(db.Float, nullable=True)
    financial_goal = db.Column(db.String(50), nullable=True)       # e.g. travel, house, retirement
    time_horizon = db.Column(db.Integer, nullable=True)             # years
    risk_tolerance = db.Column(db.String(20), nullable=True)        # low / medium / high
    income_stability = db.Column(db.String(20), nullable=True)      # stable / moderate / unstable
    monthly_sip = db.Column(db.Float, nullable=True)                # monthly SIP amount

    # --- Computed fields ---
    computed_risk_score = db.Column(db.Float, nullable=True)
    computed_risk_level = db.Column(db.String(20), nullable=True)

    def set_password(self, password: str) -> None:
        """Hash and store the user's password."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        """Verify a password against the stored hash."""
        return check_password_hash(self.password_hash, password)

    def profile_complete(self) -> bool:
        """Check whether the user has filled in their financial profile."""
        return all([
            self.monthly_income is not None,
            self.monthly_expenses is not None,
            self.current_savings is not None,
            self.financial_goal is not None,
            self.time_horizon is not None,
            self.risk_tolerance is not None,
        ])

    def to_dict(self) -> dict:
        """Serialize user data (excluding sensitive fields)."""
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "monthly_income": self.monthly_income,
            "monthly_expenses": self.monthly_expenses,
            "current_savings": self.current_savings,
            "financial_goal": self.financial_goal,
            "time_horizon": self.time_horizon,
            "risk_tolerance": self.risk_tolerance,
            "income_stability": self.income_stability,
            "monthly_sip": self.monthly_sip,
            "computed_risk_score": self.computed_risk_score,
            "computed_risk_level": self.computed_risk_level,
            "profile_complete": self.profile_complete(),
        }
