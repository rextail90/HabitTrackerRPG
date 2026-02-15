import React from 'react';

const Character = ({ stats }) => {
  const progressPercentage = stats ? (stats.xp / stats.xp_to_next_level) * 100 : 0;

  if (!stats) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg p-6 shadow-xl border-2 border-yellow-500">
      <h2 className="text-3xl font-bold text-yellow-400 mb-4">⚔️ Your Hero</h2>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white text-xl font-semibold">Level {stats.level}</span>
          <span className="text-yellow-300">{stats.xp} / {stats.xp_to_next_level} XP</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-black bg-opacity-30 rounded p-3">
          <div className="text-2xl font-bold text-green-400">{stats.total_habits}</div>
          <div className="text-xs text-gray-300">Active Habits</div>
        </div>
        <div className="bg-black bg-opacity-30 rounded p-3">
          <div className="text-2xl font-bold text-blue-400">{stats.completed_today}</div>
          <div className="text-xs text-gray-300">Today</div>
        </div>
        <div className="bg-black bg-opacity-30 rounded p-3">
          <div className="text-2xl font-bold text-orange-400">{stats.current_streak}</div>
          <div className="text-xs text-gray-300">Day Streak</div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <div className="text-sm text-purple-300">Total XP: {stats.total_xp}</div>
      </div>
    </div>
  );
};

export default Character;
