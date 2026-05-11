'use client';
import { memo } from 'react';
import { motion,Variants  } from 'framer-motion';

const spinnerVariants: Variants = {
  initial: { scale: 0.8, opacity: 0.7 },
  animate: {
    scale: [0.8, 1.05, 0.95, 1],
    opacity: [0.7, 1, 0.9, 1],
    boxShadow: [
      '0 0 0px #34d399',
      '0 0 12px #34d399',
      '0 0 6px #34d399',
      '0 0 0px #34d399'
    ],
    transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
  }
};

const AdminPaymentsLoader = memo(() => (
  <div className="flex items-center justify-center min-h-[40vh] sm:min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <div className="flex flex-col items-center justify-center p-2 sm:p-4 rounded-xl shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 max-w-xs w-full mx-auto">
     
      <motion.div
        variants={spinnerVariants}
        initial="initial"
        animate="animate"
        className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-green-500 border-t-transparent rounded-full mb-2 sm:mb-3 animate-spin"
        style={{ boxShadow: '0 0 8px #34d399' }}
      />
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wide"
      >
        Chargement en cours...
      </motion.p>
    </div>
  </div>
));

export { AdminPaymentsLoader };