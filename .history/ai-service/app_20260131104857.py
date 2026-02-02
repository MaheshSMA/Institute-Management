from fastapi import FastAPI
from pydantic import BaseModel
from worker import generate_insight

app = FastAPI()

class Job(BaseModel):
    student_id: int

@app.post("/run")
def run_ai(job: Job):
    generate_insight(job.student_id)
    return {"status": "ok"}
