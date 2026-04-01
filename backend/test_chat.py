import os
import django
import traceback

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

import google.generativeai as genai
from django.conf import settings

api_key = getattr(settings, 'OPENAI_API_KEY', getattr(settings, 'GEMINI_API_KEY', None))
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-2.5-flash')

try:
    print("Sending request to Gemini...")
    response = model.generate_content("Hello")
    print("SUCCESS")
    print(response.text)
except Exception as e:
    with open('error_log.txt', 'w') as f:
        f.write(traceback.format_exc())
    print("FAILED! Wrote error to error_log.txt")
