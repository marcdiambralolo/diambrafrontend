'use client';
import { RubriquesLoader } from '@/components/admin/rubriques/RubriquesLoader';
import { RubriquesToast } from '@/components/admin/rubriques/RubriquesToast';
import { useAdminRubriquesListPage } from '@/hooks/admin/rubriques/useAdminRubriquesListPage';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft, ChevronDown, ChevronUp, Copy, DollarSign, Edit3,
  Eye, Gift, MoreVertical, Plus,
  Sparkles, Trash2, TrendingUp
} from "lucide-react";
import Link from 'next/link';
import { useCallback, useState } from 'react';

const EmptyState = ({ rubriqueId }: { rubriqueId?: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, type: "spring" }}
    className="text-center py-16 px-4"
  >
    <motion.div
      animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#2E5AA6]/10 to-[#4F83D1]/10 mb-6"
    >
      <Sparkles className="w-12 h-12 text-[#2E5AA6] dark:text-[#9BC2FF]" />
    </motion.div>
    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-3">
      Aucun jeu
    </h3>
    <Link
      href={`/admin/rubriques/${rubriqueId}/add`}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
    >
      <Plus className="w-4 h-4" />
      Ajouter un jeu
    </Link>
  </motion.div>
);

const ContextMenu = ({ onEdit, onDuplicate, onToggleStatus, isActive }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
      >
        <MoreVertical className="w-4 h-4 text-slate-500" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#0F1C3F] rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden"
            >
              <button
                onClick={() => { onEdit(); setIsOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#162A56] transition"
              >
                <Edit3 className="w-4 h-4" />
                Modifier
              </button>
              <button
                onClick={() => { onDuplicate(); setIsOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#162A56] transition"
              >
                <Copy className="w-4 h-4" />
                Dupliquer
              </button>
              <button
                onClick={() => { onToggleStatus(); setIsOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#162A56] transition"
              >
                {isActive ? (
                  <>
                    <Eye className="w-4 h-4" />
                    Désactiver
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Activer
                  </>
                )}
              </button>
              <div className="border-t border-slate-200 dark:border-slate-700" />
              <button
                onClick={() => { onToggleStatus(); setIsOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Composant de carte de choix amélioré
const ChoiceCard = ({ choice, index, rubriqueId, isExpanded, isHovered, onExpand, onHoverStart, onHoverEnd, onDuplicate, onToggleStatus }: any) => {
  const totalPrice = choice.offering?.alternatives?.reduce((sum: number, alt: any) => sum + (alt.price || 0), 0) || 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05, type: "spring", stiffness: 300 }}
      whileHover={{ y: -4 }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      className="group relative"
    >
      {/* Effet de brillance au survol */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
        animate={{ opacity: isHovered ? 0.15 : 0 }}
      />

      <motion.div
        className={`relative bg-white dark:bg-[#0F1C3F] rounded-2xl border transition-all duration-300 overflow-hidden
          ${isHovered
            ? 'border-[#2E5AA6]/50 shadow-2xl scale-[1.02]'
            : 'border-slate-200 dark:border-slate-700 shadow-md'
          }`}
        animate={{ scale: isHovered ? 1.02 : 1 }}
      >
        {/* Badge de catégorie animé */}
        <motion.div
          className="absolute top-0 right-0 w-20 h-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className={`absolute top-0 right-0 w-0 h-0 border-l-[80px] border-l-transparent border-t-[80px] `} />
        </motion.div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* En-tête avec numéro et titre */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] flex items-center justify-center shadow-md"
                >
                  <span className="text-white font-bold text-sm">
                    {index + 1}
                  </span>
                </motion.div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                  {choice.title}
                </h3>



                {choice.consultationCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-400 text-xs border border-amber-200 dark:border-amber-800"
                  >
                    <TrendingUp className="w-3 h-3" />
                    {choice.consultationCount} Jeux
                  </motion.span>
                )}
              </div>


              {totalPrice > 0 && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#2E5AA6]/10 to-[#4F83D1]/10 dark:from-[#2E5AA6]/20 dark:to-[#4F83D1]/20 border border-[#2E5AA6]/20"
                >
                  <DollarSign className="w-4 h-4 text-[#2E5AA6] dark:text-[#9BC2FF]" />
                  <span className="text-sm font-bold text-[#2E5AA6] dark:text-[#9BC2FF]">
                    {totalPrice.toLocaleString()} FCFA
                  </span>
                  <Gift className="w-3 h-3 text-[#FFD600]" />
                </motion.div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <motion.button
                onClick={() => onExpand()}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </motion.button>

              <ContextMenu
                onEdit={() => window.location.href = `/admin/rubriques/${rubriqueId}/edit?idchoice=${choice._id}`}
                onDuplicate={() => onDuplicate(choice)}
                onToggleStatus={() => onToggleStatus(choice._id, !choice.hasActiveConsultation)}
                isActive={choice.hasActiveConsultation}
              />
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Link
              href={`/admin/rubriques/${rubriqueId}/edit?idchoice=${choice._id}`}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] text-white text-sm font-medium hover:shadow-md hover:scale-105 transition-all duration-200"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Modifier
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDuplicate(choice)}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#162A56] transition-all"
              title="Dupliquer"
            >
              <Copy className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function RubriquesAdminPage() {
  const {
    handleBackToList,
    setExpandedChoice,
    setHoveredChoice,
    setToast,
    loading,
    offeringsLoading,
    editingRubrique,
    toast,
    choices,
    expandedChoice,
    hoveredChoice,
  } = useAdminRubriquesListPage();

  const handleExpand = useCallback((choiceId: string) => {
    setExpandedChoice(expandedChoice === choiceId ? null : choiceId);
  }, [expandedChoice, setExpandedChoice]);

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
      {/* Éléments décoratifs animés */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2E5AA6] via-[#4F83D1] to-[#FFD600] z-50 animate-gradient-x" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#2E5AA6]/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#4F83D1]/5 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFD600]/5 rounded-full blur-3xl animate-pulse delay-2000" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* En-tête avec animation */}
        <motion.div

          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#2E5AA6]/10 to-[#4F83D1]/10 dark:from-[#2E5AA6]/20 dark:to-[#4F83D1]/20 backdrop-blur-sm mb-4"
          >
            <Sparkles className="w-4 h-4 text-[#FFD600] animate-pulse" />
            <span className="text-sm font-medium text-[#2E5AA6] dark:text-[#9BC2FF]">
              Administration
            </span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#2E5AA6] via-[#4F83D1] to-[#FFD600] bg-clip-text text-transparent animate-gradient">
            Gestion des rubriques
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Créez et personnalisez les choix de vos rubriques avec une expérience utilisateur optimale
          </p>
        </motion.div>

        {/* Bouton retour animé */}
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

        {/* Section principale */}
        <motion.section
          aria-labelledby="rubrique-edition-title"
          className="mt-4"
        >
          {/* En-tête de rubrique */}
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
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {choices.length} choix de consultation
                  </p>
                  {choices.length > 0 && (
                    <>
                      <div className="w-1 h-1 rounded-full bg-slate-400" />
                      <p className="text-xs text-slate-400">
                        {choices.length} actif(s)
                      </p>
                    </>
                  )}
                </div>
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

          {/* Liste des choix */}
          {choices.length === 0 ? (
            <EmptyState rubriqueId={editingRubrique?._id} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {choices.map((choice, index) => (
                  <ChoiceCard
                    key={choice._id}
                    choice={choice}
                    index={index}
                    rubriqueId={editingRubrique?._id}
                    isExpanded={expandedChoice === choice._id}
                    isHovered={hoveredChoice === choice._id}
                    onExpand={() => handleExpand(choice._id!)}
                    onHoverStart={() => setHoveredChoice(choice._id!)}
                    onHoverEnd={() => setHoveredChoice(null)}
                    onDuplicate={() => window.location.href = `/admin/rubriques/${editingRubrique?._id}/edit?idchoice=${choice._id}&duplicate=true`}
                    onToggleStatus={() => window.location.href = `/admin/rubriques/${editingRubrique?._id}/edit?idchoice=${choice._id}&toggleStatus=true`}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.section>
      </div>

      <RubriquesToast toast={toast} onClose={() => setToast(null)} />
    </motion.main>
  );
}