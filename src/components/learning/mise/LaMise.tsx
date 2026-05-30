'use client';
import Loader from '@/app/loading';
import { ANIMATION_CONFIG } from '@/hooks/choix/useCategoryConsulterClient';
import { useLaMise } from '@/hooks/learning/lamise/useLaMise';
import { motion } from 'framer-motion';
import {
    AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, Circle, Coins,
    Gift, ShoppingBag, Zap,
} from "lucide-react";
import { memo } from 'react';

interface StatusBannerProps {
    isSufficient: boolean;
    requiredQuantity: number;
    availableQuantity: number;
}

export const StatusBanner = memo<StatusBannerProps>(({
    isSufficient,
    requiredQuantity,
    availableQuantity
}) => {
    if (!isSufficient) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="relative overflow-hidden mb-4 flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/5 to-transparent" />
                <div className="rounded-full bg-red-100 dark:bg-red-900/40 p-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                        Jetons insuffisants
                    </p>
                    <p className="text-xs text-red-700 dark:text-red-400/80 mt-0.5">
                        Il vous manque <strong>{requiredQuantity - availableQuantity}</strong> jeton(s).
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-transparent" />
            <div className="rounded-full bg-green-100 dark:bg-green-900/40 p-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
                <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                    Prêt à valider !
                </p>
                <p className="text-xs text-green-700 dark:text-green-400/80 mt-0.5">
                    Vous disposez de <strong>{availableQuantity}</strong> jeton(s) pour ce jeu
                </p>
            </div>
        </motion.div>
    );
});

interface OfferSelectionProps {
    isSufficient: boolean;
    requiredQuantity: number;
    availableQuantity: number;
    cardClasses: string;
    onNext: () => void;
    onGoToMarket: () => void;
}

export const OfferSelection = ({
    isSufficient, requiredQuantity, availableQuantity,
    cardClasses, onNext, onGoToMarket
}: OfferSelectionProps) => (
    <>
        <div className="mb-2 mt-6">
            <StatusBanner
                isSufficient={isSufficient}
                requiredQuantity={requiredQuantity}
                availableQuantity={availableQuantity}
            />
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: ANIMATION_CONFIG.duration.normal }}
                disabled={!isSufficient}
                className={cardClasses}
            >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                <div className="flex-shrink-0">
                    {isSufficient ? (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="rounded-full bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] p-1.5">
                            <CheckCircle2 className="h-5 w-5 text-white" />
                        </motion.div>
                    ) : (
                        <div className="rounded-full border-2 border-gray-300 dark:border-gray-600 p-1.5">
                            <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <Coins className="w-3.5 h-3.5" />
                            <span>Jetons requis : <strong className="text-gray-800 dark:text-gray-200">{requiredQuantity}</strong></span>
                        </div>
                        <div className={`flex items-center gap-2 text-xs ${isSufficient ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                            <Gift className="w-3.5 h-3.5" />
                            <span><strong>{availableQuantity}</strong> disponible(s)</span>
                        </div>
                    </div>
                </div>

                {isSufficient ? (
                    <motion.div animate={{ x: [0, -5, 0] }} transition={{ duration: 1, repeat: Infinity }} className="flex-shrink-0">
                        <Zap className="w-5 h-5 text-[#2E5AA6] dark:text-[#9BC2FF]" />
                    </motion.div>
                ) : (
                    <div className="flex-shrink-0">
                        <div className="px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-semibold">
                            {availableQuantity}/{requiredQuantity}
                        </div>
                    </div>
                )}
            </motion.button>
        </motion.div>

        <div className="mt-8 space-y-3">
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={onNext}
                disabled={!isSufficient}
                className={`
          w-full h-12 rounded-xl mb-4 font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98]
          ${isSufficient
                        ? "bg-gradient-to-r from-[#2E5AA6] via-[#3A6BB8] to-[#4F83D1] text-white shadow-lg shadow-[#2E5AA6]/30 hover:shadow-xl hover:scale-[1.02] group cursor-pointer"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60"
                    }
        `}
            >
                <span>Jouer Maintenant</span>
                <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isSufficient ? "group-hover:translate-x-1" : ""}`} />
            </motion.button>

            {!isSufficient && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-xs text-red-500 dark:text-red-400 mt-2">
                    Vous ne disposez pas d'assez de jetons.
                </motion.p>
            )}

            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={onGoToMarket}
                className="group w-full h-10 flex items-center justify-center gap-2 rounded-xl border-2 border-[#DDE7FA] bg-[#EEF4FF] text-sm font-semibold text-[#2E5AA6] transition-all duration-300 active:scale-[0.98] hover:bg-[#DDE7FA] dark:border-[#2E5AA6]/45 dark:bg-[#0F1C3F]/35 dark:text-[#9BC2FF] dark:hover:bg-[#162A56]/45"
            >
                <ShoppingBag className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                <span>Acquérir des jetons</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
        </div>
    </>
);

export default function LaMise() {
    const {
        handleGoToMarket, handleNext, availableQuantity, cardClasses, isSufficient, requiredQuantity, loading,
    } = useLaMise();

    if (loading) return <Loader />;

    return (
        <div className="flex flex-col items-center justify-center w-full py-4 mb-4">
            <OfferSelection
                isSufficient={isSufficient}
                requiredQuantity={requiredQuantity}
                availableQuantity={availableQuantity}
                cardClasses={cardClasses}
                onNext={handleNext}
                onGoToMarket={handleGoToMarket}
            />
        </div>
    );
}