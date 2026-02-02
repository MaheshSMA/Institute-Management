from ollama_client import ollama_generate

def analyze_message(content: str):
    prompt = f"""
Classify the following student message.

Message:
\"\"\"{content}\"\"\"

Return ONLY JSON with keys:
emotion: calm | anxious | stressed | frustrated | depressed
risk: Low | Medium | High
confidence: number between 0 and 1
"""

    response = ollama_generate(prompt)

    try:
        return eval(response)  # Ollama outputs valid JSON usually
    except:
        return {
            "emotion": "unknown",
            "risk": "Low",
            "confidence": 0.5
        }
