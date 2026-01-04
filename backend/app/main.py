from fastapi import FastAPI
from app.database import init_db


app = FastAPI(title="Mini Admin Dashboard")
init_db()

@app.get("/health")
def health():
    return {"status": "ok"}
