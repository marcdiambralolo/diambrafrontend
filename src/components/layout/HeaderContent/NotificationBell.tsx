'use client';
import CacheLink from '@/components/commons/CacheLink';
import { useNotificationsWithCache } from '@/hooks/cache/useNotificationsWithCache';
import { prefetchConsultationFrontData, prefetchRouteData } from '@/lib/cache/route-prefetch';
import type { Notification } from '@/lib/types/notification.types';
import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, CheckCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNotificationSound } from '@/hooks/notifications/useNotificationSound';

const notificationIcons: Record<string, string> = {
  CONSULTATION_RESULT: '✨',
  NEW_KNOWLEDGE: '📚',
  CONSULTATION_ASSIGNED: '📋',
  PAYMENT_CONFIRMED: '💳',
  SYSTEM_ANNOUNCEMENT: '🔔',
  GRADE_CHANGE: '🌟',
};

const notificationColors: Record<string, string> = {
  CONSULTATION_RESULT: 'from-[#2E5AA6]/20 to-[#4F83D1]/20',
  NEW_KNOWLEDGE: 'from-blue-500/20 to-cyan-500/20',
  CONSULTATION_ASSIGNED: 'from-green-500/20 to-emerald-500/20',
  PAYMENT_CONFIRMED: 'from-amber-500/20 to-orange-500/20',
  SYSTEM_ANNOUNCEMENT: 'from-gray-500/20 to-slate-500/20',
  GRADE_CHANGE: 'from-yellow-400/30 to-[#4F83D1]/30',
};

export default function NotificationBell() {
  // Hook pour jouer le son de notification
  const playNotificationSound = useNotificationSound('/notification.mp3');


  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsProps = useNotificationsWithCache();
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  } = notificationsProps;

  // Référence pour suivre les IDs des notifications déjà vues
  const lastSeenIdsRef = useRef<string[]>([]);

  useEffect(() => {
    // On ne joue le son que si une nouvelle notification non lue arrive
    if (!notifications || notifications.length === 0) {
      lastSeenIdsRef.current = [];
      return;
    }
    const unread = notifications.filter((n) => !n.isRead);
    const lastSeen = lastSeenIdsRef.current;
    // Détecte si une nouvelle notification non lue est arrivée
    const newUnread = unread.filter((n) => !lastSeen.includes(n._id));
    if (newUnread.length > 0) {
      playNotificationSound();
    }
    // Met à jour la liste des notifications non lues
    lastSeenIdsRef.current = unread.map((n) => n._id);
  }, [notifications, playNotificationSound]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const prefetchNotificationTarget = useCallback((notification: Notification) => {
    if (notification.type === 'CONSULTATION_RESULT' && notification.metadata?.consultationId) {
      const href = `/star/consultations/${notification.metadata.consultationId}`;
      void router.prefetch(href);
      void prefetchConsultationFrontData(queryClient, notification.metadata.consultationId);
      return;
    }

    if (notification.metadata?.url) {
      void router.prefetch(notification.metadata.url);
      void prefetchRouteData(queryClient, notification.metadata.url, true);
    }
  }, [queryClient, router]);

  const handleNotificationClick = async (notification: Notification) => {
    setIsOpen(false); // Ferme la popover dès le clic
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }

    if (notification.type === 'CONSULTATION_RESULT' && notification.metadata?.consultationId) {
      prefetchNotificationTarget(notification);
      router.push(`/star/consultations/${notification.metadata.consultationId}`);
      return;
    }
    if (notification.metadata?.url) {
      prefetchNotificationTarget(notification);
      router.push(notification.metadata.url);
    }
  };

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await markAllAsRead();
  };

  if (!hasHydrated || !true) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-xl p-2 transition-colors duration-200 hover:bg-[#162A56]/80 focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6 text-[#4F83D1]" />

        {hasHydrated && true && unreadCount > 0 && (
          <motion.span
            initial={false}
            animate={{ scale: 1 }}
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] text-xs font-bold text-white shadow-lg"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 max-h-[600px] bg-gradient-to-br from-[#0F1C3F]/95 to-[#162A56]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#1C3A6B] overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-[#1C3A6B] flex items-center justify-between bg-[#0F1C3F]">
              <CacheLink
                href="/star/notifications"
                className="hover:underline focus:underline"
              >
                <h3 className="text-white font-semibold">
                  Notifications {true && unreadCount > 0 && `(${unreadCount})`}
                </h3>
              </CacheLink>
              {true && unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 text-xs text-[#9BC2FF] transition-colors hover:text-[#4F83D1]"
                >
                  <CheckCheck className="w-4 h-4" />
                  Tout marquer comme lu
                </button>
              )}
            </div>

            {/* Liste des notifications */}
            <div className="overflow-y-auto max-h-[500px] custom-scrollbar bg-[#0F1C3F]">
              {!true ? (
                <div className="p-8 text-center text-[#4F83D1]">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Connectez-vous pour voir vos notifications</p>
                </div>
              ) : isLoading ? (
                <div className="p-8 text-center text-[#4F83D1]">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-[#4F83D1]"></div>
                  <p className="mt-2">Chargement...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-[#4F83D1]">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Aucune notification</p>
                </div>
              ) : (
                <div className="divide-y divide-[#1C3A6B]">
                  {notifications.map((notification: Notification) => (
                    <motion.div
                      key={notification._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onMouseEnter={() => prefetchNotificationTarget(notification)}
                      onFocus={() => prefetchNotificationTarget(notification)}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 cursor-pointer transition-all duration-200 rounded-xl hover:bg-[#162A56]/80 ${!notification.isRead ? 'bg-[#162A56]/60 border border-[#2E5AA6]' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icône */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${notificationColors[notification.type] || 'from-[#2E5AA6]/20 to-[#4F83D1]/20'} flex items-center justify-center text-xl shadow-md`}>
                          {notificationIcons[notification.type] || '🔔'}
                        </div>

                        {/* Contenu */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={`text-sm font-medium ${notification.isRead ? 'text-[#D1D5DB]' : 'text-white'}`}>
                              {notification.title}
                            </h4>

                            <div className="flex items-center gap-1 flex-shrink-0">
                              {!notification.isRead && (
                                <div className="h-2 w-2 rounded-full bg-[#4F83D1]"></div>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-[#E5E7EB] mt-1 line-clamp-2">
                            {notification.message}
                          </p>

                          <p className="text-xs text-[#9BC2FF] mt-2">
                            {new Date(notification.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {true && notifications.length > 0 && (
              <div className="px-4 py-3 border-t border-[#1C3A6B] bg-[#0F1C3F]">
                <CacheLink
                  href="/star/notifications"
                  className="block text-center text-sm text-[#9BC2FF] transition-colors hover:text-[#4F83D1]"
                >
                  Voir toutes les notifications
                </CacheLink>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(46, 90, 166, 0.08);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(79, 131, 209, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(79, 131, 209, 0.7);
        }
      `}</style>
    </div>
  );
}