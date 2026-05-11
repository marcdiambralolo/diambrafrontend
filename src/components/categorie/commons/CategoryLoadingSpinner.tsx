'use client';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { memo } from 'react';

const CategoryLoadingSpinner = memo(() => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#EEF4FF] via-white to-slate-100 dark:from-[#070B1A] dark:via-[#0F1C3F] dark:to-[#070B1A]">
    <div className="relative">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-0 h-28 w-28 rounded-full border-4 border-transparent border-r-[#4F83D1] border-t-[#2E5AA6] opacity-60 dark:border-r-[#9BC2FF] dark:border-t-[#4F83D1] sm:h-32 sm:w-32"
      />

      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 h-28 w-28 rounded-full bg-gradient-to-br from-[#2E5AA6]/24 to-[#9BC2FF]/20 blur-xl dark:from-[#2E5AA6]/20 dark:to-[#4F83D1]/20 sm:h-32 sm:w-32"
      />

      <motion.div
        animate={{ rotate: -360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-2 rounded-full border-3 border-b-[#2E5AA6] border-l-[#7BA9F1] border-transparent opacity-80 dark:border-b-[#4F83D1] dark:border-l-[#9BC2FF] sm:inset-3"
      />

      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative flex h-28 w-28 items-center justify-center rounded-full border-2 border-[#4F83D1]/25 bg-gradient-to-br from-white via-[#EEF4FF] to-[#DDE7FA] shadow-2xl dark:border-[#355E9A]/45 dark:from-[#13274C] dark:via-[#0F1C3F] dark:to-[#162A56] sm:h-32 sm:w-32"
      >
        <motion.div
          animate={{ rotate: [0, -15, 15, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles className="h-10 w-10 text-[#2E5AA6] dark:text-[#9BC2FF] sm:h-12 sm:w-12" strokeWidth={2} />
        </motion.div>
      </motion.div>

      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.25,
            ease: "easeOut"
          }}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: `${Math.cos(i * Math.PI / 4) * 60}px`,
            marginTop: `${Math.sin(i * Math.PI / 4) * 60}px`
          }}
          className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#4F83D1] to-[#9BC2FF] dark:from-[#7BA9F1] dark:to-[#DDE7FA] sm:h-2 sm:w-2"
        />
      ))}
    </div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="absolute bottom-1/3 left-1/2 -translate-x-1/2 text-center"
    >
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="bg-gradient-to-r from-[#163A74] via-[#2E5AA6] to-[#4F83D1] bg-clip-text text-sm font-bold text-transparent dark:from-white dark:via-[#DDE7FA] dark:to-[#9BC2FF] sm:text-base"
      >
        Chargement...
      </motion.p>
      
      <motion.div className="flex justify-center gap-1.5 mt-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
            className="h-1.5 w-1.5 rounded-full bg-[#2E5AA6] dark:bg-[#9BC2FF]"
          />
        ))}
      </motion.div>      
    </motion.div>
  </div>
));

CategoryLoadingSpinner.displayName = 'CategoryLoadingSpinner';

export default CategoryLoadingSpinner;