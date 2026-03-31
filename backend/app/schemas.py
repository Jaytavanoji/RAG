"""
Pydantic request and response schemas for API validation
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any, Union
from datetime import datetime


# ==================== AUTH SCHEMAS ====================

class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    status: str
    message: str
    data: Optional[dict] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


class PasswordResetRequest(BaseModel):
    email: EmailStr


class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str


class PasswordResetOTPRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str = Field(..., min_length=6)


# ==================== DOCUMENT SCHEMAS ====================

class DocumentUploadResponse(BaseModel):
    status: str
    message: str
    data: dict


class DocumentResponse(BaseModel):
    id: str
    filename: str
    file_type: str
    chunk_count: int
    created_at: datetime
    summary: Optional[str] = None
    
    class Config:
        from_attributes = True


class DocumentListResponse(BaseModel):
    status: str
    data: List[DocumentResponse]
    total: int


class DocumentDeleteResponse(BaseModel):
    status: str
    message: str


# ==================== SEARCH SCHEMAS ====================

class SearchRequest(BaseModel):
    query: str = Field(..., min_length=3, max_length=1000)


class SearchSource(BaseModel):
    chunk_id: str
    document_id: str
    filename: str
    text: str
    chunk_index: int


class SearchResponse(BaseModel):
    status: str
    data: Union[dict, list, Any]
    message: Optional[str] = None


class QAResponse(BaseModel):
    query: str
    answer: str
    sources: List[SearchSource]
    confidence_score: float
    processing_time_ms: float


class SummarizeResponse(BaseModel):
    summary: str
    sources: List[SearchSource]
    processing_time_ms: float


class KeyPointsResponse(BaseModel):
    key_points: List[str]
    sources: List[SearchSource]
    processing_time_ms: float


class ComplianceCheckResponse(BaseModel):
    status_str: str  # compliant, non_compliant, partial, inconclusive
    findings: List[str]
    sources: List[SearchSource]
    processing_time_ms: float


# ==================== ANALYTICS SCHEMAS ====================

class SearchLogResponse(BaseModel):
    id: str
    query: str
    feature_type: str
    response: str
    confidence_score: Optional[float]
    processing_time_ms: Optional[float]
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserAnalyticsResponse(BaseModel):
    total_documents: int
    total_queries: int
    total_tokens_used: int
    average_processing_time_ms: float
    search_history: List[SearchLogResponse]


# ==================== ERROR SCHEMAS ====================

class ErrorResponse(BaseModel):
    status: str = "error"
    message: str
    detail: Optional[str] = None


# ==================== TICKET SCHEMAS ====================

class TicketCreate(BaseModel):
    title: str
    category: str
    priority: str = "Medium"
    description: str


class TicketReplyCreate(BaseModel):
    message: str


class TicketResponse(BaseModel):
    id: str
    title: str
    category: str
    priority: str
    description: str
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class TicketListResponse(BaseModel):
    status: str
    data: List[TicketResponse]
    total: int


class TicketDetailResponse(BaseModel):
    id: str
    title: str
    category: str
    priority: str
    description: str
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    replies: List[dict] = []
    
    class Config:
        from_attributes = True


# ==================== NOTIFICATION SCHEMAS ====================

class NotificationResponse(BaseModel):
    id: str
    title: str
    description: str
    notification_type: str
    icon: str
    is_read: bool
    priority: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class NotificationListResponse(BaseModel):
    status: str
    data: List[NotificationResponse]
    total: int
    unread_count: int


class NotificationMarkRead(BaseModel):
    notification_ids: List[str]


# ==================== USER SETTINGS SCHEMAS ====================

class UserSettingsResponse(BaseModel):
    id: str
    theme: str
    language: str
    email_notifications: bool
    security_alerts: bool
    ai_model: str
    max_results: int
    auto_archive: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class UserSettingsUpdate(BaseModel):
    theme: Optional[str] = None
    language: Optional[str] = None
    email_notifications: Optional[bool] = None
    security_alerts: Optional[bool] = None
    ai_model: Optional[str] = None
    max_results: Optional[int] = None
    auto_archive: Optional[bool] = None


class SettingsResponse(BaseModel):
    status: str
    data: Optional[UserSettingsResponse] = None
    message: Optional[str] = None


# ==================== ARCHIVED DOCUMENT SCHEMAS ====================

class ArchivedDocumentResponse(BaseModel):
    id: str
    filename: str
    file_type: str
    file_size_mb: float
    encryption_level: str
    archive_id: Optional[str]
    status: str
    last_accessed: Optional[datetime] = None
    archived_at: datetime
    
    class Config:
        from_attributes = True


class ArchivedDocumentListResponse(BaseModel):
    status: str
    data: List[ArchivedDocumentResponse]
    total: int


class ArchiveDocumentRequest(BaseModel):
    document_id: str


class ArchiveResponse(BaseModel):
    status: str
    message: str


# ==================== FAQ SCHEMAS ====================

class FAQResponse(BaseModel):
    id: str
    category: str
    question: str
    answer: str
    order: int
    is_active: bool
    
    class Config:
        from_attributes = True


class FAQCategoryResponse(BaseModel):
    category: str
    faqs: List[FAQResponse]


class FAQListResponse(BaseModel):
    status: str
    data: List[FAQCategoryResponse]
    total: int


# ==================== TERMINAL SCHEMAS ====================

class TerminalCommandRequest(BaseModel):
    command: str


class TerminalLogResponse(BaseModel):
    id: str
    command: str
    output: Optional[str]
    output_type: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class TerminalHistoryResponse(BaseModel):
    status: str
    data: List[TerminalLogResponse]
    total: int


class TerminalExecuteResponse(BaseModel):
    status: str
    output: str
    output_type: str


# ==================== ENTITY MAP SCHEMAS ====================

class EntityNodeResponse(BaseModel):
    id: str
    name: str
    node_type: str
    x_position: float
    y_position: float
    is_active: bool
    node_metadata: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class EntityNodeCreate(BaseModel):
    name: str
    node_type: str = "storage"
    x_position: float = 0.0
    y_position: float = 0.0
    node_metadata: Optional[str] = None


class EntityMapResponse(BaseModel):
    status: str
    data: List[EntityNodeResponse]
    total: int


# ==================== ADMIN SCHEMAS ====================

class AdminSettingsResponse(BaseModel):
    status: str
    data: dict
    message: Optional[str] = None


class SystemStatsResponse(BaseModel):
    status: str
    data: dict
