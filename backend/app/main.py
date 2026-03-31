"""
RegiNova Backend - FastAPI Application
AI-Powered Policy Intelligence Platform
"""

import uuid
import time
from datetime import datetime, timedelta
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db, init_db
from app.models import User, Document, DocumentChunk, SearchLog, Analytics, Ticket, TicketReply, Notification, UserSettings, ArchivedDocument, FAQ, TerminalLog, EntityNode
from app.schemas import *
from app.schemas import TicketCreate, TicketReplyCreate, TicketResponse, TicketListResponse, TicketDetailResponse
from app.auth import hash_password, verify_password, create_access_token, verify_token, generate_otp, validate_password
from app.document_processor import extract_text_from_file, chunk_text, save_upload_file, delete_file, get_file_type, validate_file
from app.vector_store import get_vector_store, generate_embeddings, delete_vector_store
from app.groq_service import get_groq_service
from app.logging_config import app_logger, audit_logger, log_user_action
from app.monitoring import get_full_health_report, get_system_health, get_database_health

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add security headers middleware
from fastapi.middleware import Middleware
from starlette.middleware.base import BaseHTTPMiddleware

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
        response.headers["Content-Security-Policy"] = "default-src 'self' http://localhost:5173 http://localhost:5174 http://localhost:3000 http://127.0.0.1:5173 http://127.0.0.1:5174 http://127.0.0.1:8000"
        return response

app.add_middleware(SecurityHeadersMiddleware)

# Add request logging middleware
class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        
        # Log request
        app_logger.info(
            f"REQUEST | method={request.method} | path={request.url.path} | "
            f"status={response.status_code} | duration={process_time:.3f}s"
        )
        
        return response

app.add_middleware(RequestLoggingMiddleware)


# ==================== INITIALIZATION ====================

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()
    
    # Preload sentence transformer model for faster embeddings
    import threading
    def preload_model():
        try:
            from sentence_transformers import SentenceTransformer
            SentenceTransformer('all-MiniLM-L6-v2')
            print("Sentence transformer model preloaded")
        except Exception as e:
            print(f"Failed to preload model: {e}")
    
    thread = threading.Thread(target=preload_model)
    thread.daemon = True
    thread.start()
    
    from app.database import SessionLocal
    db = SessionLocal()
    try:
        existing_faqs = db.query(FAQ).first()
        if not existing_faqs:
            default_faqs = [
                FAQ(id=str(uuid.uuid4()), category="Getting Started", question="How do I upload a document?", answer="Navigate to the Ingest page and drag-drop or select your PDF, image, or text file. The system will automatically process and index it for search.", order=1),
                FAQ(id=str(uuid.uuid4()), category="Getting Started", question="How does the Neural Search work?", answer="The Neural Search uses AI to understand your query context and finds relevant information from your uploaded documents using vector similarity search.", order=2),
                FAQ(id=str(uuid.uuid4()), category="Getting Started", question="What file types are supported?", answer="Currently supported formats: PDF, Images (PNG, JPG, JPEG), and plain text files. More formats coming soon.", order=3),
                FAQ(id=str(uuid.uuid4()), category="Account", question="How do I reset my password?", answer="Use the login page's password reset feature. Enter your email and we'll send a verification code.", order=1),
                FAQ(id=str(uuid.uuid4()), category="Account", question="Is my data secure?", answer="Yes. All data is encrypted with AES-256 encryption. Your documents are stored in isolated vector stores accessible only by you.", order=2),
                FAQ(id=str(uuid.uuid4()), category="Technical", question="What is the Groq API used for?", answer="Groq provides the LLaMA 3 language model for generating intelligent answers from your documents.", order=1),
                FAQ(id=str(uuid.uuid4()), category="Technical", question="Why is my search returning no results?", answer="Ensure you have uploaded documents first. The search only works on indexed documents in your vault.", order=2),
                FAQ(id=str(uuid.uuid4()), category="Billing", question="How is usage calculated?", answer="Usage is based on the number of documents uploaded and AI queries processed. Check your analytics page for details.", order=1),
            ]
            for faq in default_faqs:
                db.add(faq)
            db.commit()
    finally:
        db.close()


# ==================== UTILITY FUNCTIONS ====================

def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)) -> User:
    """Dependency to get current user from JWT token"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authentication scheme")
        
        user_id = verify_token(token)
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


# ==================== HEALTH CHECK ====================

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "success",
        "message": "RegiNova backend is running",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/api/health/detailed")
async def detailed_health_check():
    """Detailed health check with system metrics"""
    return {
        "status": "success",
        "data": get_full_health_report()
    }


@app.get("/api/health/system")
async def system_health():
    """Get system health metrics"""
    return {
        "status": "success",
        "data": get_system_health()
    }


@app.get("/api/health/database")
async def database_health():
    """Get database health"""
    return {
        "status": "success",
        "data": get_database_health()
    }


# ==================== AUTHENTICATION ENDPOINTS ====================

@app.post("/api/auth/signup", response_model=AuthResponse)
async def signup(request: SignupRequest, db: Session = Depends(get_db)):
    """Register a new user"""
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Validate password
    is_valid, error_msg = validate_password(request.password)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)
    
    # Create new user
    user_id = str(uuid.uuid4())
    user = User(
        id=user_id,
        email=request.email,
        password_hash=hash_password(request.password),
        full_name=request.full_name
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Log signup
    audit_logger.info(f"SIGNUP | user_id={user_id} | email={request.email}")
    
    # Create analytics record
    analytics = Analytics(
        id=str(uuid.uuid4()),
        user_id=user_id,
        total_documents=0,
        total_queries=0,
        total_tokens_used=0,
        average_processing_time_ms=0
    )
    db.add(analytics)
    
    # Create default notifications for new user
    default_notifications = [
        Notification(
            id=str(uuid.uuid4()),
            user_id=user_id,
            title="Welcome to RegiNova!",
            description="Get started by uploading your first document in the Ingest page.",
            notification_type="info",
            is_read=False
        ),
        Notification(
            id=str(uuid.uuid4()),
            user_id=user_id,
            title="Quick Tip: Neural Search",
            description="Use natural language to search your documents. Try questions like 'What is the policy on...?'",
            notification_type="tip",
            is_read=False
        ),
        Notification(
            id=str(uuid.uuid4()),
            user_id=user_id,
            title="Explore Analytics",
            description="Check your Analytics page to track document usage and search patterns.",
            notification_type="info",
            is_read=False
        ),
    ]
    for notification in default_notifications:
        db.add(notification)
    
    # Create default user settings
    user_settings = UserSettings(
        id=str(uuid.uuid4()),
        user_id=user_id,
        theme="dark",
        email_notifications=True,
        ai_model="llama-3.1-70b-versatile"
    )
    db.add(user_settings)
    
    db.commit()
    
    return {
        "status": "success",
        "message": "User registered successfully",
        "data": {"user_id": user_id, "email": request.email}
    }


@app.post("/api/auth/login", response_model=AuthResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Login user and return JWT token"""
    
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token(user.id)
    
    # Log login
    audit_logger.info(f"LOGIN | user_id={user.id} | email={request.email}")
    
    return {
        "status": "success",
        "message": "Login successful",
        "data": {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": user.id
        }
    }


@app.get("/api/auth/me", response_model=AuthResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    
    return {
        "status": "success",
        "message": "User retrieved successfully",
        "data": {
            "id": current_user.id,
            "email": current_user.email,
            "full_name": current_user.full_name,
            "created_at": current_user.created_at.isoformat()
        }
    }


# ==================== DOCUMENT SYSTEM ====================

@app.post("/api/upload", response_model=DocumentUploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload and process a document"""
    
    # Read file content
    content = await file.read()
    
    # Validate file
    is_valid, error_msg = validate_file(file.filename, len(content))
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)
    
    try:
        # Determine file type
        file_type = get_file_type(file.filename)
        
        # Save file
        file_path = save_upload_file(content, current_user.id, file.filename)
        
        # Extract text
        text = extract_text_from_file(file_path, file_type)
        if not text:
            raise HTTPException(status_code=400, detail="No text could be extracted from file")
        
        # Create document record
        doc_id = str(uuid.uuid4())
        document = Document(
            id=doc_id,
            user_id=current_user.id,
            filename=file.filename,
            file_path=file_path,
            file_type=file_type,
            original_text=text,
            chunk_count=0
        )
        
        db.add(document)
        db.commit()
        
        # Process chunks and create embeddings
        chunks = chunk_text(text)
        vector_store = get_vector_store(current_user.id)
        
        chunk_info_list = []
        for i, chunk_text_content in enumerate(chunks):
            chunk_id = str(uuid.uuid4())
            embedding = generate_embeddings(chunk_text_content)
            
            # Store chunk in database
            chunk_db = DocumentChunk(
                id=chunk_id,
                document_id=doc_id,
                chunk_index=i,
                text=chunk_text_content,
                embedding=str(embedding)
            )
            db.add(chunk_db)
            
            # Prepare for vector store
            chunk_info_list.append({
                "chunk_id": chunk_id,
                "document_id": doc_id,
                "filename": file.filename,
                "text": chunk_text_content,
                "chunk_index": i
            })
        
        # Add vectors to store
        embeddings = [generate_embeddings(chunk_text_content) for chunk_text_content in chunks]
        vector_store.add_vectors(embeddings, chunk_info_list)
        
        # Update document chunk count
        document.chunk_count = len(chunks)
        
        # Update analytics
        analytics = db.query(Analytics).filter(Analytics.user_id == current_user.id).first()
        if analytics:
            analytics.total_documents += 1
            analytics.last_updated = datetime.utcnow()
        
        db.commit()
        
        return {
            "status": "success",
            "message": "Document uploaded successfully",
            "data": {
                "document_id": doc_id,
                "filename": file.filename,
                "chunk_count": len(chunks),
                "file_type": file_type
            }
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/documents", response_model=DocumentListResponse)
async def list_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all documents for current user"""
    
    documents = db.query(Document).filter(Document.user_id == current_user.id).order_by(Document.created_at.desc()).all()
    
    return {
        "status": "success",
        "data": [
            {
                "id": doc.id,
                "filename": doc.filename,
                "file_type": doc.file_type,
                "chunk_count": doc.chunk_count,
                "created_at": doc.created_at,
                "summary": (doc.original_text[:200] + "...") if doc.original_text and len(doc.original_text) > 200 else (doc.original_text or "")
            }
            for doc in documents
        ],
        "total": len(documents)
    }


@app.get("/api/documents/{document_id}", response_model=DocumentListResponse)
async def get_document(
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get single document"""
    
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    return {
        "status": "success",
        "data": [
            {
                "id": document.id,
                "filename": document.filename,
                "file_type": document.file_type,
                "chunk_count": document.chunk_count,
                "created_at": document.created_at
            }
        ],
        "total": 1
    }


@app.delete("/api/documents/{document_id}", response_model=DocumentDeleteResponse)
async def delete_document(
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a document"""
    
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    try:
        # Delete file
        delete_file(document.file_path)
        
        # Delete from database
        db.delete(document)
        
        # Update analytics
        analytics = db.query(Analytics).filter(Analytics.user_id == current_user.id).first()
        if analytics and analytics.total_documents > 0:
            analytics.total_documents -= 1
            analytics.last_updated = datetime.utcnow()
        
        db.commit()
        
        return {
            "status": "success",
            "message": "Document deleted successfully"
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# ==================== SEARCH & AI ENDPOINTS ====================

@app.post("/api/search", response_model=SearchResponse)
async def search(
    request: SearchRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Search documents with Q&A"""
    
    start_time = time.time()
    
    # Get user documents
    documents = db.query(Document).filter(Document.user_id == current_user.id).all()
    if not documents:
        raise HTTPException(status_code=400, detail="No documents uploaded")
    
    try:
        # Vector search
        vector_store = get_vector_store(current_user.id)
        query_embedding = generate_embeddings(request.query)
        results = vector_store.search(query_embedding, k=5)
        
        if not results:
            raise HTTPException(status_code=400, detail="No relevant chunks found")
        
        # Build context
        context = "\n\n".join([f"[{r['filename']}]: {r['text']}" for r in results])
        
        # Generate answer
        groq = get_groq_service()
        answer, tokens, confidence = groq.generate_answer(request.query, context)
        
        processing_time = (time.time() - start_time) * 1000
        
        # Log search
        search_log = SearchLog(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            query=request.query,
            feature_type="qa",
            response=answer,
            sources=str(results),
            confidence_score=confidence,
            processing_time_ms=processing_time,
            tokens_used=tokens
        )
        db.add(search_log)
        
        # Update analytics
        analytics = db.query(Analytics).filter(Analytics.user_id == current_user.id).first()
        if analytics:
            analytics.total_queries += 1
            analytics.total_tokens_used += tokens
            if analytics.average_processing_time_ms == 0:
                analytics.average_processing_time_ms = processing_time
            else:
                analytics.average_processing_time_ms = (
                    analytics.average_processing_time_ms * (analytics.total_queries - 1) + processing_time
                ) / analytics.total_queries
            analytics.last_updated = datetime.utcnow()
        
        db.commit()
        
        return {
            "status": "success",
            "message": "Answer generated successfully",
            "data": {
                "answer": answer,
                "sources": [
                    {
                        "chunk_id": r.get("chunk_id"),
                        "document_id": r.get("document_id"),
                        "filename": r.get("filename"),
                        "text": r.get("text"),
                        "chunk_index": r.get("chunk_index")
                    }
                    for r in results
                ],
                "confidence_score": confidence,
                "processing_time_ms": processing_time
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))



# ==================== ANALYTICS ENDPOINTS ====================

@app.get("/api/analytics", response_model=SearchResponse)
async def get_user_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user analytics"""
    
    analytics = db.query(Analytics).filter(Analytics.user_id == current_user.id).first()
    search_logs = db.query(SearchLog).filter(SearchLog.user_id == current_user.id).order_by(SearchLog.created_at.desc()).limit(10).all()
    recent_documents = db.query(Document).filter(Document.user_id == current_user.id).order_by(Document.created_at.desc()).limit(10).all()
    
    total_docs = analytics.total_documents if analytics else 0
    total_queries = analytics.total_queries if analytics else 0
    total_tokens = analytics.total_tokens_used if analytics else 0
    avg_time = analytics.average_processing_time_ms if analytics else 0
    
    # Build neural heatmap from last 14 days of search logs
    from collections import defaultdict
    from datetime import date
    daily_counts = defaultdict(int)
    all_logs = db.query(SearchLog).filter(SearchLog.user_id == current_user.id).all()
    for log in all_logs:
        day_str = log.created_at.strftime("%m/%d") if log.created_at else ""
        if day_str:
            daily_counts[day_str] += 1
    
    neural_heatmap = [
        {"date": day, "activity": count}
        for day, count in sorted(daily_counts.items())[-14:]
    ]
    
    return {
        "status": "success",
        "message": "Analytics retrieved successfully",
        "data": {
            # Raw fields for Analytics page
            "total_documents": total_docs,
            "total_queries": total_queries,
            "total_tokens_used": total_tokens,
            "total_size": f"{total_docs * 0.5:.1f} MB",  # estimated
            "total_tickets": 0,  # ticket system placeholder
            "average_processing_time_ms": avg_time,
            # Dashboard metrics wrapper
            "metrics": {
                "total_documents": total_docs,
                "total_queries": total_queries,
                "active_tickets": 0,
                "neural_integrity": "98.4%",
                "vault_storage": f"{total_docs * 0.5:.1f} MB"
            },
            # Recent documents for Dashboard intel feed
            "recent_documents": [
                {
                    "id": doc.id,
                    "filename": doc.filename,
                    "file_type": doc.file_type,
                    "chunk_count": doc.chunk_count,
                    "created_at": doc.created_at.isoformat() if doc.created_at else ""
                }
                for doc in recent_documents
            ],
            # Neural heatmap for activity chart
            "neural_heatmap": neural_heatmap,
            # Search history
            "search_history": [
                {
                    "id": log.id,
                    "query": log.query,
                    "feature_type": log.feature_type,
                    "response": log.response,
                    "confidence_score": log.confidence_score,
                    "processing_time_ms": log.processing_time_ms,
                    "created_at": log.created_at.isoformat() if log.created_at else ""
                }
                for log in search_logs
            ]
        }
    }


# ==================== TICKET SYSTEM ENDPOINTS ====================

@app.post("/api/tickets", response_model=TicketListResponse)
async def create_ticket(
    request: TicketCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new support ticket"""
    
    ticket_id = str(uuid.uuid4())
    ticket = Ticket(
        id=ticket_id,
        user_id=current_user.id,
        title=request.title,
        category=request.category,
        priority=request.priority,
        description=request.description,
        status="Open"
    )
    
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    
    audit_logger.info(f"TICKET_CREATED | ticket_id={ticket_id} | user_id={current_user.id} | priority={request.priority}")
    
    return {
        "status": "success",
        "data": [
            {
                "id": ticket.id,
                "title": ticket.title,
                "category": ticket.category,
                "priority": ticket.priority,
                "description": ticket.description,
                "status": ticket.status,
                "created_at": ticket.created_at,
                "updated_at": ticket.updated_at
            }
        ],
        "total": 1
    }


@app.get("/api/tickets", response_model=TicketListResponse)
async def list_tickets(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all tickets for current user"""
    
    tickets = db.query(Ticket).filter(
        Ticket.user_id == current_user.id
    ).order_by(Ticket.created_at.desc()).all()
    
    return {
        "status": "success",
        "data": [
            {
                "id": t.id,
                "title": t.title,
                "category": t.category,
                "priority": t.priority,
                "description": t.description,
                "status": t.status,
                "created_at": t.created_at,
                "updated_at": t.updated_at
            }
            for t in tickets
        ],
        "total": len(tickets)
    }


@app.get("/api/tickets/{ticket_id}", response_model=TicketDetailResponse)
async def get_ticket(
    ticket_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get single ticket with replies"""
    
    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id,
        Ticket.user_id == current_user.id
    ).first()
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    replies = db.query(TicketReply).filter(
        TicketReply.ticket_id == ticket_id
    ).order_by(TicketReply.created_at.asc()).all()
    
    return {
        "id": ticket.id,
        "title": ticket.title,
        "category": ticket.category,
        "priority": ticket.priority,
        "description": ticket.description,
        "status": ticket.status,
        "created_at": ticket.created_at,
        "updated_at": ticket.updated_at,
        "replies": [
            {
                "id": r.id,
                "message": r.message,
                "is_admin": r.is_admin,
                "created_at": r.created_at.isoformat() if r.created_at else ""
            }
            for r in replies
        ]
    }


@app.post("/api/tickets/{ticket_id}/reply", response_model=TicketDetailResponse)
async def reply_to_ticket(
    ticket_id: str,
    request: TicketReplyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Reply to a ticket"""
    
    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id,
        Ticket.user_id == current_user.id
    ).first()
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    reply_id = str(uuid.uuid4())
    reply = TicketReply(
        id=reply_id,
        ticket_id=ticket_id,
        user_id=current_user.id,
        message=request.message,
        is_admin=False
    )
    
    db.add(reply)
    db.commit()
    
    # Get updated replies
    replies = db.query(TicketReply).filter(
        TicketReply.ticket_id == ticket_id
    ).order_by(TicketReply.created_at.asc()).all()
    
    return {
        "id": ticket.id,
        "title": ticket.title,
        "category": ticket.category,
        "priority": ticket.priority,
        "description": ticket.description,
        "status": ticket.status,
        "created_at": ticket.created_at,
        "updated_at": ticket.updated_at,
        "replies": [
            {
                "id": r.id,
                "message": r.message,
                "is_admin": r.is_admin,
                "created_at": r.created_at.isoformat() if r.created_at else ""
            }
            for r in replies
        ]
    }


@app.patch("/api/tickets/{ticket_id}/close", response_model=TicketListResponse)
async def close_ticket(
    ticket_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Close a ticket"""
    
    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id,
        Ticket.user_id == current_user.id
    ).first()
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    ticket.status = "Closed"
    db.commit()
    db.refresh(ticket)
    
    audit_logger.info(f"TICKET_CLOSED | ticket_id={ticket_id} | user_id={current_user.id}")
    
    return {
        "status": "success",
        "data": [
            {
                "id": ticket.id,
                "title": ticket.title,
                "category": ticket.category,
                "priority": ticket.priority,
                "description": ticket.description,
                "status": ticket.status,
                "created_at": ticket.created_at,
                "updated_at": ticket.updated_at
            }
        ],
        "total": 1
    }


@app.get("/api/history", response_model=SearchResponse)
async def get_search_history(
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get search history"""
    
    search_logs = db.query(SearchLog).filter(
        SearchLog.user_id == current_user.id
    ).order_by(SearchLog.created_at.desc()).limit(limit).all()
    
    return {
        "status": "success",
        "message": "Search history retrieved",
        "data": [
            {
                "id": log.id,
                "query": log.query,
                "feature_type": log.feature_type,
                "response": log.response[:200] if log.response else "",
                "confidence_score": log.confidence_score,
                "processing_time_ms": log.processing_time_ms,
                "created_at": log.created_at.isoformat() if log.created_at else "",
                "timestamp": log.created_at.isoformat() if log.created_at else ""
            }
            for log in search_logs
        ]
    }


# ==================== NOTIFICATION ENDPOINTS ====================

@app.get("/api/notifications", response_model=NotificationListResponse)
async def list_notifications(
    unread_only: bool = False,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user notifications"""
    
    query = db.query(Notification).filter(Notification.user_id == current_user.id)
    
    if unread_only:
        query = query.filter(Notification.is_read == False)
    
    notifications = query.order_by(Notification.created_at.desc()).all()
    unread_count = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).count()
    
    return {
        "status": "success",
        "data": [
            {
                "id": n.id,
                "title": n.title,
                "description": n.description,
                "notification_type": n.notification_type,
                "icon": n.icon,
                "is_read": n.is_read,
                "priority": n.priority,
                "created_at": n.created_at.isoformat() if n.created_at else ""
            }
            for n in notifications
        ],
        "total": len(notifications),
        "unread_count": unread_count
    }


@app.post("/api/notifications/mark-read", response_model=NotificationListResponse)
async def mark_notifications_read(
    request: NotificationMarkRead,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark notifications as read"""
    
    for notif_id in request.notification_ids:
        notification = db.query(Notification).filter(
            Notification.id == notif_id,
            Notification.user_id == current_user.id
        ).first()
        if notification:
            notification.is_read = True
    
    db.commit()
    
    return await list_notifications(False, current_user, db)


@app.post("/api/notifications/mark-all-read", response_model=NotificationListResponse)
async def mark_all_notifications_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark all notifications as read"""
    
    db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).update({"is_read": True})
    
    db.commit()
    
    return await list_notifications(False, current_user, db)


# ==================== USER SETTINGS ENDPOINTS ====================

@app.get("/api/settings", response_model=SettingsResponse)
async def get_user_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user settings"""
    
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    
    if not settings:
        settings_id = str(uuid.uuid4())
        settings = UserSettings(
            id=settings_id,
            user_id=current_user.id,
            theme="void",
            language="en",
            email_notifications=True,
            security_alerts=True,
            ai_model="llama-3-70b-8192",
            max_results=5,
            auto_archive=False
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    
    return {
        "status": "success",
        "data": {
            "id": settings.id,
            "theme": settings.theme,
            "language": settings.language,
            "email_notifications": settings.email_notifications,
            "security_alerts": settings.security_alerts,
            "ai_model": settings.ai_model,
            "max_results": settings.max_results,
            "auto_archive": settings.auto_archive,
            "created_at": settings.created_at.isoformat() if settings.created_at else "",
            "updated_at": settings.updated_at.isoformat() if settings.updated_at else ""
        }
    }


@app.put("/api/settings", response_model=SettingsResponse)
async def update_user_settings(
    request: UserSettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user settings"""
    
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    
    if not settings:
        settings_id = str(uuid.uuid4())
        settings = UserSettings(id=settings_id, user_id=current_user.id)
        db.add(settings)
    
    if request.theme is not None:
        settings.theme = request.theme
    if request.language is not None:
        settings.language = request.language
    if request.email_notifications is not None:
        settings.email_notifications = request.email_notifications
    if request.security_alerts is not None:
        settings.security_alerts = request.security_alerts
    if request.ai_model is not None:
        settings.ai_model = request.ai_model
    if request.max_results is not None:
        settings.max_results = request.max_results
    if request.auto_archive is not None:
        settings.auto_archive = request.auto_archive
    
    db.commit()
    db.refresh(settings)
    
    audit_logger.info(f"SETTINGS_UPDATED | user_id={current_user.id}")
    
    return {
        "status": "success",
        "message": "Settings updated successfully",
        "data": {
            "id": settings.id,
            "theme": settings.theme,
            "language": settings.language,
            "email_notifications": settings.email_notifications,
            "security_alerts": settings.security_alerts,
            "ai_model": settings.ai_model,
            "max_results": settings.max_results,
            "auto_archive": settings.auto_archive,
            "created_at": settings.created_at.isoformat() if settings.created_at else "",
            "updated_at": settings.updated_at.isoformat() if settings.updated_at else ""
        }
    }


# ==================== ARCHIVE ENDPOINTS ====================

@app.get("/api/archive", response_model=ArchivedDocumentListResponse)
async def list_archived_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get archived documents"""
    
    archives = db.query(ArchivedDocument).filter(
        ArchivedDocument.user_id == current_user.id
    ).order_by(ArchivedDocument.archived_at.desc()).all()
    
    return {
        "status": "success",
        "data": [
            {
                "id": a.id,
                "filename": a.filename,
                "file_type": a.file_type,
                "file_size_mb": a.file_size_mb,
                "encryption_level": a.encryption_level,
                "archive_id": a.archive_id,
                "status": a.status,
                "last_accessed": a.last_accessed.isoformat() if a.last_accessed else None,
                "archived_at": a.archived_at.isoformat() if a.archived_at else ""
            }
            for a in archives
        ],
        "total": len(archives)
    }


@app.post("/api/archive", response_model=ArchiveResponse)
async def archive_document(
    request: ArchiveDocumentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Archive a document"""
    
    document = db.query(Document).filter(
        Document.id == request.document_id,
        Document.user_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    archive_id = f"N_ARCH_{str(uuid.uuid4())[:4].upper()}"
    
    archive = ArchivedDocument(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        original_document_id=document.id,
        filename=document.filename,
        file_type=document.file_type,
        file_size_mb=0.5,
        encryption_level="Quantum-7",
        archive_id=archive_id,
        status="Dormant"
    )
    
    db.add(archive)
    db.delete(document)
    db.commit()
    
    audit_logger.info(f"DOCUMENT_ARCHIVED | archive_id={archive_id} | user_id={current_user.id}")
    
    return {
        "status": "success",
        "message": f"Document archived successfully. Archive ID: {archive_id}"
    }


@app.post("/api/archive/{archive_id}/restore", response_model=ArchiveResponse)
async def restore_archived_document(
    archive_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Restore an archived document"""
    
    archive = db.query(ArchivedDocument).filter(
        ArchivedDocument.id == archive_id,
        ArchivedDocument.user_id == current_user.id
    ).first()
    
    if not archive:
        raise HTTPException(status_code=404, detail="Archived document not found")
    
    archive.status = "Restored"
    archive.last_accessed = datetime.utcnow()
    db.commit()
    
    audit_logger.info(f"DOCUMENT_RESTORED | archive_id={archive_id} | user_id={current_user.id}")
    
    return {
        "status": "success",
        "message": "Document restored successfully"
    }


@app.delete("/api/archive/{archive_id}", response_model=ArchiveResponse)
async def delete_archived_document(
    archive_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Permanently delete an archived document"""
    
    archive = db.query(ArchivedDocument).filter(
        ArchivedDocument.id == archive_id,
        ArchivedDocument.user_id == current_user.id
    ).first()
    
    if not archive:
        raise HTTPException(status_code=404, detail="Archived document not found")
    
    archive.status = "Purged"
    db.delete(archive)
    db.commit()
    
    audit_logger.info(f"ARCHIVE_PURGED | archive_id={archive_id} | user_id={current_user.id}")
    
    return {
        "status": "success",
        "message": "Archived document permanently deleted"
    }


# ==================== SUPPORT/FAQ ENDPOINTS ====================

@app.get("/api/support/faqs", response_model=FAQListResponse)
async def list_faqs(
    db: Session = Depends(get_db)
):
    """Get all FAQs grouped by category"""
    
    faqs = db.query(FAQ).filter(FAQ.is_active == True).order_by(FAQ.category, FAQ.order).all()
    
    from collections import defaultdict
    categories = defaultdict(list)
    
    for faq in faqs:
        categories[faq.category].append({
            "id": faq.id,
            "category": faq.category,
            "question": faq.question,
            "answer": faq.answer,
            "order": faq.order,
            "is_active": faq.is_active
        })
    
    return {
        "status": "success",
        "data": [
            {"category": cat, "faqs": faq_list}
            for cat, faq_list in categories.items()
        ],
        "total": len(faqs)
    }


# ==================== TERMINAL ENDPOINTS ====================

@app.get("/api/terminal/history", response_model=TerminalHistoryResponse)
async def get_terminal_history(
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get terminal command history"""
    
    logs = db.query(TerminalLog).filter(
        TerminalLog.user_id == current_user.id
    ).order_by(TerminalLog.created_at.desc()).limit(limit).all()
    
    return {
        "status": "success",
        "data": [
            {
                "id": log.id,
                "command": log.command,
                "output": log.output,
                "output_type": log.output_type,
                "created_at": log.created_at.isoformat() if log.created_at else ""
            }
            for log in logs
        ],
        "total": len(logs)
    }


@app.post("/api/terminal/execute", response_model=TerminalExecuteResponse)
async def execute_terminal_command(
    request: TerminalCommandRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Execute a terminal command"""
    
    command = request.command.strip().lower()
    output = ""
    output_type = "system"
    
    if command == "help":
        output = "Available commands: help, status, analytics, documents, tickets, clear, version"
        output_type = "system"
    elif command == "status":
        analytics = db.query(Analytics).filter(Analytics.user_id == current_user.id).first()
        docs_count = db.query(Document).filter(Document.user_id == current_user.id).count()
        output = f"System Status: Operational | Documents: {docs_count} | Queries: {analytics.total_queries if analytics else 0}"
        output_type = "success"
    elif command == "analytics":
        analytics = db.query(Analytics).filter(Analytics.user_id == current_user.id).first()
        if analytics:
            output = f"Total Documents: {analytics.total_documents} | Total Queries: {analytics.total_queries} | Tokens Used: {analytics.total_tokens_used}"
        else:
            output = "No analytics data available"
        output_type = "output"
    elif command == "documents":
        docs = db.query(Document).filter(Document.user_id == current_user.id).limit(5).all()
        if docs:
            output = "Recent Documents:\n" + "\n".join([f"  - {d.filename} ({d.file_type})" for d in docs])
        else:
            output = "No documents found"
        output_type = "output"
    elif command == "tickets":
        tickets = db.query(Ticket).filter(Ticket.user_id == current_user.id).limit(5).all()
        if tickets:
            output = "Your Tickets:\n" + "\n".join([f"  - [{t.status}] {t.title}" for t in tickets])
        else:
            output = "No tickets found"
        output_type = "output"
    elif command == "version":
        output = "RegiNova Sovereign Core v4.2.0"
        output_type = "success"
    elif command == "clear":
        db.query(TerminalLog).filter(TerminalLog.user_id == current_user.id).delete()
        db.commit()
        output = "Terminal history cleared"
        output_type = "system"
    elif command.startswith("run "):
        output = f"Command '{command}' not recognized in current security context."
        output_type = "warning"
    else:
        output = f"Command '{command}' not recognized. Type 'help' for available commands."
        output_type = "error"
    
    log_id = str(uuid.uuid4())
    terminal_log = TerminalLog(
        id=log_id,
        user_id=current_user.id,
        command=request.command,
        output=output,
        output_type=output_type
    )
    db.add(terminal_log)
    db.commit()
    
    return {
        "status": "success",
        "output": output,
        "output_type": output_type
    }


# ==================== ENTITY MAP ENDPOINTS ====================

@app.get("/api/entities", response_model=EntityMapResponse)
async def get_entity_nodes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get entity map nodes"""
    
    nodes = db.query(EntityNode).filter(
        EntityNode.user_id == current_user.id
    ).all()
    
    if not nodes:
        nodes = [
            EntityNode(
                id=str(uuid.uuid4()),
                user_id=current_user.id,
                name="Kernel_Root_01",
                node_type="root",
                x_position=40.0,
                y_position=30.0,
                is_active=True
            ),
            EntityNode(
                id=str(uuid.uuid4()),
                user_id=current_user.id,
                name="Active_Node_Nexus",
                node_type="nexus",
                x_position=55.0,
                y_position=50.0,
                is_active=True
            ),
            EntityNode(
                id=str(uuid.uuid4()),
                user_id=current_user.id,
                name="Static_Storage_A",
                node_type="storage",
                x_position=70.0,
                y_position=25.0,
                is_active=False
            )
        ]
        for node in nodes:
            db.add(node)
        db.commit()
        nodes = db.query(EntityNode).filter(EntityNode.user_id == current_user.id).all()
    
    return {
        "status": "success",
        "data": [
            {
                "id": n.id,
                "name": n.name,
                "node_type": n.node_type,
                "x_position": n.x_position,
                "y_position": n.y_position,
                "is_active": n.is_active,
                "node_metadata": n.node_metadata,
                "created_at": n.created_at.isoformat() if n.created_at else ""
            }
            for n in nodes
        ],
        "total": len(nodes)
    }


@app.post("/api/entities", response_model=EntityMapResponse)
async def create_entity_node(
    request: EntityNodeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new entity node"""
    
    node = EntityNode(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        name=request.name,
        node_type=request.node_type,
        x_position=request.x_position,
        y_position=request.y_position,
        node_metadata=request.node_metadata,
        is_active=True
    )
    
    db.add(node)
    db.commit()
    db.refresh(node)
    
    return await get_entity_nodes(current_user, db)


# ==================== ADMIN ENDPOINTS ====================

@app.get("/api/admin/settings", response_model=AdminSettingsResponse)
async def get_admin_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get admin-level settings (same as user settings for now)"""
    
    return await get_user_settings(current_user, db)


@app.put("/api/admin/settings", response_model=AdminSettingsResponse)
async def update_admin_settings(
    request: UserSettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update admin-level settings"""
    
    return await update_user_settings(request, current_user, db)


@app.get("/api/admin/stats", response_model=SystemStatsResponse)
async def get_system_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get system statistics"""
    
    total_docs = db.query(Document).filter(Document.user_id == current_user.id).count()
    total_archives = db.query(ArchivedDocument).filter(ArchivedDocument.user_id == current_user.id).count()
    total_tickets = db.query(Ticket).filter(Ticket.user_id == current_user.id).count()
    analytics = db.query(Analytics).filter(Analytics.user_id == current_user.id).first()
    
    return {
        "status": "success",
        "data": {
            "total_documents": total_docs,
            "total_archived": total_archives,
            "total_tickets": total_tickets,
            "total_queries": analytics.total_queries if analytics else 0,
            "system_load": "Normal",
            "security_status": "Secure"
        }
    }
