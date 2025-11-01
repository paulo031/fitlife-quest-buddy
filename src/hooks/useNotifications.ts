import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [enabled, setEnabled] = useLocalStorage('fitlife-notifications-enabled', false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        setEnabled(true);
      }
      return result;
    }
    return 'denied';
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (enabled && permission === 'granted') {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });
    }
  };

  const scheduleDailyReminder = () => {
    if (!enabled || permission !== 'granted') return;

    const now = new Date();
    const reminderTime = new Date();
    reminderTime.setHours(9, 0, 0, 0); // 9 AM

    if (now > reminderTime) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const timeUntilReminder = reminderTime.getTime() - now.getTime();

    setTimeout(() => {
      sendNotification('💪 Hora do treino!', {
        body: 'Você consegue hoje! Vamos começar sua rotina de exercícios.',
        tag: 'daily-reminder',
      });
      scheduleDailyReminder(); // Reschedule for next day
    }, timeUntilReminder);
  };

  const toggleNotifications = async () => {
    if (!enabled) {
      const result = await requestPermission();
      if (result === 'granted') {
        scheduleDailyReminder();
      }
    } else {
      setEnabled(false);
    }
  };

  useEffect(() => {
    if (enabled && permission === 'granted') {
      scheduleDailyReminder();
    }
  }, [enabled, permission]);

  return {
    permission,
    enabled,
    requestPermission,
    sendNotification,
    toggleNotifications,
  };
}
