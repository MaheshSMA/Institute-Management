import mysql.connector

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="mysql",
    database="institution_db"
)

def save_meta(message_id, data):
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO MESSAGE_AI_META
        (Message_id, Emotion, Risk_Level, Confidence_Score)
        VALUES (%s, %s, %s, %s)
    """, (
        message_id,
        data["emotion"],
        data["risk"],
        data["confidence"]
    ))
    conn.commit()

def save_reply(message_id, reply):
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO AI_REPLY_SUGGESTION
        (Message_id, Suggested_Reply)
        VALUES (%s, %s)
    """, (message_id, reply))
    conn.commit()
