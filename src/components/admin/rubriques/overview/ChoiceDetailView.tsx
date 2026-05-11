'use client';
import { memo } from 'react';
import { motion } from 'framer-motion';
import AlternativePill from './AlternativePill';
import { getId, clamp } from '@/lib/functions';
import type { ConsultationChoice, OfferingAlternative } from '@/lib/interfaces';

type CategoryKey = "animal" | "vegetal" | "beverage";

const listVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.05, delayChildren: 0.03 } },
};

interface ChoiceDetailViewProps {
  choice: ConsultationChoice;
}

export const ChoiceDetailView = memo(function ChoiceDetailView({ choice }: ChoiceDetailViewProps) {
  return (
    <div className="space-y-3">
      <div className="rounded-3xl border border-slate-200 bg-white/60 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="text-[11px] font-extrabold text-slate-500 dark:text-zinc-400">CHOIX</div>
        <div className="mt-1 text-[15px] font-extrabold text-slate-900 dark:text-white">
          {choice?.title ?? "—"}
        </div>
        <div className="mt-1 text-[12px] text-slate-600 dark:text-zinc-300 line-clamp-4">
          {choice?.description ? clamp(choice.description, 320) : "—"}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/60 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="text-[12px] font-extrabold text-slate-900 dark:text-white">
          Offrandes alternatives
        </div>
        
        <div className="mt-2 flex flex-col gap-2">
          {Array.isArray(choice?.offering?.alternatives) && choice.offering.alternatives.length > 0 ? (
            <motion.div 
              variants={listVariants} 
              initial="initial" 
              animate="animate" 
              className="flex flex-col gap-2"
            >
              {choice.offering.alternatives.map((a: OfferingAlternative) => (
                <AlternativePill
                  key={getId(a)}
                  category={String(a.category) as CategoryKey}
                  offeringId={String(a.offeringId)}
                  quantity={Number(a.quantity ?? 1)}
                />
              ))}
            </motion.div>
          ) : (
            <div className="text-[12px] text-slate-600 dark:text-zinc-300">
              Aucune alternative configurée pour ce choix.
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
