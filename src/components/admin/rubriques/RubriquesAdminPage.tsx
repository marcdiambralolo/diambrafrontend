'use client';
import RubriquesOverviewPageClient from '@/components/admin/rubriques/overview/RubriquesOverviewPageClient';
import { RubriquesGestionListPanel } from '@/components/admin/rubriques/RubriquesGestionListPanel';
import { RubriquesHeader } from '@/components/admin/rubriques/RubriquesHeader';
import { RubriquesLoader } from '@/components/admin/rubriques/RubriquesLoader';
import { RubriquesTabs } from '@/components/admin/rubriques/RubriquesTabs';
import { RubriquesToast } from '@/components/admin/rubriques/RubriquesToast';
import { useAdminRubriquesPage } from '@/hooks/admin/rubriques/useAdminRubriquesPage';
import { motion } from 'framer-motion';

export default function RubriquesAdminPage() {
  const {
    loading, toast, rubriques, offerings, offeringsLoading, activeTab,
    setActiveTab, handleSelectRubrique, handleCreateRubrique,
    handleCreate, setToast,
  } = useAdminRubriquesPage();

  if (loading || offeringsLoading) {
    return <RubriquesLoader loading={loading} offeringsLoading={offeringsLoading} />;
  }

  return (
    <motion.main
      className="mx-auto w-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 dark:from-[#070B1A] dark:via-[#0F1C3F] dark:to-[#162A56]"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, type: 'spring', stiffness: 60 }}
      aria-label="Gestion des rubriques"
    >
      <RubriquesTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'gestion' && (
        <section aria-labelledby="rubriques-gestion-title" className="mt-2">
          <h2 id="rubriques-gestion-title" className="text-2xl font-bold text-[#2E5AA6] dark:text-[#9BC2FF] mb-4">
            Gestion des rubriques
          </h2>
          <RubriquesHeader
            rubriquesCount={rubriques.length}
            offeringsCount={offerings.length}
            onCreate={() => handleCreateRubrique(handleCreate)}
          />
          <RubriquesGestionListPanel
            rubriques={rubriques}
            onList={handleSelectRubrique}
          />
        </section>
      )}

      {activeTab === 'overview' && (
        <section aria-labelledby="rubriques-overview-title" className="mt-2">
          <h2 id="rubriques-overview-title" className="text-2xl font-bold text-[#2E5AA6] dark:text-[#9BC2FF] mb-4">
            Aperçu des rubriques
          </h2>
          <RubriquesOverviewPageClient />
        </section>
      )}
      <RubriquesToast toast={toast} onClose={() => setToast(null)} />
    </motion.main>
  );
}