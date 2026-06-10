from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import engine, Base
from app.routers import auth, tenders

# Initialize database schemas (handles SQLite local creation seamlessly)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Tender Copilot API", version="0.1.0")

# Enable CORS for Next.js client calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production per security requirements
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(tenders.router)

@app.get("/")
def read_root():
    return {"status": "healthy", "service": "Smart Tender Copilot API"}
