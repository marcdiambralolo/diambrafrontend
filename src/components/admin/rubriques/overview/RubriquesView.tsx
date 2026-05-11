'use client';
import { getId } from '@/lib/functions';
import { Rubrique } from '@/lib/interfaces';
import { motion } from 'framer-motion';
import { memo } from 'react';
import { RubriqueCard } from './RubriqueCard';

const listVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.05, delayChildren: 0.03 } },
};

interface RubriquesViewProps {
  rubriques: Rubrique[];
  onOpenRubrique: (rubriqueId: string) => void;
}

export const RubriquesView = memo(function RubriquesView({ rubriques, onOpenRubrique }: RubriquesViewProps) {
  if (rubriques.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white/60 p-6 text-center text-[12px] text-slate-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300">
        Aucune rubrique trouvée pour ce domaine.
      </div>
    );
  }

  return (
    <motion.div 
      variants={listVariants} 
      initial="initial" 
      animate="animate" 
      className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
    >
      {rubriques.map((r: Rubrique) => (
        <RubriqueCard key={getId(r)} rubrique={r} onOpen={onOpenRubrique} />
      ))}
    </motion.div>
  );
});
