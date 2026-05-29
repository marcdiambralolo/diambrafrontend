'use client';
import { useEndGameGenerator } from "@/hooks/learning/endgame/useGameGenerator";
import { formatDate } from "@/lib/functions";
import { caldure } from "@/lib/learning/functions";
import { motion, AnimatePresence } from "framer-motion";
import { memo, useMemo } from "react";
import { MatchView } from "../game/Features";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { RotateCcw, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
 

export const InfoRowEndgame = memo(({ label, value }: { label: string; value: string | number | undefined }) => (
    <div className="flex justify-between py-2 border-b border-gray-200 last:border-0">
        <span className="font-semibold text-gray-700">{label}:</span>
        <span className="text-gray-900 font-medium">{value ?? 'N/A'}</span>
    </div>
));

InfoRowEndgame.displayName = "InfoRowEndgame";

export const EmptyStateEndGame = memo(() => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center text-gray-600 text-lg font-semibold mt-6 uppercase py-12 bg-gray-50 rounded-xl"
        role="alert"
        aria-live="polite"
    >
        🎮 Aucun jeu disponible
    </motion.div>
));

EmptyStateEndGame.displayName = "EmptyState";

export const FinMatchView = memo(() => {
    const { displayMatches: infomatch } = useEndGameGenerator();
    const datefin = useMemo(() => new Date().toISOString(), []);
    const monniveau = useMemo(() => infomatch?.[0]?.niveau ?? 0, [infomatch]);
    const montpsglobal = useMemo(() => infomatch?.[0]?.tpsglobal ?? 0, [infomatch]);
    const madatedebut = useMemo(() => infomatch?.[0]?.datedebut, [infomatch]);

    const stats = useMemo(() => {
        let scores = 0, trouves = 0, rates = 0;
        for (const match of infomatch ?? []) {
            scores += match.score || 0;
            trouves += match.trouves || 0;
            rates += match.rates || 0;
        }
        return { scores, trouves, rates };
    }, [infomatch]);

    const summaryDetails = useMemo(() => [
        { label: "🎮 Niveau", value: monniveau },
        { label: "🏆 Score total", value: stats.scores.toFixed(0) },
        { label: "✓ Trouvés", value: stats.trouves },
        { label: "✗ Ratés", value: stats.rates },
        { label: "📊 Nombre de matchs", value: infomatch.length },
        { label: "📅 Date de début", value: formatDate(madatedebut || new Date().toISOString()) },
        { label: "📅 Date de fin", value: formatDate(datefin) },
        { label: "⏱️ Temps écoulé", value: caldure(datefin, madatedebut || datefin) },
    ], [monniveau, stats, infomatch.length, madatedebut, datefin]);

    const hasMatches = infomatch && infomatch.length > 0;

    if (!hasMatches) {
        return <EmptyStateEndGame />;
    }

    return (
        <div className="w-full w-max-md mt-4 flex flex-col items-center justify-center px-2">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-6 shadow-md"
            >
                <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="w-12 h-0.5 bg-gradient-to-r from-purple-400 to-transparent" />
                    <h3 className="text-lg font-bold text-center text-purple-700">
                        {montpsglobal === 4 ? "📊 RÉSUMÉ DE LA PARTIE" : "🏆 RÉSULTATS FINAUX"}
                    </h3>
                    <div className="w-12 h-0.5 bg-gradient-to-l from-purple-400 to-transparent" />
                </div>

                <div className={montpsglobal === 4 ? "grid grid-cols-2 gap-2" : "space-y-1"}>
                    {summaryDetails.map((item) => (
                        <InfoRowEndgame key={item.label} label={item.label} value={item.value} />
                    ))}
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full space-y-4"
                >
                    {infomatch.map((match, index) => (
                        <MatchView
                            key={ index}
                            matchData={match}
                            index={index}
                        />
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
});

FinMatchView.displayName = "FinMatchView";

export default function ResultatsPage() {
    const router = useRouter();
    const { clearCompletedMatches } = useMonEtoileStore();

    const handleRecommencer = () => {
        clearCompletedMatches();
         router.push('/star/learning');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
            {/* Bouton Recommencer stylisé */}
            <div className="max-w-2xl mx-auto mb-6 flex items-center gap-2">
                <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRecommencer}
                    className="group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden ml-auto"
                >
                    {/* Effet de brillance */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                    <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    <span>Recommencer la competition</span>
                    <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
            </div>

            {/* Composant FinMatchView */}
            <FinMatchView />

            {/* Bouton Recommencer supplémentaire en bas */}
            <div className="max-w-2xl mx-auto mt-8 text-center">
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRecommencer}
                    className="group relative inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden"
                >
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                    <RotateCcw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                    <span className="text-lg">Recommencer une partie</span>
                    <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                </motion.button>
            </div>
        </div>
    );
}