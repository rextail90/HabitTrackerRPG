from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import List
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    db_user = models.User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/{user_id}", response_model=schemas.User)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/{user_id}/stats", response_model=schemas.UserStats)
def get_user_stats(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Calculate XP needed for next level (exponential growth)
    xp_to_next_level = (user.level * 100) - user.xp

    # Total active habits
    total_habits = db.query(models.Habit).filter(
        models.Habit.user_id == user_id,
        models.Habit.is_active == True
    ).count()

    # Completions today
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    completed_today = db.query(models.HabitCompletion).filter(
        models.HabitCompletion.user_id == user_id,
        models.HabitCompletion.date >= today
    ).count()

    # Calculate current streak
    current_streak = calculate_streak(user_id, db)

    return schemas.UserStats(
        level=user.level,
        xp=user.xp,
        total_xp=user.total_xp,
        xp_to_next_level=xp_to_next_level,
        total_habits=total_habits,
        completed_today=completed_today,
        current_streak=current_streak
    )

def calculate_streak(user_id: int, db: Session) -> int:
    """Calculate consecutive days with at least one habit completion"""
    streak = 0
    current_date = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

    while True:
        completions = db.query(models.HabitCompletion).filter(
            models.HabitCompletion.user_id == user_id,
            models.HabitCompletion.date >= current_date,
            models.HabitCompletion.date < current_date + timedelta(days=1)
        ).count()

        if completions == 0:
            break

        streak += 1
        current_date -= timedelta(days=1)

    return streak
