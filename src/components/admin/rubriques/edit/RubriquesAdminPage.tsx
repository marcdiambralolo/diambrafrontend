'use client';
import { RubriquesLoader } from '@/components/admin/rubriques/RubriquesLoader';
import { RubriquesToast } from '@/components/admin/rubriques/RubriquesToast';
import { ANIMATION_VARIANTS } from '@/hooks/admin/rubriques/useAdminRubriquesAddPage';
import { useAdminRubriquesEditPage } from '@/hooks/admin/rubriques/useAdminRubriquesEditPage';
import { FrequenceConsultation, TypeParticipants } from "@/lib/interfaces";
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  Award,
  Calendar,
  CheckCircle, DollarSign,
  Edit3,
  FileText,
  HelpCircle,
  Loader2, Package,
  Save, Sparkles,
  Users,
  X,
  Zap
} from "lucide-react";
import { OfferingSelector } from "../OfferingSelector";
import RubriquePdfUpload from "../RubriquePdfUpload";

interface FormFieldProps {
  label: string;
  description?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

const FormField = ({ label, description, required, error, children }: FormFieldProps) => (
  <div className="space-y-1">
    <div className="flex items-center gap-1">
      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {description && (
        <div className="group relative">
          <HelpCircle className="w-3 h-3 text-slate-400 cursor-help" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
            {description}
          </div>
        </div>
      )}
    </div>
    {children}
    {error && (
      <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
        <AlertCircle className="w-3 h-3" />
        {error}
      </p>
    )}
  </div>
);

const InfoBadge = ({ icon: Icon, label, value, color }: {
  icon: any;
  label: string;
  value: string;
  color?: string;
}) => (
  <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-gradient-to-r from-slate-50 to-indigo-50 dark:from-[#162A56] dark:to-[#0F1C3F] border border-slate-200 dark:border-slate-700">
    <Icon className={`w-3.5 h-3.5 ${color || 'text-[#2E5AA6]'}`} />
    <span className="text-xs text-slate-600 dark:text-slate-400">{label}:</span>
    <span className="text-xs font-semibold text-slate-900 dark:text-white">{value}</span>
  </div>
);

const ChevronDown = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

// Mapping des valeurs pour l'affichage
const FREQUENCE_LABELS: Record<string, string> = {
  UNE_FOIS_VIE: 'Une fois dans la vie',
  ANNUELLE: 'Chaque année',
  MENSUELLE: 'Chaque mois',
  QUOTIDIENNE: 'Chaque jour',
  LIBRE: 'À tout moment',
};

const PARTICIPANTS_LABELS: Record<string, string> = {
  SOLO: 'Solo',
  AVEC_TIERS: 'Avec tiers',
  POUR_TIERS: 'Pour un tiers',
  GROUPE: 'Groupe',
};

export default function RubriquesAdminEditPage() {
  const {
    handleSave, handleBackToList, handleUpdateChoice, setToast, toggleSection,
    handleAlternativeChange, handleCancelEdit, handleDeleteChoice, grades,
    expandedSection, totalCost, isFormValid, loading, saving, offerings,
    offeringsLoading, choice, view, editingRubrique, toast, originalChoice,
  } = useAdminRubriquesEditPage();

  if (loading || offeringsLoading) {
    return <RubriquesLoader loading={loading} offeringsLoading={offeringsLoading} />;
  }

  return (
    <motion.main
      className="mx-auto w-full bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 dark:from-[#070B1A] dark:via-[#0F1C3F] dark:to-[#162A56] p-4 md:p-6 lg:p-8 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      aria-label="Gestion des rubriques"
    >
      {/* Decorative elements */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2E5AA6] via-[#4F83D1] to-[#FFD600] z-50" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#2E5AA6]/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#4F83D1]/5 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#2E5AA6]/10 to-[#4F83D1]/10 dark:from-[#2E5AA6]/20 dark:to-[#4F83D1]/20 backdrop-blur-sm mb-4">
            <Sparkles className="w-4 h-4 text-[#FFD600] animate-pulse" />
            <span className="text-sm font-medium text-[#2E5AA6] dark:text-[#9BC2FF]">
              Administration
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#2E5AA6] via-[#4F83D1] to-[#FFD600] bg-clip-text text-transparent animate-gradient">
            Modifier le choix
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">

            Modifiez les détails de ce choix de consultation
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.section
          aria-labelledby="rubrique-edition-title"
          className="mt-8"
        >
          {/* Header Actions */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-white font-bold text-2xl">
                  {editingRubrique?.titre?.charAt(0) || 'R'}
                </span>
              </motion.div>
              <div>
                <h2 id="rubrique-edition-title" className="text-2xl font-bold text-[#2E5AA6] dark:text-[#9BC2FF]">
                  {editingRubrique?.titre || 'Nouvelle rubrique'}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {`Modification du choix "${originalChoice?.title || choice.title}"`
                  }
                </p>
              </div>
            </div>

            <div className="flex gap-2">

              <motion.button
                onClick={handleDeleteChoice}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <X className="w-4 h-4" />
                Supprimer
              </motion.button>

              <motion.button
                onClick={handleBackToList}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-[#0F1C3F] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#162A56] transition-all duration-200 shadow-sm hover:shadow-md group"
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Retour à la liste des rubriques"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Retour
              </motion.button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              {...ANIMATION_VARIANTS.scale}
              className="relative overflow-hidden rounded-2xl bg-white/95 dark:bg-[#0F1C3F]/95 backdrop-blur-sm shadow-2xl border border-slate-200/50 dark:border-slate-700/50"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#2E5AA6]/5 via-[#4F83D1]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#FFD600]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

              <div className="relative p-6 md:p-8">


                <div className="space-y-6">
                  {/* Section: Basic Information */}
                  <motion.div
                    layout
                    className="border-2 border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-white dark:bg-[#0F1C3F] shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1 space-y-4">
                        <FormField
                          label="Titre du choix"
                          description="Le nom qui apparaîtra pour les utilisateurs"
                          required
                          error={!choice.title?.trim() && choice.title !== '' ? 'Le titre est requis' : undefined}
                        >
                          <div className="relative">
                            <Edit3 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              value={choice.title || ''}
                              onChange={(e) => handleUpdateChoice({ ...choice, title: e.target.value })}
                              placeholder="Ex: Consultation personnalisée, Analyse approfondie..."
                              className="w-full pl-10 pr-3 py-2.5 text-sm font-medium rounded-lg border border-[#2E5AA6]/20 focus:ring-2 focus:ring-[#2E5AA6]/40 focus:border-[#2E5AA6] dark:border-white/10 dark:bg-[#0F1C3F] dark:text-slate-100 text-black transition"
                            />
                          </div>
                        </FormField>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {/* Grade selection */}
                          <FormField label="Grade associé" required error={!choice.gradeId ? 'Grade requis' : undefined}>
                            <select
                              value={typeof choice.gradeId === 'string' ? choice.gradeId : (choice.gradeId && typeof choice.gradeId === 'object' ? (choice.gradeId as any)._id : '')}
                              onChange={async e => {
                                const gradeId = e.target.value;
                                handleUpdateChoice({ ...choice, gradeId });
                              }}
                              className={`w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-[#0F1C3F] text-black transition ${!choice.gradeId
                                ? 'border-red-400 focus:ring-red-400'
                                : 'border-slate-300 dark:border-slate-600'
                                }`}
                              required
                            >
                              <option value="">Sélectionner un grade</option>
                              {grades.map(grade => (
                                <option key={grade._id} value={grade._id}>
                                  {grade.name}
                                </option>
                              ))}
                            </select>
                          </FormField>

                          {/* Frequency */}
                          <FormField label="Fréquence">
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <select
                                value={choice.frequence || ''}
                                onChange={e => handleUpdateChoice({ ...choice, frequence: e.target.value as FrequenceConsultation })}
                                className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-slate-300 bg-white dark:bg-[#0F1C3F] dark:border-slate-600 text-black"
                              >
                                <option value="">Sélectionner</option>
                                <option value="UNE_FOIS_VIE">🔮 Une fois dans la vie</option>
                                <option value="ANNUELLE">📅 Chaque année</option>
                                <option value="MENSUELLE">📆 Chaque mois</option>
                                <option value="QUOTIDIENNE">⭐ Chaque jour</option>
                                <option value="LIBRE">🕊️ À tout moment</option>
                              </select>
                            </div>
                          </FormField>

                          {/* Participants */}
                          <FormField label="Participants">
                            <div className="relative">
                              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <select
                                value={choice.participants || ''}
                                onChange={e => handleUpdateChoice({ ...choice, participants: e.target.value as TypeParticipants })}
                                className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-slate-300 bg-white dark:bg-[#0F1C3F] dark:border-slate-600 text-black"
                              >
                                <option value="">Sélectionner</option>
                                <option value="SOLO">👤 Solo</option>
                                <option value="AVEC_TIERS">👥 Avec tiers</option>
                                <option value="POUR_TIERS">🎁 Pour un tiers</option>
                                <option value="GROUPE">👨‍👩‍👧‍👦 Groupe</option>
                              </select>
                            </div>
                          </FormField>
                        </div>

                        {/* Description */}
                        <FormField label="Description" description="Décrivez ce choix en détail">
                          <textarea
                            value={choice.description || ''}
                            onChange={(e) => handleUpdateChoice({ ...choice, description: e.target.value })}
                            placeholder="Décrivez les bénéfices, le déroulement et ce que l'utilisateur peut attendre..."
                            rows={3}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#2E5AA6]/40 dark:border-white/10 dark:bg-[#0F1C3F] dark:text-slate-100 text-black resize-none"
                          />
                        </FormField>
                      </div>
                    </div>
                  </motion.div>

                  {/* Section: AI Configuration (Collapsible) */}
                  <motion.div
                    layout
                    className="border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-[#0F1C3F] shadow-md"
                  >
                    <button
                      onClick={() => toggleSection('ai')}
                      className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-[#162A56] transition"
                    >
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-[#FFD600]" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          Configuration IA
                        </span>
                        <span className="text-xs text-slate-500">(Optionnel)</span>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedSection === 'ai' ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {expandedSection === 'ai' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-700">
                            <FormField
                              label="Prompt personnalisé"
                              description="Guide l'IA pour l'analyse de ce choix spécifique"
                            >
                              <textarea
                                value={choice.prompt || ''}
                                onChange={(e) => handleUpdateChoice({ ...choice, prompt: e.target.value })}
                                placeholder="Ex: Analysez en profondeur les énergies subtiles, mettez l'accent sur les aspects spirituels..."
                                rows={3}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#2E5AA6]/40 dark:border-white/10 dark:bg-[#0F1C3F] dark:text-slate-100 text-black font-mono"
                              />
                            </FormField>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Section: PDF Upload */}
                  <motion.div
                    layout
                    className="border-2 border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-white dark:bg-[#0F1C3F] shadow-md"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5 text-[#4F83D1]" />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Document PDF associé
                      </span>
                      <span className="text-xs text-slate-500">(Optionnel - Max 20MB)</span>
                    </div>
                    <RubriquePdfUpload
                      previewName={
                        choice.pdfFile
                          ? typeof choice.pdfFile === 'string'
                            ? 'PDF associé'
                            : (choice.pdfFile as File).name
                          : null
                      }
                      onFileSelect={file => handleUpdateChoice({ ...choice, pdfFile: file })}
                      label=""
                      maxSizeMb={20}
                      showPreviewLink={!!choice.pdfFile}
                      fileUrl={
                        typeof choice.pdfFile === 'string'
                          ? choice.pdfFile
                          : (choice.pdfFile ? URL.createObjectURL(choice.pdfFile as File) : null)
                      }
                    />
                  </motion.div>

                  {/* Section: Offerings */}
                  <motion.div
                    layout
                    className="border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-[#0F1C3F] shadow-md"
                  >
                    <button
                      onClick={() => toggleSection('offering')}
                      className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-[#162A56] transition"
                    >
                      <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-[#2E5AA6]" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          Alternatives d'offrandes
                        </span>
                        <span className="text-xs text-red-500">* 3 requises</span>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedSection === 'offering' ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {expandedSection === 'offering' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-700">
                            <div className="space-y-3">
                              {choice.offering?.alternatives?.map((alt, idx) => (
                                <OfferingSelector
                                  key={alt.category || idx}
                                  alternative={alt}
                                  offerings={offerings}
                                  onChange={(updated) => handleAlternativeChange(idx, updated)}
                                />
                              ))}
                            </div>

                            {totalCost > 0 && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-gradient-to-r from-[#EEF4FF] to-[#DDE7FA] dark:from-[#0F1C3F] dark:to-[#162A56] p-4 border border-[#2E5AA6]/20"
                              >
                                <div className="flex items-center gap-2">
                                  <DollarSign className="w-5 h-5 text-[#2E5AA6] dark:text-[#9BC2FF]" />
                                  <span className="text-sm font-semibold text-[#16315F] dark:text-[#DDE7FA]">
                                    Coût total de la prestation
                                  </span>
                                </div>
                                <div className="text-2xl font-bold text-[#2E5AA6] dark:text-[#FFD600]">
                                  {totalCost.toLocaleString()} FCFA
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Info summary */}
                  <div className="flex flex-wrap gap-2">
                    {choice.frequence && (
                      <InfoBadge icon={Calendar} label="Fréquence" value={FREQUENCE_LABELS[choice.frequence] || choice.frequence} />
                    )}
                    {choice.participants && (
                      <InfoBadge icon={Users} label="Participants" value={PARTICIPANTS_LABELS[choice.participants] || choice.participants} />
                    )}
                    {choice.gradeId && (
                      <InfoBadge icon={Award} label="Grade" value="Configuré" />
                    )}
                    {choice.pdfFile && (
                      <InfoBadge icon={FileText} label="PDF" value="Téléchargé" color="text-green-500" />
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">

                  <motion.button
                    onClick={handleCancelEdit}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <X className="w-5 h-5" />
                    Annuler
                  </motion.button>


                  <motion.button
                    onClick={handleSave}
                    disabled={saving || !isFormValid}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg ${isFormValid
                      ? 'bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] text-white hover:from-[#244A8A] hover:to-[#3E6FB5] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                      : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                      }`}
                    whileHover={isFormValid ? { scale: 1.02 } : {}}
                    whileTap={isFormValid ? { scale: 0.98 } : {}}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Mise à jour...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Mettre à jour
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Validation messages */}
                {!isFormValid && !saving && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800"
                  >
                    <div className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold mb-1">Champs requis manquants :</p>
                        <ul className="list-disc list-inside space-y-0.5">
                          {!choice.title?.trim() && <li>Un titre est requis</li>}
                          {!choice.description?.trim() && <li>Une description est requise</li>}
                          {!choice.gradeId && <li>Un grade doit être sélectionné</li>}
                          {!choice.frequence && <li>Une fréquence doit être sélectionnée</li>}
                          {!choice.participants && <li>Le type de participants doit être sélectionné</li>}
                          {choice.offering?.alternatives?.length !== 3 && <li>3 alternatives d'offrandes sont requises</li>}
                          {choice.offering?.alternatives?.some(alt => !alt.offeringId) && <li>Toutes les alternatives doivent avoir une offrande sélectionnée</li>}
                          {choice.offering?.alternatives?.some(alt => alt.quantity <= 0) && <li>Toutes les quantités doivent être supérieures à 0</li>}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}

                {!saving && isFormValid && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 flex items-center justify-center gap-2 text-xs text-green-600 dark:text-green-400"
                  >
                    <CheckCircle className="w-3 h-3" />
                    <span>Tous les champs obligatoires sont remplis ✓</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.section>
      </div>

      <RubriquesToast toast={toast} onClose={() => setToast(null)} />
    </motion.main>
  );
}