import os
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware
from pdf_loader import load_all_pdfs

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

model = genai.GenerativeModel("gemini-3-flash-preview")

# Load all PDF pages ONCE
DOCUMENTS = load_all_pdfs()

class ChatRequest(BaseModel):
    question: str

def find_relevant_pages(question, docs, max_pages=5):
    keywords = question.lower().split()

    scored = []
    for d in docs:
        score = sum(1 for k in keywords if k in d["text"].lower())
        if score > 0:
            scored.append((score, d))

    scored.sort(reverse=True, key=lambda x: x[0])
    return [d for _, d in scored[:max_pages]]

# -------- Chat Endpoint --------
@app.post("/chat")
def chat(req: ChatRequest):
    relevant_pages = find_relevant_pages(req.question, DOCUMENTS)

    if not relevant_pages:
        return {"answer": "Not covered in syllabus"}

    context = ""
    for p in relevant_pages:
        context += f"""
SOURCE: {p['source']} (Page {p['page']})
{p['text']}
"""

    prompt = f"""
You are a helpful academic assistant for RVCE students.

You will be given syllabus content and a student question.

Rules:
- Answer ONLY using the provided syllabus content.
- If the topic is partially covered, answer the covered parts.
- If the topic is completely unrelated, say: "Not covered in the syllabus."
- Do NOT hallucinate beyond the syllabus.
- Be concise and student-friendly.

SYLLABUS CONTENT:
{context}

QUESTION:
{req.question}
"""

    response = model.generate_content(prompt)

    return {"answer": response.text.strip()}

# uvicorn main:app --reload --port 8000
