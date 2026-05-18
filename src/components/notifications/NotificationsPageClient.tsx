"use client";
import CacheLink from "@/components/commons/CacheLink";
import { filterOptions, useNotificationsPage } from "@/hooks/notifications/useNotificationsPage";
import { cx, formatDateFRNew } from "@/lib/functions";
import type { Notification } from "@/lib/types/notification.types";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { ArrowLeft, Bell, CheckCheck, Clock, Settings, Trash2 } from "lucide-react";
import { memo, useMemo } from "react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const scaleOnHover: Variants = {
  whileHover: { scale: 1.02, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98 }
};

const notificationIcons: Record<string, { icon: string; bg: string }> = {
  CONSULTATION_RESULT: { icon: "✨", bg: "bg-purple-100" },
  CONSULTATION_ASSIGNED: { icon: "📋", bg: "bg-blue-100" },
  PAYMENT_CONFIRMED: { icon: "💰", bg: "bg-emerald-100" },
  SYSTEM_ANNOUNCEMENT: { icon: "🔔", bg: "bg-amber-100" },
  GRADE_CHANGE: { icon: "🌟", bg: "bg-indigo-100" },
};

export const LoadingState = memo(function LoadingState() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
        <p className="mt-3 text-sm text-gray-500">Chargement des notifications...</p>
      </div>
    </div>
  );
});

export const EmptyState = memo(function EmptyState({ filter }: { filter: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <Bell className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        {filter === "all" ? "Aucune notification" : "Aucune notification pour ce filtre"}
      </h3>
      <p className="text-sm text-gray-500">
        {filter === "all"
          ? "Vous n'avez aucune notification pour le moment."
          : "Essayez de modifier le filtre pour afficher davantage d'éléments."}
      </p>
    </motion.div>
  );
});

interface NotificationCardProps {
  notification: Notification;
  onNotificationClick: (notification: Notification) => void;
  onDelete: (id: string) => void;
}

export const NotificationCard = memo(function NotificationCard({
  notification,
  onNotificationClick,
  onDelete,
}: NotificationCardProps) {
  const typeKey = String(notification.type || "SYSTEM_ANNOUNCEMENT");
  const iconInfo = notificationIcons[typeKey] ?? notificationIcons.SYSTEM_ANNOUNCEMENT;

  return (
    <motion.article
      variants={fadeInUp}
      onClick={() => onNotificationClick(notification)}
      className={cx(
        "group relative cursor-pointer rounded-xl bg-white border p-5 transition-all hover:shadow-md",
        notification.isRead ? "border-gray-100" : "border-l-4 border-l-indigo-500 border-gray-100",
      )}
    >
      <div className="flex gap-4">
        {/* Icône */}
        <div className={cx(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
          iconInfo.bg
        )}>
          <span className="text-2xl">{iconInfo.icon}</span>
        </div>

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className={cx(
                "font-semibold text-gray-900",
                !notification.isRead && "text-indigo-600"
              )}>
                {notification.title}
              </h3>
              <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                {notification.message}
              </p>
            </div>

            {/* Bouton supprimer */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(notification._id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50"
              aria-label="Supprimer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {/* Date */}
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            {formatDateFRNew(notification.createdAt)}
          </div>

          {/* Badge non lu */}
          {!notification.isRead && (
            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-indigo-500" />
              </span>
              Non lue
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
});

// ==================== NOTIFICATION LIST ====================
interface NotificationListProps {
  notifications: Notification[];
  isLoading: boolean;
  filter: string;
  onNotificationClick: (notification: Notification) => void;
  onDelete: (id: string) => void;
}

const NotificationList = memo(function NotificationList({
  notifications,
  isLoading,
  filter,
  onNotificationClick,
  onDelete,
}: NotificationListProps) {
  const items = useMemo(() => notifications ?? [], [notifications]);

  if (isLoading) return <LoadingState />;
  if (items.length === 0) return <EmptyState filter={filter} />;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      <AnimatePresence mode="popLayout">
        {items.map((notification, index) => (
          <NotificationCard
            key={notification._id + index}
            notification={notification}
            onNotificationClick={onNotificationClick}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
});

// ==================== NOTIFICATION HEADER ====================
interface NotificationHeaderProps {
  unreadCount: number;
  markAllAsRead: () => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

const NotificationHeader = memo(function NotificationHeader({
  unreadCount,
  markAllAsRead,
  showSettings,
  setShowSettings,
}: NotificationHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <CacheLink href="/star/profil">
            <motion.button
              whileHover={{ x: -2 }}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:border-indigo-200 hover:text-indigo-600"
              aria-label="Retour"
              type="button"
            >
              <ArrowLeft className="h-4 w-4" />
            </motion.button>
          </CacheLink>

          <div>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-indigo-500" />
              <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
              {unreadCount > 0 && (
                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-700">
                  {unreadCount}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              {unreadCount > 0
                ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`
                : "Toutes vos notifications sont lues"}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {unreadCount > 0 && (
            <motion.button
              {...scaleOnHover}
              onClick={markAllAsRead}
              className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 transition-all hover:bg-indigo-100"
              type="button"
            >
              <CheckCheck className="h-4 w-4" />
              Tout marquer comme lu
            </motion.button>
          )}

          <motion.button
            {...scaleOnHover}
            onClick={() => setShowSettings(!showSettings)}
            className={cx(
              "flex h-9 w-9 items-center justify-center rounded-lg transition-all",
              showSettings
                ? "bg-indigo-600 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:border-indigo-200 hover:text-indigo-600"
            )}
            type="button"
          >
            <Settings className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
});

// ==================== NOTIFICATION SETTINGS MODAL ====================
interface NotificationSettingsModalProps {
  show: boolean;
  onClose: () => void;
}

const NotificationSettingsModal = memo(function NotificationSettingsModal({
  show,
  onClose,
}: NotificationSettingsModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                <Settings className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Paramètres</h2>
                <p className="text-xs text-gray-500">Personnalisation bientôt disponible</p>
              </div>
            </div>

            <p className="text-sm text-gray-600">
              Les paramètres de notifications seront disponibles prochainement.
              Vous pourrez choisir les types de notifications à recevoir.
            </p>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-indigo-700"
                type="button"
              >
                Fermer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// ==================== FILTER BAR ====================
const FilterBar = memo(function FilterBar({
  filter,
  setFilter,
}: {
  filter: string;
  setFilter: (value: string) => void;
}) {
  return (
    <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-100 pb-4">
      {filterOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => setFilter(option.value)}
          className={cx(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
            filter === option.value
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
});

export default function NotificationsPageClient() {
  const {
    filter, filteredNotifications, showSettings, isLoading, unreadCount,
    setFilter, markAllAsRead, setShowSettings, handleNotificationClick, handleDelete,
  } = useNotificationsPage();

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <NotificationHeader
          unreadCount={unreadCount}
          markAllAsRead={markAllAsRead}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
        />

        <FilterBar filter={filter} setFilter={setFilter} />

        <NotificationList
          notifications={filteredNotifications}
          isLoading={isLoading}
          filter={filter}
          onNotificationClick={handleNotificationClick}
          onDelete={handleDelete}
        />
      </div>

      <NotificationSettingsModal
        show={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </main>
  );
}