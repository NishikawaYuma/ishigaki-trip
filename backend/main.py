import json
import os
from pathlib import Path
from typing import Any, Generator

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from google import genai
from google.genai import types
from google.cloud import firestore
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


class MessageItem(BaseModel):
    role: str  # "user" or "model"
    content: str


class ChatRequest(BaseModel):
    history: list[MessageItem]


def _stream_chat(history: list[MessageItem]) -> Generator[str, None, None]:
    contents = [
        types.Content(role=msg.role, parts=[types.Part(text=msg.content)])
        for msg in history
    ]
    try:
        for chunk in _client.models.generate_content_stream(
            model="gemini-2.5-flash",
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=_SYSTEM_PROMPT,
                tools=[types.Tool(google_search=types.GoogleSearch())],
            ),
        ):
            if chunk.text:
                yield f"data: {json.dumps(chunk.text)}\n\n"
    except Exception as e:
        yield f"event: error\ndata: {json.dumps(str(e))}\n\n"


_db: firestore.Client | None = None

def get_db() -> firestore.Client:
    global _db
    if _db is None:
        _db = firestore.Client()
    return _db

_ALLOWED_KEYS = {"checklist", "budget", "itinerary"}


@app.get("/data/{key}")
async def get_data(key: str):
    if key not in _ALLOWED_KEYS:
        raise HTTPException(status_code=400, detail="invalid key")
    doc = get_db().collection("trip-state").document(key).get()
    return doc.to_dict() or {}


@app.post("/data/{key}")
async def set_data(key: str, data: dict[str, Any]):
    if key not in _ALLOWED_KEYS:
        raise HTTPException(status_code=400, detail="invalid key")
    get_db().collection("trip-state").document(key).set(data)
    return {"ok": True}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/chat")
def chat(request: ChatRequest):
    return StreamingResponse(
        _stream_chat(request.history),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
