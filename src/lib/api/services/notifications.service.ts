import apiClient from '../client';
import type { NotificationResponse, NotificationPreferences } from '@/lib/types/notification.types';

export const notificationsService = {
  /**
   * Récupère toutes les notifications de l'utilisateur avec pagination
   */
  async getNotifications(page: number = 1, limit: number = 20, isRead?: boolean): Promise<NotificationResponse> {
    const params: Record<string, unknown> = { page, limit };
    if (typeof isRead === 'boolean') {
      params.isRead = isRead;
    }
    const response = await apiClient.get<NotificationResponse>('/notifications', { params });
    return response.data;
  },

  /**
   * Récupère uniquement les notifications non lues
   */
  async getUnreadNotifications(): Promise<NotificationResponse> {
    return this.getNotifications(1, 20, false);
  },

  /**
   * Récupère le nombre de notifications non lues
   */
  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<number>('/notifications/unread/count');
    return response.data;
  },

  /**
   * Marque une notification comme lue
   */
  async markAsRead(notificationId: string): Promise<void> {
    await apiClient.patch(`/notifications/${notificationId}/read`);
  },

  /**
   * Marque toutes les notifications comme lues
   */
  async markAllAsRead(): Promise<{ message: string; modifiedCount: number }> {
    const response = await apiClient.post<{ message: string; modifiedCount: number }>('/notifications/mark-all-read');
    return response.data;
  },

  /**
   * Supprime une notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    await apiClient.delete(`/notifications/${notificationId}`);
  },

  /**
   * Supprime toutes les notifications lues
   */
  async deleteAllRead(): Promise<{ message: string; deletedCount: number }> {
    const response = await apiClient.delete<{ message: string; deletedCount: number }>('/notifications/read/all');
    return response.data;
  },

  /**
   * Récupère les préférences de notification (à implémenter côté backend si nécessaire)
   */
  async getPreferences(): Promise<NotificationPreferences> {
    // Pour l'instant, retourner des valeurs par défaut
    // Peut être implémenté côté backend plus tard
    return {
      consultationReady: true,
      newKnowledge: true,
      systemUpdates: true,
      promotions: false,
      emailNotifications: true,
      pushNotifications: false,
    };
  },

  /**
   * Met à jour les préférences de notification (à implémenter côté backend si nécessaire)
   */
  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    // À implémenter côté backend
    return { ...await this.getPreferences(), ...preferences };
  },
};
