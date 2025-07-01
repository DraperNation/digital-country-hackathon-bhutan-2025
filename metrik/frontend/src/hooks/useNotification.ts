import { useState, useCallback } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  description?: string;
}

export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((type: NotificationType, message: string, description?: string) => {
    const id = Math.random().toString(36).substring(7);
    const notification: Notification = {
      id,
      type,
      message,
      description,
    };

    setNotifications(prev => [...prev, notification]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const success = useCallback((message: string, description?: string) => {
    addNotification('success', message, description);
  }, [addNotification]);

  const error = useCallback((message: string, description?: string) => {
    addNotification('error', message, description);
  }, [addNotification]);

  const info = useCallback((message: string, description?: string) => {
    addNotification('info', message, description);
  }, [addNotification]);

  const warning = useCallback((message: string, description?: string) => {
    addNotification('warning', message, description);
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    info,
    warning,
  };
} 