# Habit Tracker RPG

Turn your daily habits into an epic RPG adventure! Level up your character by completing real-life habits.

## Features

- **RPG Gamification**: Earn XP, level up, and track your progress like a video game character
- **Habit Management**: Create, edit, and track daily habits
- **Smart Reminders**: Set specific times for habit notifications
- **Daily Check-ins**: Mark habits as complete and earn rewards
- **Streak Tracking**: Build momentum with consecutive day streaks
- **Beautiful UI**: Modern, responsive design with Tailwind CSS

## Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Axios

**Backend:**
- Python 3.10+
- FastAPI
- SQLAlchemy
- PostgreSQL

## Prerequisites

Before you begin, ensure you have the following installed:
- Python 3.10 or higher
- Node.js 18+ and npm
- PostgreSQL 14+

## Setup Instructions

### 1. Database Setup

First, create a PostgreSQL database:

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE habit_tracker;

# Create user (optional)
CREATE USER habit_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE habit_tracker TO habit_user;

# Exit
\q
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and update DATABASE_URL
# DATABASE_URL=postgresql://user:password@localhost:5432/habit_tracker
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### 4. Running the Application

You'll need two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate  # or source venv/bin/activate on macOS/Linux
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`

## Usage

### First Time Setup

1. When you first open the app, a default user will be created automatically
2. Click "Create New Habit" to add your first habit
3. Fill in the habit details:
   - Name (e.g., "Make my bed")
   - Description (optional)
   - Reminder time (when you want to be notified)
   - Days of the week
   - XP reward

### Daily Workflow

1. **Morning**: Check your habit list for the day
2. **Throughout the day**: Receive browser notifications for scheduled habits
3. **Complete habits**: Click the "Complete" button to earn XP
4. **Level up**: Watch your character grow as you build better habits!

### Browser Notifications

To enable notifications:
1. The app will request notification permission on first load
2. Make sure to allow notifications in your browser
3. Toggle the "Enable notifications" checkbox in the app

## Project Structure

```
webapp/
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   ├── users.py       # User & stats endpoints
│   │   │   └── habits.py      # Habit & completion endpoints
│   │   ├── database.py        # Database configuration
│   │   ├── models.py          # SQLAlchemy models
│   │   ├── schemas.py         # Pydantic schemas
│   │   └── main.py            # FastAPI app
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Character.jsx          # RPG stats display
│   │   │   ├── HabitList.jsx          # Habit list view
│   │   │   ├── HabitForm.jsx          # Create/edit form
│   │   │   └── NotificationManager.jsx # Browser notifications
│   │   ├── App.jsx            # Main app component
│   │   ├── api.js             # API client
│   │   └── main.jsx           # Entry point
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## API Endpoints

### Users
- `POST /users/` - Create a new user
- `GET /users/{user_id}` - Get user details
- `GET /users/{user_id}/stats` - Get user stats (XP, level, streaks)

### Habits
- `POST /habits/?user_id={user_id}` - Create a new habit
- `GET /habits/?user_id={user_id}` - Get all habits for a user
- `GET /habits/{habit_id}` - Get a specific habit
- `PUT /habits/{habit_id}` - Update a habit
- `DELETE /habits/{habit_id}` - Delete (deactivate) a habit
- `POST /habits/complete?user_id={user_id}` - Mark habit as complete
- `GET /habits/completions/?user_id={user_id}` - Get completion history

## Future Enhancements

Some ideas for expanding the MVP:
- User authentication and registration
- Multiple character classes/avatars
- Achievement badges and rewards
- Social features (friends, leaderboards)
- Habit templates and recommendations
- Mobile app version
- Data visualization and analytics
- Export/import habits
- Custom themes

## Troubleshooting

**Database connection errors:**
- Make sure PostgreSQL is running
- Verify your DATABASE_URL in `.env` is correct
- Check that the database exists

**Frontend can't connect to backend:**
- Ensure the backend is running on port 8000
- Check that CORS is properly configured in `main.py`

**Notifications not working:**
- Make sure you've allowed notifications in your browser settings
- Check that the "Enable notifications" toggle is on
- Notifications only work over HTTPS or localhost

## License

MIT

## Contributing

This is a personal project, but feel free to fork and modify as you wish!

---

Built with ⚔️ by a habit-forming hero
