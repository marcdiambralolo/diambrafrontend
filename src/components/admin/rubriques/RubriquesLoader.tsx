'use client';
import React, { memo } from "react";
import { motion,Variants  } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";

interface RubriquesLoaderProps {
  loading: boolean;
  offeringsLoading: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const floatVariants: Variants = {
  float: {
    y: [0, -8, 0],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const RubriquesLoader = memo<RubriquesLoaderProps>(({ loading, offeringsLoading }) => {
  const isOfferingsPhase = !loading && offeringsLoading;
  const message = isOfferingsPhase ? "Chargement des offrandes..." : "Chargement des rubriques...";
  const icon = isOfferingsPhase ? Sparkles : Loader2;

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-slate-100 dark:from-[#070B1A] dark:via-[#0F1C3F] dark:to-[#162A56]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Cercles décoratifs animés */}
      <motion.div
        variants={pulseVariants}
        animate="pulse"
        className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-gradient-to-br from-[#4F83D1]/10 to-[#9BC2FF]/10 blur-3xl"
      />
      <motion.div
        variants={pulseVariants}
        animate="pulse"
        style={{ animationDelay: "1s" }}
        className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-gradient-to-br from-blue-400/10 to-[#2E5AA6]/10 blur-3xl"
      />

      {/* Contenu principal */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center gap-4 p-6"
      >
        {/* Conteneur icon avec glow */}
        <motion.div
          variants={floatVariants}
          animate="float"
          className="relative"
        >
          {/* Glow effect */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 rounded-full bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] blur-xl"
          />

          {/* Icon container */}
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] shadow-2xl shadow-[#2E5AA6]/30">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {React.createElement(icon, {
                className: "w-10 h-10 text-white",
                strokeWidth: 2.5
              })}
            </motion.div>
          </div>
        </motion.div>

        {/* Message animé */}
        <motion.div
          variants={itemVariants}
          className="text-center space-y-2"
        >
          <motion.h3
            key={message}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-base font-bold text-gray-900 dark:text-white sm:text-lg"
          >
            {message}
          </motion.h3>
          <motion.p
            variants={itemVariants}
            className="text-xs text-gray-500 dark:text-[#AFC0DE] sm:text-sm"
          >
            Veuillez patienter quelques instants
          </motion.p>
        </motion.div>

        {/* Barre de progression animée */}
        <motion.div
          variants={itemVariants}
          className="h-1.5 w-48 overflow-hidden rounded-full bg-gray-200 dark:bg-[#162A56] sm:w-64"
        >
          <motion.div
            animate={{
              x: ["-100%", "100%"]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="h-full w-1/2 rounded-full bg-gradient-to-r from-[#2E5AA6] via-[#4F83D1] to-[#9BC2FF]"
          />
        </motion.div>

        {/* Points animés */}
        <motion.div
          variants={itemVariants}
          className="flex gap-1.5"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className="h-2 w-2 rounded-full bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1]"
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
});

RubriquesLoader.displayName = "RubriquesLoader";