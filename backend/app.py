import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai

# 1. Setup
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))   
model = genai.GenerativeModel('gemini-flash-latest')

app = Flask(__name__)
CORS(app) # Allows React to connect

# 2. The Logic (Phase 1:2)
def extract_vars(user_text):
    prompt = f"""
    Extract:
    1. 'city': A city in British Columbia.
    2. 'intent': The user's needs/concerns (everything except the city).
    Conversation: {user_text}
    Return ONLY JSON: {{"city": "string", "intent": "string"}}
    """
    response = model.generate_content(prompt)
    clean_json = response.text.strip().replace('```json', '').replace('```', '')
    return json.loads(clean_json)

# 3. The API Endpoint (For Soyoung/React)
@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get("message", "")
    extracted = extract_vars(user_message)
    return jsonify(extracted)

# 4. The Terminal Mode (For your Task)
def run_terminal_mode():
    print("--- Phase 1:2 Terminal Variable Extractor ---")
    user_input = input("What is on your mind? ")
    result = extract_vars(user_input)
    
    # If city is missing, ask directly (Phase 1:2 Requirement)
    if not result['city']:
        city_input = input("Which BC city are you in? ") 
        result['city'] = city_input
        
    print(f"\nExtracted Data: {result}")

if __name__ == "__main__":
    # Toggle: Run terminal mode for your task, or app.run() for the team
    run_terminal_mode() 
    # app.run(debug=True, port=5000)