import os
import sys
import hashlib
from unittest.mock import MagicMock, patch

# Mock Django settings BEFORE importing AIService
class MockSettings:
    GEMINI_API_KEY = "test"
    GEMINI_MODEL_NAME = "test"
    GROK_API_KEY = "test"
    GROQ_MODEL_NAME = "test"
    HF_API_KEY = "test"
    HF_MODEL_NAME = "test"
    AI_PROVIDER_ORDER = ['gemini', 'groq', 'huggingface']
    AI_DAILY_RATE_LIMIT = 5

# Mock django.conf.settings
sys.modules['django'] = MagicMock()
sys.modules['django.conf'] = MagicMock()
import django.conf
django.conf.settings = MockSettings()

# Mock django.core.cache
sys.modules['django.core'] = MagicMock()
sys.modules['django.core.cache'] = MagicMock()
import django.core.cache
mock_cache = {}
def cache_get(key, default=None): return mock_cache.get(key, default)
def cache_set(key, value, timeout=None): mock_cache[key] = value
def cache_clear(): mock_cache.clear()
django.core.cache.cache.get = cache_get
django.core.cache.cache.set = cache_set
django.core.cache.cache.clear = cache_clear

# Now import the components
from core.ai_service import AIService

def test_multi_provider_logic():
    print("--- Starting Multi-Provider System Verification (Stand-alone) ---")
    mock_cache.clear()
    ai_service = AIService()
    
    prompt = "Test fallback logic"
    user_id = 999
    
    # 1. Test Normal Operation (Gemini Success)
    print("\n[1] Testing Primary Provider (Gemini Success)...")
    with patch('core.ai_providers.GeminiProvider.generate_response') as mock_gemini:
        mock_gemini.return_value = ({"response": "Gemini result", "provider_used": "Gemini"}, None)
        
        result = ai_service.generate_response(prompt, user_id=user_id)
        print(f"Result: {result}")
        if result['provider_used'] == "Gemini":
            print("SUCCESS: Gemini used as primary.")
        else:
            print("FAILURE: Gemini was not used as primary.")

    # 2. Test Failover to Groq
    print("\n[2] Testing Failover (Gemini Fail -> Groq Success)...")
    mock_cache.clear()
    with patch('core.ai_providers.GeminiProvider.generate_response') as mock_gemini, \
         patch('core.ai_providers.GroqProvider.generate_response') as mock_groq:
        
        mock_gemini.return_value = (None, "api_error")
        mock_groq.return_value = ({"response": "Groq result", "provider_used": "Groq"}, None)
        
        result = ai_service.generate_response(prompt, user_id=user_id)
        print(f"Result: {result}")
        if result['provider_used'] == "Groq":
            print("SUCCESS: Failed over to Groq correctly.")
        else:
            print("FAILURE: Did not fail over to Groq.")

    # 3. Test Failover to HuggingFace
    print("\n[3] Testing Failover (Gemini Fail -> Groq Fail -> HF Success)...")
    mock_cache.clear()
    with patch('core.ai_providers.GeminiProvider.generate_response') as mock_gemini, \
         patch('core.ai_providers.GroqProvider.generate_response') as mock_groq, \
         patch('core.ai_providers.HuggingFaceProvider.generate_response') as mock_hf:
        
        mock_gemini.return_value = (None, "api_error")
        mock_groq.return_value = (None, "api_error")
        mock_hf.return_value = ({"response": "HF result", "provider_used": "HuggingFace"}, None)
        
        result = ai_service.generate_response(prompt, user_id=user_id)
        print(f"Result: {result}")
        if result['provider_used'] == "HuggingFace":
            print("SUCCESS: Failed over to HuggingFace correctly.")
        else:
            print("FAILURE: Did not fail over to HuggingFace.")

    # 4. Test Caching
    print("\n[4] Testing Caching Logic...")
    mock_cache.clear()
    with patch('core.ai_providers.GeminiProvider.generate_response') as mock_gemini:
        mock_gemini.return_value = ({"response": "Cached result", "provider_used": "Gemini"}, None)
        
        # First call (populates cache)
        ai_service.generate_response("Cache test", user_id=user_id)
        
        # Second call (should be cached, mock shouldn't be called again)
        mock_gemini.reset_mock()
        result = ai_service.generate_response("Cache test", user_id=user_id)
        
        if result['response'] == "Cached result" and not mock_gemini.called:
            print("SUCCESS: Caching is working across providers.")
        else:
            print("FAILURE: Caching logic failed.")

    # 5. Test Rate Limiting
    print("\n[5] Testing User-based Rate Limiting...")
    mock_cache.clear()
    limit = 5
    ai_service.daily_limit = limit
    
    with patch('core.ai_providers.GeminiProvider.generate_response') as mock_gemini:
        mock_gemini.return_value = ({"response": "res", "provider_used": "G"}, None)
        
        for i in range(limit):
            ai_service.generate_response(f"Prompt {i}", user_id=user_id)
            
        # This one should be blocked
        result = ai_service.generate_response("Blocked prompt", user_id=user_id)
        print(f"Result: {result}")
        if result.get('status') == "rate_limited":
            print("SUCCESS: Daily rate limiting is enforced.")
        else:
            print("FAILURE: Rate limiting not enforced.")

if __name__ == "__main__":
    test_multi_provider_logic()
