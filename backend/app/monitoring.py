"""
Health monitoring and system status endpoints
"""

import psutil
import platform
from datetime import datetime
from app.database import engine
from sqlalchemy import text

def get_system_health():
    """Get system health metrics"""
    try:
        return {
            "cpu_percent": psutil.cpu_percent(interval=1),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_percent": psutil.disk_usage('/').percent,
            "uptime_seconds": int((datetime.now() - datetime.fromtimestamp(psutil.boot_time())).total_seconds())
        }
    except Exception as e:
        return {
            "cpu_percent": None,
            "memory_percent": None,
            "disk_percent": None,
            "error": str(e)
        }

def get_database_health():
    """Check database connection and basic stats"""
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            if result.fetchone():
                # Get table counts
                tables_info = {}
                for table in ['users', 'documents', 'search_logs', 'analytics']:
                    result = conn.execute(text(f"SELECT COUNT(*) FROM {table}"))
                    count = result.scalar()
                    tables_info[table] = count
                
                return {
                    "status": "connected",
                    "database_type": "PostgreSQL",
                    "tables": tables_info
                }
    except Exception as e:
        return {
            "status": "disconnected",
            "error": str(e)
        }

def get_platform_info():
    """Get platform and deployment info"""
    return {
        "platform": platform.system(),
        "python_version": platform.python_version(),
        "processor": platform.processor(),
    }

def get_full_health_report():
    """Generate complete health report"""
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "status": "healthy",
        "system": get_system_health(),
        "database": get_database_health(),
        "platform": get_platform_info(),
    }
