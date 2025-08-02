# app/api/chatbot.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils_chatbot.chatbot import query_groq

router = APIRouter()

class ChatRequest(BaseModel):
    prompt: str

@router.post("/chatbot")
def chat(request: ChatRequest):
    try:
        reply = query_groq(request.prompt)
        return {"response": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
