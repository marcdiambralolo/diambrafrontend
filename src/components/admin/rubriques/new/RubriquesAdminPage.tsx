'use client';
import { RubriquesToast } from '@/components/admin/rubriques/RubriquesToast';
import { ConsultationType } from '@/hooks/admin/consultations/useAdminConsultationsPageNotnotified';
import { useAdminRubriquesNewPage } from '@/hooks/admin/rubriques/useAdminRubriquesNewPage';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Save, X } from 'lucide-react';

export default function RubriquesAdminPage() {
  const {
    saving,
    toast,
    editingRubrique,
    setEditingRubrique,
    handleSave,
    handleBackToList,
    setToast,
  } = useAdminRubriquesNewPage();

  return (
    <motion.main
      className="mx-auto w-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 dark:from-[#070B1A] dark:via-[#0F1C3F] dark:to-[#162A56] min-h-screen"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, type: 'spring', stiffness: 60 }}
      aria-label="Gestion des rubriques"
    >
      <section aria-labelledby="rubriques-gestion-title" className="mt-2">
        <div className="max-w-4xl mx-auto">
          <h2
            id="rubriques-gestion-title"
            className="text-3xl font-bold bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] bg-clip-text text-transparent dark:from-[#9BC2FF] dark:to-[#4F83D1] mb-6"
          >
            Création d'une nouvelle rubrique
          </h2>

          <section aria-labelledby="rubrique-edition-title" className="mt-4">
            <div className="grid grid-cols-1 gap-6">
              <div className="flex flex-col">
                <button
                  onClick={handleBackToList}
                  className="theme-dark-secondary-button mb-4 self-start rounded-lg bg-white/80 backdrop-blur-sm px-4 py-2 text-slate-700 transition-all hover:bg-slate-100 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#2E5AA6]/40 dark:bg-[#0F1C3F]/80 dark:text-slate-200 dark:hover:bg-[#162A56]"
                  aria-label="Retour à la liste des rubriques"
                >
                  ← Retour à la liste
                </button>

                <AnimatePresence mode="wait">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-8 border border-slate-200 rounded-2xl bg-white/90 backdrop-blur-sm shadow-xl dark:bg-[#0F1C3F]/90 dark:border-white/10"
                  >
                    {/* Header */}
                    <div className="mb-8 space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Titre de la rubrique *
                        </label>
                        <input
                          type="text"
                          value={editingRubrique.titre}
                          onChange={(e) =>
                            setEditingRubrique({ ...editingRubrique, titre: e.target.value })
                          }
                          placeholder="Ex: Astrologie Africaine, Numérologie..."
                          className="w-full px-4 py-3 text-lg rounded-xl border border-[#2E5AA6]/20 bg-white focus:ring-2 focus:ring-[#2E5AA6]/40 focus:border-[#2E5AA6] dark:border-white/10 dark:bg-[#0A0F2A] dark:text-slate-100 dark:focus:ring-[#4F83D1]/40 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Type de consultation *
                        </label>
                        <select
                          value={editingRubrique.typeconsultation || ''}
                          onChange={(e) =>
                            setEditingRubrique({
                              ...editingRubrique,
                              typeconsultation: e.target.value as ConsultationType,
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-[#2E5AA6]/20 focus:ring-2 focus:ring-[#2E5AA6]/40 focus:border-[#2E5AA6] bg-white text-base font-medium dark:border-white/10 dark:bg-[#0A0F2A] dark:text-slate-100 transition-all"
                        >
                          <option value="" disabled>
                            Sélectionnez un type
                          </option>
                          <option value="SPIRITUALITE">Spiritualité</option>
                          <option value="VIE_PERSONNELLE">Vie personnelle</option>
                          <option value="RELATIONS">Relations</option>
                          <option value="PROFESSIONNEL">Professionnel</option>
                          <option value="OFFRANDES">Offrandes</option>
                          <option value="ASTROLOGIE_AFRICAINE">Astrologie africaine</option>
                          <option value="HOROSCOPE">Horoscope</option>
                          <option value="NOMBRES_PERSONNELS">Nombres personnels</option>
                          <option value="CYCLES_PERSONNELS">Cycles personnels</option>
                          <option value="CINQ_ETOILES">Cinq étoiles</option>
                          <option value="NUMEROLOGIE">Numérologie</option>
                          <option value="AUTRE">Autre</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Description
                        </label>
                        <textarea
                          value={editingRubrique?.description}
                          onChange={(e) =>
                            setEditingRubrique({ ...editingRubrique, description: e.target.value })
                          }
                          placeholder="Décrivez le contenu et les objectifs de cette rubrique..."
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2E5AA6]/40 focus:border-transparent dark:border-white/10 dark:bg-[#0A0F2A] dark:text-slate-100 transition-all resize-none"
                        />
                        <p className="mt-1 text-xs text-slate-400">
                          {editingRubrique?.description!.length}/500 caractères
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={handleBackToList}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all font-medium dark:border-white/20 dark:hover:bg-white/5"
                      >
                        <X className="w-5 h-5" />
                        Annuler
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving || !editingRubrique?.titre?.trim()}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] text-white font-bold hover:from-[#244A8A] hover:to-[#3E6FB5] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#2E5AA6]/25"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Création...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            Créer la rubrique
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </section>
        </div>
      </section>
      <RubriquesToast toast={toast} onClose={() => setToast(null)} />
    </motion.main>
  );
}