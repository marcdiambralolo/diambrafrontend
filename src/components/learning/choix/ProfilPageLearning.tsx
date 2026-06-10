'use client';
import Loader from '@/app/loading';
import { useLaMise } from '@/hooks/learning/lamise/useLaMise';
import { useMonEtoileStore } from '@/lib/store/monetoile.store';
import { AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, Circle, Coins, Gift, ShoppingBag, } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import ErrorPage from '../commons/Erreur';
import { HeaderSection } from '../commons/Features';
import FixedContent from '../commons/FixedContent';
import GameFinishedCelebration from '../commons/GameFinishedCelebration';

const STATUS_BANNER_CONFIG = {
  sufficient: {
    bgGradient: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
    borderColor: "border-green-200 dark:border-green-800",
    iconBg: "bg-green-100 dark:bg-green-900/40",
    iconColor: "text-green-600 dark:text-green-400",
    titleColor: "text-green-800 dark:text-green-300",
    textColor: "text-green-700 dark:text-green-400/80",
    icon: CheckCircle2,
    title: "Prêt à valider"
  },
  insufficient: {
    bgGradient: "from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20",
    borderColor: "border-red-300 dark:border-red-800",
    iconBg: "bg-red-100 dark:bg-red-900/40",
    iconColor: "text-red-600 dark:text-red-400",
    titleColor: "text-red-800 dark:text-red-300",
    textColor: "text-red-700 dark:text-red-400/80",
    icon: AlertTriangle,
    title: "Jetons insuffisants"
  }
} as const;

const BUTTON_BASE_CLASSES =
  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

interface StatusBannerProps {
  isSufficient: boolean;
  requiredQuantity: number;
  availableQuantity: number;
}

interface TokenCardProps {
  isSufficient: boolean;
  requiredQuantity: number;
  availableQuantity: number;
  cardClasses: string;
  onPlayClick: () => void;
  isPending: boolean;
}

interface MarketButtonProps {
  onClick: () => void;
  isPending: boolean;
}

interface PlayButtonProps {
  isSufficient: boolean;
  onClick: () => void;
  isPending: boolean;
}

const StatusBanner = ({ isSufficient, requiredQuantity, availableQuantity }: StatusBannerProps) => {
  const missingTokens = requiredQuantity - availableQuantity;
  const config = STATUS_BANNER_CONFIG[isSufficient ? 'sufficient' : 'insufficient'];
  const Icon = config.icon;

  const message = useMemo(() => {
    if (isSufficient) {
      return `Vous disposez de ${availableQuantity} jeton${availableQuantity > 1 ? 's' : ''}`;
    }
    return `Il vous manque ${missingTokens} jeton${missingTokens > 1 ? 's' : ''}.`;
  }, [isSufficient, availableQuantity, missingTokens]);

  return (
    <div className={`relative overflow-hidden mb-1 flex items-start gap-3 p-2 rounded-2xl bg-gradient-to-r ${config.bgGradient} border ${config.borderColor}`}>
      <div className={`rounded-full ${config.iconBg} p-2 flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${config.iconColor}`} aria-hidden="true" />
      </div>
      <div className="flex-1">
        <p className={`text-sm font-semibold ${config.titleColor} flex items-center gap-2`}>
          {config.title}
          {isSufficient && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200">
              OK
            </span>
          )}
        </p>
        <p className={`text-xs ${config.textColor} mt-0.5`}>
          {message}
          {!isSufficient && (
            <strong className="ml-1 text-red-600 dark:text-red-400">{missingTokens}</strong>
          )}
        </p>
      </div>
    </div>
  );
};

const TokenCard = ({
  isSufficient,
  requiredQuantity,
  availableQuantity,
  cardClasses,
  onPlayClick,
  isPending
}: TokenCardProps) => {
  const missingTokens = requiredQuantity - availableQuantity;
  const isEnabled = isSufficient && !isPending;

  const handleClick = useCallback(() => {
    if (isEnabled) {
      onPlayClick();
    }
  }, [isEnabled, onPlayClick]);

  return (
    <button
      disabled={!isEnabled}
      onClick={handleClick}
      className={`${cardClasses} ${BUTTON_BASE_CLASSES} group`}
      aria-label={isSufficient ? "Valider la mise" : "Jetons insuffisants"}
      aria-disabled={!isEnabled}
    >
      <div className="flex-shrink-0">
        {isSufficient ? (
          <div className="rounded-full bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] p-1">
            <CheckCircle2 className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
        ) : (
          <div className="rounded-full border-2 border-gray-300 dark:border-gray-600 p-1">
            <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <Coins className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
          <span>
            Jetons requis : <strong className="text-gray-800 dark:text-gray-200">{requiredQuantity}</strong>
          </span>
        </div>
        <div className={`flex items-center mt-2 gap-2 text-xs ${isSufficient ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
          <Gift className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
          <span>
            <strong>{availableQuantity}</strong> disponible{availableQuantity > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {!isSufficient && (
        <div className="px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-bold flex-shrink-0">
          -{missingTokens}
        </div>
      )}
    </button>
  );
};

const PlayButton = ({ isSufficient, onClick, isPending }: PlayButtonProps) => {
  const isEnabled = isSufficient && !isPending;

  const buttonClasses = useMemo(() => `
    w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 ${BUTTON_BASE_CLASSES}
    ${isEnabled
      ? "bg-gradient-to-r from-[#2E5AA6] via-[#3A6BB8] to-[#4F83D1] text-white shadow-md hover:shadow-lg cursor-pointer"
      : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60"
    }
  `, [isEnabled]);

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
};

const MarketButton = ({ onClick, isPending }: MarketButtonProps) => (
  <button
    onClick={onClick}
    disabled={isPending}
    className="group w-full h-11 mt-4 mb-4 flex items-center justify-center gap-2 rounded-xl border-2 border-[#DDE7FA] bg-[#EEF4FF] text-sm font-semibold text-[#2E5AA6] dark:border-[#2E5AA6]/45 dark:bg-[#0F1C3F]/35 dark:text-[#9BC2FF] transition-colors hover:bg-[#E5EEFF] dark:hover:bg-[#1A2A5A]/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <ShoppingBag className="w-4 h-4" aria-hidden="true" />
        <span>Acquérir des jetons</span>
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </>
    )}
  </button>
);

const InsufficientTokensMessage = () => (
  <p className="text-center text-xs text-red-500 dark:text-red-400 mt-2">
    Vous ne disposez pas d&apos;assez de jetons.
  </p>
);

const ProfilPageLearning = () => {
  const gameIsFinished = useMonEtoileStore((state) => state.gameIsFinished);

  const {
    handlePlayClick, handleMarketClick,
    isSufficient, loading, requiredQuantity, error, availableQuantity, cardClasses,
  } = useLaMise();

  const statusBannerProps = {
    isSufficient,
    requiredQuantity,
    availableQuantity
  };

  const tokenCardProps = {
    isSufficient,
    requiredQuantity,
    availableQuantity,
    cardClasses,
    onPlayClick: handlePlayClick,
    isPending: loading
  };

  if (gameIsFinished) { return <GameFinishedCelebration />; }

  if (loading) { return <Loader />; }

  if (error) { return <ErrorPage />; }

  return (
    <div className="w-full mx-auto max-w-md">
      <div className="flex flex-col items-center justify-center">
        <HeaderSection />

        <div className="w-full max-w-md mx-auto flex flex-col items-center space-y-4">
          <StatusBanner {...statusBannerProps} />
          <TokenCard {...tokenCardProps} />

          <PlayButton
            isSufficient={isSufficient}
            onClick={handlePlayClick}
            isPending={loading}
          />
          {!isSufficient && <InsufficientTokensMessage />}
          <MarketButton onClick={handleMarketClick} isPending={loading} />
        </div>

        <FixedContent />
      </div>
    </div>
  );
};

export default ProfilPageLearning;