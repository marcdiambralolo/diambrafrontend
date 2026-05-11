'use client';
import { Category, useCategoryConsulterClient } from '@/hooks/categorie/consulter/useCategoryConsulterClient';
import { CATEGORY_CONFIG } from '@/lib/constants';
import { OfferingAlternative } from "@/lib/interfaces";
import { AnimatePresence, motion,Variants  } from 'framer-motion';
import { AlertCircle, AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, Circle, Package, ShoppingBag, Sparkles } from 'lucide-react';
import Image from "next/image";
import React, { memo } from "react";
import CategoryLoadingSpinner from '../commons/CategoryLoadingSpinner';

interface OfferingCardProps {
  offering: OfferingAlternative;
  isSelected: boolean;
  availableQuantity: number;
  onSelect: () => void;
  index: number;
}

export const OfferingCard: React.FC<OfferingCardProps> = memo(({ offering, isSelected, availableQuantity, onSelect, index }) => {
  const isSufficient = availableQuantity >= offering.quantity;
  const config = CATEGORY_CONFIG[offering.category];

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={isSufficient ? onSelect : undefined}
      disabled={!isSufficient}
      className={`
        w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left
        ${isSelected
          ? `border-[#4F83D1]  shadow-md`
          : isSufficient
            ? "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#9BC2FF] active:scale-[0.98]"
            : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-50 cursor-not-allowed"
        }
      `}
    >
      <div className="flex-shrink-0">
        {isSelected ? (
          <CheckCircle2 className="h-5 w-5 text-[#2E5AA6] dark:text-[#9BC2FF]" />
        ) : (
          <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
        )}
      </div>

      <div className={`
        w-16 h-16 rounded-lg flex items-center justify-center text-xl flex-shrink-0 overflow-hidden
        ${isSelected
          ? `bg-gradient-to-br ${config.gradient} text-white shadow-sm`
          : "bg-gray-100 dark:bg-gray-700"
        }
      `}>
         .
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
          {offering.name || `${config.label} ${index + 1}`}
        </h4>

        <div className="text-[11px] text-gray-600 dark:text-gray-400">
          <div className="mb-0.5">Offrande(s) Requise(s) :  <strong>{offering.quantity}</strong></div>
          <div className={isSufficient ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
            <strong>{availableQuantity}</strong> disponible(s) dans votre panier d'offrandes
          </div>
        </div>
      </div>
    </motion.button>
  );
});

export function OfferingStepEmptyCategory() {

  return (
    <div className="text-center py-12 px-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
        <Package className="w-8 h-8 text-gray-400" />
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Aucune offrande dans cette catégorie
      </p>
    </div>
  );
}

const toastVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 100,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 22
    }
  },
  exit: {
    opacity: 0,
    x: 100,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
};

interface ErrorToastProps {
  message: string;
  onClose: () => void;
}

export const ErrorToast = ({ message, onClose }: ErrorToastProps) => (
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
        className="flex-shrink-0 text-white/80 hover:text-white transition-colors duration-150"
        aria-label="Fermer"
      >
        <span className="text-lg leading-none">×</span>
      </button>
    </div>
  </motion.div>
);

interface TabButtonProps {
  category: Category;
  isActive: boolean;
  onClick: () => void;
  count: number;
}

export const TabButton: React.FC<TabButtonProps> = memo(({ category, isActive, onClick }) => {
  const config = CATEGORY_CONFIG[category];

  return (
    <button
      onClick={onClick}
      className={`
        flex-1 relative py-3 px-4 rounded-xl font-semibold text-sm transition-all
        ${isActive
          ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg`
          : `${config.lightBg} ${config.darkBg} text-gray-700 dark:text-gray-300 hover:opacity-80`
        }
      `}
    >
      <span className="flex items-center justify-center gap-1.5">
        <span className="text-base">{config.icon}</span>
        <span>{config.label}</span>
      </span>
    </button>
  );
});

interface OfferingStepTabsProps {
  activeTab: Category;
  categoryCounts: Record<Category, number>;
  onTabChange: (cat: Category) => void;
}

export function OfferingStepTabs({ activeTab, categoryCounts, onTabChange }: OfferingStepTabsProps) {

  return (
    <div className="flex gap-2">
      {(['animal', 'vegetal', 'beverage'] as Category[]).map(cat => (
        <TabButton
          key={cat}
          category={cat}
          isActive={activeTab === cat}
          onClick={() => onTabChange(cat)}
          count={categoryCounts[cat]}
        />
      ))}
    </div>
  );
}

interface StatusBannerProps {
  hasSelection: boolean;
  isSufficient: boolean;
}

export const StatusBanner: React.FC<StatusBannerProps> = memo(({ hasSelection, isSufficient }) => {
  if (!hasSelection) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-2 p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
      >
        <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-yellow-700 dark:text-yellow-300">
          Sélectionnez une alternative disponible pour continuer
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
          Quantité insuffisante. Rendez-vous au marché pour acquérir cette offrande.
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
        Alternative sélectionnée et disponible. Prêt à continuer !
      </p>
    </motion.div>
  );
});

export default function CategoryConsulterPageWrapper() {
  const {
    handleGoToMarket, clearError, consultation, contextInfo, dataLoading,
    dataError, title, showError, currentError, state,
  } = useCategoryConsulterClient();

  if (dataLoading) { return <CategoryLoadingSpinner />; }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
      <div className="w-full max-w-4xl mx-auto mb-4 sm:mb-6"        >
        <h1 className="bg-gradient-to-r mt-8 from-[#163A74] via-[#2E5AA6] to-[#4F83D1] bg-clip-text px-3 text-center text-xl font-bold text-transparent dark:from-white dark:via-[#DDE7FA] dark:to-[#9BC2FF] sm:text-3xl lg:text-3xl">
          {title}
        </h1>
      </div>

      <div className="space-y-4 sm:space-y-6"        >
        <div className="w-full max-w-3xl mx-auto theme-dark-panel relative isolate mb-4 sm:mb-6 flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-50/80 via-slate-50/60 to-white/80 text-center backdrop-blur-xl dark:border-[color:var(--theme-border)] dark:from-[#0F1C3F]/78 dark:via-[#162A56]/64 dark:to-[#0F1C3F]/78">
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#2E5AA6]/10 via-[#4F83D1]/10 to-[#9BC2FF]/8 dark:from-[#2E5AA6]/10 dark:via-[#4F83D1]/8 dark:to-[#9BC2FF]/8"
            style={{
              backgroundPosition: '0% 50%',
              backgroundSize: '200% 200%',
              animation: 'gradientAnimation 5s linear infinite',
            }}
          />

          <div className="relative z-10 px-4 py-3 sm:px-6 sm:py-4 w-full flex flex-col items-center justify-center text-center">
            <div className="max-w-4xl flex flex-col sm:flex-row items-center justify-center gap-2 mb-2"                                >
              <Sparkles className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-[#9BC2FF] sm:h-5 sm:w-5" />
              <span className="text-xs font-medium text-blue-900/70 dark:text-[#AFC0DE] sm:text-sm">
                Rubrique :
              </span>
              <span className="truncate text-xs font-semibold text-blue-950 dark:text-white sm:text-sm">
                {contextInfo.rubrique?.titre}
              </span>
            </div>

            <div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#2E5AA6] dark:text-[#9BC2FF] sm:h-5 sm:w-5" />
                <span className="text-xs font-medium text-[#163A74]/70 dark:text-[#AFC0DE] sm:text-sm">
                  Consultation :
                </span>
                <span className="text-xs font-semibold text-[#163A74] dark:text-white sm:text-sm">
                  {consultation?.title}
                </span>
              </div>

              <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed  dark:text-[#D1D5DB]">
                {contextInfo.choix?.description}
              </p>
            </div>

            <div className="pointer-events-none absolute -top-1 -right-1 h-20 w-20 rounded-full bg-gradient-to-br from-white/40 to-transparent dark:from-white/10 blur-2xl" />
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-center text-2xl sm:text-2xl md:text-2xl font-extrabold  select-none relative"    >
            <span className="block animate-gradient-x bg-gradient-to-r from-[#2E5AA6] via-[#4F83D1] to-orange-400 bg-clip-text text-transparent drop-shadow-lg"    >
              OFFRANDES
            </span>
          </ h1>
          <div className="max-w-2xl mx-auto px-4 py-3">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-base text-gray-500 dark:text-gray-400 font-bold">
                  Cette requête nécessite que vous fassiez une offrande.
                </p>

                <p className="text-base text-gray-500 dark:text-gray-400">
                  Choisissez entre une offrande animale, végétale ou boisson.
                </p>
              </div>
            </div>

            <OfferingStepTabs activeTab={state.activeTab} categoryCounts={state.categoryCounts} onTabChange={state.handleTabChange} />
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto px-4 py-4 space-y-3 pb-8">
              <AnimatePresence mode="wait">
                <StatusBanner
                  hasSelection={!!state.selectedOffering}
                  isSufficient={state.canProceed} />
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={state.activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2"
                >
                  {state.currentOfferings.length === 0 ? (
                    <OfferingStepEmptyCategory />
                  ) : (
                    state.currentOfferings.map((offering: OfferingAlternative, index: number) => (
                      <OfferingCard
                        key={offering.offeringId}
                        offering={offering}
                        isSelected={state.selectedId === offering.offeringId}
                        availableQuantity={state.walletMap.get(offering.offeringId) || 0}
                        onSelect={() => state.handleSelect(offering.offeringId)}
                        index={index} />
                    ))
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="w-full max-w-2xl mx-auto px-4 py-3 space-y-2">
            <div className="flex gap-2">
              <button
                onClick={state.handleNext}
                disabled={!state.canProceed}
                className={`flex-1 h-11 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${state.canProceed ? "bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] text-white shadow-lg shadow-[#2E5AA6]/20" : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"}`}
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
              <span>Marché des offrandes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showError || !!dataError && (
          <ErrorToast message={currentError!} onClose={clearError} />
        )}
      </AnimatePresence>
    </div>
  );
}