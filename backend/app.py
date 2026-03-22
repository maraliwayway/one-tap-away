import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai

# load GEMINI_API_KEY from the secret .env file
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

# configures Gemini library 
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-flash-latest')

# creates the Flask app and enables CORS 
app = Flask(__name__)
CORS(app)

def extract_vars(user_text):
    """
    Core Logic: Uses AI to separate the {city} from the rest of the {intent}.
    Even phrases like 'Yes, safe' are captured as {intent}.
    """
    prompt = (
        f"Analyze this message: '{user_text}'. "
        "Identify the 'city' (must be in British Columbia) and the 'intent' (all other words). "
        "Return ONLY a JSON object: {\"city\": \"string or null\", \"intent\": \"string\"}"
    )
    
    response = model.generate_content(prompt)

    # JSON format
    json_str = response.text.strip().replace('```json', '').replace('```', '')
    return json.loads(json_str)

# http endpoint
@app.route('/chat', methods=['POST'])
def chat():
    # get message sent by the React frontend
    data = request.json
    user_message = data.get("message", "")
    
    # processes the variables {city} and {intent}
    result = extract_vars(user_message)
    
    # returns the variables back to the frontend as a JSON response
    return jsonify(result)

# for debugging
@app.route('/')
def index():
    return "backend is running"

if __name__ == "__main__":
    # Starts the server on port 5000
    print("Backend server is running on http://127.0.0.1:5000")
    app.run(debug=True, port=5000)