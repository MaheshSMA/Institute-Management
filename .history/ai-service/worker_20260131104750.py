import json
import mysql.connector
import requests
from datetime import datetime

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "llama3"

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "your_password",
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


def call_ollama(prompt):
    payload = {
        "model": MODEL,
        "prompt": prompt,
        "stream": False
    }

    r = requests.post(OLLAMA_URL, json=payload, timeout=60)
    r.raise_for_status()

    return json.loads(r.json()["response"])


def save_insight(student_id, data):
    conn = mysql.connector.connect(**DB_CONFIG)
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO STUDENT_AI_INSIGHTS
        (Student_id, summary_text, dominant_topics,
         engagement_level, risk_score, risk_explanation, generated_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
          summary_text = VALUES(summary_text),
          dominant_topics = VALUES(dominant_topics),
          engagement_level = VALUES(engagement_level),
          risk_score = VALUES(risk_score),
          risk_explanation = VALUES(risk_explanation),
          generated_at = VALUES(generated_at)
    """, (
        student_id,
        data["summary_text"],
        json.dumps(data["dominant_topics"]),
        data["engagement_level"],
        data["risk_score"],
        data["risk_explanation"],
        datetime.now()
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


PROMPT_TEMPLATE = """<PASTE THE PROMPT FROM ABOVE HERE>"""
