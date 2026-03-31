# RegiNova Backend API

AI-Powered Policy Intelligence Platform Backend

## Overview

RegiNova Backend is a production-ready FastAPI application that provides intelligent document analysis and semantic search capabilities using the Groq API with LLaMA 3 model.

## Features

- **Multi-user Architecture** - Secure user authentication with JWT tokens
- **Document Upload** - Support for PDF, images (OCR), and text files
- **AI-Powered Search** - Question & Answer using RAG (Retrieval-Augmented Generation)
- **Vector Search** - Semantic similarity search using FAISS
- **Policy Analysis** - Summarization, key point extraction, compliance checking
- **Analytics** - Search history and usage tracking
- **Production-Ready** - Database indexes, error handling, CORS configuration

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL (Neon) / SQLite
- **Vector Search**: FAISS
- **AI Model**: Groq API (LLaMA 3)
- **Auth**: JWT + Bcrypt
- **OCR**: Tesseract

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get current user info |
| POST | `/api/auth/password-reset` | Request password reset |
| POST | `/api/auth/password-reset-confirm` | Confirm password reset with OTP |

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/documents/upload` | Upload document (PDF/image/text) |
| GET | `/api/documents` | List all user documents |
| GET | `/api/documents/{document_id}` | Get single document |
| DELETE | `/api/documents/{document_id}` | Delete document |

### Search & AI

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/search/qa` | Question & Answer search |
| POST | `/api/search/summarize` | Summarize documents |
| POST | `/api/search/key-points` | Extract key points |
| POST | `/api/search/compliance` | Check compliance |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/user` | Get user analytics |
| GET | `/api/analytics/search-history` | Get search history |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

## Quick Start

### Prerequisites

- Python 3.9+
- pip
- Groq API key (free at https://console.groq.com)

### Installation

```bash
# Clone the repository
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env

# Configure .env with your settings
# - Add GROQ_API_KEY
# - Configure DATABASE_URL if needed
# - Set JWT_SECRET_KEY
```

### Running Locally

```bash
# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Access API documentation
# Swagger UI: http://localhost:8000/docs
# ReDoc: http://localhost:8000/redoc
```

## Request/Response Format

### Standard Response Format

```json
{
  "status": "success|error",
  "message": "Description",
  "data": {
    // Response data
  }
}
```

### Authentication

All authenticated endpoints require Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Example Usage

### 1. Signup

```bash
curl -X POST "http://localhost:8000/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "full_name": "John Doe"
  }'
```

### 2. Login

```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### 3. Upload Document

```bash
curl -X POST "http://localhost:8000/api/documents/upload" \
  -H "Authorization: Bearer <token>" \
  -F "file=@policy.pdf"
```

### 4. Search with Q&A

```bash
curl -X POST "http://localhost:8000/api/search/qa" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What are the main provisions of this policy?"
  }'
```

## Configuration

See `.env.example` for all configuration options:

- **DATABASE_URL** - Database connection string
- **GROQ_API_KEY** - Groq API key
- **JWT_SECRET_KEY** - JWT signing key
- **CORS_ORIGINS** - Allowed frontend origins
- **CHUNK_SIZE** - Text chunk size for embeddings (default: 1024)
- **MAX_UPLOAD_SIZE** - Maximum file upload size (default: 50MB)

## Database Models

### Users
- `id` - Unique user ID
- `email` - User email (unique)
- `password_hash` - Bcrypt hashed password
- `full_name` - User's full name
- `created_at` - Account creation timestamp

### Documents
- `id` - Document ID
- `user_id` - Owner user ID
- `filename` - Original filename
- `file_path` - Storage path
- `file_type` - PDF/image/text
- `original_text` - Extracted text
- `chunk_count` - Number of chunks
- `created_at` - Upload timestamp

### DocumentChunks
- `id` - Chunk ID
- `document_id` - Parent document
- `chunk_index` - Position in document
- `text` - Chunk text content
- `embedding` - Vector embedding

### SearchLogs
- `id` - Log ID
- `user_id` - User who searched
- `query` - Search query
- `feature_type` - qa/summarize/key_points/compliance
- `response` - AI response
- `confidence_score` - Confidence 0-1
- `processing_time_ms` - Latency
- `tokens_used` - LLM tokens
- `created_at` - Timestamp

### Analytics
- Aggregated user statistics
- Tracks total documents, queries, tokens
- Average processing time

## Testing

```bash
# Run test suite
pytest tests/

# Run with coverage
pytest --cov=app tests/
```

## Error Handling

API returns appropriate HTTP status codes:

- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (auth required or invalid token)
- `404` - Not Found
- `500` - Server Error

All errors include a descriptive message in the response body.

## Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens with 24-hour expiry
- User data isolation at database level
- CORS protection
- Input validation with Pydantic
- OTP for password reset (10-minute expiry)

## Performance

- Database indexes on frequently queried columns
- Connection pooling for PostgreSQL
- FAISS for fast vector similarity search
- Async request handling with FastAPI
- Efficient text chunking with overlap

## Deployment

See `DEPLOYMENT.md` for instructions on deploying to Render.

## Development Setup

See `SETUP.md` for detailed development setup guide.

## License

MIT

## Support

For issues or questions, see the main project repository.
