'use client';
import { memo } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Sparkles } from 'lucide-react';

interface RefreshBannerProps {
  isRefreshing: boolean;
  loading: boolean;
  show: boolean;
}

const RefreshBanner = memo<RefreshBannerProps>(({ isRefreshing, loading, show }) => {
  if (!show) return null;

  const isBusy = isRefreshing || loading;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="
        relative overflow-hidden
        bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600
        dark:from-amber-600 dark:via-orange-600 dark:to-orange-700
        text-white rounded-2xl p-3 sm:p-4
        shadow-xl shadow-amber-500/30
        border border-amber-400/20
      "
    >
      <motion.div
        animate={{
          x: [-200, 200],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />

      <div className="relative flex items-center justify-center gap-2 sm:gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: isBusy ? 1.5 : 2.5, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.div>
        
        <span className="text-xs sm:text-sm font-semibold tracking-wide">
          Actualisation des données en cours
        </span>
        
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5] 
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </motion.div>
      </div>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  return prevProps.show === nextProps.show && prevProps.isRefreshing === nextProps.isRefreshing;
});

RefreshBanner.displayName = 'RefreshBanner';

export default RefreshBanner;