import { useEffect } from 'react';

const NotificationManager = ({ habits, enabled }) => {
  useEffect(() => {
    if (!enabled || !('Notification' in window)) {
      return;
    }

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Check for habits that need reminders
    const checkReminders = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const currentDay = (now.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0

      habits.forEach(habit => {
        if (
          habit.reminder_time &&
          habit.reminder_time.startsWith(currentTime) &&
          (habit.days_of_week.length === 0 || habit.days_of_week.includes(currentDay))
        ) {
          showNotification(habit);
        }
      });
    };

    const showNotification = (habit) => {
      if (Notification.permission === 'granted') {
        new Notification('Habit Reminder! ⚔️', {
          body: `Time to: ${habit.name}`,
          icon: '/vite.svg',
          tag: `habit-${habit.id}`,
        });
      }
    };

    // Check every minute
    const interval = setInterval(checkReminders, 60000);

    // Initial check
    checkReminders();

    return () => clearInterval(interval);
  }, [habits, enabled]);

  return null;
};

export default NotificationManager;
