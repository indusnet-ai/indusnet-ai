from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import engine, Base
from app import models  # Force import of models so metadata registers all tables
from app.routers import (
    auth,
    tenders,
    hr_jobs,
    hr_applications,
    hr_candidates,
    hr_analysis,
    hr_copilot,
    hr_email
)

# Initialize database schemas (handles SQLite/Supabase creation seamlessly)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Tender & HR Copilot API", version="0.2.0")

# Enable CORS for Next.js client calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://indusnet-ai.com",
        "https://www.indusnet-ai.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth.router)
app.include_router(tenders.router)
app.include_router(hr_jobs.router)
app.include_router(hr_applications.router)
app.include_router(hr_candidates.router)
app.include_router(hr_analysis.router)
app.include_router(hr_copilot.router)
app.include_router(hr_email.router)

@app.get("/")
def read_root():
    return {"status": "healthy", "service": "Smart Tender & HR Copilot API"}

