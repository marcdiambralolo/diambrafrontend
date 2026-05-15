"use client";
import ActivitySection from '@/components/admin/dashboard/ActivitySection';
import { DetailsGrid } from '@/components/admin/dashboard/DetailsGrid';
import LoadingState from '@/components/admin/dashboard/LoadingState';
import { useAdminDashboardPage } from '@/hooks/admin/dashboard/useAdminDashboardPage';
import { DATE_RANGES, REPORT_TABS } from '@/hooks/admin/dashboard/useAdminReportsPage';
import { motion, Variants } from 'framer-motion';
import { AlertCircle, BarChart3, Clock, CreditCard, DollarSign, FileText, LucideIcon, RefreshCw, Sparkles, TrendingDown, TrendingUp, Users } from 'lucide-react';
import dynamic from 'next/dynamic';
import { memo, useMemo } from 'react';
import ReportsActivity from './reports/ReportsActivity';
import ReportsHeader from './reports/ReportsHeader';
import ReportsMetricsGrid from './reports/ReportsMetricsGrid';
import ReportsTabs from './reports/ReportsTabs';

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
              <span className={`text-xs sm:text-sm font-semibold ${trend.isPositive
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

type DashboardStats = {
  users: { total: number; active: number; new: number; inactive: number };
  consultations: { total: number; pending: number; completed: number; revenue: number };
  payments: { pending: number; completed: number; failed: number };
};

type DerivedDashboardStats = {
  userGrowthRate?: string | number;
  consultationSuccessRate?: string | number;
  paymentSuccessRate?: string | number;
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: custom * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  })
};

interface StatsGridProps {
  stats: DashboardStats;
  derivedStats: DerivedDashboardStats;
}

function toNumber(value: string | number | undefined): number {
  return typeof value === 'number' ? value : Number.parseFloat(value ?? '0');
}

const StatsGrid = memo<StatsGridProps>(({ stats, derivedStats }) => {
  const statsData = useMemo(() => [
    {
      title: "Utilisateurs",
      value: stats.users.total.toLocaleString('fr-FR'),
      icon: Users,
      color: "blue" as const,
      trend: {
        value: toNumber(derivedStats?.userGrowthRate),
        isPositive: stats.users.new > 0
      }
    },
    {
      title: "Jeux",
      value: stats.consultations.total.toLocaleString('fr-FR'),
      icon: FileText,
      color: "green" as const,
      trend: {
        value: toNumber(derivedStats?.consultationSuccessRate),
        isPositive: stats.consultations.completed > stats.consultations.pending
      }
    },
    {
      title: "Paiements",
      value: stats.payments.completed.toLocaleString('fr-FR'),
      icon: CreditCard,
      color: "blue" as const,
      trend: {
        value: toNumber(derivedStats?.paymentSuccessRate),
        isPositive: stats.payments.completed > stats.payments.failed
      }
    },
    {
      title: "Revenu",
      value: `${stats.consultations.revenue.toLocaleString('fr-FR')} F`,
      icon: DollarSign,
      color: "orange" as const,
      trend: {
        value: 23.1,
        isPositive: true
      }
    }
  ], [stats, derivedStats]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.title}
          custom={index}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
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

const AdminHeader = memo<AdminHeaderProps>(({ lastUpdated, isRefreshing, loading, onRefresh }) => {
  const formattedTime = useMemo(() => {
    if (!lastUpdated) return null;
    return new Date(lastUpdated).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }, [lastUpdated]);

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
                Tableau de bord
              </h1>
              {formattedTime && (
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{formattedTime}</span>
                </p>
              )}
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

const ReportsChart = dynamic(() => import('./reports/ReportsChart'), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-lg h-[380px] flex items-center justify-center">
      <div className="animate-pulse text-slate-400">Chargement du graphique...</div>
    </div>
  ),
});

export default function AdminDashboardPage() {
  const {
    handleRefresh, setDateRange, setSelectedReport, stats, loading, error,
    lastUpdated, dateRange, selectedReport, metrics, safeDerivedStats,
    showRefreshBanner, isRefreshing, chartData, chartConfig,
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
    <main id="admin-dashboard-main" aria-labelledby="admin-dashboard-title">
      <h1 id="admin-dashboard-title" className="sr-only">Tableau de bord administration</h1>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <AdminHeader
          lastUpdated={lastUpdated!}
          isRefreshing={isRefreshing}
          loading={loading}
          onRefresh={handleRefresh}
        />

        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6" role="region" aria-label="Statistiques et activité">
          {showRefreshBanner && (
            <RefreshBanner
              isRefreshing={isRefreshing}
              loading={loading}
              show={showRefreshBanner}
            />
          )}

          <ActivitySection stats={stats} derivedStats={safeDerivedStats} />
          <StatsGrid stats={stats} derivedStats={safeDerivedStats} />
          <DetailsGrid stats={stats} derivedStats={safeDerivedStats} />
        </section>

        <section className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-7xl mx-auto" role="region" aria-label="Rapports et graphiques">
          <ReportsHeader dateRange={dateRange} setDateRange={setDateRange} dateRanges={DATE_RANGES} />
          <ReportsMetricsGrid metrics={metrics} />
          <ReportsTabs selectedReport={selectedReport} setSelectedReport={setSelectedReport} REPORT_TABS={REPORT_TABS} />
          <ReportsChart chartData={chartData} chartConfig={chartConfig} selectedReport={selectedReport} />
          <ReportsActivity stats={stats} />
        </section>
      </div>
    </main>
  );
}