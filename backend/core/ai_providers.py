import time
import abc
import logging
import hashlib
import requests
import google.generativeai as genai
from django.conf import settings

logger = logging.getLogger('django')

class BaseAIProvider(abc.ABC):
    """Abstract base class for all AI providers."""
    
    # Class-level state to share cooldown across all instances of the same provider
    _last_429_time = 0
    _cooldown_period = 60
    _consecutive_429s = 0

    def __init__(self, name):
        self.name = name

    @abc.abstractmethod
    def generate_response(self, prompt):
        """Must be implemented by subclasses. Returns (text, error_type)."""
        pass

    def _format_response(self, text):
        """Standardizes the response format."""
        return {
            "response": text,
            "provider_used": self.name
        }

    @property
    def in_cooldown(self):
        """Check if provider is in cooldown."""
        return (time.time() - self.__class__._last_429_time) < self.__class__._cooldown_period

    def _trigger_cooldown(self, error_str):
        """Activate cooldown based on error."""
        self.__class__._last_429_time = time.time()
        self.__class__._consecutive_429s += 1
        
        if "limit: 0" in error_str.lower() or "quota" in error_str.lower():
            self.__class__._cooldown_period = 300 # 5 mins for major quota issues
            logger.error(f"{self.name} Provider: QUOTA EXHAUSTED. 5 min cooldown.")
        else:
            self.__class__._cooldown_period = min(300, 60 * self.__class__._consecutive_429s)
            logger.warning(f"{self.name} Provider: Rate limit hit. Cooldown: {self.__class__._cooldown_period}s")

    def _reset_cooldown(self):
        """Reset cooldown stats."""
        self.__class__._last_429_time = 0
        self.__class__._consecutive_429s = 0
        self.__class__._cooldown_period = 60

class GeminiProvider(BaseAIProvider):
    """Gemini-based AI provider implementation."""
    
    _last_429_time = 0
    _cooldown_period = 60
    _consecutive_429s = 0

    def __init__(self):
        super().__init__("Gemini")
        self.api_key = getattr(settings, 'GEMINI_API_KEY', None)
        self.model_name = getattr(settings, 'GEMINI_MODEL_NAME', 'gemini-2.0-flash')
        
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel(self.model_name)
        else:
            self.model = None

    def generate_response(self, prompt):
        if not self.model or self.in_cooldown:
            return None, "unavailable"

        try:
            response = self.model.generate_content(prompt)
            self._reset_cooldown()
            return self._format_response(response.text), None
        except Exception as e:
            error_str = str(e)
            if "429" in error_str or "quota" in error_str.lower():
                self._trigger_cooldown(error_str)
                return None, "rate_limit"
            logger.error(f"Gemini API Error: {error_str}")
            return None, "api_error"

class GroqProvider(BaseAIProvider):
    """Groq-based AI provider implementation via REST API."""
    
    _last_429_time = 0
    _cooldown_period = 60
    _consecutive_429s = 0

    def __init__(self):
        super().__init__("Groq")
        self.api_key = getattr(settings, 'GROK_API_KEY', None)
        self.model_name = getattr(settings, 'GROQ_MODEL_NAME', 'llama-3.3-70b-versatile')
        self.url = "https://api.groq.com/openai/v1/chat/completions"

    def generate_response(self, prompt):
        if not self.api_key or self.in_cooldown:
            return None, "unavailable"

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        data = {
            "model": self.model_name,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7
        }

        try:
            response = requests.post(self.url, headers=headers, json=data, timeout=15)
            if response.status_code == 429:
                self._trigger_cooldown(response.text)
                return None, "rate_limit"
            
            if response.status_code != 200:
                logger.error(f"Groq API Error {response.status_code}: {response.text}")
                return None, "api_error"

            result = response.json()
            content = result['choices'][0]['message']['content']
            self._reset_cooldown()
            return self._format_response(content), None
        except Exception as e:
            logger.error(f"Groq Request Failed: {str(e)}")
            return None, "api_error"

class HuggingFaceProvider(BaseAIProvider):
    """HuggingFace-based AI provider implementation (Inference API)."""
    
    _last_429_time = 0
    _cooldown_period = 60
    _consecutive_429s = 0

    def __init__(self):
        super().__init__("HuggingFace")
        self.api_key = getattr(settings, 'HF_API_KEY', None)
        self.model_name = getattr(settings, 'HF_MODEL_NAME', "mistralai/Mistral-7B-Instruct-v0.3")
        self.url = f"https://api-inference.huggingface.co/models/{self.model_name}"

    def generate_response(self, prompt):
        if not self.api_key or self.api_key == "hf_..." or self.in_cooldown:
            return None, "unavailable"

        headers = {"Authorization": f"Bearer {self.api_key}"}
        data = {"inputs": prompt, "parameters": {"max_new_tokens": 512, "return_full_text": False}}

        try:
            response = requests.post(self.url, headers=headers, json=data, timeout=20)
            if response.status_code == 429:
                self._trigger_cooldown(response.text)
                return None, "rate_limit"

            if response.status_code != 200:
                logger.error(f"HuggingFace API Error {response.status_code}: {response.text}")
                return None, "api_error"

            result = response.json()
            
            # Extract content robustly
            if isinstance(result, list) and len(result) > 0:
                content = result[0].get('generated_text', '')
            elif isinstance(result, dict) and 'generated_text' in result:
                content = result['generated_text']
            else:
                content = str(result)
                
            self._reset_cooldown()
            return self._format_response(content), None
        except Exception as e:
            logger.error(f"HuggingFace Request Failed: {str(e)}")
            return None, "api_error"

