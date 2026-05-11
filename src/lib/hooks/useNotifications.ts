'use client';
import { useState, useEffect, useCallback } from 'react';
import { notificationsService } from '@/lib/api/services';
import { useAuth } from '@/lib/hooks/useAuth';
import { logger } from '@/lib/utils/logger';
import type { Notification } from '@/lib/types/notification.types';

export function useNotifications(pollingInterval: number = 300000) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Pour jouer le son lors d'une nouvelle notification
  const playNotificationSound = () => {
    if (typeof window !== 'undefined') {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(() => {});
    }
  };

  const fetchNotifications = useCallback(async () => {
    try {
      setError(null);
      const data = await notificationsService.getUnreadNotifications();
      // Détecter si une nouvelle notification est arrivée
      setNotifications(prev => {
        // Si on a déjà des notifications, et qu'il y en a plus qu'avant, jouer le son
        if (prev.length > 0 && data.notifications.length > prev.length) {
          playNotificationSound();
        }
        return data.notifications;
      });
      setUnreadCount(data.unreadCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des notifications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationsService.markAsRead(notificationId);
      setNotifications(prev => prev.map(n =>
        n._id === notificationId ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      logger.error('Erreur lors du marquage de la notification:', err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      logger.error('Erreur lors du marquage de toutes les notifications:', err);
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      await notificationsService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      const notification = notifications.find(n => n._id === notificationId);
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      logger.error('Erreur lors de la suppression de la notification:', err);
    }
  }, [notifications]);

  // Polling pour récupérer les nouvelles notifications
  // ⚠️ Ne fetcher QUE si utilisateur connecté
  useEffect(() => {
    // Attendre que l'auth soit chargé et que l'utilisateur soit connecté
    if (authLoading) {
      return; // Attendre que l'auth finisse de charger
    }

    if (!isAuthenticated) {
      // Pas connecté, ne rien fetcher
      setIsLoading(false);
      return;
    }

    // Utilisateur connecté, lancer le polling
    fetchNotifications();

    if (pollingInterval > 0) {
      const interval = setInterval(fetchNotifications, pollingInterval);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, authLoading, fetchNotifications, pollingInterval]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}