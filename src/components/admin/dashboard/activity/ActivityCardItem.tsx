"use client";
import { motion } from "framer-motion";
import { memo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

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
      {/* Gradient overlay */}
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

ActivityCardItem.displayName = "ActivityCardItem";

export default ActivityCardItem;