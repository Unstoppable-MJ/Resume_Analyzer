import google.generativeai as genai
from django.conf import settings
import os
import sys
import django

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

API_KEY = getattr(settings, 'GEMINI_API_KEY', None)
if not API_KEY:
    print("ERROR: No GEMINI_API_KEY found in settings.")
    sys.exit(1)

genai.configure(api_key=API_KEY)

print(f"Checking models for key: {API_KEY[:10]}...")

try:
    available_models = []
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            available_models.append(m.name)
            print(f"Found: {m.name}")
    
    if not available_models:
        print("No models found with generateContent support.")
    
except Exception as e:
    print(f"Error listing models: {str(e)}")
