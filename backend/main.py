from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import os
import requests
import json
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration: get your API key from environment variable
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# Request models
class QuestionRequest(BaseModel):
    question: str
    stream: Optional[bool] = False

class ResponseModel(BaseModel):
    answer: str

class ErrorResponse(BaseModel):
    error: str

@app.get("/")
def health_check():
    return {"status": "API is running", "usage": "POST /api/ask with question"}

def generate_deepseek_response(question: str, stream: bool = False):
    """Generate response from DeepSeek API"""
    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json",
        "Accept": "text/event-stream" if stream else "application/json"
    }
    
    payload = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": "You are a helpful AI assistant."},
            {"role": "user", "content": question}
        ],
        "temperature": 0.7,
        "stream": stream
    }

    try:
        response = requests.post(
            DEEPSEEK_API_URL,
            headers=headers,
            json=payload,
            stream=stream,
            timeout=30
        )
        response.raise_for_status()
        
        if stream:
            def event_stream():
                for line in response.iter_lines():
                    if line:
                        decoded_line = line.decode('utf-8')
                        if decoded_line.startswith('data:'):
                            data = decoded_line[5:].strip()
                            if data != '[DONE]':
                                try:
                                    chunk = json.loads(data)['choices'][0]['delta'].get('content', '')
                                    if chunk:
                                        yield chunk
                                except:
                                    continue
            return event_stream()
        else:
            return response.json()['choices'][0]['message']['content']
            
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=502,
            detail=f"DeepSeek API error: {str(e)}"
        )

@app.post("/api/ask")
async def ask_question(request_data: QuestionRequest):
    try:
        question = request_data.question.strip()
        if not question:
            raise HTTPException(status_code=400, detail="Question is required")

        if request_data.stream:
            return StreamingResponse(
                generate_deepseek_response(question, stream=True),
                media_type="text/event-stream"
            )
        else:
            answer = generate_deepseek_response(question)
            return {"answer": answer}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
