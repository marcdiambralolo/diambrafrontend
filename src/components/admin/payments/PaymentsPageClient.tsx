"use client";
import { AdminPaymentsEmptyState } from '@/components/admin/payments/AdminPaymentsEmptyState';
import { AdminPaymentsErrorAlert } from '@/components/admin/payments/AdminPaymentsErrorAlert';
import { AdminPaymentsHeader } from '@/components/admin/payments/AdminPaymentsHeader';
import { AdminPaymentsLoader } from '@/components/admin/payments/AdminPaymentsLoader';
import { AdminPaymentsPagination } from '@/components/admin/payments/AdminPaymentsPagination';
import PaymentsFilters from '@/components/admin/payments/PaymentsFilters';
import PaymentsList from '@/components/admin/payments/PaymentsList';
import PaymentsStats from '@/components/admin/payments/PaymentsStats';
import { useAdminPaymentsPage } from '@/hooks/admin/payments/useAdminPaymentsPage';

export default function PaymentsPageClient() {
  const {
    payments, total, showFilters, loading, totalPages, error, stats, methodFilter,
    currentPage, isRefreshing, searchQuery, statusFilter,
    handleRefresh, setStatusFilter, setSearchQuery, setMethodFilter,
    setCurrentPage, setShowFilters, handleResetFilters,
  } = useAdminPaymentsPage();

  if (loading) { return <AdminPaymentsLoader />; }

  if (error) {
    return (
      <div aria-live="polite">
        <AdminPaymentsErrorAlert error={error} onRetry={handleRefresh} />
      </div>
    );
  }

  return (
    <>
      {/* Skip link accessibilité */}
      <a href="#admin-payments-main" className="sr-only focus:not-sr-only absolute top-2 left-2 z-50 bg-cosmic-indigo text-white font-bold px-4 py-2 rounded-xl">Aller au contenu principal</a>
      <main id="admin-payments-main" aria-labelledby="admin-payments-title" className="bg-gray-50">
        {/* h1 sr-only pour accessibilité, le header visuel reste */}
        <h1 id="admin-payments-title" className="sr-only">Gestion des paiements</h1>
        <AdminPaymentsHeader total={total} isRefreshing={isRefreshing} onRefresh={handleRefresh} />

        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4">
          <PaymentsStats stats={stats} />
          <PaymentsFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            methodFilter={methodFilter}
            setMethodFilter={setMethodFilter}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            handleResetFilters={handleResetFilters}
          />

          {payments && payments.length > 0 ? (
            <section className="space-y-4" role="region" aria-label="Liste des paiements">
              <PaymentsList payments={payments} />
              {totalPages > 1 && (
                <AdminPaymentsPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPrev={() => setCurrentPage(p => Math.max(1, p - 1))}
                  onNext={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                />
              )}
            </section>
          ) : (
            <AdminPaymentsEmptyState
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              methodFilter={methodFilter}
              onResetFilters={handleResetFilters}
            />
          )}
        </div>
      </main>
    </>
  );
}