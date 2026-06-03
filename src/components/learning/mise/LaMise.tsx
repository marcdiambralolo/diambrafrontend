'use client';
import { useLaMise } from '@/hooks/learning/lamise/useLaMise';
import { AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, Circle, Coins, Gift, ShoppingBag } from "lucide-react";
import dynamic from 'next/dynamic';
import { Suspense, memo, useCallback, useDeferredValue, useMemo, useTransition } from 'react';

const Loader = dynamic(() => import('@/app/loading'), {
    ssr: false,
    loading: () => <div className="animate-pulse h-32 w-full bg-gray-100 rounded-xl" />
});

interface StatusBannerProps {
    isSufficient: boolean;
    requiredQuantity: number;
    availableQuantity: number;
}

const StatusBannerSkeleton = memo(() => (
    <div className="relative overflow-hidden mb-4 p-3 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 animate-pulse">
        <div className="flex items-start gap-3">
            <div className="rounded-full bg-gray-300 dark:bg-gray-600 p-1.5 w-7 h-7" />
            <div className="flex-1">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-2" />
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-48" />
            </div>
        </div>
    </div>
));

const ButtonSkeleton = memo(() => (
    <div className="w-full h-12 mt-4 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
));

const StatusBanner = memo(({ isSufficient, requiredQuantity, availableQuantity }: StatusBannerProps) => {
    const missingTokens = useMemo(() =>
        requiredQuantity - availableQuantity,
        [requiredQuantity, availableQuantity]
    );

    if (!isSufficient) {
        return (
            <div className="relative overflow-hidden mb-4 flex items-start gap-3 p-3 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800 will-change-transform">
                <div className="rounded-full bg-red-100 dark:bg-red-900/40 p-1.5 flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" aria-hidden="true" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                        Jetons insuffisants
                    </p>
                    <p className="text-xs text-red-700 dark:text-red-400/80">
                        Il vous manque <strong>{missingTokens}</strong> jeton{missingTokens > 1 ? 's' : ''}.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden flex items-start gap-3 mb-4 p-3 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 will-change-transform">
            <div className="rounded-full bg-green-100 dark:bg-green-900/40 p-1.5 flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" aria-hidden="true" />
            </div>
            <div>
                <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                    Prêt à valider !
                </p>
                <p className="text-xs text-green-700 dark:text-green-400/80">
                    Vous disposez de <strong>{availableQuantity}</strong> jeton{availableQuantity > 1 ? 's' : ''}
                </p>
            </div>
        </div>
    );
});

const TokenCard = memo(({
    isSufficient,
    requiredQuantity,
    availableQuantity,
    cardClasses,
    onClick
}: {
    isSufficient: boolean;
    requiredQuantity: number;
    availableQuantity: number;
    cardClasses: string;
    onClick: () => void;
}) => {
    const ratio = useMemo(() =>
        `${availableQuantity}/${requiredQuantity}`,
        [availableQuantity, requiredQuantity]
    );

    const missingTokens = useMemo(() =>
        requiredQuantity - availableQuantity,
        [requiredQuantity, availableQuantity]
    );

    return (
        <button
            disabled={!isSufficient}
            onClick={onClick}
            className={`${cardClasses} transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
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
                <div className={`flex items-center mt-2 gap-2 text-xs ${isSufficient
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                    }`}>
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

const PlayButton = memo(({ isSufficient, onClick, isPending }: {
    isSufficient: boolean;
    onClick: () => void;
    isPending: boolean;
}) => {
    const buttonClasses = useMemo(() => `
    w-full h-12 mt-4 rounded-xl font-bold text-sm 
    flex items-center justify-center gap-2 
    transition-all duration-200
    ${isSufficient && !isPending
            ? "bg-gradient-to-r from-[#2E5AA6] via-[#3A6BB8] to-[#4F83D1] text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60"
        }
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  `, [isSufficient, isPending]);

    return (
        <button
            onClick={onClick}
            disabled={!isSufficient || isPending}
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

const MarketButton = memo(({ onClick, isPending }: { onClick: () => void; isPending: boolean }) => (
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

export default function LaMise() {
    const { handleGoToMarket, handleNext, availableQuantity, cardClasses, isSufficient, requiredQuantity, loading } = useLaMise();
    const [isPendingPlay, startPlayTransition] = useTransition();
    const [isPendingMarket, startMarketTransition] = useTransition();

    const deferredIsSufficient = useDeferredValue(isSufficient);

    const handlePlayClick = useCallback(() => {
        if (!isSufficient) return;

        startPlayTransition(() => {
            handleNext();
        });
    }, [isSufficient, handleNext]);

    const handleMarketClick = useCallback(() => {
        startMarketTransition(() => {
            handleGoToMarket();
        });
    }, [handleGoToMarket]);

    const content = useMemo(() => {
        if (loading) return <Loader />;

        return (
            <div className="w-full max-w-md mx-auto flex flex-col items-center will-change-transform">
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
        );
    }, [
        loading,
        deferredIsSufficient,
        requiredQuantity,
        availableQuantity,
        isSufficient,
        cardClasses,
        handlePlayClick,
        isPendingPlay,
        handleMarketClick,
        isPendingMarket
    ]);

    return (
        <Suspense fallback={
            <div className="w-full max-w-md mx-auto">
                <StatusBannerSkeleton />
                <ButtonSkeleton />
                <ButtonSkeleton />
            </div>
        }>
            {content}
        </Suspense>
    );
}

if (typeof window !== 'undefined') {
    const prefetchRoutes = () => {
        const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
        idleCallback(() => {
            const prefetchLink = (href: string) => {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.as = 'document';
                link.href = href;
                document.head.appendChild(link);
            };

            prefetchLink('/jeu');
            prefetchLink('/marketplace');
        });
    };

    if (document.readyState === 'complete') {
        prefetchRoutes();
    } else {
        window.addEventListener('load', prefetchRoutes);
    }
}