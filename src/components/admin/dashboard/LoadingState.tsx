'use client';
import { memo } from 'react';
import { motion,Variants  } from 'framer-motion';
import { Activity } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1,
    },
  },
};

const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const LoadingState = memo(() => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#070B1A] dark:via-[#0F1C3F] dark:to-[#070B1A]">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 90, 180, 270, 360],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-[#4F83D1]/10 to-[#9BC2FF]/10 blur-3xl dark:from-[#21457F]/10 dark:via-[#2E5AA6]/8 dark:to-[#4F83D1]/6"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6"
      >
        {/* Main spinner container */}
        <motion.div className="relative mb-6 sm:mb-8">
          {/* Outer glow ring */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-[#2E5AA6] via-[#4F83D1] to-[#9BC2FF] blur-2xl"
          />

          {/* Main animated spinner */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#2E5AA6] via-[#4F83D1] to-[#9BC2FF] p-[3px]">
              <div className="h-full w-full rounded-full bg-white dark:bg-[#0F1C3F]" />
            </div>
          </motion.div>

          {/* Center pulsing icon */}
          <motion.div
            animate={{
              scale: [0.9, 1.1, 0.9],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 dark:text-blue-400" />
          </motion.div>
        </motion.div>

        {/* Glassmorphic info card */}
        <motion.div
          variants={pulseVariants}
          animate="pulse"
          className="
            backdrop-blur-xl 
            bg-white/80 dark:bg-[#0F1C3F]/80 
            rounded-2xl px-6 py-5 sm:px-8 sm:py-6
            shadow-2xl 
            border border-slate-200/50 dark:border-[color:var(--theme-border)]
            text-center max-w-sm w-full
          "
        >
          <h2 className="mb-2 bg-gradient-to-r from-[#2E5AA6] via-[#4F83D1] to-[#9BC2FF] bg-clip-text text-lg font-bold text-transparent sm:text-xl">
            Chargement du tableau de bord
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mb-4">
            Préparation de vos statistiques...
          </p>

          {/* Animated progress dots */}
          <div className="flex items-center justify-center gap-1.5">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: index * 0.15,
                  ease: 'easeInOut',
                }}
                className="h-2 w-2 rounded-full bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1]"
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
});

LoadingState.displayName = 'LoadingState';

export default LoadingState;