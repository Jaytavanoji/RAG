"""
Groq API integration for AI features using LLaMA 3
"""

import requests
import json
import time
from typing import List, Dict, Tuple
from app.config import settings


class GroqService:
    """Service for interacting with Groq API"""
    
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.model = settings.GROQ_MODEL
        self.api_url = "https://api.groq.com/openai/v1/chat/completions"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    def call_api(self, messages: List[Dict], max_tokens: int = 1024) -> Tuple[str, int]:
        """
        Call Groq API with messages
        
        Returns:
            (response_text, tokens_used)
        """
        payload = {
            "model": self.model,
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": 0.7,
        }
        
        try:
            response = requests.post(
                self.api_url,
                headers=self.headers,
                json=payload,
                timeout=30
            )
            response.raise_for_status()
            
            data = response.json()
            message_content = data["choices"][0]["message"]["content"]
            tokens_used = data.get("usage", {}).get("total_tokens", 0)
            
            return message_content, tokens_used
        
        except requests.exceptions.RequestException as e:
            raise Exception(f"Groq API error: {str(e)}")
    
    def generate_answer(self, query: str, context: str) -> Tuple[str, int, float]:
        """
        Generate answer to query based on context
        
        Returns:
            (answer, tokens_used, confidence_score)
        """
        system_prompt = """You are an expert policy analyst assistant. 
Your task is to answer questions based on the provided policy documents.
Provide clear, accurate, and concise answers based only on the information provided.
If the answer is not found in the documents, clearly state that."""
        
        user_prompt = f"""Context from policy documents:
{context}

User Question: {query}

Please provide a comprehensive answer based on the context above."""
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        start_time = time.time()
        answer, tokens = self.call_api(messages)
        processing_time = (time.time() - start_time) * 1000
        
        # Calculate confidence based on context relevance and answer length
        confidence = min(1.0, 0.6 + (len(answer) / 500) * 0.4)
        
        return answer, tokens, confidence
    
    def summarize_document(self, text: str) -> Tuple[str, int]:
        """
        Generate summary of document
        
        Returns:
            (summary, tokens_used)
        """
        system_prompt = """You are a policy document summarizer.
Create a concise summary highlighting key points, important clauses, and main provisions.
Keep the summary to 200-300 words."""
        
        user_prompt = f"""Please summarize the following policy document:

{text}

Provide a clear, structured summary with main sections and key points."""
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        summary, tokens = self.call_api(messages, max_tokens=512)
        return summary, tokens
    
    def extract_key_points(self, text: str) -> Tuple[List[str], int]:
        """
        Extract key points from document
        
        Returns:
            (list of key points, tokens_used)
        """
        system_prompt = """You are a policy analyst. Extract the most important key points from documents.
Return the points as a JSON list of strings."""
        
        user_prompt = f"""Extract the 5-7 most important key points from this policy document:

{text}

Return as JSON array: ["point1", "point2", ...]"""
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        response, tokens = self.call_api(messages, max_tokens=512)
        
        # Parse JSON response
        try:
            # Find JSON array in response
            start = response.find('[')
            end = response.rfind(']') + 1
            if start >= 0 and end > start:
                json_str = response[start:end]
                key_points = json.loads(json_str)
                return key_points, tokens
        except (json.JSONDecodeError, ValueError):
            pass
        
        # Fallback: split by newlines
        key_points = [line.strip() for line in response.split('\n') if line.strip()]
        return key_points[:7], tokens
    
    def check_compliance(self, query: str, context: str) -> Tuple[str, List[str], int]:
        """
        Check compliance status based on query and context
        
        Returns:
            (status: 'compliant'/'non_compliant'/'partial'/'inconclusive', findings: list, tokens_used)
        """
        system_prompt = """You are a compliance expert analyzing policy documents.
Evaluate compliance status and provide findings.
Response format: 
First line: STATUS: [compliant/non_compliant/partial/inconclusive]
Following lines: FINDING: [specific findings]"""
        
        user_prompt = f"""Analyze compliance for the following:

Query/Requirement: {query}

Policy Context:
{context}

Provide compliance status and specific findings."""
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        response, tokens = self.call_api(messages)
        
        # Parse response
        lines = response.split('\n')
        status = "inconclusive"
        findings = []
        
        for line in lines:
            line = line.strip()
            if line.startswith("STATUS:"):
                status_str = line.replace("STATUS:", "").strip().lower()
                if status_str in ['compliant', 'non_compliant', 'partial', 'inconclusive']:
                    status = status_str
            elif line.startswith("FINDING:"):
                findings.append(line.replace("FINDING:", "").strip())
        
        return status, findings, tokens


def get_groq_service() -> GroqService:
    """Get Groq service instance"""
    return GroqService()
