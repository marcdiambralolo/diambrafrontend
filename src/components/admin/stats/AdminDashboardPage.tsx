"use client";
import { REPORT_TABS } from '@/hooks/admin/dashboard/useAdminReportsPage';
import { DATE_RANGES, DateRangeType, ReportType, useAdminDashboardPage } from '@/hooks/admin/stats/useAdminDashboardPage';
import { DateRange, ReportMetric } from '@/lib/interfaces';
import { motion, Variants } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Activity, AlertCircle, BarChart3, Calendar, Download, Filter, RefreshCw, Sparkles, TrendingDown, TrendingUp } from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { memo, useCallback, useState } from 'react';

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1,
    },
  },
};

interface ReportsTabsProps {
  selectedReport: ReportType;
  setSelectedReport: (v: ReportType) => void;
  REPORT_TABS: { value: ReportType; label: string }[];
}

const ReportsTabs: React.FC<ReportsTabsProps> = ({ selectedReport, setSelectedReport, REPORT_TABS }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2 }}
    className="border-b border-slate-200 dark:border-slate-700"
  >
    <div className="flex gap-1 overflow-x-auto scrollbar-hide">
      {REPORT_TABS.map((tab) => (
        <motion.button
          key={tab.value}
          whileHover={{ y: -2 }}
          onClick={() => setSelectedReport(tab.value)}
          className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap flex-shrink-0 ${selectedReport === tab.value
            ? 'border-cosmic-indigo text-cosmic-indigo dark:text-cosmic-pink'
            : 'border-transparent text-cosmic-purple dark:text-cosmic-pink/60 hover:text-cosmic-indigo dark:hover:text-cosmic-pink'
            }`}
        >
          {tab.label}
        </motion.button>
      ))}
    </div>
  </motion.div>
);

interface ReportsMetricsGridProps {
  metrics: ReportMetric[];
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.05, type: 'spring', stiffness: 200, damping: 20 }
  })
};

const ReportsMetricsGrid: React.FC<ReportsMetricsGridProps> = ({ metrics }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
    {metrics.map((metric, index) => {
      const isPositive = metric.change >= 0;
      return (
        <motion.div
          key={index}
          custom={index}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-5 transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{metric.label}</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1 truncate">{metric.value}</p>
              {metric.subLabel && (
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">{metric.subLabel}</p>
              )}
              <div className="flex items-center gap-1 mt-2">
                {isPositive ? (
                  <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-600 flex-shrink-0" />
                ) : (
                  <TrendingDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-600 flex-shrink-0" />
                )}
                <p className={`text-[10px] sm:text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>{isPositive ? '+' : ''}{metric.change}%</p>
                <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">ce mois</span>
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${metric.color} text-white shadow-lg flex-shrink-0`}
            >
              <div className="w-4 h-4 sm:w-5 sm:h-5">{metric.icon}</div>
            </motion.div>
          </div>
        </motion.div>
      );
    })}
  </div>
);

const DateRangeButton = memo(({ range, isActive, onClick }: { range: DateRange; isActive: boolean; onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`
      relative px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap flex-shrink-0
      transition-all duration-300 overflow-hidden group
      ${isActive
        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
        : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
      }
    `}
  >
    {isActive && (
      <motion.div
        layoutId="activeDateRange"
        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600"
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    )}
    <span className="relative z-10 flex items-center gap-2">
      {range.icon && <span className="text-base">{range.icon}</span>}
      {range.label}
    </span>
  </motion.button>
));

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  variant?: 'outline' | 'primary';
  onClick?: () => void;
  loading?: boolean;
}

const ActionButton = memo(({ icon: Icon, label, variant = 'outline', onClick, loading = false }: ActionButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    disabled={loading}
    className={`
      group relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm
      transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden
      ${variant === 'primary'
        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500'
      }
      ${loading ? 'opacity-70 cursor-not-allowed' : ''}
    `}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
    {loading ? (
      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    ) : (
      <Icon className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform" />
    )}
    <span className="relative z-10 hidden sm:inline">{label}</span>
  </motion.button>
));

interface ReportsHeaderProps {
  dateRange: DateRangeType;
  setDateRange: (v: DateRangeType) => void;
  dateRanges: DateRange[];
  onExport?: () => void;
  onFilter?: () => void;
  total?: number;
  trend?: number;
}

const ReportsHeader = memo<ReportsHeaderProps>(({
  dateRange,
  setDateRange,
  dateRanges,
  onExport,
  onFilter,
  total = 0,
  trend = 0
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleDateRangeChange = useCallback((value: DateRangeType) => {
    setDateRange(value);
  }, [setDateRange]);

  const handleExport = useCallback(async () => {
    if (onExport && !isExporting) {
      setIsExporting(true);
      await onExport();
      setIsExporting(false);
    }
  }, [onExport, isExporting]);

  const isPositiveTrend = trend >= 0;

  return (
    <div className="space-y-6">
      {(total > 0 || trend !== 0) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-2xl border border-purple-100 dark:border-purple-800"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Période sélectionnée</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {dateRanges.find(r => r.value === dateRange)?.label || dateRange}
              </p>
            </div>
          </div>

          {total > 0 && (
            <div className="flex items-center gap-3 px-4 border-l border-r border-purple-200 dark:border-purple-800">
              <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total des consultations</p>
                <p className="text-lg font-black text-gray-900 dark:text-white">{total.toLocaleString()}</p>
              </div>
            </div>
          )}

          {trend !== 0 && (
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPositiveTrend ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-red-100 dark:bg-red-900/40'}`}>
                {isPositiveTrend ? <TrendingUp className="w-5 h-5 text-emerald-600" /> : <TrendingDown className="w-5 h-5 text-red-600" />}
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Tendance</p>
                <p className={`text-sm font-bold ${isPositiveTrend ? 'text-emerald-600' : 'text-red-600'}`}>
                  {isPositiveTrend ? '+' : ''}{trend}%
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Sélecteurs de période et actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {dateRanges.map((range) => (
            <DateRangeButton
              key={range.value}
              range={range}
              isActive={dateRange === range.value}
              onClick={() => handleDateRangeChange(range.value as DateRangeType)}
            />
          ))}
        </div>

        <div className="flex gap-3">
          <ActionButton
            icon={Filter}
            label="Filtrer"
            variant="outline"
            onClick={onFilter}
          />
          <ActionButton
            icon={Download}
            label="Exporter"
            variant="primary"
            onClick={handleExport}
            loading={isExporting}
          />
        </div>
      </div>
    </div>
  );
});

type ReportsStats = {
  consultations: { completed: number };
  payments: { completed: number };
  users: { new: number };
};

interface ReportsActivityProps {
  stats: ReportsStats | null | undefined;
}

const ReportsActivity: React.FC<ReportsActivityProps> = ({ stats }) => {
  if (!stats) return null;
  const activities = [
    {
      type: 'consultation',
      user: 'Jeux',
      action: `${stats.consultations.completed} complétées`,
      time: 'Actuel'
    },
    {
      type: 'payment',
      user: 'Paiements',
      action: `${stats.payments.completed} traités`,
      time: 'Actuel'
    },
    {
      type: 'registration',
      user: 'Utilisateurs',
      action: `${stats.users.new} nouveaux`,
      time: 'Actuel'
    },
  ];
  const getColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'bg-blue-500';
      case 'payment': return 'bg-green-500';
      case 'registration': return 'bg-[#2E5AA6]';
      default: return 'bg-slate-500';
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-lg"
    >
      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
        Activité Récente
      </h2>
      <div className="space-y-1 sm:space-y-2">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between py-2.5 sm:py-3 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors rounded-lg px-2"
          >
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <motion.div
                whileHover={{ scale: 1.2 }}
                className={`w-2 h-2 rounded-full ${getColor(activity.type)} flex-shrink-0`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">{activity.user}</p>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">{activity.action}</p>
              </div>
            </div>
            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">{activity.time}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const LoadingState = memo(() => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#070B1A] dark:via-[#0F1C3F] dark:to-[#070B1A]">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 90, 180, 270, 360],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-[#4F83D1]/10 to-[#9BC2FF]/10 blur-3xl dark:from-[#21457F]/10 dark:via-[#2E5AA6]/8 dark:to-[#4F83D1]/6"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6"
      >
        <motion.div className="relative mb-6 sm:mb-8">
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-[#2E5AA6] via-[#4F83D1] to-[#9BC2FF] blur-2xl"
          />

          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#2E5AA6] via-[#4F83D1] to-[#9BC2FF] p-[3px]">
              <div className="h-full w-full rounded-full bg-white dark:bg-[#0F1C3F]" />
            </div>
          </motion.div>
          <motion.div
            animate={{
              scale: [0.9, 1.1, 0.9],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 dark:text-blue-400" />
          </motion.div>
        </motion.div>

        < div
          className="
            backdrop-blur-xl 
            bg-white/80 dark:bg-[#0F1C3F]/80 
            rounded-2xl px-6 py-5 sm:px-8 sm:py-6
            shadow-2xl 
            border border-slate-200/50 dark:border-[color:var(--theme-border)]
            text-center max-w-sm w-full
          "
        >
          <h2 className="mb-2 bg-gradient-to-r from-[#2E5AA6] via-[#4F83D1] to-[#9BC2FF] bg-clip-text text-lg font-bold text-transparent sm:text-xl">
            Chargement du tableau de bord
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mb-4">
            Préparation de vos statistiques...
          </p>

          <div className="flex items-center justify-center gap-1.5">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: index * 0.15,
                  ease: 'easeInOut',
                }}
                className="h-2 w-2 rounded-full bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1]"
              />
            ))}
          </div>
        </ div>
      </motion.div>
    </div>
  );
});

interface RefreshBannerProps {
  isRefreshing: boolean;
  loading: boolean;
  show: boolean;
}

const RefreshBanner = memo<RefreshBannerProps>(({ isRefreshing, loading, show }) => {
  if (!show) return null;

  const isBusy = isRefreshing || loading;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="
        relative overflow-hidden
        bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600
        dark:from-amber-600 dark:via-orange-600 dark:to-orange-700
        text-white rounded-2xl p-3 sm:p-4
        shadow-xl shadow-amber-500/30
        border border-amber-400/20
      "
    >
      <motion.div
        animate={{
          x: [-200, 200],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />

      <div className="relative flex items-center justify-center gap-2 sm:gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: isBusy ? 1.5 : 2.5, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.div>

        <span className="text-xs sm:text-sm font-semibold tracking-wide">
          Actualisation des données en cours
        </span>

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </motion.div>
      </div>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  return prevProps.show === nextProps.show && prevProps.isRefreshing === nextProps.isRefreshing;
});

interface ErrorStateProps {
  error: string | null;
  isRefreshing: boolean;
  onRetry: () => void;
}

const ErrorState = memo<ErrorStateProps>(({ error, isRefreshing, onRetry }) => {

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="
          text-center max-w-md w-full 
          bg-white dark:bg-slate-900/50 
          backdrop-blur-xl
          rounded-3xl shadow-2xl 
          border border-slate-200 dark:border-slate-700
          p-6 sm:p-8
        "
      >
        <motion.div
          animate={{
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut"
          }}
          className="inline-flex p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 mb-4"
        >
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 dark:text-red-400" />
        </motion.div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Erreur de chargement
        </h2>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          {error || 'Impossible de charger les statistiques'}
        </p>

        <motion.button
          onClick={onRetry}
          disabled={isRefreshing}
          whileHover={!isRefreshing ? { scale: 1.02 } : {}}
          whileTap={!isRefreshing ? { scale: 0.98 } : {}}
          className="
            w-full px-6 py-3.5 
            bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600
            text-white rounded-xl 
            font-semibold text-sm sm:text-base
            shadow-lg shadow-amber-500/30
            hover:shadow-xl hover:shadow-amber-500/40
            transition-all duration-300
            flex items-center justify-center gap-2
            disabled:opacity-50 disabled:cursor-not-allowed
            disabled:hover:scale-100
          "
        >
          <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Chargement...' : 'Réessayer'}</span>
        </motion.button>
      </motion.div>
    </div>
  );
});

interface AdminHeaderProps {
  lastUpdated?: string;
  isRefreshing: boolean;
  loading: boolean;
  onRefresh: () => void;
}

const AdminHeader = memo<AdminHeaderProps>(({ isRefreshing, loading, onRefresh }) => {

  const isDisabled = isRefreshing || loading;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <motion.div
              className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg shadow-amber-500/20"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </motion.div>

            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent truncate">
                Statistiques détaillées
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <motion.button
              onClick={onRefresh}
              disabled={isDisabled}
              whileHover={!isDisabled ? { scale: 1.02 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
              className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${isDisabled
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40'
                }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDisabled ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {isRefreshing ? 'Actualisation...' : 'Actualiser'}
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
});

const ReportsChart = dynamic(() => import('./ReportsChart'), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-lg h-[380px] flex items-center justify-center">
      <div className="animate-pulse text-slate-400">Chargement du graphique...</div>
    </div>
  ),
});

export default function AdminDashboardPage() {
  const {
    handleRefresh, setDateRange, setSelectedReport, stats, loading, error, isRefreshing, chartData, chartConfig,
    lastUpdated, dateRange, selectedReport, metrics, showRefreshBanner,
  } = useAdminDashboardPage();

  if (loading) return <LoadingState />;

  if (error) {
    return (
      <div aria-live="polite">
        <ErrorState
          error={error}
          isRefreshing={isRefreshing}
          onRetry={handleRefresh}
        />
      </div>
    );
  }

  if (!stats) {
    return (
      <div aria-live="polite">
        <ErrorState
          error="Statistiques indisponibles."
          isRefreshing={isRefreshing}
          onRetry={handleRefresh}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-8 bg-gradient-to-br px-6 py-6 from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <AdminHeader
        lastUpdated={lastUpdated!}
        isRefreshing={isRefreshing}
        loading={loading}
        onRefresh={handleRefresh}
      />
      {showRefreshBanner && (
        <RefreshBanner
          isRefreshing={isRefreshing}
          loading={loading}
          show={showRefreshBanner}
        />
      )}
      <ReportsHeader dateRange={dateRange} setDateRange={setDateRange} dateRanges={DATE_RANGES} />
      <ReportsMetricsGrid metrics={metrics} />
      <ReportsTabs selectedReport={selectedReport} setSelectedReport={setSelectedReport} REPORT_TABS={REPORT_TABS} />
      <ReportsChart chartData={chartData} chartConfig={chartConfig} selectedReport={selectedReport} />
      <ReportsActivity stats={stats} />
    </div>
  );
}