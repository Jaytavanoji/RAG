<div align="center">

```text
 ───▄▀▀▀▄▄▄▄▄▄▄▀▀▀▄───
 ───█▒▒░░░░░░░░░▒▒█───
 ────█░░█░░░░░█░░█────  REGINOVA RAG AI
 ─▄▄──█░░░▀█▀░░░█──▄▄─  ENTERPRISE VECTOR INTEL
 █░░█─▀▄░░░░░░░▄▀─█░░█  [FAISS + GROQ LLAMA 3.1]
```

# 🌌 REGINOVA — AI RAG INTELLIGENCE ENGINE

**Next-Gen Retrieval-Augmented Generation Platform for Enterprise Document Analytics & High-Speed Vector Intelligence**

[![JavaScript](https://img.shields.io/badge/JavaScript-61.7%25-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://github.com/Jaytavanoji/RAG)
[![Python](https://img.shields.io/badge/Python-30.1%25-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://github.com/Jaytavanoji/RAG)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.5%25-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://github.com/Jaytavanoji/RAG)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Groq AI](https://img.shields.io/badge/Groq_AI-Llama_3.1-FF4D1F?style=for-the-badge&logo=openai&logoColor=white)](https://groq.com/)
[![Neon DB](https://img.shields.io/badge/Neon-PostgreSQL-00E5A3?style=for-the-badge&logo=postgresql&logoColor=black)](https://neon.tech/)

---

### ⚡ **Instant Document Vectorization · Sub-200ms Semantic Search · Bank-Grade JWT Auth**

[Explore Architecture](#-system-architecture) · [Quick Start](#-quick-start) · [API Documentation](#-api-endpoints)

</div>

<br />

> [!IMPORTANT]
> **Production Ready Platform**: RegiNova is equipped with automated rotating logs, rate-limiting middleware, multi-tenant database isolation, security header hardening, and 4x automated health-monitoring endpoints.

<br />

## 📊 Language Composition

```text
JavaScript  ██████████████████████████████ 61.7%
Python      ███████████████ 30.1%
TypeScript  ███▋ 7.5%
Other       ▍ 0.7%
```

---

## ⚡ Key Highlights & Capabilities

<table align="center" width="100%">
  <tr>
    <td width="50%" valign="top">
      <h3>⚡ Ultra-Fast FAISS Search</h3>
      <p>Sub-200ms semantic similarity queries across massive document indexes using persistent FAISS vector embeddings.</p>
    </td>
    <td width="50%" valign="top">
      <h3>🧠 Groq Llama 3.1 LLM Engine</h3>
      <p>Powered by <code>llama-3.1-8b-instant</code> for real-time RAG context synthesis, document summarization, and confidence scoring.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>🔒 Bank-Grade Auth & Security</h3>
      <p>JWT bearer authentication (24h expiry), bcrypt password hashing (12 rounds), CORS domain isolation, and security headers (HSTS, CSP).</p>
    </td>
    <td width="50%" valign="top">
      <h3>🗄️ Neon Cloud PostgreSQL</h3>
      <p>Serverless relational storage with 5 normalized tables, automated daily backups, and multi-tenant user data isolation.</p>
    </td>
  </tr>
</table>

---

## 📐 System Architecture

```mermaid
sequenceDiagram
    autonumber
    actor User as 👤 Client / React UI
    participant Gateway as 🛡️ Security & Rate Limiter
    participant API as 🚀 FastAPI Server
    participant Vector as ⚡ FAISS Store
    participant AI as 🧠 Groq Llama 3.1
    participant DB as 🗄️ Neon PostgreSQL

    User->>Gateway: POST /api/search (Query + JWT Token)
    Gateway->>API: Validates Rate Limit & HSTS/CORS
    API->>DB: Verify User Session & Isolation
    API->>Vector: Perform Sub-200ms Vector Match
    Vector-->>API: Return Top-K Relevant Context Chunks
    API->>AI: Synthesize Prompt + Context Chunks
    AI-->>API: Stream RAG Answer + Confidence Score
    API->>DB: Log Audit Event & Search History
    API-->>User: Return 200 OK (Answer + Sources + Analytics)
```

---

## 🛠️ Tech Stack Matrix

| Domain | Core Technology | Highlights |
| :--- | :--- | :--- |
| **Backend Framework** | **FastAPI (Python 3.11)** | Asynchronous REST API, Uvicorn ASGI server, Pydantic schemas |
| **RAG AI Pipeline** | **Groq API (`llama-3.1-8b-instant`)** | Low-latency inference, token tracking, dynamic summarization |
| **Vector Engine** | **FAISS (Facebook AI Similarity Search)** | Persistent vector index, cosine similarity matching |
| **Relational Database** | **Neon PostgreSQL** | Serverless SQL, SQLAlchemy ORM, 5 core schemas |
| **Frontend UI** | **React + Vite + TypeScript** | React Router, Material Symbols, Responsive Glassmorphic UI |
| **Auth & Security** | **PyJWT + Passlib (bcrypt)** | 24-hour expiration, SecurityHeadersMiddleware, 100 req/min rate limiter |
| **Infrastructure** | **Render.com + Vercel** | Automated CI/CD deployments, free SSL certificates |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python** `v3.11+`
- **Node.js** `v18.0.0+`
- **Groq API Key** ([Get your key here](https://console.groq.com))
- **Neon PostgreSQL Instance** ([Create free DB](https://neon.tech))

---

### 1. Clone & Setup Repository

```bash
git clone https://github.com/Jaytavanoji/RAG.git
cd RAG
```

### 2. Configure Backend Environment (`.env`)

Create a `.env` file in the root directory:

```env
# Database & Authentication
DATABASE_URL=postgresql+psycopg2://user:password@ep-host.neon.tech/reginova_db
JWT_SECRET=your_super_secret_32_character_key_here
ENVIRONMENT=production
DEBUG=False

# Groq AI Settings
GROQ_API_KEY=gsk_your_groq_api_key_string
GROQ_MODEL=llama-3.1-8b-instant

# Security Controls
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]
RATE_LIMIT_ENABLED=True
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_SECONDS=60
```

### 3. Launch Backend Server

```bash
# Create & activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Run DB schema migrations & start server
python reset_db.py
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

> [!TIP]
> Access interactive Swagger API documentation live at **`http://localhost:8000/docs`**

### 4. Launch Frontend Application

```bash
cd frontend
npm install
npm run dev
```

Open **`http://localhost:5173`** in your browser to interact with the RegiNova platform!

---

## 📡 API Endpoints Cheat Sheet

| Category | Endpoint | Method | Description | Auth Required |
| :--- | :--- | :---: | :--- | :---: |
| 🟢 **System** | `/api/health` | `GET` | System, DB & FAISS Health Diagnostic | ❌ |
| 🔑 **Auth** | `/api/auth/signup` | `POST` | Register User (Bcrypt Password Hashing) | ❌ |
| 🔑 **Auth** | `/api/auth/login` | `POST` | Authenticate & Issue 24h JWT Token | ❌ |
| 👤 **User** | `/api/auth/me` | `GET` | Get Current User Session Profile | ✅ |
| 📄 **Docs** | `/api/documents/upload` | `POST` | Ingest PDF/Text & Index into FAISS | ✅ |
| 🧠 **RAG** | `/api/search` | `POST` | Execute Vector Search + Groq LLM Answer | ✅ |
| 📊 **Metrics** | `/api/analytics` | `GET` | Fetch Query Durations, Tokens & Search History | ✅ |

---

## 📂 Project Directory Map

```text
RAG/
├── app/
│   ├── main.py             # FastAPI entrypoint & Security Middleware
│   ├── config.py           # Environment settings & Pydantic config
│   ├── database.py         # Neon PostgreSQL connection pooling
│   ├── auth/               # JWT token logic & bcrypt hashing
│   ├── rag/                # FAISS vector store & Groq LLM pipeline
│   └── models/             # SQLAlchemy DB schemas
├── frontend/
│   ├── src/                # React components, UI views & API clients
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite build configuration
├── logs/                   # Rotating production logs (reginova.log, error.log, audit.log)
├── reset_db.py             # Database migration & table reset script
├── requirements.txt        # Python backend dependencies
└── README.md               # Documentation
```

---

## 🛡️ Audit Logging & Security Operations

RegiNova automatically writes structured, rotating logs to the `./logs/` directory:

- 📝 **`logs/reginova.log`**: General system execution & latency metrics.
- 🚨 **`logs/error.log`**: Exception stack trace capture.
- 🔒 **`logs/audit.log`**: User authentication events and document access trails.

```bash
# Monitor live logs in real-time
tail -f logs/reginova.log
```

---

## 👤 Author & Credits

Developed with ❤️ by **Jay Tavanoji**.

- **GitHub Repository**: [@Jaytavanoji/RAG](https://github.com/Jaytavanoji/RAG)
- **Portfolio**: [porfolio-jay-tavanoji-56.vercel.app](https://porfolio-jay-tavanoji-56.vercel.app/)
