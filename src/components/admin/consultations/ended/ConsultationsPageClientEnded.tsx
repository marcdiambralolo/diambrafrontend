'use client';
import { useAdminConsultationsPageFinished } from '@/hooks/admin/consultations/useAdminConsultationsPageFinished';
import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { AlertCircle, Clock, RefreshCw, Wifi } from 'lucide-react';
import { Zap } from 'lucide-react';
import React from 'react';
import { Consultation } from '@/lib/interfaces';
import { AnimatePresence } from 'framer-motion';
import ConsultationCard from '../commons/ConsultationCard';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { memo, useMemo } from 'react';

export const CosmicLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#070B1A] via-[#0F1C3F] to-[#162A56] relative overflow-hidden">
    <div className="absolute inset-0 -z-10">
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-80 sm:h-80 bg-[#2E5AA6]/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.4, 1], opacity: [0.08, 0.15, 0.08], x: [0, -30, 0], y: [0, 25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-80 sm:h-80 bg-indigo-500/20 rounded-full blur-3xl"
      />
    </div>
    <motion.div initial="hidden" animate="visible" className="text-center z-10">
      <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-6 sm:mb-8">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="absolute inset-0 bg-gradient-to-br from-[#2E5AA6]/30 to-[#4F83D1]/30 rounded-full blur-2xl" />
        <motion.div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="absolute inset-0 bg-[#2E5AA6] rounded-full blur-xl" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] shadow-2xl shadow-[#2E5AA6]/35 sm:h-20 sm:w-20">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m9 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
        </motion.div>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-full border-4 border-[#2E5AA6]/30 border-t-[#2E5AA6]" />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} className="absolute inset-2 border-4 border-indigo-500/30 border-b-indigo-500 rounded-full" />
      </div>
      <motion.h2 className="mb-2 text-xl font-black tracking-tight sm:text-2xl" animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} style={{ backgroundImage: 'linear-gradient(90deg, #4F83D1, #9BC2FF, #DDE7FA, #4F83D1)', backgroundSize: '200% 100%', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Chargement des consultations</motion.h2>
      <motion.p className="text-xs sm:text-sm text-[#DDE7FA]/75 font-medium" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>Récupération des données en cours...</motion.p>
      <div className="flex items-center justify-center gap-1.5 mt-4">
        {[0, 1, 2, 3].map((i) => (
          <motion.div key={i} className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#4F83D1]" animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }} />
        ))}
      </div>
    </motion.div>
  </div>
);

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  total: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  loading: boolean;
}

const PaginationControls = memo(({
  currentPage,
  totalPages,
  total,
  itemsPerPage,
  onPageChange,
  loading
}: PaginationControlsProps) => {
  const getVisiblePageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-200 bg-white p-2.5 shadow-sm dark:border-[color:var(--theme-border)] dark:bg-[#0F1C3F]"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="text-[10px] text-gray-600 dark:text-gray-400 font-medium">
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {((currentPage - 1) * itemsPerPage) + 1}
          </span>
          {' - '}
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {Math.min(currentPage * itemsPerPage, total)}
          </span>
          {' sur '}
          <span className="font-bold text-gray-900 dark:text-gray-100">{total}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1 || loading}
            className="p-1 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronsLeft className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="p-1 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="hidden sm:flex items-center gap-1">
            {getVisiblePageNumbers.map((page, index) => (
              page === '...'
                ? <span key={`ellipsis-${index}`} className="px-1.5 text-gray-400 text-[10px]">•••</span>
                : <button
                  key={page}
                  onClick={() => onPageChange(page as number)}
                  disabled={loading}
                  className={`min-w-[28px] px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${page === currentPage ? 'scale-105 bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] text-white shadow-md' : 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-[#13274C]'} disabled:opacity-30`}
                >
                  {page}
                </button>
            ))}
          </div>
          <div className="rounded-lg bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] px-2.5 py-1 text-[10px] font-bold text-white shadow-md sm:hidden">
            {currentPage} / {totalPages}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="p-1 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
          </button>

          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || loading}
            className="p-1 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronsRight className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </motion.div>
  );
});

interface ConsultationsListProps {
  consultations: Consultation[];
  currentPage: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  loading: boolean;
}

export const ConsultationsList: React.FC<ConsultationsListProps> = ({
  consultations, loading, currentPage, totalPages, total, onPageChange,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full auto-rows-fr">
        <AnimatePresence mode="popLayout">
          {consultations.map((consultation: Consultation) => {
            const consultationId = String(consultation.id ?? consultation._id ?? '');
            return (
              <div key={consultationId} className="relative flex w-full h-full">
                <ConsultationCard
                  consultation={consultation}
                />
              </div>
            );
          })}
        </AnimatePresence>
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        itemsPerPage={10}
        onPageChange={onPageChange}
        loading={loading}
      />
    </>
  );
};

interface ConsultationsHeaderProps {
  total: number;
  onRefresh: () => void;
  isRefreshing: boolean;
  loading: boolean;
}

export const ConsultationsHeader: React.FC<ConsultationsHeaderProps> = ({ total, onRefresh, isRefreshing, loading }) => (
  <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 shadow-sm backdrop-blur-xl dark:border-[color:var(--theme-border)] dark:bg-[#0F1C3F]/80">
    <div className="max-w-5xl mx-auto px-3 py-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] p-1.5 shadow-md">
            <FileText className="w-3.5 h-3.5 text-white" />
          </div>

          <div>
            <h1 className="text-sm font-bold text-gray-900 dark:text-gray-100">Jeux</h1>
            <p className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-[#AFC0DE]">
              <Zap className="w-2.5 h-2.5" />
              {total} au total
            </p>
          </div>
        </div>
        <button
          onClick={onRefresh}
          disabled={isRefreshing || loading}
          className={`p-1.5 rounded-lg transition-all shadow-sm ${isRefreshing || loading
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
        >
          <svg className={`w-3.5 h-3.5 ${isRefreshing || loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582M20 20v-5h-.581M5 19A9 9 0 0021 12.082M19 5A9 9 0 003 11.918" /></svg>
        </button>
      </div>
    </div>
  </div>
);


interface ConsultationsErrorProps {
  error: string;
  onRetry: () => void;
}

export function ConsultationsError({ error, onRetry }: ConsultationsErrorProps) {
  const isTimeoutError = error.includes('Délai dépassé') || error.includes('timeout');
  const isNetworkError = error.includes('connexion') || error.includes('réseau');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center min-h-[60vh] bg-gray-50 dark:bg-gray-950 p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-red-100 dark:border-red-900/40 p-8"
      >
        <motion.div
          className="flex justify-center mb-4"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {isTimeoutError ? (
            <Clock className="w-12 h-12 text-orange-500" />
          ) : isNetworkError ? (
            <Wifi className="w-12 h-12 text-red-500" />
          ) : (
            <AlertCircle className="w-12 h-12 text-rose-500" />
          )}
        </motion.div>

        {/* Titre */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {isTimeoutError ? 'Requête trop longue' : isNetworkError ? 'Erreur réseau' : 'Erreur'}
        </h3>

        {/* Message d'erreur */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          {error}
        </p>

        {/* Conseils */}
        {isTimeoutError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/40 rounded-lg p-4 mb-6 text-left"
          >
            <p className="text-xs font-semibold text-orange-900 dark:text-orange-300 mb-2">
              Conseils :
            </p>
            <ul className="text-xs text-orange-800 dark:text-orange-300 space-y-1">
              <li>• Vérifiez votre connexion internet</li>
              <li>• Patientez quelques secondes et réessayez</li>
              <li>• Vérifiez que le serveur backend fonctionne</li>
            </ul>
          </motion.div>
        )}

        {isNetworkError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 rounded-lg p-4 mb-6 text-left"
          >
            <p className="text-xs font-semibold text-red-900 dark:text-red-300 mb-2">
              Conseils :
            </p>
            <ul className="text-xs text-red-800 dark:text-red-300 space-y-1">
              <li>• Vérifiez votre connexion internet</li>
              <li>• Vérifiez l'URL du serveur backend</li>
              <li>• Assurez-vous que le serveur est démarré</li>
            </ul>
          </motion.div>
        )}

        {/* Boutons */}
        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#2E5AA6]/20 transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export const ConsultationsEmptyState: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center"
  >
    <FileText className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
      Aucun jeu trouvé
    </h3>

    <p className="text-sm text-gray-500 dark:text-gray-400">
      Les jeux apparaîtront ici.
    </p>
  </motion.div>
);

export default function ConsultationsPageClientEnded() {
  const {
    consultations, total, totalPages, error, currentPage, loading, isRefreshing,
    handleRefresh, handlePageChange,
  } = useAdminConsultationsPageFinished();

  if (loading) return <CosmicLoader />;

  if (error) {
    return <ConsultationsError error={error} onRetry={handleRefresh} />;
  }

  return (
    <main className="relative overflow-hidden bg-white">
      <div className="border-b border-slate-200">
        <ConsultationsHeader
          total={consultations.length}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          loading={loading}
        />
      </div>
      <div className="mx-auto max-w-5xl px-3 py-4 space-y-3">
        <section key="ended" className="space-y-2.5">
          {consultations && consultations.length > 0 ? (
            <ConsultationsList
              consultations={consultations}
              currentPage={currentPage}
              totalPages={totalPages}
              total={total}
              onPageChange={handlePageChange}
              loading={loading}
            />
          ) : (<ConsultationsEmptyState />)}
        </section>
      </div>
    </main>
  );
}