from pydantic import BaseModel, EmailStr
from datetime import datetime, time
from typing import Optional, List

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    level: int
    xp: int
    total_xp: int
    created_at: datetime

    class Config:
        from_attributes = True

# Habit Schemas
class HabitBase(BaseModel):
    name: str
    description: Optional[str] = None
    reminder_time: Optional[time] = None
    days_of_week: List[int] = []
    xp_reward: int = 10

class HabitCreate(HabitBase):
    pass

class HabitUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    reminder_time: Optional[time] = None
    days_of_week: Optional[List[int]] = None
    is_active: Optional[bool] = None

class Habit(HabitBase):
    id: int
    user_id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Habit Completion Schemas
class HabitCompletionCreate(BaseModel):
    habit_id: int
    date: Optional[datetime] = None

class HabitCompletion(BaseModel):
    id: int
    habit_id: int
    user_id: int
    completed_at: datetime
    date: datetime

    class Config:
        from_attributes = True

# Stats Schema
class UserStats(BaseModel):
    level: int
    xp: int
    total_xp: int
    xp_to_next_level: int
    total_habits: int
    completed_today: int
    current_streak: int
