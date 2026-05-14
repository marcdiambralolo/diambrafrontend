'use client';
import { ANIMATION_CONFIG, toastVariants, useCategoryConsulterClient } from '@/hooks/categorie/consulter/useCategoryConsulterClient';
import { OfferingAlternative } from "@/lib/interfaces";
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, Circle, Package, ShoppingBag, Sparkles } from 'lucide-react';
import { memo, useMemo } from "react";

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

export const CATEGORY_CONFIG = {
  banque: {
    label: "Banque",
    icon: "🏦",
    gradient: "from-blue-500 to-indigo-500",
    lightBg: "bg-blue-50",
    darkBg: "dark:bg-amber-900/20"
  }, 
};

interface OfferingCardProps {
  offering: OfferingAlternative;
  isSelected: boolean;
  availableQuantity: number;
  onSelect: () => void;
}

const OfferingCard = memo<OfferingCardProps>(({
  offering,
  isSelected,
  availableQuantity,
  onSelect }) => {
  const isSufficient = availableQuantity >= offering.quantity;
  const config = CATEGORY_CONFIG[offering.category];

  const cardClasses = useMemo(() => {
    const baseClasses = "w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left";

    if (isSelected) {
      return `${baseClasses} border-[#4F83D1] shadow-md`;
    }

    if (isSufficient) {
      return `${baseClasses} border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#9BC2FF] active:scale-[0.98]`;
    }

    return `${baseClasses} border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-50 cursor-not-allowed`;
  }, [isSelected, isSufficient]);

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05, duration: ANIMATION_CONFIG.duration.normal }}
      onClick={isSufficient ? onSelect : undefined}
      disabled={!isSufficient}
      className={cardClasses}
    >
      {/* Icône de sélection */}
      <div className="flex-shrink-0">
        {isSelected ? (
          <CheckCircle2 className="h-5 w-5 text-[#2E5AA6] dark:text-[#9BC2FF]" />
        ) : (
          <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
        )}
      </div>

       

      {/* Détails de l'offre */}
      <div className="flex-1 min-w-0">
        <div className="text-[11px] text-gray-600 dark:text-gray-400 space-y-0.5">
          <div>Jetons requis : <strong className="text-gray-800 dark:text-gray-200">{offering.quantity}</strong></div>
          <div className={isSufficient ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
            <strong>{availableQuantity}</strong> disponible(s)
          </div>
        </div>
      </div>
    </motion.button>
  );
});

const OfferingStepEmptyCategory = memo(() => (
  <div className="text-center py-12 px-4">
    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
      <Package className="w-8 h-8 text-gray-400" />
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      Aucune jeton dans cette catégorie
    </p>
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
    <div className="bg-red-500/95 dark:bg-red-600/95 backdrop-blur-sm text-white rounded-xl shadow-2xl px-4 py-3 flex items-start gap-3 border border-red-400/30">
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-snug">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-white/80 hover:text-white transition-colors duration-150 text-lg leading-none"
        aria-label="Fermer"
      >
        ×
      </button>
    </div>
  </motion.div>
));

interface StatusBannerProps {
  hasSelection: boolean;
  isSufficient: boolean;
}

const StatusBanner = memo<StatusBannerProps>(({ hasSelection, isSufficient }) => {
  if (!hasSelection) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-2 p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
      >
        <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-yellow-700 dark:text-yellow-300">
          Sélectionnez une offre disponible pour continuer
        </p>
      </motion.div>
    );
  }

  if (!isSufficient) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
      >
        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-red-700 dark:text-red-300">
          Quantité insuffisante. Rendez-vous au marché pour acquérir plus de jetons.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-start gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
    >
      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
      <p className="text-xs text-green-700 dark:text-green-300">
        Offre sélectionnée et disponible. Prêt à continuer !
      </p>
    </motion.div>
  );
});

export default function CategoryConsulterPageWrapper() {
  const {
    handleGoToMarket, handleNextNew, clearError,
    dataLoading, dataError, showError, currentError, state, pot,
  } = useCategoryConsulterClient();

  if (dataLoading) {
    return <CategoryLoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-base text-gray-500 dark:text-gray-400 font-bold">
                  Cette consultation nécessite des jetons
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto px-4 py-4 space-y-3 pb-8">
              <AnimatePresence mode="wait">
                <StatusBanner
                  hasSelection={!!state.selectedOffering}
                  isSufficient={state.canProceed}
                />
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={state.activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: ANIMATION_CONFIG.duration.fast }}
                  className="space-y-2"
                >
                  {state.currentOfferings.length === 0 ? (
                    <OfferingStepEmptyCategory />
                  ) : (
                    <OfferingCard
                      key={pot.offeringId}
                      offering={pot}
                      isSelected={state.selectedId === pot.offeringId}
                      availableQuantity={state.walletMap.get(pot.offeringId) || 0}
                      onSelect={() => state.handleSelect(pot.offeringId)}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="w-full max-w-2xl mx-auto px-4 py-3 space-y-2">
            <div className="flex gap-2">
              <button
                onClick={handleNextNew}
                disabled={!state.canProceed}
                className={`
                  flex-1 h-11 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]
                  ${state.canProceed
                    ? "bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] text-white shadow-lg shadow-[#2E5AA6]/20 hover:shadow-xl"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                <span>Valider</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleGoToMarket}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border-2 border-[#DDE7FA] bg-[#EEF4FF] text-sm font-semibold text-[#2E5AA6] transition-all active:scale-[0.98] hover:bg-[#DDE7FA] dark:border-[#2E5AA6]/45 dark:bg-[#0F1C3F]/35 dark:text-[#9BC2FF] dark:hover:bg-[#162A56]/45"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Marché des jetons</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {(showError || !!dataError) && (
          <ErrorToast message={currentError!} onClose={clearError} />
        )}
      </AnimatePresence>
    </div>
  );
}