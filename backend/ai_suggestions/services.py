import google.generativeai as genai
from django.conf import settings
from core.common import BaseService
import warnings

# Suppress warnings to prevent terminal spam/crashes
warnings.simplefilter('ignore')


class AISuggestionsService(BaseService):
    """Service to provide AI-based resume improvement suggestions using Gemini."""

    def __init__(self):
        super().__init__()
        self.api_key = getattr(settings, 'OPENAI_API_KEY', getattr(settings, 'GEMINI_API_KEY', None))
        if self.api_key and self.api_key != 'dummy_key':
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-2.5-flash')
        else:
            self.model = None

    def get_suggestions(self, resume_text):
        """Invoke LLM to get suggestions."""
        try:
            if not self.model:
                return ["Add more metrics to your experience", "Improve keyword density", "Include LinkedIn profile"]
            
            prompt = f"You are an expert career coach. Analyze the following resume and provide 5 brief improvement tips.\n\nResume Text:\n{resume_text}"
            response = self.model.generate_content(prompt)
            
            suggestions = response.text.split('\n')
            # Clean up markdown formatting (like *, -, 1., etc)
            import re
            cleaned_suggestions = []
            for s in suggestions:
                s = re.sub(r'^(\*|-|\d+\.)\s*', '', s.strip()).strip()
                if s and len(s) > 10:
                    cleaned_suggestions.append(s)
                    
            return cleaned_suggestions[:5]
        except Exception as e:
            self.logger.error(f"Gemini API Error: {str(e)}")
            return ["Add more metrics to your experience", "Improve keyword density", "Include LinkedIn profile"]
