'use client';
import { ANIMATION_CONFIG, toastVariants, useCategoryConsulterClient } from '@/hooks/categorie/consulter/useCategoryConsulterClient';
import { CATEGORY_CONFIG } from '@/lib/constants';
import { OfferingAlternative } from "@/lib/interfaces";
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { AlertCircle, AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, Circle, Package, ShoppingBag } from 'lucide-react';
import { memo, useMemo } from "react";
import CategoryLoadingSpinner from '../commons/CategoryLoadingSpinner';

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