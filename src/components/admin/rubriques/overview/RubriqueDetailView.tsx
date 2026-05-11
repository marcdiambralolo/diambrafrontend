'use client';
import { memo } from 'react';
import { motion } from 'framer-motion';
import ChoiceCard from './ChoiceCard';
import { getId, clamp } from '@/lib/functions';
import { ConsultationChoice, Rubrique } from '@/lib/interfaces';

const listVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.05, delayChildren: 0.03 } },
};

interface RubriqueDetailViewProps {
  rubrique: Rubrique;
  choices: ConsultationChoice[];
  onOpenChoice: (choiceId: string) => void;
}

export const RubriqueDetailView = memo(function RubriqueDetailView({ 
  rubrique, 
  choices, 
  onOpenChoice 
}: RubriqueDetailViewProps) {
  return (
    <div className="space-y-3">
      <div className="rounded-3xl border border-slate-200 bg-white/60 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="text-[11px] font-extrabold text-slate-500 dark:text-zinc-400">RUBRIQUE</div>
        <div className="mt-1 text-[15px] font-extrabold text-slate-900 dark:text-white">
          {rubrique?.titre ?? "—"}
        </div>
        
        <div className="mt-1 text-[12px] text-slate-600 dark:text-zinc-300 line-clamp-3">
          {rubrique?.description ? clamp(rubrique.description, 260) : "—"}
        </div>
      </div>

      <motion.div 
        variants={listVariants} 
        initial="initial" 
        animate="animate" 
        className="space-y-2"
      >
        {choices.map((c) => (
          <ChoiceCard key={getId(c)} choice={c} onOpen={onOpenChoice} />
        ))}
      </motion.div>
    </div>
  );
});
