🌌 REGINOVA — AI RAG INTELLIGENCE ENGINE
Next-Gen Retrieval-Augmented Generation Platform for Enterprise Document Analytics & High-Speed Vector Intelligence

JavaScriptPythonTypeScriptFastAPIGroq AINeon DB

⚡ Instant Document Vectorization · Sub-200ms Semantic Search · Bank-Grade JWT Auth
Explore Architecture
 · 
Quick Start
 · 
API Documentation


IMPORTANT

Production Ready Platform: RegiNova is equipped with automated rotating logs, rate-limiting middleware, multi-tenant database isolation, security header hardening, and 4x automated health-monitoring endpoints.


📊 Language Composition
text


JavaScript  ██████████████████████████████ 61.7%
Python      ███████████████ 30.1%
TypeScript  ███▋ 7.5%
Other       ▍ 0.7%
⚡ Key Highlights & Capabilities
⚡ Ultra-Fast FAISS Search
Sub-200ms semantic similarity queries across massive document indexes using persistent FAISS vector embeddings.

🧠 Groq Llama 3.1 LLM Engine
Powered by llama-3.1-8b-instant for real-time RAG context synthesis, document summarization, and confidence scoring.

🔒 Bank-Grade Auth & Security
JWT bearer authentication (24h expiry), bcrypt password hashing (12 rounds), CORS domain isolation, and security headers (HSTS, CSP).

🗄️ Neon Cloud PostgreSQL
Serverless relational storage with 5 normalized tables, automated daily backups, and multi-tenant user data isolation.

📐 System Architecture
Mermaid diagram
🛠️ Tech Stack Matrix
Domain	Core Technology	Highlights
Backend Framework	FastAPI (Python 3.11)	Asynchronous REST API, Uvicorn ASGI server, Pydantic schemas
RAG AI Pipeline	Groq API (llama-3.1-8b-instant)	Low-latency inference, token tracking, dynamic summarization
Vector Engine	FAISS (Facebook AI Similarity Search)	Persistent vector index, cosine similarity matching
Relational Database	Neon PostgreSQL	Serverless SQL, SQLAlchemy ORM, 5 core schemas
Frontend UI	React + Vite + TypeScript	React Router, Material Symbols, Responsive Glassmorphic UI
Auth & Security	PyJWT + Passlib (bcrypt)	24-hour expiration, SecurityHeadersMiddleware, 100 req/min rate limiter
Infrastructure	Render.com + Vercel	Automated CI/CD deployments, free SSL certificates
🚀 Quick Start Guide
Prerequisites
Python v3.11+
Node.js v18.0.0+
Groq API Key (Get your key here)
Neon PostgreSQL Instance (Create free DB)
1. Clone & Setup Repository
bash


git clone https://github.com/Jaytavanoji/RAG.git
cd RAG
2. Configure Backend Environment (.env)
Create a .env file in the root directory:

env


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
3. Launch Backend Server
bash


# Create & activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
# Install requirements
pip install -r requirements.txt
# Run DB schema migrations & start server
python reset_db.py
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
TIP

Access interactive Swagger API documentation live at http://localhost:8000/docs

4. Launch Frontend Application
bash


cd frontend
npm install
npm run dev
Open http://localhost:5173 in your browser to interact with the RegiNova platform!

📡 API Endpoints Cheat Sheet
Category	Endpoint	Method	Description	Auth Required
🟢 System	/api/health	GET	System, DB & FAISS Health Diagnostic	❌
🔑 Auth	/api/auth/signup	POST	Register User (Bcrypt Password Hashing)	❌
🔑 Auth	/api/auth/login	POST	Authenticate & Issue 24h JWT Token	❌
👤 User	/api/auth/me	GET	Get Current User Session Profile	✅
📄 Docs	/api/documents/upload	POST	Ingest PDF/Text & Index into FAISS	✅
🧠 RAG	/api/search	POST	Execute Vector Search + Groq LLM Answer	✅
📊 Metrics	/api/analytics	GET	Fetch Query Durations, Tokens & Search History	✅
📂 Project Directory Map
text


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
🛡️ Audit Logging & Security Operations
RegiNova automatically writes structured, rotating logs to the ./logs/ directory:

📝 logs/reginova.log: General system execution & latency metrics.
🚨 logs/error.log: Exception stack trace capture.
🔒 logs/audit.log: User authentication events and document access trails.
bash


# Monitor live logs in real-time
tail -f logs/reginova.log
👤 Author & Credits
Developed with ❤️ by Jay Tavanoji.

GitHub Repository: @Jaytavanoji/RAG
