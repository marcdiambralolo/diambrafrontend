'use client';
import { Rubrique } from "@/lib/interfaces";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar, CheckCircle, ChevronRight, Clock, Eye,
  FileText, Layers, Sparkles, TrendingUp
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface RubriquesListProps {
  rubriques: Rubrique[];
  onList: (rubrique: Rubrique) => void;
}

const StatBadge = ({ icon: Icon, label, value, color }: any) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-gradient-to-r from-slate-100 to-indigo-50 dark:from-[#162A56] dark:to-[#0F1C3F] border border-slate-200 dark:border-slate-700"
  >
    <Icon className={`w-3 h-3 ${color || 'text-[#2E5AA6]'}`} />
    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</span>
    <span className="text-xs font-bold text-[#2E5AA6] dark:text-[#9BC2FF]">{value}</span>
  </motion.div>
);

const RubriqueCard = ({ rubrique, index, onList }: { rubrique: Rubrique; index: number; onList: (rubrique: Rubrique) => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const rawCategoryId = rubrique.categorieId as unknown;
  const categoryRecord = typeof rawCategoryId === 'object' && rawCategoryId !== null
    ? rawCategoryId as { nom?: unknown; _id?: string }
    : null;
  const categoryLabel = typeof rawCategoryId === 'string'
    ? rawCategoryId
    : (typeof categoryRecord?.nom === 'string' ? categoryRecord.nom : 'Non catégorisé');

  const activeChoices = rubrique.consultationChoices?.filter(c => c.hasActiveConsultation).length || 0;
  const totalPrice = rubrique.consultationChoices?.reduce((sum, choice) => {
    const choicePrice = choice.offering?.alternatives?.reduce((s, alt) => s + (alt.price || 0), 0) || 0;
    return sum + choicePrice;
  }, 0) || 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05, type: "spring", stiffness: 300 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Effet de brillance au survol */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
        animate={{ opacity: isHovered ? 0.15 : 0 }}
      />

      {/* Badge décoratif */}
      <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-0 h-0 border-l-[96px] border-l-transparent border-t-[96px] border-t-[#2E5AA6]/10 dark:border-t-[#4F83D1]/10"
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className={`relative bg-white dark:bg-[#0F1C3F] rounded-2xl border transition-all duration-300 overflow-hidden
        ${isHovered
          ? 'border-[#2E5AA6]/50 shadow-2xl scale-[1.02]'
          : 'border-slate-200 dark:border-slate-700 shadow-md'
        }`}
      >
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* En-tête avec numéro et titre */}
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">
                      {rubrique.consultationChoices.length}
                    </span>
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-3 h-3 text-[#FFD600] fill-[#FFD600]" />
                  </motion.div>
                </motion.div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-xl text-slate-800 dark:text-white truncate">
                      {rubrique.titre}
                    </h3>
                    {activeChoices > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400 text-xs border border-green-200 dark:border-green-800"
                      >
                        <CheckCircle className="w-3 h-3" />
                        {activeChoices} actif(s)
                      </motion.span>
                    )}
                  </div>

                  {/* Métadonnées */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <StatBadge icon={Layers} label="Catégorie" value={categoryLabel} />
                    {rubrique.typeconsultation && (
                      <StatBadge icon={Calendar} label="Type" value={rubrique.typeconsultation} color="text-orange-500" />
                    )}
                    <StatBadge icon={FileText} label="Choix" value={rubrique.consultationChoices?.length || 0} />
                    {totalPrice > 0 && (
                      <StatBadge icon={TrendingUp} label="Prix total" value={`${totalPrice.toLocaleString()} FCFA`} color="text-purple-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                {rubrique.description || "Aucune description disponible"}
              </p>

              {/* ID avec effet de glassmorphisme */}
              <div className="flex items-center gap-2 mb-3">
                {rubrique.createdAt && (
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>Créé le {new Date(rubrique.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Aperçu des choix récents */}
              {rubrique.consultationChoices && rubrique.consultationChoices.length > 0 && (
                <div className="mt-3">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-1 text-xs font-medium text-[#2E5AA6] dark:text-[#9BC2FF] hover:underline transition"
                  >
                    <Eye className="w-3 h-3" />
                    {isExpanded ? "Masquer" : "Voir"} les choix récents
                    <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden mt-2"
                      >
                        <div className="space-y-1.5 pl-2 border-l-2 border-[#2E5AA6]/30">
                          {rubrique.consultationChoices.slice(0, 3).map((choice, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <span className="text-slate-600 dark:text-slate-400">
                                • {choice.title}
                              </span>
                              {choice.hasActiveConsultation && (
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                              )}
                            </div>
                          ))}
                          {rubrique.consultationChoices.length > 3 && (
                            <p className="text-xs text-slate-400 italic">
                              + {rubrique.consultationChoices.length - 3} autres choix
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onList(rubrique)}
                className="group/btn relative overflow-hidden px-4 py-2 rounded-xl bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] text-white text-sm font-semibold shadow-md hover:shadow-xl transition-all duration-200"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Gérer
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#4F83D1] to-[#2E5AA6]"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              <Link
                href={`/admin/rubriques/${rubrique._id}/update`}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-medium text-center hover:bg-slate-50 dark:hover:bg-[#162A56] hover:border-[#2E5AA6] transition-all duration-200"
              >
                Modifier
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export function RubriquesList({ rubriques, onList }: RubriquesListProps) {
  if (rubriques.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 px-4 bg-white dark:bg-[#0F1C3F] rounded-2xl border border-slate-200 dark:border-slate-700"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#2E5AA6]/10 to-[#4F83D1]/10 mb-4"
        >
          <Sparkles className="w-10 h-10 text-[#2E5AA6] dark:text-[#9BC2FF]" />
        </motion.div>
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Aucune rubrique
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Commencez par créer votre première rubrique
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {rubriques.map((rubrique, index) => (
          <RubriqueCard
            key={rubrique._id}
            rubrique={rubrique}
            index={index}
            onList={onList}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}