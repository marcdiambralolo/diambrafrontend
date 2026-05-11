"use client";
import ActivitySection from '@/components/admin/dashboard/ActivitySection';
import AdminHeader from '@/components/admin/dashboard/AdminHeader';
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