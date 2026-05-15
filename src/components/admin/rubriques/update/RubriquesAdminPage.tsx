'use client';
import { RubriquesLoader } from '@/components/admin/rubriques/RubriquesLoader';
import { RubriquesToast } from '@/components/admin/rubriques/RubriquesToast';
import { ANIMATION_VARIANTS } from '@/hooks/admin/rubriques/useAdminRubriquesAddPage';
import { useAdminRubriquesUpdatePage } from '@/hooks/admin/rubriques/useAdminRubriquesUpdatePage';
import { motion,Variants  } from 'framer-motion';
import { ArrowLeft, Plus, Sparkles } from "lucide-react";
import Link from 'next/link';

export default function RubriquesAdminPage() {
  const {
    handleBackToList, setToast, setEditingRubrique, handleRubriqueSubmit,
    loading, editingRubrique, toast,
  } = useAdminRubriquesUpdatePage();

  if (loading) {
    return <RubriquesLoader loading={loading} offeringsLoading={loading} />;
  }

  return (
    <motion.main
      className="mx-auto w-full bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 dark:from-[#070B1A] dark:via-[#0F1C3F] dark:to-[#162A56] p-4 md:p-6 lg:p-8 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      aria-label="Gestion des rubriques"
    >
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2E5AA6] via-[#4F83D1] to-[#FFD600] z-50 animate-gradient-x" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#2E5AA6]/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#4F83D1]/5 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFD600]/5 rounded-full blur-3xl animate-pulse delay-2000" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#2E5AA6] via-[#4F83D1] to-[#FFD600] bg-clip-text text-transparent animate-gradient">
            Gestion des rubriques
          </h1>
        </motion.div>

        <motion.button
          onClick={handleBackToList}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-[#0F1C3F] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#162A56] transition-all duration-200 shadow-sm hover:shadow-md group mb-6"
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.98 }}
          aria-label="Retour à la liste des rubriques"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Retour à la liste
        </motion.button>

        <motion.section
          aria-labelledby="rubrique-edition-title"
          className="mt-4"
        >
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] flex items-center justify-center shadow-lg"
              >
                <span className="text-white font-bold text-2xl">
                  {editingRubrique?.titre?.charAt(0) || 'R'}
                </span>
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-[#2E5AA6] dark:text-[#9BC2FF]">
                  {editingRubrique?.titre || 'Nouvelle rubrique'}
                </h2>
              </div>
            </div>

            <Link
              href={`/admin/rubriques/${editingRubrique?._id}/create`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Nouveau choix
            </Link>
          </div>

          <form
            className="max-w-xl mx-auto bg-white dark:bg-[#0F1C3F] rounded-2xl shadow-lg p-8 flex flex-col gap-6 border border-slate-200 dark:border-slate-700"
            onSubmit={handleRubriqueSubmit}
          >
            <div>
              <label htmlFor="rubrique-titre" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Titre de la rubrique</label>
              <input
                id="rubrique-titre"
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#162A56] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#2E5AA6]/40 focus:border-[#2E5AA6]"
                value={editingRubrique?.titre || ''}
                onChange={e => setEditingRubrique({
                  ...editingRubrique,
                  titre: e.target.value,
                  consultationChoices: editingRubrique?.consultationChoices ?? []
                })}
                required
              />
            </div>           
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600"
                onClick={handleBackToList}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </motion.section>
      </div>

      <RubriquesToast toast={toast} onClose={() => setToast(null)} />
    </motion.main>
  );
}