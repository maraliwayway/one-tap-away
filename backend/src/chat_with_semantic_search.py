import os
import json
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-flash-latest")

chat_semantic_search_bp = Blueprint("chat_with_semantic_search", __name__)

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
SYSTEM_INSTRUCTIONS_PATH = os.path.join(BASE_DIR, "artifacts", "system_instructions.md")
SYSTEM_DATA_PATH = os.path.join(BASE_DIR, "artifacts", "spreadsheet_data.json")


def _load_file(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def _load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


@chat_semantic_search_bp.route("/chat_with_semantic_search", methods=["POST"])
def chat_with_semantic_search():
    data = request.json
    user_message = data.get("message", "")
    # Expect history as: [{"role": "user", "text": "..."}, {"role": "model", "text": "..."}, ...]
    history = data.get("history", [])

    system_instructions = _load_file(SYSTEM_INSTRUCTIONS_PATH)
    system_data = json.dumps(_load_json(SYSTEM_DATA_PATH), ensure_ascii=False, indent=2)

    # Build the system context as the first user turn
    system_context = f"SYSTEM INSTRUCTIONS:\n{system_instructions}\n\nSYSTEM DATA:\n{system_data}\n\nRespond as instructed above."

    # Convert history to Gemini's format
    gemini_history = [{"role": "user", "parts": [system_context]},
                      {"role": "model", "parts": ["Understood. I'm ready to help users find resources."]}]

    for turn in history:
        role = "user" if turn["role"] == "user" else "model"
        gemini_history.append({"role": role, "parts": [turn["text"]]})

    chat = model.start_chat(history=gemini_history)
    response = chat.send_message(user_message)

    return jsonify({"response": response.text.strip()})