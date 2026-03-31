# RegiNova Backend - Development Setup Guide

Complete guide for setting up the RegiNova backend for local development.

## Prerequisites

### Required
- Python 3.9 or higher
- pip (Python package manager)
- Git
- Groq API account (free at https://console.groq.com)

### Optional (for OCR support)
- Tesseract OCR
- ImageMagick

## Step 1: Clone & Environment Setup

```bash
# Navigate to backend directory
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

## Step 2: Install Dependencies

```bash
# Upgrade pip
pip install --upgrade pip

# Install all required packages
pip install -r requirements.txt
```

### Dependency Overview

| Package | Purpose |
|---------|---------|
| fastapi | Web framework |
| uvicorn | ASGI server |
| sqlalchemy | ORM for database |
| psycopg2-binary | PostgreSQL driver |
| pydantic | Data validation |
| pyjwt | JWT token generation |
| passlib, bcrypt | Password hashing |
| pytesseract | OCR for images |
| pymupdf | PDF text extraction |
| faiss-cpu | Vector similarity search |
| requests | HTTP requests |
| pytest | Testing framework |

## Step 3: Get Groq API Key

1. Visit https://console.groq.com
2. Sign up for free account
3. Create new API key in console
4. Copy the API key

## Step 4: Configure Environment Variables

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your configuration
```

### Required .env Variables

```bash
# Groq API - REQUIRED
GROQ_API_KEY=your_api_key_from_console_groq_com

# JWT Secret - Generate random string
# Python: python -c "import secrets; print(secrets.token_urlsafe(32))"
JWT_SECRET_KEY=your_random_secret_key_here

# Database (default SQLite for development)
DATABASE_URL=sqlite:///./reginova.db

# CORS Origins - For local development
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]
```

### Optional .env Variables

```bash
# Debug mode
DEBUG=False

# App info
APP_NAME=RegiNova Backend
APP_VERSION=1.0.0

# Database for production
# DATABASE_URL=postgresql://user:password@localhost:5432/reginova

# JWT expiration
JWT_EXPIRATION_HOURS=24

# Document processing
MAX_UPLOAD_SIZE=52428800  # 50MB
CHUNK_SIZE=1024
CHUNK_OVERLAP=128

# Vector store paths
FAISS_INDEX_PATH=./faiss_indexes
VAULT_PATH=./vault

# Password reset OTP
OTP_EXPIRATION_MINUTES=10
```

## Step 5: Install Tesseract OCR (Optional but Recommended)

### On Windows
1. Download from: https://github.com/UB-Mannheim/tesseract/wiki
2. Run installer (default path or custom)
3. Add to Python path in .env or code:
```python
import pytesseract
pytesseract.pytesseract.pytesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
```

### On Mac
```bash
brew install tesseract
```

### On Linux
```bash
# Ubuntu/Debian
sudo apt-get install tesseract-ocr

# Fedora
sudo dnf install tesseract
```

## Step 6: Start the Development Server

```bash
# Start FastAPI server with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# You should see:
# INFO:     Uvicorn running on http://0.0.0.0:8000
# INFO:     Application startup complete
```

## Step 7: Access API Documentation

Open your browser and visit:

- **Swagger UI (interactive)**: http://localhost:8000/docs
- **ReDoc (documentation)**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/api/health

## Step 8: Test with Frontend

### Update Frontend API URL

Edit `frontend/src/api/config.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
```

### Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend should be available at http://localhost:5173

## Testing

### Run Test Suite

```bash
# Run all tests
pytest tests/

# Run with verbose output
pytest tests/ -v

# Run with coverage report
pytest tests/ --cov=app

# Run specific test file
pytest tests/test_api.py

# Run specific test class
pytest tests/test_api.py::TestAuthentication

# Run specific test
pytest tests/test_api.py::TestAuthentication::test_signup_success
```

### Manual Testing with cURL

```bash
# Health check
curl http://localhost:8000/api/health

# Signup
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "full_name": "Test User"
  }'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'

# Get current user (replace TOKEN with actual token)
curl http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

## Directory Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application & routes
│   ├── config.py               # Configuration settings
│   ├── database.py             # Database setup
│   ├── models.py               # SQLAlchemy models
│   ├── schemas.py              # Pydantic schemas
│   ├── auth.py                 # Auth utilities
│   ├── document_processor.py   # File processing
│   ├── vector_store.py         # FAISS vector search
│   └── groq_service.py         # Groq API integration
│
├── tests/
│   ├── __init__.py
│   └── test_api.py             # API tests
│
├── vault/                      # Uploaded files (created at runtime)
├── faiss_indexes/              # Vector indexes (created at runtime)
│
├── requirements.txt            # Python dependencies
├── .env.example                # Environment template
├── README.md                   # API documentation
├── SETUP.md                    # This file
├── DEPLOYMENT.md               # Deployment guide
└── pytest.ini                  # Pytest configuration
```

## Common Issues & Solutions

### Issue: "ModuleNotFoundError: No module named 'X'"

**Solution:**
```bash
# Reinstall dependencies
pip install -r requirements.txt

# Or install specific package
pip install <package-name>
```

### Issue: "pytesseract.TesseractNotFoundError"

**Solution:** Tesseract not installed or path not set
```bash
# Install Tesseract (see Step 5)
# Or disable image processing in code if not needed
```

### Issue: "GROQ_API_KEY not found"

**Solution:**
1. Check .env file exists
2. Verify GROQ_API_KEY is set
3. Ensure .env is in same directory as app.main module
4. Restart server after changing .env

### Issue: "Address already in use"

**Solution:** Port 8000 is in use
```bash
# Use different port
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001

# Or kill process using port 8000
# On Windows: netstat -ano | findstr :8000
# On Linux/Mac: lsof -i :8000
```

### Issue: "Database is locked" (SQLite)

**Solution:**
```bash
# Delete SQLite database to reset
rm reginova.db

# Restart server to recreate
```

### Issue: CORS errors from frontend

**Solution:** Update CORS_ORIGINS in .env:
```bash
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173","http://127.0.0.1:5173"]
```

## Database Management

### View Database (SQLite)

```bash
# Using sqlite3 CLI
sqlite3 reginova.db

# List tables
.tables

# View schema
.schema

# Query example
SELECT * FROM users;
```

### Reset Database

```bash
# Delete SQLite file
rm reginova.db

# Server will recreate on startup
```

## Code Organization

### Authentication Flow
1. User signs up → password hashed with bcrypt → stored in DB
2. User logs in → password verified → JWT token generated
3. Token sent to frontend
4. Frontend includes token in Authorization header for authenticated requests
5. Backend verifies token before processing request

### Document Processing Flow
1. File uploaded → validated
2. Text extracted (PDF reader/OCR/raw text)
3. Text split into chunks
4. Embeddings generated for each chunk
5. Chunks stored in database
6. Embeddings stored in FAISS index

### Search Flow
1. User query → embedding generated
2. FAISS vector search retrieves top-5 similar chunks
3. Context built from chunks
4. Groq API called with context and query
5. Response returned with source attribution

## Performance Tips

1. **Use PostgreSQL in production** (not SQLite)
2. **Increase CHUNK_SIZE** for less precise but faster search
3. **Use FAISS GPU** version if NVIDIA GPU available
4. **Enable database query caching** in production
5. **Monitor token usage** on Groq API (limited free tier)

## Development Workflow

```bash
# 1. Make changes to code
# 2. Server auto-reloads (uvicorn --reload)
# 3. Test with Swagger UI or cURL
# 4. Run test suite
pytest tests/

# 5. Check for errors
# 6. Commit changes
git add .
git commit -m "description"

# 7. Before pushing to production
pytest tests/ --cov=app
```

## Next Steps

1. **Connect Frontend** - Run frontend dev server
2. **Test Full Flow** - Signup → Upload → Search
3. **Deploy** - See DEPLOYMENT.md
4. **Monitor** - Check logs and analytics

## Getting Help

- Check error messages in terminal output
- Review logs in API response
- Test endpoints with Swagger UI first
- Check .env configuration
- Review database with sqlite3 CLI

## Additional Resources

- FastAPI Docs: https://fastapi.tiangolo.com
- SQLAlchemy Docs: https://docs.sqlalchemy.org
- Groq API Docs: https://console.groq.com/docs
- FAISS Docs: https://github.com/facebookresearch/faiss
- JWT Docs: https://jwt.io
