"""
Document processing utilities for PDF, images, and text files
"""

import os
import json
from pathlib import Path
from typing import List, Tuple
import pytesseract
from PIL import Image
import fitz  # PyMuPDF
from app.config import settings


def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from a PDF file using PyMuPDF"""
    try:
        text = ""
        pdf_document = fitz.open(file_path)
        
        for page_num in range(len(pdf_document)):
            page = pdf_document[page_num]
            text += page.get_text()
        
        pdf_document.close()
        return text.strip()
    except Exception as e:
        raise Exception(f"Failed to extract text from PDF: {str(e)}")


def extract_text_from_image(file_path: str) -> str:
    """Extract text from image using Tesseract OCR"""
    try:
        image = Image.open(file_path)
        text = pytesseract.image_to_string(image)
        return text.strip()
    except Exception as e:
        raise Exception(f"Failed to extract text from image: {str(e)}")


def extract_text_from_file(file_path: str, file_type: str) -> str:
    """
    Extract text from file based on type
    file_type: 'pdf', 'image', 'text'
    """
    if file_type == "pdf":
        return extract_text_from_pdf(file_path)
    elif file_type == "image":
        return extract_text_from_image(file_path)
    elif file_type == "text":
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read().strip()
    else:
        raise Exception(f"Unsupported file type: {file_type}")


def chunk_text(text: str, chunk_size: int = None, overlap: int = None) -> List[str]:
    """
    Split text into overlapping chunks
    
    Args:
        text: Text to chunk
        chunk_size: Size of each chunk in characters (default from settings)
        overlap: Number of overlapping characters (default from settings)
    
    Returns:
        List of text chunks
    """
    if chunk_size is None:
        chunk_size = settings.CHUNK_SIZE
    if overlap is None:
        overlap = settings.CHUNK_OVERLAP
    
    words = text.split()
    chunks = []
    current_chunk = []
    current_length = 0
    
    for word in words:
        word_length = len(word)
        
        # Start new chunk if adding word would exceed chunk_size
        if current_length + word_length > chunk_size and current_chunk:
            chunk_text = " ".join(current_chunk)
            chunks.append(chunk_text)
            
            # Keep last few words for overlap
            overlap_count = 0
            overlap_chunk = []
            for w in reversed(current_chunk):
                overlap_chunk.insert(0, w)
                overlap_count += len(w) + 1
                if overlap_count >= overlap:
                    break
            
            current_chunk = overlap_chunk
            current_length = overlap_count
        
        current_chunk.append(word)
        current_length += word_length + 1
    
    # Add remaining chunk
    if current_chunk:
        chunks.append(" ".join(current_chunk))
    
    return chunks


def save_upload_file(file_content: bytes, user_id: str, filename: str) -> str:
    """
    Save uploaded file to vault
    
    Returns: file_path
    """
    # Create user vault directory if it doesn't exist
    user_vault = Path(settings.VAULT_PATH) / user_id
    user_vault.mkdir(parents=True, exist_ok=True)
    
    file_path = user_vault / filename
    with open(file_path, 'wb') as f:
        f.write(file_content)
    
    return str(file_path)


def delete_file(file_path: str) -> None:
    """Delete a file from vault"""
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
    except Exception as e:
        raise Exception(f"Failed to delete file: {str(e)}")


def get_file_type(filename: str) -> str:
    """Determine file type from filename extension"""
    ext = filename.lower().split('.')[-1]
    
    if ext in ['pdf']:
        return 'pdf'
    elif ext in ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff']:
        return 'image'
    elif ext in ['txt', 'md']:
        return 'text'
    else:
        raise Exception(f"Unsupported file type: {ext}")


def validate_file(filename: str, file_size: int) -> Tuple[bool, str]:
    """
    Validate file before processing
    Returns (is_valid, error_message)
    """
    if file_size > settings.MAX_UPLOAD_SIZE:
        return False, f"File size exceeds maximum of {settings.MAX_UPLOAD_SIZE / 1024 / 1024}MB"
    
    try:
        file_type = get_file_type(filename)
    except Exception as e:
        return False, str(e)
    
    if not filename.strip():
        return False, "Filename cannot be empty"
    
    return True, ""
