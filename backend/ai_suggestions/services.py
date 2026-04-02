from core.common import BaseService
from core.ai_service import AIService
import warnings

# Suppress warnings
warnings.simplefilter('ignore')

class AISuggestionsService(BaseService):
    """Service to provide AI-based resume improvement suggestions using multi-provider switching."""

    def __init__(self):
        super().__init__()
        self.ai = AIService()

    def get_suggestions(self, resume_text, user_id=None):
        """Invoke LLM to get suggestions via AIService failover system."""
        prompt = f"You are an expert career coach. Analyze the following resume and provide 5 brief improvement tips.\n\nResume Text:\n{resume_text}"
        
        fallback = self._get_fallback_suggestions()
        
        # Use AIService for resilient generation
        ai_data = self.ai.generate_response(prompt, user_id=user_id)
        response_text = ai_data.get('response') if ai_data else None
        
        if not response_text or ai_data.get('status') in ['rate_limited', 'all_failed']:
            return fallback

        try:
            suggestions = response_text.split('\n')
            # Clean up markdown formatting (like *, -, 1., etc)
            import re
            cleaned_suggestions = []
            for s in suggestions:
                s = re.sub(r'^(\*|-|\d+\.)\s*', '', s.strip()).strip()
                if s and len(s) > 10:
                    cleaned_suggestions.append(s)
                    
            if not cleaned_suggestions:
                return fallback
                
            return cleaned_suggestions[:5]
        except Exception as e:
            self.logger.error(f"Gemini API Processing Error: {str(e)}")
            return fallback

    def _get_fallback_suggestions(self):
        """High quality professional fallback suggestions."""
        return [
            "Quantify your impact: Use numbers (%, $, #) to demonstrate results instead of just tasks.",
            "Optimize for ATS: Ensure keywords from the job description are reflected in your experience section.",
            "Action-Oriented Verbs: Start bullet points with strong verbs like 'Spearheaded', 'Engineered', or 'Architected'.",
            "Functional Formatting: Check that your contact info, LinkedIn, and Github are clearly visible at the top.",
            "Concise Bullet Points: Aim for 3-5 high-impact bullets per role to maintain readability for recruiters."
        ]
