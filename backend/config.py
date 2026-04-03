"""
Application configuration module.
Defines settings for different environments (development, production).
"""

import os
from datetime import timedelta

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


def _parse_origins(value: str):
    if not value:
        return ["*"]
    return [origin.strip() for origin in value.split(",") if origin.strip()]


class Config:
    """Base configuration class."""

    SECRET_KEY = os.environ.get("SECRET_KEY", "super-secret-key-change-in-production")
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        f"sqlite:///{os.path.join(BASE_DIR, 'investwise.db')}",
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jwt-secret-key-change-in-production")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    CORS_ORIGINS = _parse_origins(os.environ.get("CORS_ORIGINS", "*"))
    HOST = os.environ.get("HOST", "0.0.0.0")
    PORT = int(os.environ.get("PORT", "5001"))
    DEBUG = os.environ.get("FLASK_DEBUG", "0") == "1"
