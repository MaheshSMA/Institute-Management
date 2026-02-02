from pydantic import BaseModel

class AnalyzeRequest(BaseModel):
    content: str
