import os
import json
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables and configure Gemini
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-flash-latest')

# Blueprint for the new endpoint
chat_semantic_search_bp = Blueprint('chat_with_semantic_search', __name__)


# Base directory for relative paths
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
SYSTEM_INSTRUCTIONS_PATH = os.path.join(BASE_DIR, 'artifacts', 'system_instructions.md')
SYSTEM_DATA_PATH = os.path.join(BASE_DIR, 'artifacts', 'spreadsheet_data.json')

def _load_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def _load_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def _build_prompt(system_instructions, system_data, user_message):
    return f"""
SYSTEM INSTRUCTIONS:\n{system_instructions}\n\nSYSTEM DATA:\n{system_data}\n\nUSER MESSAGE:\n{user_message}\n\nRespond as instructed above.
"""

@chat_semantic_search_bp.route('/chat_with_semantic_search', methods=['POST'])
def chat_with_semantic_search():
    data = request.json
    user_message = data.get("message", "")

    # Load system instructions and data
    system_instructions = _load_file(SYSTEM_INSTRUCTIONS_PATH)
    system_data = json.dumps(_load_json(SYSTEM_DATA_PATH), ensure_ascii=False, indent=2)

    # Build prompt
    prompt = _build_prompt(system_instructions, system_data, user_message)

    # Get AI response
    response = model.generate_content(prompt)
    ai_text = response.text.strip()

    return jsonify({"response": ai_text})
