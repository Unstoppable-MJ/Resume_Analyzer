import re
from core.common import BaseService

class ATSCheckerService(BaseService):
    """Service to check resume for ATS friendliness."""

    def check_ats_compatibility(self, text):
        """Run multiple checks for ATS compliance."""
        checks = {
            "has_contact_info": self._check_contact_info(text),
            "has_standard_sections": self._check_headings(text),
            "no_complex_graphics": True, # Placeholder for structural check
            "formatting_score": 0
        }
        
        # Calculate a formatting score based on checks
        score = sum([1 for k, v in checks.items() if v is True])
        checks["formatting_score"] = round((score / 3) * 100, 2)
        
        return checks

    def _check_contact_info(self, text):
        """Check for email and phone number."""
        email_pattern = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
        phone_pattern = r'\+?\d[\d -]{8,12}\d'
        return bool(re.search(email_pattern, text)) and bool(re.search(phone_pattern, text))

    def _check_headings(self, text):
        """Check for standard headings like 'Experience', 'Education', 'Skills'."""
        headings = ['experience', 'education', 'skills', 'projects', 'summary']
        count = 0
        for h in headings:
            if h in text.lower():
                count += 1
        return count >= 3
