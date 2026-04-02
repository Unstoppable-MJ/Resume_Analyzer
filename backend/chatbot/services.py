from core.common import BaseService
from core.ai_service import AIService

class ChatbotService(BaseService):
    """Service for Career Copilot Chatbot using multi-provider AI failover."""

    def __init__(self):
        super().__init__()
        self.ai = AIService()

    def get_response(self, user_query, resume_context="", user_id=None):
        """Generate response based on query and optional resume context via AIService."""
        prompt = f"You are a Career Copilot. Context: {resume_context}\n\nUser Question: {user_query}\n\nPlease provide a helpful and concise response. IMPORTANT FORMATTING RULES: ALWAYS structure your reply using paragraphs with clear line breaks. Use bullet points for lists. Bold the important words and key terms. Use relevant emojis naturally throughout the text for better readability and engagement."
        
        fallback = "Career Copilot is currently experiencing high demand. I'll be back shortly to help you with your career journey!"
        
        ai_data = self.ai.generate_response(prompt, user_id=user_id)
        return ai_data.get('response', fallback)
