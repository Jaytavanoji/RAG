"""
SQLAlchemy ORM models for RegiNova
"""

from sqlalchemy import Column, String, Integer, Text, DateTime, Float, Boolean, ForeignKey, Index
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class User(Base):
    """User account model"""
    __tablename__ = "users"
    
    id = Column(String(100), primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    documents = relationship("Document", back_populates="user", cascade="all, delete-orphan")
    search_logs = relationship("SearchLog", back_populates="user", cascade="all, delete-orphan")
    tickets = relationship("Ticket", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    settings = relationship("UserSettings", back_populates="user", cascade="all, delete-orphan", uselist=False)
    archived_documents = relationship("ArchivedDocument", back_populates="user", cascade="all, delete-orphan")
    terminal_logs = relationship("TerminalLog", back_populates="user", cascade="all, delete-orphan")
    entity_nodes = relationship("EntityNode", back_populates="user", cascade="all, delete-orphan")
    
    __table_args__ = (Index("idx_user_email", "email"),)


class Document(Base):
    """Uploaded document model"""
    __tablename__ = "documents"
    
    id = Column(String(100), primary_key=True, index=True)
    user_id = Column(String(100), ForeignKey("users.id"), nullable=False, index=True)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False)  # pdf, image, text
    original_text = Column(Text, nullable=False)
    chunk_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="documents")
    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")
    
    __table_args__ = (Index("idx_document_user", "user_id"),)


class DocumentChunk(Base):
    """Text chunks from documents for vector search"""
    __tablename__ = "document_chunks"
    
    id = Column(String(100), primary_key=True, index=True)
    document_id = Column(String(100), ForeignKey("documents.id"), nullable=False, index=True)
    chunk_index = Column(Integer, nullable=False)
    text = Column(Text, nullable=False)
    embedding = Column(Text, nullable=True)  # Stored as JSON string
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    document = relationship("Document", back_populates="chunks")
    
    __table_args__ = (Index("idx_chunk_document", "document_id"),)


class SearchLog(Base):
    """Search query and response history"""
    __tablename__ = "search_logs"
    
    id = Column(String(100), primary_key=True, index=True)
    user_id = Column(String(100), ForeignKey("users.id"), nullable=False, index=True)
    query = Column(String, nullable=False)
    feature_type = Column(String, nullable=False)  # qa, summarize, key_points, compliance
    response = Column(Text, nullable=False)
    sources = Column(Text, nullable=True)  # JSON string of source chunks
    confidence_score = Column(Float, nullable=True)
    processing_time_ms = Column(Float, nullable=True)
    tokens_used = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    user = relationship("User", back_populates="search_logs")
    # Analytics model follows
    __table_args__ = (Index("idx_search_user", "user_id"), Index("idx_search_created", "created_at"))


class Analytics(Base):
    """User analytics aggregation"""
    __tablename__ = "analytics"
    
    id = Column(String(100), primary_key=True, index=True)
    user_id = Column(String(100), ForeignKey("users.id"), nullable=False, index=True)
    total_documents = Column(Integer, default=0)
    total_queries = Column(Integer, default=0)
    total_tokens_used = Column(Integer, default=0)
    average_processing_time_ms = Column(Float, default=0)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (Index("idx_analytics_user", "user_id"),)


class Ticket(Base):
    """Support ticket model"""
    __tablename__ = "tickets"
    
    id = Column(String(100), primary_key=True, index=True)
    user_id = Column(String(100), ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    priority = Column(String, default="Medium")
    description = Column(Text, nullable=False)
    status = Column(String, default="Open")
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="tickets")
    replies = relationship("TicketReply", back_populates="ticket", cascade="all, delete-orphan")
    
    __table_args__ = (Index("idx_ticket_user", "user_id"), Index("idx_ticket_status", "status"))


class TicketReply(Base):
    """Ticket reply/conversation"""
    __tablename__ = "ticket_replies"
    
    id = Column(String(100), primary_key=True, index=True)
    ticket_id = Column(String(100), ForeignKey("tickets.id"), nullable=False, index=True)
    user_id = Column(String(100), ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    ticket = relationship("Ticket", back_populates="replies")
    
    __table_args__ = (Index("idx_reply_ticket", "ticket_id"),)


class Notification(Base):
    """User notifications"""
    __tablename__ = "notifications"
    
    user = relationship("User", back_populates="notifications")
    
    id = Column(String(100), primary_key=True, index=True)
    user_id = Column(String(100), ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    notification_type = Column(String, default="System")  # System, Analysis, Maintenance, Support
    icon = Column(String, default="info")
    is_read = Column(Boolean, default=False)
    priority = Column(String, default="Normal")  # Low, Normal, High
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    __table_args__ = (Index("idx_notification_user", "user_id"), Index("idx_notification_read", "is_read"))


class UserSettings(Base):
    """User settings/preferences"""
    __tablename__ = "user_settings"
    
    user = relationship("User", back_populates="settings")
    
    id = Column(String(100), primary_key=True, index=True)
    user_id = Column(String(100), ForeignKey("users.id"), nullable=False, index=True, unique=True)
    theme = Column(String, default="void")  # void, dynamic
    language = Column(String, default="en")
    email_notifications = Column(Boolean, default=True)
    security_alerts = Column(Boolean, default=True)
    ai_model = Column(String, default="llama-3-70b-8192")
    max_results = Column(Integer, default=5)
    auto_archive = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (Index("idx_settings_user", "user_id"),)


class ArchivedDocument(Base):
    """Archived documents"""
    __tablename__ = "archived_documents"
    
    user = relationship("User", back_populates="archived_documents")
    
    id = Column(String(100), primary_key=True, index=True)
    user_id = Column(String(100), ForeignKey("users.id"), nullable=False, index=True)
    original_document_id = Column(String(100), nullable=True)
    filename = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    file_size_mb = Column(Float, default=0.0)
    encryption_level = Column(String, default="Quantum-7")
    archive_id = Column(String, nullable=True)
    status = Column(String, default="Dormant")  # Dormant, Restored, Purged
    last_accessed = Column(DateTime, nullable=True)
    archived_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    __table_args__ = (Index("idx_archived_user", "user_id"), Index("idx_archived_status", "status"))


class FAQ(Base):
    """Frequently Asked Questions for support"""
    __tablename__ = "faqs"
    
    id = Column(String(100), primary_key=True, index=True)
    category = Column(String, nullable=False, index=True)  # Getting Started, Account, Technical, Billing
    question = Column(String, nullable=False)
    answer = Column(Text, nullable=False)
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (Index("idx_faq_category", "category"),)


class TerminalLog(Base):
    """Terminal command history"""
    __tablename__ = "terminal_logs"
    
    user = relationship("User", back_populates="terminal_logs")
    
    id = Column(String(100), primary_key=True, index=True)
    user_id = Column(String(100), ForeignKey("users.id"), nullable=False, index=True)
    command = Column(String, nullable=False)
    output = Column(Text, nullable=True)
    output_type = Column(String, default="system")  # system, success, warning, error, output, progress
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    __table_args__ = (Index("idx_terminal_user", "user_id"),)


class EntityNode(Base):
    """Entity map nodes for visualization"""
    __tablename__ = "entity_nodes"
    
    user = relationship("User", back_populates="entity_nodes")
    
    id = Column(String(100), primary_key=True, index=True)
    user_id = Column(String(100), ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    node_type = Column(String, default="storage")  # root, nexus, storage, processor
    x_position = Column(Float, default=0.0)
    y_position = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
    node_metadata = Column(Text, nullable=True)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (Index("idx_entity_user", "user_id"),)
