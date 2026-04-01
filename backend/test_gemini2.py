import google.generativeai as genai

API_KEY = "AIzaSyBYLAQocPM3RcXOrAJuWD3SM4u9DteqeQc"
genai.configure(api_key=API_KEY)

try:
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content("Hello Career Copilot")
    print("SUCCESS:", response.text)
except Exception as e:
    import traceback
    traceback.print_exc()
