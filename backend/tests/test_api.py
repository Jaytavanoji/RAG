"""
Test suite for RegiNova Backend API
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app, get_db
from app.database import Base
from app.models import User, Document

# Use in-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


class TestHealth:
    """Health check tests"""
    
    def test_health_check(self):
        response = client.get("/api/health")
        assert response.status_code == 200
        assert response.json()["status"] == "success"


class TestAuthentication:
    """Authentication endpoint tests"""
    
    def test_signup_success(self):
        response = client.post(
            "/api/auth/signup",
            json={
                "email": "test@example.com",
                "password": "SecurePass123!",
                "full_name": "Test User"
            }
        )
        assert response.status_code == 200
        assert response.json()["status"] == "success"
        assert "data" in response.json()
    
    def test_signup_weak_password(self):
        response = client.post(
            "/api/auth/signup",
            json={
                "email": "test2@example.com",
                "password": "weak",
                "full_name": "Test User"
            }
        )
        assert response.status_code == 400
    
    def test_signup_duplicate_email(self):
        # First signup
        client.post(
            "/api/auth/signup",
            json={
                "email": "duplicate@example.com",
                "password": "SecurePass123!",
                "full_name": "First User"
            }
        )
        
        # Try duplicate
        response = client.post(
            "/api/auth/signup",
            json={
                "email": "duplicate@example.com",
                "password": "SecurePass123!",
                "full_name": "Second User"
            }
        )
        assert response.status_code == 400
    
    def test_login_success(self):
        # Signup
        client.post(
            "/api/auth/signup",
            json={
                "email": "login@example.com",
                "password": "SecurePass123!",
                "full_name": "Login User"
            }
        )
        
        # Login
        response = client.post(
            "/api/auth/login",
            json={
                "email": "login@example.com",
                "password": "SecurePass123!"
            }
        )
        assert response.status_code == 200
        assert response.json()["status"] == "success"
        assert "data" in response.json()
        assert "access_token" in response.json()["data"]
    
    def test_login_wrong_password(self):
        # Signup
        client.post(
            "/api/auth/signup",
            json={
                "email": "wrong@example.com",
                "password": "SecurePass123!",
                "full_name": "Wrong Pass User"
            }
        )
        
        # Login with wrong password
        response = client.post(
            "/api/auth/login",
            json={
                "email": "wrong@example.com",
                "password": "WrongPassword123!"
            }
        )
        assert response.status_code == 401
    
    def test_get_current_user_success(self):
        # Signup and login
        signup_response = client.post(
            "/api/auth/signup",
            json={
                "email": "me@example.com",
                "password": "SecurePass123!",
                "full_name": "Me User"
            }
        )
        
        login_response = client.post(
            "/api/auth/login",
            json={
                "email": "me@example.com",
                "password": "SecurePass123!"
            }
        )
        
        token = login_response.json()["data"]["access_token"]
        
        # Get current user
        response = client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        assert response.json()["status"] == "success"
        assert response.json()["data"]["email"] == "me@example.com"
    
    def test_get_current_user_no_auth(self):
        response = client.get("/api/auth/me")
        assert response.status_code == 401


class TestDocuments:
    """Document management tests"""
    
    @pytest.fixture
    def auth_headers(self):
        """Get authenticated user headers"""
        client.post(
            "/api/auth/signup",
            json={
                "email": "doc@example.com",
                "password": "SecurePass123!",
                "full_name": "Doc User"
            }
        )
        
        login_response = client.post(
            "/api/auth/login",
            json={
                "email": "doc@example.com",
                "password": "SecurePass123!"
            }
        )
        
        token = login_response.json()["data"]["access_token"]
        return {"Authorization": f"Bearer {token}"}
    
    def test_list_documents_empty(self, auth_headers):
        response = client.get("/api/documents", headers=auth_headers)
        assert response.status_code == 200
        assert response.json()["status"] == "success"
        assert response.json()["total"] == 0


class TestAnalytics:
    """Analytics endpoint tests"""
    
    @pytest.fixture
    def auth_headers(self):
        """Get authenticated user headers"""
        client.post(
            "/api/auth/signup",
            json={
                "email": "analytics@example.com",
                "password": "SecurePass123!",
                "full_name": "Analytics User"
            }
        )
        
        login_response = client.post(
            "/api/auth/login",
            json={
                "email": "analytics@example.com",
                "password": "SecurePass123!"
            }
        )
        
        token = login_response.json()["data"]["access_token"]
        return {"Authorization": f"Bearer {token}"}
    
    def test_get_user_analytics(self, auth_headers):
        response = client.get("/api/analytics/user", headers=auth_headers)
        assert response.status_code == 200
        assert response.json()["status"] == "success"
        assert "data" in response.json()
    
    def test_get_search_history(self, auth_headers):
        response = client.get("/api/analytics/search-history", headers=auth_headers)
        assert response.status_code == 200
        assert response.json()["status"] == "success"
        assert "data" in response.json()
