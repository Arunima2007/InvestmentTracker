"""
Database models package.
Initializes the SQLAlchemy instance shared across the application.
"""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
