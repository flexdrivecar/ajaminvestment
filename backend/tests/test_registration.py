import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import db

client = TestClient(app)

@pytest.fixture(autouse=True)
def clear_database():
    """Clear database before each test"""
    db.users.clear()
    db.user_emails.clear()
    yield
    db.users.clear()
    db.user_emails.clear()

def test_valid_registration():
    """Test successful user registration"""
    response = client.post("/auth/register", json={
        "email": "test@example.com",
        "password": "StrongPass123",
        "first_name": "John",
        "last_name": "Doe",
        "country": "United States"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "test@example.com"
    assert data["user"]["first_name"] == "John"
    assert data["user"]["kyc_status"] == "pending"

def test_duplicate_email_registration():
    """Test registration with duplicate email returns 409_EMAIL_EXISTS"""
    client.post("/auth/register", json={
        "email": "duplicate@example.com",
        "password": "StrongPass123",
        "first_name": "John",
        "last_name": "Doe",
        "country": "United States"
    })
    
    response = client.post("/auth/register", json={
        "email": "duplicate@example.com",
        "password": "AnotherPass123",
        "first_name": "Jane",
        "last_name": "Smith",
        "country": "Canada"
    })
    
    assert response.status_code == 409
    data = response.json()
    assert data["detail"]["error_code"] == "409_EMAIL_EXISTS"
    assert data["detail"]["message"] == "That email is already registered"
    assert data["detail"]["field"] == "email"

def test_weak_password_registration():
    """Test registration with weak password returns 400_WEAK_PASSWORD"""
    test_cases = [
        "weak",  # Too short
        "weakpassword",  # No uppercase or numbers
        "WEAKPASSWORD",  # No lowercase or numbers
        "WeakPassword",  # No numbers
        "weakpass123",  # No uppercase
        "WEAKPASS123",  # No lowercase
    ]
    
    for weak_password in test_cases:
        response = client.post("/auth/register", json={
            "email": f"test_{weak_password}@example.com",
            "password": weak_password,
            "first_name": "John",
            "last_name": "Doe",
            "country": "United States"
        })
        
        assert response.status_code == 400
        data = response.json()
        assert data["detail"]["error_code"] == "400_WEAK_PASSWORD"
        assert "Password must be at least 8 characters" in data["detail"]["message"]
        assert data["detail"]["field"] == "password"

def test_invalid_referral_code():
    """Test registration with invalid referral code returns 400_INVALID_REFERRAL"""
    response = client.post("/auth/register", json={
        "email": "test@example.com",
        "password": "StrongPass123",
        "first_name": "John",
        "last_name": "Doe",
        "country": "United States",
        "referral_code": "AB"  # Too short
    })
    
    assert response.status_code == 400
    data = response.json()
    assert data["detail"]["error_code"] == "400_INVALID_REFERRAL"
    assert data["detail"]["message"] == "Invalid referral code"
    assert data["detail"]["field"] == "referral_code"

def test_valid_referral_code():
    """Test registration with valid referral code succeeds"""
    response = client.post("/auth/register", json={
        "email": "test@example.com",
        "password": "StrongPass123",
        "first_name": "John",
        "last_name": "Doe",
        "country": "United States",
        "referral_code": "VALID123"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data

def test_password_validation_edge_cases():
    """Test password validation edge cases"""
    response = client.post("/auth/register", json={
        "email": "test1@example.com",
        "password": "Pass123A",
        "first_name": "John",
        "last_name": "Doe",
        "country": "United States"
    })
    assert response.status_code == 200
    
    response = client.post("/auth/register", json={
        "email": "test2@example.com",
        "password": "Pass12A",
        "first_name": "John",
        "last_name": "Doe",
        "country": "United States"
    })
    assert response.status_code == 400

def test_registration_creates_restricted_user():
    """Test that new users are created with ACTIVE_RESTRICTED status"""
    response = client.post("/auth/register", json={
        "email": "test@example.com",
        "password": "StrongPass123",
        "first_name": "John",
        "last_name": "Doe",
        "country": "United States"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["kyc_status"] == "pending"
