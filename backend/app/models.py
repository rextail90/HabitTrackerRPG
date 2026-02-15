from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON, Time
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # RPG Stats
    level = Column(Integer, default=1)
    xp = Column(Integer, default=0)
    total_xp = Column(Integer, default=0)

    habits = relationship("Habit", back_populates="owner")
    completions = relationship("HabitCompletion", back_populates="user")

class Habit(Base):
    __tablename__ = "habits"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    reminder_time = Column(Time, nullable=True)
    days_of_week = Column(JSON, default=list)  # [0,1,2,3,4,5,6] for Mon-Sun
    xp_reward = Column(Integer, default=10)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="habits")
    completions = relationship("HabitCompletion", back_populates="habit")

class HabitCompletion(Base):
    __tablename__ = "habit_completions"

    id = Column(Integer, primary_key=True, index=True)
    completed_at = Column(DateTime, default=datetime.utcnow)
    date = Column(DateTime)  # Date of the habit completion (normalized to start of day)

    user_id = Column(Integer, ForeignKey("users.id"))
    habit_id = Column(Integer, ForeignKey("habits.id"))

    user = relationship("User", back_populates="completions")
    habit = relationship("Habit", back_populates="completions")
