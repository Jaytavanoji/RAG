"""
Authentication utilities for password hashing, JWT token generation, OTP handling
"""

import jwt
import secrets
import string
import hashlib
from datetime import datetime, timedelta
import bcrypt
from app.config import settings

# Get the secret key from settings
JWT_SECRET = settings.JWT_SECRET if settings.JWT_SECRET else settings.JWT_SECRET_KEY


def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password"""
    try:
        return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())
    except Exception:
        return False


def create_access_token(user_id: str, expires_delta: timedelta = None) -> str:
    """Generate JWT access token"""
    if expires_delta is None:
        expires_delta = timedelta(hours=settings.JWT_EXPIRATION_HOURS)
    
    expire = datetime.utcnow() + expires_delta
    to_encode = {"sub": user_id, "exp": expire}
    
    encoded_jwt = jwt.encode(
        to_encode,
        JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt


def verify_token(token: str) -> str:
    """Verify JWT token and return user_id. Raises exception if invalid."""
    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise Exception("Invalid token")
        return user_id
    except jwt.ExpiredSignatureError:
        raise Exception("Token has expired")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")


def generate_otp(length: int = 6) -> str:
    """Generate a random OTP (One-Time Password)"""
    return ''.join(secrets.choice(string.digits) for _ in range(length))


def validate_password(password: str) -> tuple[bool, str]:
    """
    Validate password strength
    Returns (is_valid, error_message)
    """
    if len(password) < 6:
        return False, "Password must be at least 6 characters long"
    
    return True, ""
