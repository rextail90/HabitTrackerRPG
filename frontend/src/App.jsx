import React, { useState, useEffect } from 'react';
import Character from './components/Character';
import HabitList from './components/HabitList';
import HabitForm from './components/HabitForm';
import NotificationManager from './components/NotificationManager';
import * as api from './api';

function App() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  // For demo purposes, using userId = 1
  // In production, you'd implement proper authentication
  const userId = 1;

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Try to get existing user or create new one
      try {
        const userResponse = await api.getUser(userId);
        setUser(userResponse.data);
      } catch (error) {
        if (error.response?.status === 404) {
          // Create new user
          const newUser = await api.createUser({
            username: 'hero_player',
            email: 'player@habitrpg.com',
          });
          setUser(newUser.data);
        }
      }

      await loadData();
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const [statsRes, habitsRes, completionsRes] = await Promise.all([
        api.getUserStats(userId),
        api.getHabits(userId),
        api.getCompletions(userId),
      ]);

      setStats(statsRes.data);
      setHabits(habitsRes.data);
      setCompletions(completionsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleCreateHabit = async (habitData) => {
    try {
      await api.createHabit(habitData, userId);
      await loadData();
      setShowForm(false);
    } catch (error) {
      console.error('Error creating habit:', error);
      alert('Failed to create habit. Please try again.');
    }
  };

  const handleUpdateHabit = async (habitData) => {
    try {
      await api.updateHabit(editingHabit.id, habitData);
      await loadData();
      setEditingHabit(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating habit:', error);
      alert('Failed to update habit. Please try again.');
    }
  };

  const handleDeleteHabit = async (habitId) => {
    if (!window.confirm('Are you sure you want to delete this habit?')) return;

    try {
      await api.deleteHabit(habitId);
      await loadData();
    } catch (error) {
      console.error('Error deleting habit:', error);
      alert('Failed to delete habit. Please try again.');
    }
  };

  const handleCompleteHabit = async (habitId) => {
    try {
      await api.completeHabit(habitId, userId);
      await loadData();

      // Show celebration
      const habit = habits.find(h => h.id === habitId);
      if (habit) {
        alert(`🎉 Habit completed! +${habit.xp_reward} XP!`);
      }
    } catch (error) {
      console.error('Error completing habit:', error);
      if (error.response?.data?.detail) {
        alert(error.response.data.detail);
      } else {
        alert('Failed to complete habit. Please try again.');
      }
    }
  };

  const handleEditHabit = (habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingHabit(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Loading your adventure...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <NotificationManager habits={habits} enabled={notificationsEnabled} />

      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            ⚔️ Habit Tracker RPG
          </h1>
          <p className="text-gray-300">Level up your life, one habit at a time</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <Character stats={stats} />

            <div className="mt-4 bg-gray-800 rounded-lg p-4">
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="w-4 h-4"
                />
                Enable notifications
              </label>
            </div>
          </div>

          <div className="lg:col-span-2">
            {showForm ? (
              <HabitForm
                onSubmit={editingHabit ? handleUpdateHabit : handleCreateHabit}
                onCancel={handleCancelForm}
                initialData={editingHabit}
              />
            ) : (
              <>
                <div className="mb-4">
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition shadow-lg"
                  >
                    ➕ Create New Habit
                  </button>
                </div>

                <HabitList
                  habits={habits}
                  completions={completions}
                  onComplete={handleCompleteHabit}
                  onEdit={handleEditHabit}
                  onDelete={handleDeleteHabit}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
