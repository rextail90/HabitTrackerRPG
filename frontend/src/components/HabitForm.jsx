import React, { useState, useEffect } from 'react';

const HabitForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    reminder_time: '',
    days_of_week: [0, 1, 2, 3, 4, 5, 6],
    xp_reward: 10,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        reminder_time: initialData.reminder_time || '',
        days_of_week: initialData.days_of_week || [0, 1, 2, 3, 4, 5, 6],
        xp_reward: initialData.xp_reward || 10,
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleDay = (day) => {
    setFormData(prev => ({
      ...prev,
      days_of_week: prev.days_of_week.includes(day)
        ? prev.days_of_week.filter(d => d !== day)
        : [...prev.days_of_week, day].sort()
    }));
  };

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-4">
        {initialData ? '✏️ Edit Habit' : '➕ Create New Habit'}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-2">Habit Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Make my bed"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Why is this habit important?"
            rows="3"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Reminder Time</label>
          <input
            type="time"
            value={formData.reminder_time}
            onChange={(e) => setFormData({ ...formData, reminder_time: e.target.value })}
            className="w-full bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Days of the Week</label>
          <div className="flex gap-2 flex-wrap">
            {dayNames.map((day, index) => (
              <button
                key={index}
                type="button"
                onClick={() => toggleDay(index)}
                className={`px-3 py-2 rounded font-semibold transition ${
                  formData.days_of_week.includes(index)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">XP Reward</label>
          <input
            type="number"
            value={formData.xp_reward}
            onChange={(e) => setFormData({ ...formData, xp_reward: parseInt(e.target.value) })}
            className="w-full bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max="100"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded transition"
          >
            {initialData ? 'Update Habit' : 'Create Habit'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded transition"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default HabitForm;
