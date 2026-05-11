'use client';
import { RubriquesOverviewDomaines } from '@/components/admin/rubriques/overview/RubriquesOverviewDomaines';
import { RubriquesOverviewError } from '@/components/admin/rubriques/overview/RubriquesOverviewError';
import { RubriquesOverviewLoading } from '@/components/admin/rubriques/overview/RubriquesOverviewLoading';
import { RubriquesOverviewStats } from '@/components/admin/rubriques/overview/RubriquesOverviewStats';
import { useRubriquesOverview } from '@/hooks/admin/rubriques/useRubriquesOverview';
import { memo } from 'react';

const RubriquesOverviewPageClient = memo(function RubriquesOverviewPageClient() {
  const { domaines, stats, loading, error } = useRubriquesOverview();

  if (loading) {
    return <RubriquesOverviewLoading />;
  }

  if (error) {
    return <RubriquesOverviewError error={typeof error === 'string' ? error : (error ? String(error) : '')} />;
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-[#EEF4FF] to-[#DDE7FA] dark:from-[#070B1A] dark:via-[#0F1C3F] dark:to-[#162A56] p-3 sm:p-6"
    >
      <div className="max-w-7xl mx-auto">
        <div
          className="mb-6 sm:mb-8 text-center sm:text-left"
        >
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed px-2 sm:px-0">
            Architecture complète de tous les services proposés sur la plateforme
          </p>
        </div>

        <RubriquesOverviewStats stats={stats} />
        
        <RubriquesOverviewDomaines domaines={domaines} />
      </div>
    </div>
  );
});

export default RubriquesOverviewPageClient;