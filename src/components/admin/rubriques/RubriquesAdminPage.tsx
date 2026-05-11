'use client';
import { RubriquesGestionListPanel } from '@/components/admin/rubriques/RubriquesGestionListPanel';
import { RubriquesHeader } from '@/components/admin/rubriques/RubriquesHeader';
import { RubriquesLoader } from '@/components/admin/rubriques/RubriquesLoader';
import { RubriquesToast } from '@/components/admin/rubriques/RubriquesToast';
import { useAdminRubriquesPage } from '@/hooks/admin/rubriques/useAdminRubriquesPage';
import { motion } from 'framer-motion';

export default function RubriquesAdminPage() {
  const {
    loading, toast, rubriques, offerings, offeringsLoading,
    handleSelectRubrique, handleCreateRubrique, handleCreate, setToast,
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
      <RubriquesHeader
        rubriquesCount={rubriques.length}
        offeringsCount={offerings.length}
        onCreate={() => handleCreateRubrique(handleCreate)}
      />
      <RubriquesGestionListPanel
        rubriques={rubriques}
        onList={handleSelectRubrique}
      />
      <RubriquesToast toast={toast} onClose={() => setToast(null)} />
    </motion.main>
  );
}