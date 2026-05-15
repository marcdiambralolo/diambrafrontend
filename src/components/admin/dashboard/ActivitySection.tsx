"use client";
import { useActivityItems } from "@/hooks/admin/dashboard/useActivityItems";
import { motion } from "framer-motion";
import { Activity, TrendingDown, TrendingUp } from "lucide-react";
import { memo } from "react";
import { Variants } from "framer-motion";

export const activityCardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const LiveBadge = memo(() => (
  <motion.div
    animate={{ scale: [1, 1.05, 1] }}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1"
  >
    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />

    <span className="text-xs font-semibold">LIVE</span>
  </motion.div>
));

const ActivityHeader = memo(() => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
      <div className="flex-shrink-0 p-2 bg-white/15 dark:bg-white/10 rounded-xl backdrop-blur-sm shadow-lg">
        <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      </div>

      <div className="min-w-0">
        <h2 className="text-base sm:text-lg font-bold text-white truncate">
          Activité du jour
        </h2>

        <p className="text-white/70 text-[10px] sm:text-xs truncate">
          Statistiques en temps réel
        </p>
      </div>
    </div>
    <LiveBadge />
  </div>
));

export interface ActivityItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  percent: string;
  trend?: number;
}

const ActivityCardItem = memo<{ item: ActivityItem; index: number }>(({ item, index }) => {
  const Icon = item.icon;
  const hasTrend = item.trend !== undefined;
  const isPositiveTrend = hasTrend && item.trend! >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.05,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ scale: 1.03, y: -2 }}
      className="
        relative overflow-hidden
        bg-white/10 dark:bg-white/5
        backdrop-blur-xl
        rounded-xl p-3 sm:p-4
        border border-white/20 dark:border-white/10
        shadow-lg shadow-black/10
        hover:shadow-xl hover:shadow-black/20
        transition-all duration-300
      "
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm">
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </div>
          <p className="text-white/90 text-[11px] sm:text-xs font-semibold uppercase tracking-wide truncate">
            {item.label}
          </p>
        </div>

        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-2xl sm:text-3xl font-bold text-white truncate leading-none mb-1">
              {item.value}
            </p>
            <p className="text-white/70 text-[10px] sm:text-xs truncate">
              {item.percent}
            </p>
          </div>

          {hasTrend && (
            <div className={`flex-shrink-0 p-1 rounded-lg ${isPositiveTrend
              ? 'bg-green-500/20 text-green-300'
              : 'bg-red-500/20 text-red-300'
              }`}>
              {isPositiveTrend ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.item.value === nextProps.item.value &&
    prevProps.item.percent === nextProps.item.percent &&
    prevProps.item.trend === nextProps.item.trend
  );
});

const ActivityBackground = memo(() => (
  <div className="absolute inset-0 opacity-10">
    <motion.div
      animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute -top-20 -right-20 w-48 h-48 bg-white rounded-full blur-3xl"
    />
  </div>
));

type DashboardStats = {
  users: { total: number; active: number; new: number; inactive: number };
  consultations: { total: number; pending: number; completed: number; revenue: number };
  payments: { pending: number; completed: number; failed: number };
};

type DerivedDashboardStats = {
  userGrowthRate?: string | number;
  consultationSuccessRate?: string | number;
  paymentSuccessRate?: string | number;
  activeUserRate?: string | number;
};

interface ActivitySectionProps {
  stats: DashboardStats;
  derivedStats: DerivedDashboardStats;
}

const ActivitySection = memo<ActivitySectionProps>(({ stats, derivedStats }) => {
  const activityItems = useActivityItems(stats, derivedStats);

  return (
    <motion.section
      variants={activityCardVariants}
      initial="hidden"
      animate="visible"
      className="relative rounded-2xl p-4 sm:p-6 text-white shadow-2xl overflow-hidden
        bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700
        dark:from-blue-600 dark:via-blue-700 dark:to-blue-900
        border border-blue-400/20 dark:border-blue-500/20"
    >
      <ActivityBackground />
      <div className="relative z-10 space-y-4">
        <ActivityHeader />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {activityItems.map((item, index) => (
            <ActivityCardItem key={`${item.label}-${index}`} item={item} index={index} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.stats === nextProps.stats &&
    prevProps.derivedStats === nextProps.derivedStats
  );
});

ActivitySection.displayName = "ActivitySection";

export default ActivitySection;