import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API
export const createUser = (userData) => api.post('/users/', userData);
export const getUser = (userId) => api.get(`/users/${userId}`);
export const getUserStats = (userId) => api.get(`/users/${userId}/stats`);

// Habits API
export const createHabit = (habitData, userId) =>
  api.post(`/habits/?user_id=${userId}`, habitData);
export const getHabits = (userId, activeOnly = true) =>
  api.get(`/habits/?user_id=${userId}&active_only=${activeOnly}`);
export const updateHabit = (habitId, habitData) =>
  api.put(`/habits/${habitId}`, habitData);
export const deleteHabit = (habitId) =>
  api.delete(`/habits/${habitId}`);
export const completeHabit = (habitId, userId, date = null) =>
  api.post(`/habits/complete?user_id=${userId}`, { habit_id: habitId, date });
export const getCompletions = (userId, limit = 100) =>
  api.get(`/habits/completions/?user_id=${userId}&limit=${limit}`);

export default api;
