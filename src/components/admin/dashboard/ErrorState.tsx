'use client';
import { memo } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  error: string | null;
  isRefreshing: boolean;
  onRetry: () => void;
}

const ErrorState = memo<ErrorStateProps>(({ error, isRefreshing, onRetry }) => {

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="
          text-center max-w-md w-full 
          bg-white dark:bg-slate-900/50 
          backdrop-blur-xl
          rounded-3xl shadow-2xl 
          border border-slate-200 dark:border-slate-700
          p-6 sm:p-8
        "
      >
        <motion.div
          animate={{
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut"
          }}
          className="inline-flex p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 mb-4"
        >
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 dark:text-red-400" />
        </motion.div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Erreur de chargement
        </h2>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          {error || 'Impossible de charger les statistiques'}
        </p>

        <motion.button
          onClick={onRetry}
          disabled={isRefreshing}
          whileHover={!isRefreshing ? { scale: 1.02 } : {}}
          whileTap={!isRefreshing ? { scale: 0.98 } : {}}
          className="
            w-full px-6 py-3.5 
            bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600
            text-white rounded-xl 
            font-semibold text-sm sm:text-base
            shadow-lg shadow-amber-500/30
            hover:shadow-xl hover:shadow-amber-500/40
            transition-all duration-300
            flex items-center justify-center gap-2
            disabled:opacity-50 disabled:cursor-not-allowed
            disabled:hover:scale-100
          "
        >
          <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Chargement...' : 'Réessayer'}</span>
        </motion.button>
      </motion.div>
    </div>
  );
});

ErrorState.displayName = 'ErrorState';

export default ErrorState;