'use client';
import { ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';
import { memo } from 'react';

interface PlayButtonProps {
    isSufficient: boolean;
    onClick: () => void;
    isPending: boolean;
}

export const PlayButton = memo(({ isSufficient, onClick, isPending }: PlayButtonProps) => {
    const isEnabled = isSufficient && !isPending;

    const buttonClasses = `
    w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
    ${isEnabled
            ? "bg-gradient-to-r from-[#2E5AA6] via-[#3A6BB8] to-[#4F83D1] text-white shadow-md cursor-pointer"
            : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60"
        }
  `;

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={!isEnabled}
            className={buttonClasses}
            aria-busy={isPending}
            aria-label="Jouer maintenant"
        >
            {isPending ? (
                <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" aria-hidden="true" />
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

export const MarketButton = memo(({ onClick, isPending }: MarketButtonProps) => (
    <button
        type="button"
        onClick={onClick}
        disabled={isPending}
        className="w-full h-11 mt-2 mb-2 flex items-center justify-center gap-2 rounded-xl border-2 border-[#DDE7FA] bg-[#EEF4FF] text-sm font-semibold text-[#2E5AA6] dark:border-[#2E5AA6]/45 dark:bg-[#0F1C3F]/35 dark:text-[#9BC2FF] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Acquérir des jetons"
        aria-busy={isPending}
    >
        {isPending ? (
            <>
                <div className="w-4 h-4 border-2 border-[#2E5AA6] border-t-transparent rounded-full" aria-hidden="true" />
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