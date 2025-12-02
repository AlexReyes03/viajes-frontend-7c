import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import { notificationAPI } from '../services/notificationService';

export function useNotifications() {
  const { lastMessage } = useWebSocket();
  const [allNotifications, setAllNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar notificaciones iniciales desde API
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationAPI.getAll();
      setAllNotifications(data);

      // Calcular contador de no leídas
      const unreadCounter = data.filter(n => !n.read).length;
      setUnreadCount(unreadCounter);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar notificaciones al montar el componente
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Escuchar nuevas notificaciones del WebSocket
  useEffect(() => {
    if (lastMessage && lastMessage.type === 'NOTIFICATION') {
      const newNotification = lastMessage.data;

      // Evitar duplicados
      setAllNotifications(prev => {
        const exists = prev.find(n => n.id === newNotification.id);
        if (exists) return prev;
        return [newNotification, ...prev];
      });

      // Incrementar contador si no está leída
      if (!newNotification.read) {
        setUnreadCount(prev => prev + 1);
      }

      // Opcional: Mostrar notificación del navegador
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(newNotification.title, {
          body: newNotification.body,
          icon: '/favicon.ico'
        });
      }
    }
  }, [lastMessage]);

  // Marcar como leída
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);

      // Actualizar estado local
      setAllNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
      throw err;
    }
  }, []);

  // Marcar todas como leídas
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationAPI.markAllAsRead();

      // Actualizar estado local
      setAllNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
      throw err;
    }
  }, []);

  // Eliminar notificación
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await notificationAPI.delete(notificationId);

      // Actualizar estado local
      const wasUnread = allNotifications.find(n => n.id === notificationId)?.read === false;
      setAllNotifications(prev => prev.filter(n => n.id !== notificationId));

      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
      throw err;
    }
  }, [allNotifications]);

  // Filtros
  const unreadNotifications = allNotifications.filter(n => !n.read);
  const readNotifications = allNotifications.filter(n => n.read);

  return {
    notifications: allNotifications,
    unreadNotifications,
    readNotifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: fetchNotifications
  };
}
