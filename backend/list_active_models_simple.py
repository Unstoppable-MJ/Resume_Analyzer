import google.generativeai as genai

# Using the latest key provided by the user
API_KEY = "AIzaSyAMtQzZo_WROqxJW46Mb82S8ifPcX_v2K8"
genai.configure(api_key=API_KEY)

print(f"Checking models for key: {API_KEY[:10]}...")

try:
    available_models = []
    print("----------------------------------------")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            available_models.append(m.name)
            print(f"Name: {m.name}")
            print(f"Description: {m.description}")
            print("----------------------------------------")
    
    if not available_models:
        print("No models found with generateContent support.")
    
except Exception as e:
    print(f"Error listing models: {str(e)}")
