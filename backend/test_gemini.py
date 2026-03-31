import os, sys, warnings
warnings.simplefilter('ignore')

sys.path.append(r"d:\Project_Intership\Mini_Project\backend")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

import django
django.setup()

import google.generativeai as genai
from django.conf import settings

api_key = getattr(settings, 'OPENAI_API_KEY', None)
genai.configure(api_key=api_key)

models_to_test = ['gemini-1.5-flash', 'gemini-pro', 'gemini-2.5-flash', 'gemini-2.0-flash']

for m in models_to_test:
    try:
        print(f"Testing {m}...")
        model = genai.GenerativeModel(m)
        response = model.generate_content("Say hi")
        print(f"SUCCESS with {m}: {response.text}")
        break
    except Exception as e:
        print(f"ERROR with {m}: {e}")
