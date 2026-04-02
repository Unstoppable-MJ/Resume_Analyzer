import hashlib
import logging
from datetime import datetime
from django.core.cache import cache
from core.ai_providers import GeminiProvider, GroqProvider, HuggingFaceProvider
from django.conf import settings

logger = logging.getLogger('django')

class AIService:
    """
    Orchestrator for multi-provider AI fallback system.
    Handles caching, rate limiting, and failover logic.
    """
    
    def __init__(self):
        # Initialize providers once per service instance
        self.providers = {
            'gemini': GeminiProvider(),
            'groq': GroqProvider(),
            'huggingface': HuggingFaceProvider()
        }
        self.provider_order = getattr(settings, 'AI_PROVIDER_ORDER', ['gemini', 'groq', 'huggingface'])
        self.daily_limit = getattr(settings, 'AI_DAILY_RATE_LIMIT', 50)

    def generate_response(self, prompt, user_id=None, use_cache=True):
        """
        Main entry point for generating AI responses.
        Tries providers in sequence until one succeeds.
        """
        # 1. Rate Limiting Check
        if user_id and not self._check_rate_limit(user_id):
            return {
                "response": "Daily AI limit reached. Please try again tomorrow.",
                "provider_used": "System",
                "status": "rate_limited"
            }

        # 2. Caching Check
        prompt_hash = hashlib.md5(prompt.encode()).hexdigest()
        if use_cache:
            cached_res = cache.get(f"ai_cache_{prompt_hash}")
            if cached_res:
                logger.info("AIService: Returning cached response.")
                return cached_res

        # 3. Failover Execution
        for provider_key in self.provider_order:
            provider = self.providers.get(provider_key)
            if not provider or provider.in_cooldown:
                continue

            logger.info(f"AIService: Trying provider {provider.name}")
            result, error = provider.generate_response(prompt)
            
            if result:
                # Cache the successful result
                if use_cache:
                    cache.set(f"ai_cache_{prompt_hash}", result, timeout=3600*24) # 24h cache
                return result
            
            logger.warning(f"AIService: Provider {provider.name} failed with {error}")

        # 4. Final Fallback
        return {
            "response": "AI services are currently busy. Please try again later.",
            "provider_used": "None",
            "status": "all_failed"
        }

    def _check_rate_limit(self, user_id):
        """Checks if user has exceeded daily limit."""
        today = datetime.now().strftime('%Y-%m-%d')
        key = f"user_ai_usage_{user_id}_{today}"
        usage = cache.get(key, 0)
        
        if usage >= self.daily_limit:
            return False
            
        cache.set(key, usage + 1, timeout=86400) # 24h expiration
        return True
