import React from 'react';

const HabitList = ({ habits, onComplete, onEdit, onDelete, completions }) => {
  const isCompletedToday = (habitId) => {
    const today = new Date().toISOString().split('T')[0];
    return completions.some(
      (c) => c.habit_id === habitId && c.date.startsWith(today)
    );
  };

  const getDaysString = (daysArray) => {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    if (!daysArray || daysArray.length === 0) return 'Every day';
    if (daysArray.length === 7) return 'Every day';
    return daysArray.map(d => dayNames[d]).join(', ');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">📋 Your Habits</h2>

      {habits.length === 0 ? (
        <div className="bg-gray-800 bg-opacity-50 rounded-lg p-8 text-center text-gray-400">
          No habits yet. Create your first habit to start your journey!
        </div>
      ) : (
        habits.map((habit) => {
          const completed = isCompletedToday(habit.id);
          return (
            <div
              key={habit.id}
              className={`bg-gradient-to-r ${
                completed
                  ? 'from-green-900 to-green-800'
                  : 'from-gray-800 to-gray-700'
              } rounded-lg p-4 shadow-lg border-l-4 ${
                completed ? 'border-green-400' : 'border-blue-400'
              } transition-all`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    {completed && <span className="text-green-400">✓</span>}
                    {habit.name}
                  </h3>
                  {habit.description && (
                    <p className="text-gray-300 text-sm mt-1">{habit.description}</p>
                  )}
                  <div className="flex gap-4 mt-2 text-xs text-gray-400">
                    {habit.reminder_time && (
                      <span>⏰ {habit.reminder_time}</span>
                    )}
                    <span>📅 {getDaysString(habit.days_of_week)}</span>
                    <span className="text-yellow-400">+{habit.xp_reward} XP</span>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  {!completed && (
                    <button
                      onClick={() => onComplete(habit.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                    >
                      ✓ Complete
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(habit)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(habit.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default HabitList;
