'use client';
import Toast from '@/components/admin/commons/Toast';
import { ConsultationsEmptyState } from '@/components/admin/consultations/commons/ConsultationsEmptyState';
import { ConsultationsError } from '@/components/admin/consultations/commons/ConsultationsError';
import { ConsultationsList } from '@/components/admin/consultations/commons/ConsultationsList';
import { CosmicLoader } from '@/components/admin/consultations/commons/CosmicLoader';
import { useAdminConsultationsPageNotnotified } from '@/hooks/admin/consultations/useAdminConsultationsPageNotnotified';
import { FileText, Zap } from 'lucide-react';
import React from 'react';
import BatchNotifyPanel from './BatchNotifyPanel';
import Link from 'next/link';

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
            <h1 className="text-sm font-bold text-gray-900 dark:text-gray-100">Consultations non notifiées</h1>
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

export default function ConsultationsPageClientEnded() {
  const {
    isNotifyRunning, notifyProgress, consultationsNotNotified, error,
    loading, isRefreshing, jobStatuses, toastMessage, toastType,
    handleToastClose, handleRefresh, handleNotifyUser, startBatchNotify,
    stopBatchNotify, clearNotifyProgress, handleGenerateAnalysis, handleRetryAnalysis,
  } = useAdminConsultationsPageNotnotified();

  if (loading) return <CosmicLoader />;

  if (error) {
    return <ConsultationsError error={error} onRetry={handleRefresh} />;
  }

  return (
    <main className="relative overflow-hidden bg-white text-slate-900">
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="w-full flex flex-wrap gap-3 justify-center items-center py-6 bg-gradient-to-r from-cosmic-purple/10 to-cosmic-indigo/10 mb-4 text-white">
          <Link href="/admin/consultations" className="rounded-xl px-5 py-2 font-bold text-white bg-gradient-to-r from-cosmic-indigo to-cosmic-purple shadow hover:scale-105 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-indigo/40">En Attente</Link>
          <Link href="/admin/consultations/pending" className="rounded-xl px-5 py-2 font-bold text-white bg-gradient-to-r from-rose-500 to-rose-700 shadow hover:scale-105 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40">Non notifiées</Link>
          <Link href="/admin/consultations/ended" className="rounded-xl px-5 py-2 font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-700 shadow hover:scale-105 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40">Terminées</Link>
        </div>
        <ConsultationsHeader
          total={consultationsNotNotified.length}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          loading={loading}
        />
      </div>

      <div className="mx-auto max-w-5xl px-3 py-4 space-y-3">
        <section key="notnotified" className="space-y-2.5">
          <BatchNotifyPanel
            isRunning={isNotifyRunning}
            progress={notifyProgress}
            totalToNotify={consultationsNotNotified.length}
            onStart={startBatchNotify}
            onStop={stopBatchNotify}
            onClear={clearNotifyProgress}
          />
          {consultationsNotNotified.length > 0 ? (
            <ConsultationsList
              consultations={consultationsNotNotified}
              onGenerateAnalysis={handleGenerateAnalysis}
              currentPage={1}
              totalPages={1}
              total={consultationsNotNotified.length}
              onPageChange={() => { }}
              loading={loading}
              onNotify={handleNotifyUser}
              jobStatuses={jobStatuses}
              onRetryAnalysis={handleRetryAnalysis}
            />
          ) : (
            <ConsultationsEmptyState />
          )}
        </section>
      </div>

      {toastMessage ? (
        <Toast message={toastMessage} type={toastType} onClose={handleToastClose} />
      ) : null}
    </main>
  );
}