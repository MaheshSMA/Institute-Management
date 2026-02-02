from fastapi import FastAPI, BackgroundTasks
from analyzers.sentiment import analyze_message
from analyzers.reply_suggester import suggest_reply
from db import save_meta, save_reply

app = FastAPI()

from models.schemas import AnalyzeRequest
from fastapi import BackgroundTasks

@app.post("/analyze/{message_id}")
def analyze(
    message_id: int,
    req: AnalyzeRequest,
    background: BackgroundTasks
):
    background.add_task(run_ai, message_id, req.content)
    return {"status": "queued"}


def run_ai(message_id: int, content: str):
    analysis = analyze_message(content)
    save_meta(message_id, analysis)

    reply = suggest_reply(content)
    save_reply(message_id, reply)
