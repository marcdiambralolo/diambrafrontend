'use client';
import { memo } from 'react';
import { motion,Variants  } from 'framer-motion';
import { Users } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.6, 0.05, 0.01, 0.9],
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

const UsersLoading = memo(() => (
  <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 dark:from-[#070B1A] dark:via-[#0F1C3F] dark:to-[#162A56]">
    <motion.div
      animate={{
        scale: [1, 1.15, 1],
        rotate: [0, 90, 180],
        opacity: [0.2, 0.4, 0.2],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: 'linear',
      }}
      className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-[#4F83D1]/20 to-[#7FA7E0]/20 blur-2xl dark:from-[#21457F]/16 dark:via-[#2E5AA6]/14 dark:to-[#4F83D1]/12"
    />

    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 flex flex-col items-center justify-center px-4"
    >
      {/* Icon container with pulse effect */}
      <motion.div
        variants={itemVariants}
        className="relative mb-6"
      >
        {/* Outer ring */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-[#2E5AA6] via-[#4F83D1] to-[#9BC2FF] opacity-40 blur-lg"
        />

        {/* Main icon circle */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="relative h-16 w-16 rounded-full bg-gradient-to-br from-[#2E5AA6] via-[#4F83D1] to-[#9BC2FF] p-[2px] shadow-xl sm:h-20 sm:w-20"
        >
          <div className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-[#0F1C3F]">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Users className="h-8 w-8 text-[#2E5AA6] dark:text-[#9BC2FF] sm:h-10 sm:w-10" />
            </motion.div>
          </div>
        </motion.div>

        {/* Orbiting dots */}
        {[0, 120, 240].map((rotate, index) => (
          <motion.div
            key={index}
            animate={{
              rotate: [rotate, rotate + 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
              delay: index * 0.1,
            }}
            className="absolute inset-0 flex items-start justify-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.2,
              }}
              className="h-2 w-2 rounded-full bg-gradient-to-r from-[#4F83D1] to-[#9BC2FF]"
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Text content */}
      <motion.div
        variants={itemVariants}
        className="rounded-xl border border-white/20 bg-white/50 px-6 py-3 backdrop-blur-sm dark:border-[color:var(--theme-border)] dark:bg-[#0F1C3F]/60"
      >
        <motion.p
          variants={itemVariants}
          className="bg-gradient-to-r from-[#2E5AA6] via-[#4F83D1] to-[#7FA7E0] bg-clip-text text-base font-semibold text-transparent sm:text-lg"
        >
          Chargement des utilisateurs...
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-3 h-1 w-32 overflow-hidden rounded-full bg-gray-200 dark:bg-[#162A56] sm:w-40"
        >
          <motion.div
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="h-full w-1/2 rounded-full bg-gradient-to-r from-[#2E5AA6] via-[#4F83D1] to-[#9BC2FF]"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  </div>
));

UsersLoading.displayName = 'UsersLoading';

export default UsersLoading;