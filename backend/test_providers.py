import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from core.ai_service import AIService
from core.ai_providers import GeminiProvider, GroqProvider, HuggingFaceProvider

def test_individual_providers():
    print("--- Testing Individual Providers ---")
    providers = [
        GeminiProvider(),
        GroqProvider(),
        HuggingFaceProvider()
    ]
    
    for p in providers:
        print(f"\nTesting {p.name}...")
        if p.in_cooldown:
            print(f"  {p.name} is in cooldown. Skipping.")
            continue
            
        result, error = p.generate_response("Say 'Success' if you can read this.")
        if result:
            print(f"  {p.name} SUCCESS: {result['response']}")
        else:
            print(f"  {p.name} FAILED: {error}")

def test_fallback_chain():
    print("\n--- Testing AIService Fallback Chain ---")
    service = AIService()
    # Test with cache disabled for realism
    result = service.generate_response("Generate a 1-sentence career advice.", use_cache=False)
    print(f"\nAIService Result:")
    print(f"  Provider Used: {result.get('provider_used')}")
    print(f"  Response: {result.get('response')}")
    print(f"  Status: {result.get('status', 'ok')}")

if __name__ == "__main__":
    test_individual_providers()
    test_fallback_chain()
