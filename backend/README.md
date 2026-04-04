# One Tap Away Backend
This is a Flask backend that provides an AI-powered chat endpoint for city and intent extraction.

## Setup Instructions

### 1. Install pipenv
If you don't have pipenv installed, run:

```bash
pip install pipenv
```

### 2. Install dependencies
Navigate to this backend directory and run:

```bash
pipenv install
```

### 3. Run the server
Start the backend server with:

```bash
pipenv run python app.py
```

## Test Backend 
In another terminal, run: 

curl -X POST http://127.0.0.1:5000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Is Vancouver safe?"}'


## Test Message (Semantic Search Chat)
curl -X POST http://127.0.0.1:5000/chat_with_semantic_search \
  -H "Content-Type: application/json" \
  -d '{"message": "I'm a woman living in Surrey and I've recently experienced threats and abuse from my partner. I'm an immigrant and I need help with translation, legal assistance, and possibly court support. Where can I go?"}'

Expected Answer: The expected single result should be Options Threshold Multicultural Outreach.