"""
Vector store using FAISS for semantic search
"""

import os
import json
import numpy as np
from pathlib import Path
from typing import List, Tuple, Dict
import faiss
from app.config import settings


class FAISSVectorStore:
    """FAISS-based vector store for similarity search"""
    
    def __init__(self, user_id: str, dimension: int = 384):
        self.user_id = user_id
        self.dimension = dimension
        self.index_path = Path(settings.FAISS_INDEX_PATH) / user_id
        self.index_path.mkdir(parents=True, exist_ok=True)
        
        self.index_file = self.index_path / "index.faiss"
        self.metadata_file = self.index_path / "metadata.json"
        
        # Load or create index
        if self.index_file.exists():
            self.index = faiss.read_index(str(self.index_file))
            with open(self.metadata_file, 'r') as f:
                self.metadata = json.load(f)
        else:
            self.index = faiss.IndexFlatL2(dimension)
            self.metadata = {"chunks": []}
    
    def add_vectors(self, vectors: List[List[float]], chunk_info: List[Dict]) -> None:
        """
        Add vectors to index
        
        Args:
            vectors: List of embedding vectors
            chunk_info: List of chunk metadata dicts
        """
        if not vectors:
            return
        
        vectors_array = np.array(vectors).astype('float32')
        self.index.add(vectors_array)
        
        # Store metadata
        for info in chunk_info:
            self.metadata["chunks"].append(info)
        
        self.save()
    
    def search(self, query_vector: List[float], k: int = 5) -> List[Dict]:
        """
        Search for similar vectors
        
        Returns:
            List of k nearest chunks with metadata
        """
        if self.index.ntotal == 0:
            return []
        
        query_array = np.array([query_vector]).astype('float32')
        distances, indices = self.index.search(query_array, min(k, self.index.ntotal))
        
        results = []
        for idx in indices[0]:
            if idx >= 0 and idx < len(self.metadata["chunks"]):
                chunk = self.metadata["chunks"][int(idx)]
                distance = float(distances[0][list(indices[0]).index(idx)])
                # Convert L2 distance to similarity score (0-1)
                similarity = 1 / (1 + distance)
                chunk["similarity_score"] = similarity
                results.append(chunk)
        
        return results
    
    def save(self) -> None:
        """Save index and metadata to disk"""
        faiss.write_index(self.index, str(self.index_file))
        with open(self.metadata_file, 'w') as f:
            json.dump(self.metadata, f, indent=2)
    
    def clear(self) -> None:
        """Clear the index"""
        self.index = faiss.IndexFlatL2(self.dimension)
        self.metadata = {"chunks": []}
        self.save()


# Global model cache
_embedding_model = None

def get_embedding_model():
    """Get or create cached sentence transformer model"""
    global _embedding_model
    if _embedding_model is None:
        from sentence_transformers import SentenceTransformer
        _embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
    return _embedding_model

def generate_embeddings(text: str) -> List[float]:
    """
    Generate embedding for text using Sentence Transformers
    Uses a lightweight model for semantic search
    """
    model = get_embedding_model()
    embedding = model.encode(text).tolist()
    return embedding


def get_vector_store(user_id: str) -> FAISSVectorStore:
    """Get or create vector store for user"""
    return FAISSVectorStore(user_id)


def delete_vector_store(user_id: str) -> None:
    """Delete vector store for user"""
    index_path = Path(settings.FAISS_INDEX_PATH) / user_id
    if index_path.exists():
        import shutil
        shutil.rmtree(index_path)
