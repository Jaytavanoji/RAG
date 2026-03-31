"""
Rate limiting utilities for API endpoints
"""

import time
from collections import defaultdict
from typing import Dict, Tuple
from app.config import settings

class RateLimiter:
    """Simple in-memory rate limiter"""
    
    def __init__(self, requests: int = 100, window_seconds: int = 60):
        self.requests = requests
        self.window_seconds = window_seconds
        self.requests_log: Dict[str, list] = defaultdict(list)
    
    def is_allowed(self, identifier: str) -> Tuple[bool, Dict]:
        """
        Check if request is allowed for identifier
        
        Returns:
            (is_allowed, info_dict)
        """
        if not settings.RATE_LIMIT_ENABLED:
            return True, {"limited": False}
        
        now = time.time()
        cutoff = now - self.window_seconds
        
        # Remove old requests
        self.requests_log[identifier] = [
            timestamp for timestamp in self.requests_log[identifier]
            if timestamp > cutoff
        ]
        
        # Check limit
        if len(self.requests_log[identifier]) >= self.requests:
            return False, {
                "limited": True,
                "requests": len(self.requests_log[identifier]),
                "limit": self.requests,
                "window": self.window_seconds
            }
        
        # Record request
        self.requests_log[identifier].append(now)
        
        return True, {
            "limited": False,
            "requests": len(self.requests_log[identifier]),
            "limit": self.requests,
            "window": self.window_seconds
        }

# Global rate limiter instance
rate_limiter = RateLimiter(
    requests=settings.RATE_LIMIT_REQUESTS,
    window_seconds=settings.RATE_LIMIT_WINDOW_SECONDS
)
