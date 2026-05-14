"use client";
import ActivitySection from '@/components/admin/dashboard/ActivitySection';
import { DetailsGrid } from '@/components/admin/dashboard/DetailsGrid';
import ErrorState from '@/components/admin/dashboard/ErrorState';
import LoadingState from '@/components/admin/dashboard/LoadingState';
import RefreshBanner from '@/components/admin/dashboard/RefreshBanner';
import StatsGrid from '@/components/admin/dashboard/StatsGrid';
import { useAdminDashboardPage } from '@/hooks/admin/dashboard/useAdminDashboardPage';
import { DATE_RANGES, REPORT_TABS } from '@/hooks/admin/dashboard/useAdminReportsPage';
import dynamic from 'next/dynamic';
import ReportsActivity from './reports/ReportsActivity';
import ReportsHeader from './reports/ReportsHeader';
import ReportsMetricsGrid from './reports/ReportsMetricsGrid';
import ReportsTabs from './reports/ReportsTabs';
import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Clock, RefreshCw } from 'lucide-react';

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