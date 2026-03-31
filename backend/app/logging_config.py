"""
Logging configuration for RegiNova
"""

import logging
import logging.config
from app.config import settings
from pathlib import Path

# Create logs directory
logs_dir = Path("./logs")
logs_dir.mkdir(exist_ok=True)

LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        },
        "detailed": {
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s"
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "default",
            "level": settings.LOG_LEVEL,
        },
        "file": {
            "class": "logging.handlers.RotatingFileHandler",
            "formatter": "detailed",
            "filename": "./logs/reginova.log",
            "maxBytes": 10485760,  # 10MB
            "backupCount": 5,
            "level": settings.LOG_LEVEL,
        },
        "error_file": {
            "class": "logging.handlers.RotatingFileHandler",
            "formatter": "detailed",
            "filename": "./logs/error.log",
            "maxBytes": 10485760,  # 10MB
            "backupCount": 5,
            "level": "ERROR",
        },
        "audit_file": {
            "class": "logging.handlers.RotatingFileHandler",
            "formatter": "detailed",
            "filename": "./logs/audit.log",
            "maxBytes": 10485760,  # 10MB
            "backupCount": 10,
            "level": "INFO",
        },
    },
    "loggers": {
        "app": {
            "handlers": ["console", "file"],
            "level": settings.LOG_LEVEL,
            "propagate": False,
        },
        "audit": {
            "handlers": ["audit_file"],
            "level": "INFO",
            "propagate": False,
        },
        "error": {
            "handlers": ["console", "error_file"],
            "level": "ERROR",
            "propagate": False,
        },
    },
}

logging.config.dictConfig(LOGGING_CONFIG)

# Get loggers
app_logger = logging.getLogger("app")
audit_logger = logging.getLogger("audit")
error_logger = logging.getLogger("error")

def log_user_action(user_id: str, action: str, details: str = ""):
    """Log user actions for audit trail"""
    audit_logger.info(f"USER_ACTION | user_id={user_id} | action={action} | details={details}")

def log_api_error(endpoint: str, method: str, status_code: int, error: str):
    """Log API errors"""
    error_logger.error(f"API_ERROR | endpoint={endpoint} | method={method} | status={status_code} | error={error}")
