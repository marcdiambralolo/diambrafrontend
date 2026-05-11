import { useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '@/lib/api/services/notifications.service';
import { QUERY_KEYS } from '@/lib/cache/queryClient';
import type { NotificationResponse } from '@/lib/types/notification.types';

import { useAuthStore } from '@/lib/store/auth.store';

export function useNotificationsWithCache() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = Boolean(user);
  const {
    data,
    isLoading,
    error,
    refetch,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS,
    queryFn: () => notificationsService.getUnreadNotifications(),
    enabled: isAuthenticated,
    select: (data) => {
      if (!data) return { notifications: [], unreadCount: 0 };
      return {
        notifications: data.notifications || [],
        unreadCount: data.unreadCount || 0,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 min
    gcTime: 1000 * 60 * 30,   // 30 min
  });

  return {
    notifications: data?.notifications || [],
    unreadCount: data?.unreadCount || 0,
    isLoading,
    isError,
    isSuccess,
    error,
    refetch,
    fetchNotifications: refetch,
    markAsRead: async (id: string) => {
      await notificationsService.markAsRead(id);
      await queryClient.setQueryData(
        QUERY_KEYS.NOTIFICATIONS,
        (previous: NotificationResponse | undefined) => {
          if (!previous) return previous;

          const nextNotifications = previous.notifications.map((notification) =>
            notification._id === id ? { ...notification, isRead: true } : notification
          );
          const wasUnread = previous.notifications.some(
            (notification) => notification._id === id && !notification.isRead
          );

          return {
            ...previous,
            notifications: nextNotifications,
            unreadCount: wasUnread ? Math.max(0, previous.unreadCount - 1) : previous.unreadCount,
          };
        }
      );
      await refetch();
    },
    markAllAsRead: async () => {
      await notificationsService.markAllAsRead();
      await queryClient.setQueryData(
        QUERY_KEYS.NOTIFICATIONS,
        (previous: NotificationResponse | undefined) => {
          if (!previous) return previous;

          return {
            ...previous,
            notifications: previous.notifications.map((notification) => ({ ...notification, isRead: true })),
            unreadCount: 0,
          };
        }
      );
      await refetch();
    },
    deleteNotification: async (id: string) => {
      await notificationsService.deleteNotification(id);
      await queryClient.setQueryData(
        QUERY_KEYS.NOTIFICATIONS,
        (previous: NotificationResponse | undefined) => {
          if (!previous) return previous;

          const removedNotification = previous.notifications.find((notification) => notification._id === id);

          return {
            ...previous,
            notifications: previous.notifications.filter((notification) => notification._id !== id),
            unreadCount:
              removedNotification && !removedNotification.isRead
                ? Math.max(0, previous.unreadCount - 1)
                : previous.unreadCount,
            total: Math.max(0, (previous.total || previous.notifications.length) - 1),
          };
        }
      );
      await refetch();
    },
  };
}
