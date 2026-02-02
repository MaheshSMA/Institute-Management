import json
import mysql.connector
import requests
from datetime import datetime

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "llama3.2:3b"

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "mysql",
    "database": "institution_db"
}

def fetch_messages(student_id):
    conn = mysql.connector.connect(**DB_CONFIG)
    cur = conn.cursor(dictionary=True)

    cur.execute("""
        SELECT Sender, Content
        FROM MESSAGE
        WHERE Student_id = %s
          AND Created_At >= NOW() - INTERVAL 7 DAY
        ORDER BY Created_At
    """, (student_id,))

    rows = cur.fetchall()
    conn.close()

    return rows


import re

def call_ollama(prompt):
    payload = {
    "model": MODEL,
    "prompt": prompt,
    "stream": False,
    "options": {
        "temperature": 0.0,   # 🔒 deterministic
        "top_p": 1.0,
        "seed": 42            # 🔒 same output every time
    }
}


    r = requests.post(
    OLLAMA_URL,
    json=payload,
    timeout=(5, 600)  # (connect_timeout, read_timeout)
)

    r.raise_for_status()

    raw = r.json().get("response", "").strip()
    print("RAW OLLAMA OUTPUT:\n", raw)

    # 🔐 Extract JSON block safely
    match = re.search(r"\{.*\}", raw, re.DOTALL)
    if not match:
        raise ValueError("No JSON found in Ollama response")

    return json.loads(match.group())


def save_insight(student_id, data):
    conn = mysql.connector.connect(**DB_CONFIG)
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO STUDENT_AI_INSIGHTS
        (Student_id, summary_text, dominant_topics,
         engagement_level, risk_score, risk_explanation,
         generated_at, ai_source)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
          summary_text = VALUES(summary_text),
          dominant_topics = VALUES(dominant_topics),
          engagement_level = VALUES(engagement_level),
          risk_score = VALUES(risk_score),
          risk_explanation = VALUES(risk_explanation),
          generated_at = VALUES(generated_at),
          ai_source = VALUES(ai_source)
    """, (
        student_id,
        data["summary_text"],
        json.dumps(data["dominant_topics"]),
        data["engagement_level"],
        data["risk_score"],
        data["risk_explanation"],
        datetime.now(),
        "ollama"  # ✅ NOW MATCHES PLACEHOLDERS
    ))

    conn.commit()
    conn.close()

def generate_insight(student_id):
    messages = fetch_messages(student_id)

    if not messages:
        return

    convo = "\n".join(
        f'{m["Sender"]}: {m["Content"]}' for m in messages
    )

    prompt = PROMPT_TEMPLATE.replace("{{MESSAGES}}", convo)

    try:
        result = call_ollama(prompt)
        save_insight(student_id, result)
        print(f"✔ AI insight generated for student {student_id}")
    except Exception as e:
        print("❌ AI failed:", e)


PROMPT_TEMPLATE = """
IMPORTANT:
- Do not wrap the JSON in any extra keys
- Do not include explanations
- Do not include markdown
- Output ONLY raw JSON

You are an academic counselling assistant.

Analyze the following student–faculty conversation messages from the last 7 days.

Your task:
1. Write a short professional summary (3–4 lines)
2. Identify 2–4 dominant topics (single words)
3. Classify engagement level as one of:
   Active, Stable, Dropping, Inactive
4. Assign a risk score between 0 and 1
5. Give a one-sentence explanation for the risk score

Rules:
- Do NOT diagnose mental health
- Do NOT give advice
- Be neutral and professional
- Focus on engagement and communication patterns

Conversation:
{{MESSAGES}}

Respond ONLY in valid JSON with this schema:

{
  "summary_text": "...",
  "dominant_topics": ["...", "..."],
  "engagement_level": "...",
  "risk_score": 0.0,
  "risk_explanation": "..."
}
"""

