'use client';
import { ANIMATION_CONFIG, toastVariants, useCategoryConsulterClient } from '@/hooks/choix/useCategoryConsulterClient';
import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, Circle, Coins, Gem, Gift, ShoppingBag, Zap } from "lucide-react";
import { memo } from 'react';

const CategoryLoadingSpinner = memo(() => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#EEF4FF] via-white to-slate-100 dark:from-[#070B1A] dark:via-[#0F1C3F] dark:to-[#070B1A]">
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 100 - 50, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
          className="absolute h-1 w-1 rounded-full bg-gradient-to-r from-[#4F83D1] to-[#9BC2FF] dark:from-[#7BA9F1] dark:to-[#DDE7FA]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
        />
      ))}
    </div>

    <div className="relative">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 h-32 w-32 rounded-full border-4 border-transparent border-r-[#4F83D1] border-t-[#2E5AA6] opacity-60 dark:border-r-[#9BC2FF] dark:border-t-[#4F83D1] sm:h-40 sm:w-40"
      />

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-2 rounded-full border-3 border-b-[#2E5AA6] border-l-[#7BA9F1] border-transparent opacity-80 dark:border-b-[#4F83D1] dark:border-l-[#9BC2FF] sm:inset-3"
      />

      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 h-32 w-32 rounded-full bg-gradient-to-br from-[#2E5AA6]/24 to-[#9BC2FF]/20 blur-xl dark:from-[#2E5AA6]/20 dark:to-[#4F83D1]/20 sm:h-40 sm:w-40"
      />

      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex h-32 w-32 items-center justify-center rounded-full border-2 border-[#4F83D1]/25 bg-gradient-to-br from-white via-[#EEF4FF] to-[#DDE7FA] shadow-2xl dark:border-[#355E9A]/45 dark:from-[#13274C] dark:via-[#0F1C3F] dark:to-[#162A56] sm:h-40 sm:w-40"
      >
        <motion.div
          animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Gem className="h-12 w-12 text-[#2E5AA6] dark:text-[#9BC2FF] sm:h-14 sm:w-14" strokeWidth={1.5} />
        </motion.div>
      </motion.div>

      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeOut"
          }}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: `${Math.cos(i * Math.PI / 6) * 75}px`,
            marginTop: `${Math.sin(i * Math.PI / 6) * 75}px`
          }}
          className="h-2 w-2 rounded-full bg-gradient-to-r from-[#4F83D1] to-[#9BC2FF] dark:from-[#7BA9F1] dark:to-[#DDE7FA]"
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
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="bg-gradient-to-r from-[#163A74] via-[#2E5AA6] to-[#4F83D1] bg-clip-text text-sm font-bold text-transparent dark:from-white dark:via-[#DDE7FA] dark:to-[#9BC2FF] sm:text-base"
      >
        Préparation de votre espace de jeu...
      </motion.p>

      <motion.div className="flex justify-center gap-2 mt-3">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.3, 1, 0.3],
              backgroundColor: ['#2E5AA6', '#9BC2FF', '#2E5AA6']
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
            className="h-2 w-2 rounded-full"
          />
        ))}
      </motion.div>
    </motion.div>
  </div>
));

interface ErrorToastProps {
  message: string;
  onClose: () => void;
}

const ErrorToast = memo<ErrorToastProps>(({ message, onClose }) => (
  <motion.div
    variants={toastVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="fixed bottom-4 right-4 z-50 max-w-sm"
  >
    <div className="bg-gradient-to-r from-red-500 to-red-600 backdrop-blur-sm text-white rounded-2xl shadow-2xl px-5 py-4 flex items-start gap-3 border border-red-400/30">
      <div className="rounded-full bg-white/20 p-1.5">
        <AlertCircle className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-snug">Erreur</p>
        <p className="text-xs text-white/90 mt-0.5">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-white/80 hover:text-white transition-all duration-200 hover:scale-110 text-xl leading-none w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10"
        aria-label="Fermer"
      >
        ×
      </button>
    </div>
  </motion.div>
));

interface StatusBannerProps {
  isSufficient: boolean;
  requiredQuantity: number;
  availableQuantity: number;
}

const StatusBanner = memo<StatusBannerProps>(({
  isSufficient,
  requiredQuantity,
  availableQuantity
}) => {
  if (!isSufficient) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative overflow-hidden flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-400/5 to-transparent" />
        <div className="rounded-full bg-red-100 dark:bg-red-900/40 p-2">
          <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-red-800 dark:text-red-300">
            Jetons insuffisants
          </p>
          <p className="text-xs text-red-700 dark:text-red-400/80 mt-0.5">
            Il vous manque <strong>{requiredQuantity - availableQuantity}</strong> jeton(s).
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-transparent" />
      <div className="rounded-full bg-green-100 dark:bg-green-900/40 p-2">
        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-green-800 dark:text-green-300">
          Prêt à valider !
        </p>
        <p className="text-xs text-green-700 dark:text-green-400/80 mt-0.5">
          Vous disposez de <strong>{availableQuantity}</strong> jeton(s) pour ce jeu
        </p>
      </div>
    </motion.div>
  );
});

export default function ProfilPageClient() {
  const {
    handleGoToMarket, handleNext, clearError,
    dataLoading, dataError, showError, currentError, availableQuantity,
    cardClasses, isSufficient, requiredQuantity,
  } = useCategoryConsulterClient();

  if (dataLoading) {
    return <CategoryLoadingSpinner />;
  }

  return (
    <div className="relative w-full mt-16 flex flex-col items-center justify-center sm:px-0 overflow-x-hidden  dark:bg-none dark:bg-[#0C0B1D] dark:bg-gradient-to-b dark:from-[#0C0B1D] dark:to-[#162A56]">
      <div className="mb-2 mt-6">
        <StatusBanner
          isSufficient={isSufficient}
          requiredQuantity={requiredQuantity}
          availableQuantity={availableQuantity}
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: ANIMATION_CONFIG.duration.normal }}
          disabled={!isSufficient}
          className={cardClasses}
        >
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
          <div className="flex-shrink-0">
            {isSufficient ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="rounded-full bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] p-1.5"
              >
                <CheckCircle2 className="h-5 w-5 text-white" />
              </motion.div>
            ) : (
              <div className="rounded-full border-2 border-gray-300 dark:border-gray-600 p-1.5">
                <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <Coins className="w-3.5 h-3.5" />
                <span>Jetons requis : <strong className="text-gray-800 dark:text-gray-200">{requiredQuantity}</strong></span>
              </div>
              <div className={`flex items-center gap-2 text-xs ${isSufficient ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                <Gift className="w-3.5 h-3.5" />
                <span><strong>{availableQuantity}</strong> disponible(s) dans votre wallet</span>
              </div>
            </div>
          </div>

          {isSufficient && (
            <motion.div
              animate={{ x: [0, -5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="flex-shrink-0"
            >
              <Zap className="w-5 h-5 text-[#2E5AA6] dark:text-[#9BC2FF]" />
            </motion.div>
          )}

          {!isSufficient && (
            <div className="flex-shrink-0">
              <div className="px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-semibold">
                {availableQuantity}/{requiredQuantity}
              </div>
            </div>
          )}
        </motion.button>
      </motion.div>

      <div className="mt-8 space-y-3">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={handleNext}
          disabled={!isSufficient}
          className={`
                w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98]
                ${isSufficient
              ? "bg-gradient-to-r from-[#2E5AA6] via-[#3A6BB8] to-[#4F83D1] text-white shadow-lg shadow-[#2E5AA6]/30 hover:shadow-xl hover:scale-[1.02] group cursor-pointer"
              : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60"
            }
              `}
        >
          <span>Jouer Maintenant</span>
          <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isSufficient ? "group-hover:translate-x-1" : ""}`} />
        </motion.button>

        {!isSufficient && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs text-red-500 dark:text-red-400 mt-2"
          >
            Vous ne disposez pas d'assez de jetons.
          </motion.p>
        )}

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={handleGoToMarket}
          className="group w-full h-10 flex items-center justify-center gap-2 rounded-xl border-2 border-[#DDE7FA] bg-[#EEF4FF] text-sm font-semibold text-[#2E5AA6] transition-all duration-300 active:scale-[0.98] hover:bg-[#DDE7FA] dark:border-[#2E5AA6]/45 dark:bg-[#0F1C3F]/35 dark:text-[#9BC2FF] dark:hover:bg-[#162A56]/45"
        >
          <ShoppingBag className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
          <span>Acquerir des jetons</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </motion.button>
      </div>
      
      {(showError || !!dataError) && (
        <ErrorToast message={currentError!} onClose={clearError} />
      )}
    </div>
  );
}