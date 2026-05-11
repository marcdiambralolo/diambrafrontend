import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '@/lib/api/services/notifications.service';
import type { Notification } from '@/lib/types/notification.types';
import { useRouter } from 'next/navigation';

export const filterOptions: { value: string; label: string }[] = [
  { value: 'all', label: 'Toutes' },
  { value: 'unread', label: 'Non lues' },
  { value: 'CONSULTATION_RESULT', label: 'Résultats' },
  { value: 'PAYMENT_CONFIRMED', label: 'Paiements' },
  { value: 'SYSTEM_ANNOUNCEMENT', label: 'Annonces système' },
];

export function useNotificationsPage({ page = 1, limit = 20, filter: initialFilter = 'all' } = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>(initialFilter);
  const [showSettings, setShowSettings] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['notifications', page, limit, filter],
    queryFn: () => notificationsService.getNotifications(page, limit, filter === 'unread' ? false : undefined),
    placeholderData: (prev) => prev,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) => notificationsService.markAsRead(notificationId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationsService.markAllAsRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
  const deleteNotificationMutation = useMutation({
    mutationFn: (notificationId: string) => notificationsService.deleteNotification(notificationId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsReadMutation.mutateAsync(notification._id);
    }
    let url = '';
    if (notification.metadata?.url) {
      url = notification.metadata.url.startsWith('/star') ? notification.metadata.url : `/star${notification.metadata.url.startsWith('/') ? '' : '/'}${notification.metadata.url}`;
    } else if (
      (notification.type === 'CONSULTATION_RESULT' || notification.type === 'CONSULTATION_ASSIGNED') &&
      notification.metadata?.consultationId
    ) {
      url = `/star/consultations/${notification.metadata.consultationId}`;
    }
    if (url) {
      router.push(url);
    }
  };

  const handleDelete = async (notificationId: string) => {
    await deleteNotificationMutation.mutateAsync(notificationId);
  };

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  // Ajout de la propriété filteredNotifications pour compatibilité avec l'appelant
  const filteredNotifications = notifications;

  return {
    filter,
    notifications,
    filteredNotifications,
    unreadCount,
    isLoading,
    isError,
    error,
    setFilter,
    markAllAsRead: markAllAsReadMutation.mutateAsync,
    setShowSettings,
    showSettings,
    handleNotificationClick,
    handleDelete,
    refetch,
    // Pagination désactivée : NotificationResponse ne fournit pas page ni totalPages
    limit,
  };
}