'use client';
import { ArrowRight, ChevronRight, ShoppingBag } from 'lucide-react';
import { memo } from 'react';

interface ButtonSpinnerProps {
    className?: string;
}

const ButtonSpinner = ({ className = 'border-white' }: ButtonSpinnerProps) => (
    <div
        className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${className}`}
        aria-hidden="true"
    />
);

interface PlayButtonProps {
    isSufficient: boolean;
    isPending: boolean;
    onClick: () => void;
}

export const PlayButton = memo(({ isSufficient, isPending, onClick }: PlayButtonProps) => {
    const isEnabled = isSufficient && !isPending;

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={!isEnabled}
            aria-busy={isPending}
            aria-label={isPending ? 'Chargement en cours...' : 'Jouer maintenant'}
            className={`
        w-full h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:cursor-not-allowed
        ${isEnabled
                    ? 'bg-gradient-to-r from-[#2E5AA6] via-[#3A6BB8] to-[#4F83D1] text-white shadow-md active:scale-[0.99] cursor-pointer'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 opacity-60'
                }
      `}
        >
            {isPending ? (
                <>
                    <ButtonSpinner className="border-white" />
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
    isPending: boolean;
    onClick: () => void;
}

export const MarketButton = memo(({ onClick, isPending }: MarketButtonProps) => (
    <button
        type="button"
        onClick={onClick}
        disabled={isPending}
        aria-busy={isPending}
        aria-label={isPending ? 'Chargement en cours...' : 'Acquérir des jetons'}
        className="
      w-full h-11 my-2 flex items-center justify-center gap-2 rounded-xl border-2 
      border-[#DDE7FA] bg-[#EEF4FF] text-sm font-semibold text-[#2E5AA6]
      dark:border-[#2E5AA6]/45 dark:bg-[#0F1C3F]/35 dark:text-[#9BC2FF]
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
    "
    >
        {isPending ? (
            <>
                <ButtonSpinner className="border-[#2E5AA6] dark:border-[#9BC2FF]" />
                <span>Chargement en cours...</span>
            </>
        ) : (
            <>
                <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                <span>Acquérir des jetons</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </>
        )}
    </button>
));