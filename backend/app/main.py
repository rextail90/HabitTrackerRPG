from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import users, habits
import os

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Habit Tracker RPG",
    description="Gamified habit tracking with RPG elements",
    version="1.0.0"
)

# CORS middleware for frontend
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

# Add production frontend URL if set
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router)
app.include_router(habits.router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Habit Tracker RPG API",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
