'use client';
import Loader from '@/app/admin/loading';
import ConsultationCard from '@/components/commons/ConsultationCard';
import { useAdminConsultationsPageFinished } from '@/hooks/admin/consultations/useAdminConsultationsPageFinished';
import { Consultation } from '@/lib/interfaces';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FileText, RefreshCw, Zap } from 'lucide-react';
import React, { memo, useMemo } from 'react';

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
          {consultations.map((consultation: Consultation, index) => {
            const consultationId = String(consultation.id ?? consultation._id ?? '');
            return (
              <div key={consultationId} className="relative flex w-full h-full">
                <ConsultationCard
                  consultation={consultation}
                  index={index}
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
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          {error}
        </p>

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

  if (loading) return <Loader />;

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