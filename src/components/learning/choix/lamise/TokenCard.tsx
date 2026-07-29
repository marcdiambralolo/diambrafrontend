'use client';
import { CheckCircle2, Circle, Coins, Gift, Loader2 } from 'lucide-react';
import { memo } from 'react';

interface TokenCardProps {
    isSufficient: boolean;
    requiredQuantity: number;
    availableQuantity: number;
    cardClasses?: string;
    onPlayClick: () => void;
    isPending?: boolean;
}

export const TokenCard = memo(
    ({
        isSufficient,
        requiredQuantity,
        availableQuantity,
        cardClasses = '',
        onPlayClick,
        isPending = false,
    }: TokenCardProps) => {
        const isEnabled = isSufficient && !isPending;

        const ariaLabel = isPending
            ? 'Traitement en cours...'
            : isSufficient
                ? `Valider la mise de ${requiredQuantity} jeton${requiredQuantity > 1 ? 's' : ''}`
                : `Jetons insuffisants : ${requiredQuantity} requis, ${availableQuantity} disponible${availableQuantity > 1 ? 's' : ''}`;

        return (
            <button
                type="button"
                disabled={!isEnabled}
                onClick={onPlayClick}
                aria-busy={isPending}
                aria-label={ariaLabel}
                className={`
          group w-full flex items-center gap-3 p-3 rounded-2xl
          transition-all duration-200 text-left
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:opacity-60 disabled:cursor-not-allowed
          ${cardClasses}
        `}
            >
                <div className="flex-shrink-0">
                    {isPending ? (
                        <div className="p-1">
                            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" aria-hidden="true" />
                        </div>
                    ) : isSufficient ? (
                        <div className="rounded-full bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] p-1 shadow-sm">
                            <CheckCircle2 className="h-5 w-5 text-white" aria-hidden="true" />
                        </div>
                    ) : (
                        <div className="rounded-full border-2 border-gray-300 dark:border-gray-600 p-1">
                            <Circle className="w-5 h-5 text-gray-400 dark:text-gray-600" aria-hidden="true" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <Coins className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                        <span>
                            Jetons requis :{' '}
                            <strong className="text-gray-800 dark:text-gray-200 font-semibold">
                                {requiredQuantity}
                            </strong>
                        </span>
                    </div>
                    <div
                        className={`flex items-center mt-1.5 gap-2 text-xs ${isSufficient
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                            }`}
                    >
                        <Gift className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                        <span>
                            <strong className="font-semibold">{availableQuantity}</strong> disponible
                            {availableQuantity > 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
            </button>
        );
    }
);