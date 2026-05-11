'use client';
import { memo, useMemo } from 'react';
import { AnimatePresence, motion,Variants  } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface LoadingOverlayProps {
  loading: boolean;
  users: unknown[] | null | undefined;
}

export const LoadingOverlay = memo(function LoadingOverlay({ loading, users }: LoadingOverlayProps) {
  const overlayVariants: Variants = useMemo(() => ({
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } }
  }), []);

  return (
    <AnimatePresence>
      {loading && users && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-md dark:white/60"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="relative flex flex-col items-center gap-3 rounded-2xl border border-blue-200/50 bg-gradient-to-br from-white to-blue-50/80 p-6 shadow-2xl dark:border-[color:var(--theme-border)] dark:from-[#0F1C3F] dark:to-[#162A56]"
          >
            <motion.div
              className="relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <RefreshCw className="h-8 w-8 text-[#2E5AA6] dark:text-[#9BC2FF]" />
              <motion.div
                className="absolute inset-0 rounded-full bg-[#4F83D1]/30 blur-lg"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
            
            <div className="text-center">
              <p className="bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] bg-clip-text text-sm font-bold text-transparent">
                Chargement en cours...
              </p>
              
              <motion.div
                className="flex gap-1 justify-center mt-2"
                initial="hidden"
                animate="visible"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-[#4F83D1] dark:bg-[#9BC2FF]"
                    animate={{ y: [0, -8, 0], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});