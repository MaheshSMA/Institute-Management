from ollama_client import ollama_generate

def suggest_reply(student_message: str):
    prompt = f"""
You are a faculty counsellor.
Write a short, empathetic, professional reply.

Rules:
- No promises
- No medical advice
- Encourage discussion
- 3–5 lines max

Student message:
\"\"\"{student_message}\"\"\"
"""

    return ollama_generate(prompt)
