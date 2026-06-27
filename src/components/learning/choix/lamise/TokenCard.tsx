'use client';
import { CheckCircle2, Circle, Coins, Gift } from 'lucide-react';
import { memo } from 'react';

interface TokenCardProps {
    isSufficient: boolean;
    requiredQuantity: number;
    availableQuantity: number;
    cardClasses: string;
    onPlayClick: () => void;
    isPending: boolean;
}

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

    return (
        <button
            type="button"
            disabled={!isEnabled}
            onClick={onPlayClick}
            className={`${cardClasses} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center gap-3 w-full`}
            aria-label={isSufficient ? "Valider la mise" : "Jetons insuffisants"}
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
});