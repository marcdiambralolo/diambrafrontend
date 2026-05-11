'use client';
import { memo } from 'react';
import { motion,Variants  } from 'framer-motion';
import { Package } from 'lucide-react';

const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

const containerVariants: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

const dotsVariants = {
  animate: {
    scale: [1, 1.3, 1],
    opacity: [0.3, 1, 0.3],
  },
};

export const RubriquesOverviewLoading = memo(function RubriquesOverviewLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full px-4">
      
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="flex flex-col items-center justify-center gap-4 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl bg-gradient-to-br from-white/90 to-slate-50/90 dark:from-zinc-900/90 dark:to-zinc-800/90 backdrop-blur-md border border-slate-200/50 dark:border-zinc-700/50 max-w-sm w-full"
      >
        <motion.div
          variants={spinnerVariants}
          animate="animate"
          className="relative"
        >
          <div className="absolute inset-0 rounded-full bg-[#2E5AA6]/20 dark:bg-[#4F83D1]/20 blur-2xl" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#2E5AA6] via-[#4F83D1] to-[#9BC2FF] shadow-lg sm:h-20 sm:w-20">
            <Package className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
        </motion.div>

        <div className="text-center space-y-2">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-sm sm:text-base font-bold text-slate-800 dark:text-zinc-100"
          >
            Chargement de l'architecture
          </motion.p>

          <div className="flex items-center justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                variants={dotsVariants}
                animate="animate"
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
                className="w-2 h-2 rounded-full bg-[#2E5AA6] dark:bg-[#9BC2FF]"
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
});
