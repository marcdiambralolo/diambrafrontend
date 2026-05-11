'use client';
import { memo } from 'react';
import { motion,Variants  } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface RubriquesOverviewErrorProps {
  error: string;
  onRetry?: () => void;
}

const containerVariants: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

const iconVariants: Variants = {
  animate: {
    rotate: [0, 10, -10, 10, -10, 0],
    transition: {
      duration: 0.6,
      repeat: 2,
      ease: 'easeInOut',
    },
  },
};

export const RubriquesOverviewError = memo(function RubriquesOverviewError({ 
  error, 
  onRetry 
}: RubriquesOverviewErrorProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full px-4">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="flex flex-col items-center justify-center gap-4 sm:gap-5 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl bg-gradient-to-br from-red-50/90 to-rose-50/90 dark:from-red-950/90 dark:to-rose-950/90 backdrop-blur-md border border-red-200/50 dark:border-red-800/50 max-w-md w-full text-center"
      >
        <motion.div
          variants={iconVariants}
          animate="animate"
          className="relative"
        >
          <div className="absolute inset-0 bg-red-500/20 dark:bg-red-400/20 rounded-full blur-2xl" />
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/50 dark:to-rose-900/50 flex items-center justify-center shadow-lg">
            <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600 dark:text-red-400" />
          </div>
        </motion.div>

        <div className="space-y-2">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-sm sm:text-base font-bold text-red-800 dark:text-red-200"
          >
            Erreur de chargement
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-xs sm:text-sm text-red-600 dark:text-red-300 leading-relaxed"
          >
            {error}
          </motion.p>
        </div>

        {onRetry && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-500 dark:to-rose-500 text-white text-sm font-bold hover:from-red-700 hover:to-rose-700 dark:hover:from-red-600 dark:hover:to-rose-600 shadow-lg hover:shadow-xl transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </motion.button>
        )}
      </motion.div>
    </div>
  );
});