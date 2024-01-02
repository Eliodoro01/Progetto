import secrets

from flask_sqlalchemy import SQLAlchemy
from itsdangerous import Serializer
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import Column, String, UniqueConstraint, PrimaryKeyConstraint

db = SQLAlchemy()


def get_reset_token(email):
    user = User.query.filter_by(email=email).first()
    if user:
        return user.token
    return None


class User(db.Model):
    __tablename__ = 'user'
    username = db.Column(String(120), primary_key=True, nullable=False)
    last_name = db.Column(String(120), nullable=False)
    email = db.Column(String(120), unique=True, nullable=False)
    password = db.Column(String(256), nullable=False)
    token = db.Column(String(256), nullable=False)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def update_token(self):
        self.token = secrets.token_urlsafe(16)
