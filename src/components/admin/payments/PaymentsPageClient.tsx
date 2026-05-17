"use client";
 import PaymentsFilters from '@/components/admin/payments/PaymentsFilters';
import PaymentsList from '@/components/admin/payments/PaymentsList';
import { useAdminPaymentsPage } from '@/hooks/admin/payments/useAdminPaymentsPage';
import { motion, Variants } from 'framer-motion';
import { AlertCircle, CreditCard, RefreshCw } from 'lucide-react';
import React, { memo } from 'react'; 
import { CheckCircle, Clock, XCircle } from 'lucide-react';

interface StatsProps {
  stats: {
    total: number;
    pending: number;
    completed: number;
    failed: number;
    cancelled: number;
    totalAmount: number;
    completedAmount: number;
  } | null;
}

const PaymentsStats: React.FC<StatsProps> = ({ stats }) => {
  if (!stats) return null;
  return (
    <div className="space-y-3 mb-4">
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-3 text-white">
          <p className="text-xs opacity-90 mb-1">Montant total</p>
          <p className="text-xl font-bold">{stats.totalAmount.toLocaleString()} F</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-3 text-white">
          <p className="text-xs opacity-90 mb-1">Montant encaissé</p>
          <p className="text-xl font-bold">{stats.completedAmount.toLocaleString()} F</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-white rounded-lg p-2.5 border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-green-50 rounded">
              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
            </div>

            <div>
              <p className="text-xs text-gray-500">Réussis</p>
              <p className="text-lg font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-2.5 border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-orange-50 rounded">
              <Clock className="w-3.5 h-3.5 text-orange-600" />
            </div>

            <div>
              <p className="text-xs text-gray-500">En attente</p>
              <p className="text-lg font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-2.5 border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-red-50 rounded">
              <XCircle className="w-3.5 h-3.5 text-red-600" />
            </div>

            <div>
              <p className="text-xs text-gray-500">Échoués</p>
              <p className="text-lg font-bold text-gray-900">{stats.failed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-2.5 border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-gray-50 rounded">
              <AlertCircle className="w-3.5 h-3.5 text-gray-600" />
            </div>
            
            <div>
              <p className="text-xs text-gray-500">Annulés</p>
              <p className="text-lg font-bold text-gray-900">{stats.cancelled}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 

interface AdminPaymentsErrorAlertProps {
  error: string;
  onRetry: () => void;
}

export const AdminPaymentsErrorAlert: React.FC<AdminPaymentsErrorAlertProps> = ({ error, onRetry }) => (
  <div className="flex items-center justify-center  bg-gray-50 px-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center max-w-sm w-full bg-white rounded-xl shadow-lg p-6"
    >
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
      <h3 className="text-lg font-bold text-gray-900 mb-2">Erreur</h3>
      <p className="text-sm text-gray-600 mb-4">{error}</p>
      
      <button
        onClick={onRetry}
        className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm rounded-lg font-semibold hover:shadow-lg transition-all"
      >
        Réessayer
      </button>
    </motion.div>
  </div>
);

interface AdminPaymentsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export const AdminPaymentsPagination: React.FC<AdminPaymentsPaginationProps> = ({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}) => (
  <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-3 py-2">
 
    <p className="text-xs text-gray-600">
      Page {currentPage}/{totalPages}
    </p>

    <div className="flex gap-1.5">
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ←
      </button>
      
      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs rounded font-medium hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        →
      </button>
    </div>
  </div>
);

const spinnerVariants: Variants = {
  initial: { scale: 0.8, opacity: 0.7 },
  animate: {
    scale: [0.8, 1.05, 0.95, 1],
    opacity: [0.7, 1, 0.9, 1],
    boxShadow: [
      '0 0 0px #34d399',
      '0 0 12px #34d399',
      '0 0 6px #34d399',
      '0 0 0px #34d399'
    ],
    transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
  }
};

const AdminPaymentsLoader = memo(() => (
  <div className="flex items-center justify-center min-h-[40vh] sm:min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <div className="flex flex-col items-center justify-center p-2 sm:p-4 rounded-xl shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 max-w-xs w-full mx-auto">

      <motion.div
        variants={spinnerVariants}
        initial="initial"
        animate="animate"
        className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-green-500 border-t-transparent rounded-full mb-2 sm:mb-3 animate-spin"
        style={{ boxShadow: '0 0 8px #34d399' }}
      />

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wide"
      >
        Chargement en cours...
      </motion.p>
    </div>
  </div>
));


interface AdminPaymentsHeaderProps {
  total: number;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export const AdminPaymentsHeader: React.FC<AdminPaymentsHeaderProps> = ({ total, isRefreshing, onRefresh }) => (
  <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-green-50 rounded-lg">
            <CreditCard className="w-4 h-4 text-green-600" />
          </div>

          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              Paiements
            </h1>
            <p className="text-xs text-gray-500">{total} total</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className={`p-2 rounded-lg transition-all ${isRefreshing
              ? 'bg-gray-100 text-gray-400'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  </div>
);

interface AdminPaymentsEmptyStateProps {
  searchQuery: string;
  statusFilter: string;
  methodFilter: string;
  onResetFilters: () => void;
}

export const AdminPaymentsEmptyState: React.FC<AdminPaymentsEmptyStateProps> = ({
  searchQuery,
  statusFilter,
  methodFilter,
  onResetFilters,
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
    <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />

    <h3 className="text-base font-bold text-gray-900 mb-1">
      Aucun paiement
    </h3>
    <p className="text-sm text-gray-500 mb-4">
      {searchQuery || statusFilter !== 'all' || methodFilter !== 'all'
        ? 'Aucun résultat trouvé'
        : 'Les paiements apparaîtront ici'}
    </p>

    {(searchQuery || statusFilter !== 'all' || methodFilter !== 'all') && (
      <button
        onClick={onResetFilters}
        className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm rounded-lg font-medium hover:shadow-md"
      >
        Réinitialiser
      </button>
    )}
  </div>
);

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