'use client';
import Loader from "@/app/loading";
import { useLaMise } from '@/hooks/learning/lamise/useLaMise';
import { AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, Circle, Coins, Gift, ShoppingBag } from "lucide-react";
import { memo, Suspense } from 'react';
import { FooterSection, HeaderSection, HelpButton } from '../commons/Features';
import LaBanniere from "../labanniere/LaBanniere";

const STATUS_BANNER_CONFIG = {
  sufficient: {
    bgGradient: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
    borderColor: "border-green-200 dark:border-green-800",
    iconBg: "bg-green-100 dark:bg-green-900/40",
    iconColor: "text-green-600 dark:text-green-400",
    titleColor: "text-green-800 dark:text-green-300",
    textColor: "text-green-700 dark:text-green-400/80"
  },
  insufficient: {
    bgGradient: "from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20",
    borderColor: "border-red-200 dark:border-red-800",
    iconBg: "bg-red-100 dark:bg-red-900/40",
    iconColor: "text-red-600 dark:text-red-400",
    titleColor: "text-red-800 dark:text-red-300",
    textColor: "text-red-700 dark:text-red-400/80"
  }
} as const;

interface StatusBannerProps {
  isSufficient: boolean;
  requiredQuantity: number;
  availableQuantity: number;
}

const StatusBanner = memo(({ isSufficient, requiredQuantity, availableQuantity }: StatusBannerProps) => {
  const missingTokens = requiredQuantity - availableQuantity;
  const config = STATUS_BANNER_CONFIG[isSufficient ? 'sufficient' : 'insufficient'];

  const title = isSufficient ? "Prêt à valider !" : "Jetons insuffisants";
  const message = isSufficient
    ? `Vous disposez de ${availableQuantity} jeton${availableQuantity > 1 ? 's' : ''}`
    : `Il vous manque ${missingTokens} jeton${missingTokens > 1 ? 's' : ''}.`;
  const Icon = isSufficient ? CheckCircle2 : AlertTriangle;

  return (
    <div className={`relative overflow-hidden mb-4 flex items-start gap-3 p-3 rounded-2xl bg-gradient-to-r ${config.bgGradient} border ${config.borderColor}`}>
      <div className={`rounded-full ${config.iconBg} p-1.5 flex-shrink-0`}>
        <Icon className={`w-4 h-4 ${config.iconColor}`} aria-hidden="true" />
      </div>
      <div>
        <p className={`text-sm font-semibold ${config.titleColor}`}>{title}</p>
        <p className={`text-xs ${config.textColor}`}>
          {isSufficient ? message : <>{message} <strong>{missingTokens}</strong></>}
        </p>
      </div>
    </div>
  );
});

interface TokenCardProps {
  isSufficient: boolean;
  requiredQuantity: number;
  availableQuantity: number;
  cardClasses: string;
  onClick: () => void;
}

const TokenCard = memo(({ isSufficient, requiredQuantity, availableQuantity, cardClasses, onClick }: TokenCardProps) => {
  const missingTokens = requiredQuantity - availableQuantity;

  return (
    <button
      disabled={!isSufficient}
      onClick={onClick}
      className={`${cardClasses} transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
      aria-label={isSufficient ? "Valider la mise" : "Jetons insuffisants"}
    >
      <div className="flex-shrink-0">
        {isSufficient ? (
          <div className="rounded-full bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] p-0.5">
            <CheckCircle2 className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
        ) : (
          <div className="rounded-full border-2 border-gray-300 dark:border-gray-600 p-0.5">
            <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <Coins className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
          <span>
            Jetons requis : <strong className="text-gray-800 dark:text-gray-200">{requiredQuantity}</strong>
          </span>
        </div>
        <div className={`flex items-center mt-2 gap-2 text-xs ${isSufficient ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
          <Gift className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
          <span><strong>{availableQuantity}</strong> disponible{availableQuantity > 1 ? 's' : ''}</span>
        </div>
      </div>

      {!isSufficient && (
        <div className="px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-semibold flex-shrink-0">
          -{missingTokens}
        </div>
      )}
    </button>
  );
});

interface PlayButtonProps {
  isSufficient: boolean;
  onClick: () => void;
  isPending: boolean;
}

const PlayButton = memo(({ isSufficient, onClick, isPending }: PlayButtonProps) => {
  const isEnabled = isSufficient && !isPending;

  const buttonClasses = `w-full h-12 mt-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isEnabled
    ? "bg-gradient-to-r from-[#2E5AA6] via-[#3A6BB8] to-[#4F83D1] text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
    : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60"
    }`;

  return (
    <button
      onClick={onClick}
      disabled={!isEnabled}
      className={buttonClasses}
      aria-busy={isPending}
      aria-label="Jouer maintenant"
    >
      {isPending ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Chargement...</span>
        </>
      ) : (
        <>
          <span>Jouer Maintenant</span>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </>
      )}
    </button>
  );
});

interface MarketButtonProps {
  onClick: () => void;
  isPending: boolean;
}

const MarketButton = memo(({ onClick, isPending }: MarketButtonProps) => (
  <button
    onClick={onClick}
    disabled={isPending}
    className="group w-full h-10 mt-4 mb-4 flex items-center justify-center gap-2 rounded-xl border-2 border-[#DDE7FA] bg-[#EEF4FF] text-sm font-semibold text-[#2E5AA6] dark:border-[#2E5AA6]/45 dark:bg-[#0F1C3F]/35 dark:text-[#9BC2FF] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    aria-label="Acquérir des jetons"
    aria-busy={isPending}
  >
    {isPending ? (
      <>
        <div className="w-4 h-4 border-2 border-[#2E5AA6] border-t-transparent rounded-full animate-spin" />
        <span>Chargement...</span>
      </>
    ) : (
      <>
        <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" aria-hidden="true" />
        <span>Acquérir des jetons</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
      </>
    )}
  </button>
));

const ProfilPageLearning = () => {
  const {
    handlePlayClick, handleMarketClick, isPendingMarket, requiredQuantity, loading,
    availableQuantity, cardClasses, isSufficient, deferredIsSufficient, isPendingPlay,
  } = useLaMise();

  if (loading) { return (<Loader />); }

  return (
    <div className="w-full mx-auto max-w-md pb-20 min-h-screen">
      <div className="flex flex-col items-center justify-center mb-8 space-y-4">
        <HeaderSection />

        <Suspense fallback={<Loader />}>
          <div className="w-full max-w-md mx-auto flex flex-col items-center">
            <StatusBanner
              isSufficient={deferredIsSufficient}
              requiredQuantity={requiredQuantity}
              availableQuantity={availableQuantity}
            />

            <TokenCard
              isSufficient={isSufficient}
              requiredQuantity={requiredQuantity}
              availableQuantity={availableQuantity}
              cardClasses={cardClasses}
              onClick={handlePlayClick}
            />

            <PlayButton
              isSufficient={isSufficient}
              onClick={handlePlayClick}
              isPending={isPendingPlay}
            />

            {!isSufficient && (
              <p className="text-center text-xs text-red-500 dark:text-red-400 mt-2 animate-in fade-in duration-300">
                Vous ne disposez pas d'assez de jetons.
              </p>
            )}

            <MarketButton
              onClick={handleMarketClick}
              isPending={isPendingMarket}
            />
          </div>
        </Suspense>

        <div className="fixed-bottom-content w-full space-y-4">
          <LaBanniere />
          <FooterSection />
          <HelpButton />
        </div>
      </div>
    </div>
  );
};

export default memo(ProfilPageLearning);