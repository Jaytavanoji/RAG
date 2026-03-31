"""
Configuration management for RegiNova Backend
Handles environment variables and app settings
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings from environment variables"""
    
    # App Configuration
    APP_NAME: str = "RegiNova Backend"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"  # development, staging, production
    
    # Database Configuration
    DATABASE_URL: str = "sqlite:///./reginova.db"
    
    # JWT Configuration
    JWT_SECRET_KEY: str = "your-secret-key-change-in-production"
    JWT_SECRET: Optional[str] = None  # Fallback
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24
    
    # Groq API Configuration
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.1-8b-instant"
    
    # CORS Configuration
    CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"]
    
    # Document Processing
    MAX_UPLOAD_SIZE: int = 50 * 1024 * 1024  # 50MB
    CHUNK_SIZE: int = 1024
    CHUNK_OVERLAP: int = 128
    
    # Vector Store
    FAISS_INDEX_PATH: str = "./faiss_indexes"
    VAULT_PATH: str = "./vault"
    
    # OTP Configuration
    OTP_EXPIRATION_MINUTES: int = 10
    
    # Security Headers
    ENABLE_HTTPS: bool = True
    SECURE_HSTS_SECONDS: int = 31536000  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS: bool = True
    SECURE_HSTS_PRELOAD: bool = True
    
    # Rate Limiting
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW_SECONDS: int = 60
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
