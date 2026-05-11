'use client';
import { memo } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'blue' | 'green' | 'orange' | 'red';
  onClick?: () => void;
}

const colorClasses = {
  blue: {
    gradient: 'from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-100 dark:border-blue-900/30',
    shadow: 'shadow-blue-100 dark:shadow-blue-900/20'
  },
  green: {
    gradient: 'from-green-500 to-green-600 dark:from-green-600 dark:to-green-700',
    bg: 'bg-green-50 dark:bg-green-950/30',
    border: 'border-green-100 dark:border-green-900/30',
    shadow: 'shadow-green-100 dark:shadow-green-900/20'
  },
  orange: {
    gradient: 'from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    border: 'border-orange-100 dark:border-orange-900/30',
    shadow: 'shadow-orange-100 dark:shadow-orange-900/20'
  },
  red: {
    gradient: 'from-red-500 to-red-600 dark:from-red-600 dark:to-red-700',
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-100 dark:border-red-900/30',
    shadow: 'shadow-red-100 dark:shadow-red-900/20'
  }
};

export const StatCard = memo<StatCardProps>(({ title, value, icon: Icon, trend, color, onClick }) => {
  const colors = colorClasses[color];

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative overflow-hidden rounded-2xl p-4 sm:p-5
        bg-white dark:bg-[#0F1C3F]/70
        backdrop-blur-sm
        border ${colors.border}
        shadow-lg ${colors.shadow}
        hover:shadow-xl transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
      `}
      onClick={onClick}
    >
      <div className={`absolute inset-0 opacity-5 dark:opacity-10 bg-gradient-to-br ${colors.gradient}`} />
      
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 truncate">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2 truncate">
            {value}
          </p>

          {trend && (
            <div className="flex items-center gap-1.5">
              {trend.isPositive ? (
                <TrendingUp className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              )}
              <span className={`text-xs sm:text-sm font-semibold ${
                trend.isPositive 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {Math.abs(trend.value).toFixed(1)}%
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-500">
                vs hier
              </span>
            </div>
          )}
        </div>

        <motion.div 
          className={`flex-shrink-0 p-2.5 sm:p-3 rounded-xl bg-gradient-to-br ${colors.gradient} shadow-lg`}
          whileHover={{ rotate: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </motion.div>
      </div>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.title === nextProps.title
  );
});

StatCard.displayName = 'StatCard';