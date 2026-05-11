'use client';
import { memo } from 'react';
import { motion,Variants  } from 'framer-motion';
import { Package, Plus, Sparkles } from "lucide-react";

interface RubriquesHeaderProps {
  rubriquesCount: number;
  offeringsCount: number;
  onCreate: () => void;
}

const headerVariants: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      type: 'spring',
      stiffness: 200,
      damping: 20
    }
  }
};

const iconVariants: Variants = {
  initial: { scale: 0.8, rotate: -10 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 15
    }
  }
};

export const RubriquesHeader = memo(function RubriquesHeader({
  rubriquesCount,
  offeringsCount,
  onCreate
}: RubriquesHeaderProps) {
  return (
    <motion.div
      variants={headerVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8"
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <motion.div
          variants={iconVariants}
          whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl bg-gradient-to-br from-[#163A74] via-[#2E5AA6] to-[#4F83D1] p-2.5 shadow-lg sm:rounded-2xl sm:p-3"
        >
          <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </motion.div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Gestion des rubriques
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-0.5 flex items-center gap-2 text-xs text-slate-600 dark:text-[#AFC0DE] sm:text-sm"
          >
            <span className="inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-[#2E5AA6] dark:text-[#9BC2FF]" />
              <strong className="font-bold text-slate-800 dark:text-[#DDE7FA]">{rubriquesCount}</strong> rubriques
            </span>
            <span className="text-slate-400 dark:text-[#5B78AD]">•</span>
            <span>
              <strong className="font-bold text-slate-800 dark:text-[#DDE7FA]">{offeringsCount}</strong> offrandes
            </span>
          </motion.p>
        </div>
      </div>

      <motion.button
        onClick={onCreate}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="theme-dark-primary-button flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:from-[#254A8B] hover:to-[#3F73BE] hover:shadow-xl sm:rounded-2xl sm:px-5 sm:py-3 sm:text-base"
      >
        <motion.div
          whileHover={{ rotate: 90 }}
          transition={{ duration: 0.3 }}
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.div>

        <span className="hidden sm:inline">Nouvelle rubrique</span>
        <span className="sm:hidden">Nouvelle</span>
      </motion.button>
    </motion.div>
  );
});