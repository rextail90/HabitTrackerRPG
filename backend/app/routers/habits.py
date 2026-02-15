from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/habits", tags=["habits"])

@router.post("/", response_model=schemas.Habit)
def create_habit(habit: schemas.HabitCreate, user_id: int, db: Session = Depends(get_db)):
    # Verify user exists
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db_habit = models.Habit(**habit.dict(), user_id=user_id)
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit

@router.get("/", response_model=List[schemas.Habit])
def get_habits(user_id: int, active_only: bool = True, db: Session = Depends(get_db)):
    query = db.query(models.Habit).filter(models.Habit.user_id == user_id)
    if active_only:
        query = query.filter(models.Habit.is_active == True)
    return query.all()

@router.get("/{habit_id}", response_model=schemas.Habit)
def get_habit(habit_id: int, db: Session = Depends(get_db)):
    habit = db.query(models.Habit).filter(models.Habit.id == habit_id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    return habit

@router.put("/{habit_id}", response_model=schemas.Habit)
def update_habit(habit_id: int, habit_update: schemas.HabitUpdate, db: Session = Depends(get_db)):
    db_habit = db.query(models.Habit).filter(models.Habit.id == habit_id).first()
    if not db_habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    update_data = habit_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_habit, field, value)

    db.commit()
    db.refresh(db_habit)
    return db_habit

@router.delete("/{habit_id}")
def delete_habit(habit_id: int, db: Session = Depends(get_db)):
    db_habit = db.query(models.Habit).filter(models.Habit.id == habit_id).first()
    if not db_habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    # Soft delete by marking as inactive
    db_habit.is_active = False
    db.commit()
    return {"message": "Habit deleted successfully"}

@router.post("/complete", response_model=schemas.HabitCompletion)
def complete_habit(completion: schemas.HabitCompletionCreate, user_id: int, db: Session = Depends(get_db)):
    # Verify habit exists and belongs to user
    habit = db.query(models.Habit).filter(
        models.Habit.id == completion.habit_id,
        models.Habit.user_id == user_id
    ).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    # Get or use current date
    completion_date = completion.date or datetime.utcnow()
    completion_date = completion_date.replace(hour=0, minute=0, second=0, microsecond=0)

    # Check if already completed today
    existing = db.query(models.HabitCompletion).filter(
        models.HabitCompletion.habit_id == completion.habit_id,
        models.HabitCompletion.user_id == user_id,
        models.HabitCompletion.date == completion_date
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Habit already completed today")

    # Create completion record
    db_completion = models.HabitCompletion(
        habit_id=completion.habit_id,
        user_id=user_id,
        date=completion_date
    )
    db.add(db_completion)

    # Award XP to user
    user = db.query(models.User).filter(models.User.id == user_id).first()
    user.xp += habit.xp_reward
    user.total_xp += habit.xp_reward

    # Level up if needed
    xp_needed = user.level * 100
    while user.xp >= xp_needed:
        user.xp -= xp_needed
        user.level += 1
        xp_needed = user.level * 100

    db.commit()
    db.refresh(db_completion)
    return db_completion

@router.get("/completions/", response_model=List[schemas.HabitCompletion])
def get_completions(user_id: int, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.HabitCompletion).filter(
        models.HabitCompletion.user_id == user_id
    ).order_by(models.HabitCompletion.completed_at.desc()).limit(limit).all()
