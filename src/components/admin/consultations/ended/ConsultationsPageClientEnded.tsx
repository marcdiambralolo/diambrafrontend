'use client';
import { ConsultationsEmptyState } from '@/components/admin/consultations/commons/ConsultationsEmptyState';
import { ConsultationsError } from '@/components/admin/consultations/commons/ConsultationsError';
import { ConsultationsHeader } from '@/components/admin/consultations/commons/ConsultationsHeader';
import { ConsultationsList } from '@/components/admin/consultations/commons/ConsultationsList';
import { CosmicLoader } from '@/components/admin/consultations/commons/CosmicLoader';
import { useAdminConsultationsPageFinished } from '@/hooks/admin/consultations/useAdminConsultationsPageFinished';
import Link from 'next/link';

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

        <div className="w-full flex flex-wrap gap-3 justify-center items-center py-6 bg-gradient-to-r from-cosmic-purple/10 to-cosmic-indigo/10 mb-4 text-white">
          <Link href="/admin/consultations" className="rounded-xl px-5 py-2 font-bold text-white bg-gradient-to-r from-cosmic-indigo to-cosmic-purple shadow hover:scale-105 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-indigo/40">En Attente</Link>
          <Link href="/admin/consultations/pending" className="rounded-xl px-5 py-2 font-bold text-white bg-gradient-to-r from-rose-500 to-rose-700 shadow hover:scale-105 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40">Non notifiées</Link>
          <Link href="/admin/consultations/ended" className="rounded-xl px-5 py-2 font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-700 shadow hover:scale-105 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40">Terminées</Link>
        </div>

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
              onGenerateAnalysis={() => { }}
              currentPage={currentPage}
              totalPages={totalPages}
              total={total}
              onPageChange={handlePageChange}
              loading={loading}
              onNotify={() => { }}
              jobStatuses={{}}
              onRetryAnalysis={() => { }}
            />
          ) : (<ConsultationsEmptyState />)}
        </section>
      </div>
    </main>
  );
}