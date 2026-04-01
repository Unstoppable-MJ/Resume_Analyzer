import google.generativeai as genai

API_KEY = "AIzaSyAcrEV1EI6bvbI8A5rDijt2-jUmHf7a9c0"
genai.configure(api_key=API_KEY)

try:
    with open("models.txt", "w") as f:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                f.write(f"{m.name}\n")
except Exception as e:
    import traceback
    with open("models.txt", "w") as f:
        f.write(traceback.format_exc())
