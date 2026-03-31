import google.generativeai as genai
from django.conf import settings
from core.common import BaseService

class ChatbotService(BaseService):
    """Service for Career Copilot Chatbot using Gemini."""

    def __init__(self):
        super().__init__()
        self.api_key = getattr(settings, 'OPENAI_API_KEY', getattr(settings, 'GEMINI_API_KEY', None))
        if self.api_key and self.api_key != 'dummy_key':
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None

    def get_response(self, user_query, resume_context=""):
        """Generate response based on query and optional resume context."""
        try:
            if not self.model:
                return f"I'm here to help with your career! You asked: {user_query}"
            
            prompt = f"You are a Career Copilot. Context: {resume_context}\n\nUser Question: {user_query}\n\nPlease provide a helpful and concise response."
            response = self.model.generate_content(prompt)
            
            return response.text
        except Exception as e:
            self.handle_exception(e)
