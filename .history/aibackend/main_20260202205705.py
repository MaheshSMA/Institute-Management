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

Your task:
- First, check whether ANY part of the question relates directly or indirectly to the syllabus content.
- If related:
  - Answer ONLY using the provided syllabus content.
  - Clearly state which parts of the question are covered.
  - For uncovered parts, briefly say they are beyond the syllabus.
- If not directly covered but conceptually adjacent:
  - Explain the closest related concepts from the syllabus.
  - Explain how those concepts help in understanding the asked topic.
  - Suggest how the student should study the missing topic separately.
- ONLY if there is absolutely no conceptual overlap, respond with:
  "Not covered in the syllabus."

Rules:
- Do NOT introduce facts, definitions, or examples not present in the syllabus.
- Do NOT guess or hallucinate missing content.
- Prefer partial answers over rejecting the question.
- Be concise, structured, and student-friendly.
- Use bullet points where helpful.

SYLLABUS CONTENT:
{context}

QUESTION:
{req.question}
"""


    response = model.generate_content(prompt)

    return {"answer": response.text.strip()}

# uvicorn main:app --reload --port 8000
