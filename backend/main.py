import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types
from pydantic import BaseModel

load_dotenv()

app = FastAPI(title="ishigaki-trip API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

_SYSTEM_PROMPT = (
    Path(__file__).parent / "prompts" / "ishigaki_system.txt"
).read_text(encoding="utf-8")

_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        response = _client.models.generate_content(
            model="gemini-2.5-flash",
            contents=request.message,
            config=types.GenerateContentConfig(
                system_instruction=_SYSTEM_PROMPT,
            ),
        )
        return ChatResponse(reply=response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
