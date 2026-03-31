import os
from pdfminer.high_level import extract_text as extract_pdf_text
import docx
from core.common import BaseService, ResumeParsingError

class ResumeParserService(BaseService):
    """Service to extract text from various resume formats."""

    def extract_text(self, file_path):
        """Extracts text based on file extension."""
        ext = os.path.splitext(file_path)[1].lower()
        try:
            if ext == '.pdf':
                return self._extract_from_pdf(file_path)
            elif ext in ['.doc', '.docx']:
                return self._extract_from_docx(file_path)
            else:
                raise ResumeParsingError(f"Unsupported file format: {ext}")
        except Exception as e:
            self.handle_exception(e)

    def _extract_from_pdf(self, file_path):
        """Internal method to extract text from PDF."""
        try:
            text = extract_pdf_text(file_path)
            if not text.strip():
                raise ResumeParsingError("No text found in PDF")
            return text
        except Exception as e:
            raise ResumeParsingError(f"PDF Extraction Failed: {str(e)}")

    def _extract_from_docx(self, file_path):
        """Internal method to extract text from DOCX."""
        try:
            doc = docx.Document(file_path)
            text = "\n".join([para.text for para in doc.paragraphs])
            if not text.strip():
                raise ResumeParsingError("No text found in DOCX")
            return text
        except Exception as e:
            raise ResumeParsingError(f"DOCX Extraction Failed: {str(e)}")

import spacy
from collections import Counter

class ResumeValidatorService(BaseService):
    """Validates if extracted text is actually a resume."""
    
    def __init__(self):
        super().__init__()
        # Load small english model, ignore if not installed to avoid hard crashing
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            import subprocess
            import sys
            subprocess.run([sys.executable, "-m", "spacy", "download", "en_core_web_sm"])
            self.nlp = spacy.load("en_core_web_sm")
            
        self.required_keywords = [
            'education', 'experience', 'skills', 'projects', 'work history', 
            'employment', 'university', 'college', 'technical skills'
        ]

    def validate(self, text):
        """
        Validates the resume text. 
        Returns dict: {"is_valid_resume": bool, "confidence": float, "reason": str}
        """
        if not text or len(text.strip()) < 100:
            return {
                "is_valid_resume": False,
                "confidence": 0.0,
                "reason": "Document is empty or contains too little text. (Image-based PDF?)"
            }

        text_lower = text.lower()
        
        # 1. Keyword Check
        found_sections = sum(1 for kw in self.required_keywords if kw in text_lower)
        
        # 2. NLP Entity Check
        doc = self.nlp(text[:5000]) # Cap at 5000 chars for performance
        orgs = [ent.text for ent in doc.ents if ent.label_ == 'ORG']
        dates = [ent.text for ent in doc.ents if ent.label_ == 'DATE']
        
        confidence = 0.0
        
        # Score calculation
        if found_sections >= 2:
            confidence += 0.5
        elif found_sections == 1:
            confidence += 0.2
            
        if len(orgs) >= 2:
            confidence += 0.25
        if len(dates) >= 2:
            confidence += 0.25
            
        # Final Decision
        if confidence >= 0.5:
            return {
                "is_valid_resume": True,
                "confidence": round(confidence, 2),
                "reason": "Valid resume detected."
            }
        else:
            reasons = []
            if found_sections < 2:
                reasons.append("Missing standard sections (Experience, Education, Skills)")
            if len(orgs) < 2 or len(dates) < 2:
                reasons.append("Lacking professional context (Organizations, Dates)")
                
            return {
                "is_valid_resume": False,
                "confidence": round(confidence, 2),
                "reason": " and ".join(reasons) or "Not recognized as a resume format."
            }
