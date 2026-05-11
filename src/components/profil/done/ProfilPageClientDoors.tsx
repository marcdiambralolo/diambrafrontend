"use client";
import { useSlide4SectionDoorsGoDone } from "@/hooks/cinqetoiles/useSlide4SectionDoorsGoDone";
import { motion,Variants  } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { memo } from "react";

const SuccessIcon = memo(() => (
  <motion.div
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{
      type: "spring",
      stiffness: 260,
      damping: 20,
      mass: 0.8
    }}
    className="flex items-center justify-center mx-auto mb-6"
  >
    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 \
                    flex items-center justify-center shadow-2xl shadow-green-200/50 dark:shadow-green-900/30">
      <CheckCircle2 className="w-12 h-12 text-white" />
    </div>
  </motion.div>
));

export default function ProfilPageClientDoors() {
  const { handleBack, containerVariants, itemVariants, } = useSlide4SectionDoorsGoDone();

  return (
    <main className="w-full mx-auto mt-8 mb-16 flex flex-col items-center justify-center text-center">
      <main className="max-w-3xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl sm:rounded-[2rem] border border-gray-200/50 dark:border-gray-700/50 shadow-2xl shadow-gray-200/20 dark:shadow-gray-900/30 p-5 sm:p-8 md:p-10 space-y-8"
        >
          <motion.div variants={itemVariants} className="text-center">
            <SuccessIcon />
          </motion.div>

          <motion.div variants={itemVariants} className="text-center space-y-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              Félicitations !
            </h1>

            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
              Votre demande a été traitée avec succès.
              <span className="block mt-1 text-xs text-gray-500 dark:text-gray-500">
                Les résultats sont disponibles dans votre espace personnel.
              </span>
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 border border-green-100 dark:border-green-800/30">
              <p className="text-xs font-medium text-green-800 dark:text-green-300">✓ Opération terminée</p>
            </div>

            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/10 border border-blue-100 dark:border-blue-800/30">
              <p className="text-xs font-medium text-blue-800 dark:text-blue-300">✓ Rapport établi avec succès</p>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="border-t border-gray-100 dark:border-gray-700/50">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1.5">
              <span className="opacity-70">🙏</span>
              Merci pour votre confiance
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-6">
            <button
              onClick={handleBack}
              className="w-full h-12 px-6 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 text-white font-semibold text-sm sm:text-base hover:from-gray-800 hover:to-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-600 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-gray-900/10 dark:shadow-gray-900/30 touch-manipulation"
            >
              Retour à l'accueil
            </button>
          </motion.div>
        </motion.div>
      </main>

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-[#9BC2FF]/12 dark:bg-[#2E5AA6]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-blue-300/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
      </div>
    </main>
  );
}