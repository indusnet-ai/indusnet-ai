from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
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
    hr_email,
    hr_offers,
    rag
)

# Initialize database schemas (handles SQLite/Supabase creation seamlessly)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Indus Net AI Enterprise API", version="0.3.0")

# Enable CORS for Next.js client calls
cors_origins = [o.strip() for o in settings.BACKEND_CORS_ORIGINS.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
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
app.include_router(hr_offers.router)
app.include_router(rag.router)

@app.get("/")
def read_root():
    return {"status": "healthy", "service": "Smart Tender & HR Copilot API"}

