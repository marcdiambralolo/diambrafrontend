'use client';
import { AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, Circle, Coins, Gift, ShoppingBag } from "lucide-react";
import { memo, useCallback, useMemo, useTransition } from 'react';

const STATUS_BANNER_CONFIG = {
  sufficient: {
    bgGradient: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
    borderColor: "border-green-200 dark:border-green-800",
    iconBg: "bg-green-100 dark:bg-green-900/40",
    iconColor: "text-green-600 dark:text-green-400",
    titleColor: "text-green-800 dark:text-green-300",
    textColor: "text-green-700 dark:text-green-400/80",
    icon: CheckCircle2,
    title: "Prêt à valider !"
  },
  insufficient: {
    bgGradient: "from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20",
    borderColor: "border-red-200 dark:border-red-800",
    iconBg: "bg-red-100 dark:bg-red-900/40",
    iconColor: "text-red-600 dark:text-red-400",
    titleColor: "text-red-800 dark:text-red-300",
    textColor: "text-red-700 dark:text-red-400/80",
    icon: AlertTriangle,
    title: "Jetons insuffisants"
  }
} as const;

const BUTTON_BASE_CLASSES = "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

const ANIMATION_CLASSES = {
  hover: "hover:scale-[1.02] hover:shadow-lg",
  active: "active:scale-[0.98]",
  transition: "transition-all duration-200 ease-out"
} as const;

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

interface PlayButtonProps {
  isSufficient: boolean;
  onClick: () => void;
  isPending: boolean;
}

interface MarketButtonProps {
  onClick: () => void;
  isPending: boolean;
}

export const useTokenMessage = (isSufficient: boolean, availableQuantity: number, missingTokens: number) => {
  return useMemo(() => {
    if (isSufficient) {
      return `Vous disposez de ${availableQuantity} jeton${availableQuantity > 1 ? 's' : ''}`;
    }
    return `Il vous manque ${missingTokens} jeton${missingTokens > 1 ? 's' : ''}.`;
  }, [isSufficient, availableQuantity, missingTokens]);
};

export const StatusBanner = memo(({ isSufficient, requiredQuantity, availableQuantity }: StatusBannerProps) => {
  const missingTokens = requiredQuantity - availableQuantity;
  const config = STATUS_BANNER_CONFIG[isSufficient ? 'sufficient' : 'insufficient'];
  const Icon = config.icon;
  const message = useTokenMessage(isSufficient, availableQuantity, missingTokens);

  return (
    <div className={`
      relative overflow-hidden mb-5 flex items-start gap-3 p-4 
      rounded-2xl bg-gradient-to-r ${config.bgGradient} 
      border ${config.borderColor} animate-in slide-in-from-top duration-300
    `}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />

      <div className={`rounded-full ${config.iconBg} p-2 flex-shrink-0 backdrop-blur-sm`}>
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
});

export const TokenCard = memo(({
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
      className={`
        ${cardClasses} 
        ${BUTTON_BASE_CLASSES} 
        ${ANIMATION_CLASSES.hover}
        ${ANIMATION_CLASSES.active}
        ${ANIMATION_CLASSES.transition}
        group relative overflow-hidden
      `}
      aria-label={isSufficient ? "Valider la mise" : "Jetons insuffisants"}
      aria-disabled={!isEnabled}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

      <div className="flex-shrink-0">
        {isSufficient ? (
          <div className="rounded-full bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] p-1 shadow-lg">
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
        <div className={`
          flex items-center mt-2 gap-2 text-xs 
          ${isSufficient ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}
        `}>
          <Gift className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
          <span>
            <strong>{availableQuantity}</strong> disponible{availableQuantity > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {!isSufficient && (
        <div className="px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-bold flex-shrink-0 animate-pulse">
          -{missingTokens}
        </div>
      )}
    </button>
  );
});

export const PlayButton = memo(({ isSufficient, onClick, isPending }: PlayButtonProps) => {
  const isEnabled = isSufficient && !isPending;
  const [isLocalPending, startTransition] = useTransition();

  const handleClick = useCallback(() => {
    if (isEnabled) {
      startTransition(() => {
        onClick();
      });
    }
  }, [isEnabled, onClick]);

  const buttonClasses = useMemo(() => `
    w-full h-12 rounded-xl font-bold text-sm 
    flex items-center justify-center gap-2 
    ${BUTTON_BASE_CLASSES}
    ${isEnabled
      ? "bg-gradient-to-r from-[#2E5AA6] via-[#3A6BB8] to-[#4F83D1] text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer animate-gradient"
      : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60"
    }
  `, [isEnabled]);

  return (
    <button
      onClick={handleClick}
      disabled={!isEnabled}
      className={buttonClasses}
      aria-busy={isPending || isLocalPending}
      aria-label="Jouer maintenant"
    >
      {(isPending || isLocalPending) ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Chargement...</span>
        </>
      ) : (
        <>
          <span>Jouer Maintenant</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </>
      )}
    </button>
  );
});

export const MarketButton = memo(({ onClick, isPending }: MarketButtonProps) => {
  const [isLocalPending, startTransition] = useTransition();

  const handleClick = useCallback(() => {
    startTransition(() => {
      onClick();
    });
  }, [onClick]);

  return (
    <button
      onClick={handleClick}
      disabled={isPending || isLocalPending}
      className="group w-full h-11 mt-4 mb-4 flex items-center justify-center gap-2 rounded-xl border-2 border-[#DDE7FA] bg-[#EEF4FF] text-sm font-semibold text-[#2E5AA6] dark:border-[#2E5AA6]/45 dark:bg-[#0F1C3F]/35 dark:text-[#9BC2FF] transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Acquérir des jetons"
      aria-busy={isPending || isLocalPending}
    >
      {(isPending || isLocalPending) ? (
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
  );
});

export const InsufficientTokensMessage = memo(() => (
  <p className="text-center text-xs text-red-500 dark:text-red-400 mt-2 animate-in fade-in slide-in-from-top duration-300">
    Vous ne disposez pas d&apos;assez de jetons.
  </p>
));