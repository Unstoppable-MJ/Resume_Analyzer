import time
import google.generativeai as genai
from django.conf import settings
import logging
import hashlib

logger = logging.getLogger('django')

class GeminiProvider:
    """Centralized provider for Gemini API to handle rate limits and fallbacks."""
    
    _last_429_time = 0
    _last_api_key = None
    _cooldown_period = 60  # Initial seconds to wait after a 429 error
    _consecutive_429s = 0
    _cache = {}  # In-memory cache: {prompt_hash: response_text}
    
    def __init__(self):
        self.api_key = getattr(settings, 'GEMINI_API_KEY', getattr(settings, 'OPENAI_API_KEY', None))
        
        # Reset cooldown if API key has changed
        if GeminiProvider._last_api_key and GeminiProvider._last_api_key != self.api_key:
            logger.info("GeminiProvider: API Key change detected. Resetting cooldown and cache.")
            GeminiProvider.reset_cooldown()
            GeminiProvider._cache = {}
        
        GeminiProvider._last_api_key = self.api_key
        
        self.model_name = getattr(settings, 'GEMINI_MODEL_NAME', 'gemini-2.0-flash')
        self.mock_mode = getattr(settings, 'GEMINI_MOCK_MODE', False)
        
        if self.api_key and self.api_key != 'dummy_key' and not self.mock_mode:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel(self.model_name)
            logger.info(f"GeminiProvider: Initialized with model '{self.model_name}'")
        else:
            self.model = None
            if self.mock_mode:
                logger.info("GeminiProvider: Initialized in MOCK MODE.")
            else:
                logger.warning("GeminiProvider: No valid API key found in settings.")

    def generate_content(self, prompt, fallback_data=None, use_cache=True):
        """
        Safely generate content with 429 error handling and caching.
        """
        if not self.model or self.mock_mode:
            return fallback_data

        # 1. Caching Check
        prompt_hash = hashlib.md5(prompt.encode()).hexdigest()
        if use_cache and prompt_hash in GeminiProvider._cache:
            logger.info("GeminiProvider: Returning cached response.")
            return GeminiProvider._cache[prompt_hash]

        # 2. Cooldown Check
        current_time = time.time()
        time_since_429 = current_time - GeminiProvider._last_429_time
        if time_since_429 < GeminiProvider._cooldown_period:
            remaining = int(GeminiProvider._cooldown_period - time_since_429)
            logger.warning(f"GeminiProvider: In cooldown for another {remaining}s. Returning fallback.")
            return fallback_data

        try:
            response = self.model.generate_content(prompt)
            result = response.text
            
            # Reset consecutive 429s on success
            GeminiProvider._consecutive_429s = 0
            GeminiProvider._cooldown_period = 60
            
            # Cache the result
            if use_cache:
                GeminiProvider._cache[prompt_hash] = result
                
            return result
            
        except Exception as e:
            error_str = str(e)
            if "429" in error_str or "quota" in error_str.lower():
                GeminiProvider._last_429_time = time.time()
                GeminiProvider._consecutive_429s += 1
                
                # Check for "limit: 0" which usually means daily quota exhausted
                if "limit: 0" in error_str.lower():
                    # Set a much longer cooldown for daily quota (e.g., 5 mins)
                    GeminiProvider._cooldown_period = 300 
                    logger.error(f"GeminiProvider: DAILY QUOTA EXHAUSTED (Limit 0). Cooldown set to 5 mins.")
                else:
                    # Exponential or incremental backoff for temporary rate limits
                    GeminiProvider._cooldown_period = min(300, 60 * GeminiProvider._consecutive_429s)
                    logger.warning(f"GeminiProvider: Rate Limit Hit (429). Cooldown: {GeminiProvider._cooldown_period}s. Error: {error_str}")
            else:
                logger.error(f"GeminiProvider Error: {error_str}")
            
            return fallback_data

    @classmethod
    def reset_cooldown(cls):
        """Manually reset the cooldown."""
        cls._last_429_time = 0
        cls._consecutive_429s = 0
        cls._cooldown_period = 60

    @property
    def in_cooldown(self):
        """Check if provider is currently in cooldown."""
        return (time.time() - GeminiProvider._last_429_time) < GeminiProvider._cooldown_period
