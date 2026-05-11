'use client';
import { memo } from "react";
import { motion,Variants  } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";
import { clamp, getId } from "@/lib/functions";
import type { Rubrique } from "@/lib/interfaces";

const itemVariants: Variants = {
  initial: { opacity: 0, y: 10, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
};

const RubriqueCard = memo(function RubriqueCard({
  rubrique,
  onOpen,
}: {
  rubrique: Rubrique;
  onOpen: (rubriqueId: string) => void;
}) {
  const rid = getId(rubrique);
  const count = Array.isArray(rubrique?.consultationChoices) ? rubrique.consultationChoices.length : 0;

  return (
    <motion.button
      type="button"
      variants={itemVariants}
      onClick={() => onOpen(rid)}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      aria-label={`Ouvrir la rubrique ${rubrique?.titre}`}
      className="group relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white/90 to-slate-50/80 dark:from-zinc-900/90 dark:to-zinc-800/80 p-3 sm:p-4 text-left shadow-md hover:shadow-xl backdrop-blur-md dark:border-zinc-700/50 transition-all"
    >
      {/* Gradient top bar with animation */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#2E5AA6] via-[#4F83D1] to-[#9BC2FF] dark:from-[#2E5AA6] dark:via-[#4F83D1] dark:to-[#9BC2FF]">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2E5AA6]/10 via-[#4F83D1]/10 to-transparent dark:from-[#2E5AA6]/20 dark:via-[#4F83D1]/20" />
      </div>

      <div className="relative pt-1 sm:pt-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0 space-y-1 sm:space-y-1.5">
            <div className="flex items-center gap-2">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.4 }}
                className="flex-shrink-0"
              >
                <Sparkles className="w-4 h-4 text-[#2E5AA6] dark:text-[#9BC2FF]" />
              </motion.div>
              <h3 className="truncate text-sm sm:text-[15px] font-extrabold text-slate-900 dark:text-white">
                {rubrique?.titre ?? "Rubrique"}
              </h3>
            </div>
            <p className="line-clamp-2 text-[11px] sm:text-[12px] leading-relaxed text-slate-600 dark:text-zinc-300">
              {rubrique?.description ? clamp(rubrique.description, 120) : "—"}
            </p>
          </div>

         
        </div>
         <div className="flex flex-col items-center gap-2">
            <motion.span
              whileHover={{ scale: 1.1 }}
              className="inline-flex items-center rounded-full bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-100 px-2.5 py-1 text-[10px] sm:text-[11px] font-extrabold text-white dark:text-zinc-900 shadow-sm"
            >
              {count} choix 
            </motion.span>
            
            <motion.span
              whileHover={{ scale: 1.1, rotate: 90 }}
              transition={{ type: 'spring', stiffness: 400 }}
              className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-200 shadow-sm group-hover:border-[#4F83D1] dark:group-hover:border-[#2E5AA6] transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </motion.span>
          </div>
      </div>
    </motion.button>
  );
});

export { RubriqueCard };