'use client';
import { useEndGameGenerator } from "@/hooks/learning/endgame/useGameGenerator";
import { formatDate } from "@/lib/functions";
import { colorReference, Theme } from "@/lib/learning/data";
import { caldure, generateLetterPairs } from "@/lib/learning/functions";
import { Case, MatchInfo } from "@/lib/learning/interface";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

const UnecaseFixe = memo(({ tpsglobal, txt, isLocked, size, mode, pieces }: Case & { pieces: string[] }) => {
    const letterPairs = generateLetterPairs();
    const caseRef = useRef<HTMLDivElement>(null);

    const updateFontSize = useCallback(() => {
        if (caseRef.current) {
            const newFontSize = `${caseRef.current.clientWidth * 0.5}px`;
            caseRef.current.style.fontSize = newFontSize;
            return newFontSize;
        }
        return "45px";
    }, []);

    const fontSize = useMemo(() => updateFontSize(), [updateFontSize]);
    const txtIndex = useMemo(() => parseInt(txt || "0", 10), [txt]);

    const couleurdefond = useMemo(() => {
        if (tpsglobal === 1) return colorReference[txtIndex] || "black";
        if (isLocked) return Theme.coulfondcaseverouille;
        return "black";
    }, [isLocked, tpsglobal, txtIndex]);

    const imagedefond = useMemo(() => {
        if (tpsglobal !== 2 || !pieces[txtIndex]) return "none";
        return `url(${pieces[txtIndex]})`;
    }, [pieces, tpsglobal, txtIndex]);

    const content = useMemo(() => {
        if (tpsglobal === 0) return txt;
        if (tpsglobal === 3) return letterPairs[txtIndex];

        const size = parseInt(fontSize, 10) || 100;

        const iconProps = {
            priority: true,
            alt: "icon",
            width: size,
            height: size,
            style: { textShadow: "2px 2px 5px rgba(0, 0, 0, 0.8)" },
        };

        switch (tpsglobal) {
            case 1:
                if (mode && isLocked) return <Image src="/momok.png" {...iconProps} alt="OK" />;
                break;
            case 2:
                if (mode && isLocked) return <Image src="/momok.png" {...iconProps} alt="OK" />;
                break;
            default:
                return txt;
        }
    }, [fontSize, isLocked, letterPairs, mode, tpsglobal, txt, txtIndex]);


    useEffect(() => {
        if (!caseRef.current) return;
        const observer = new ResizeObserver(updateFontSize);
        observer.observe(caseRef.current);
        return () => observer.disconnect();
    }, [updateFontSize]);

    return (
        <div ref={caseRef}
            className="text-white font-semibold flex items-center justify-center border border-white cursor-pointer overflow-hidden whitespace-nowrap aspect-square"
            style={{
                width: size,
                height: size,
                backgroundColor: couleurdefond,
                backgroundImage: imagedefond,
            }}
        >
            <span className="overflow-hidden min-w-0">{content}</span>
        </div>
    );
});

interface MatchViewProps {
    matchData: MatchInfo;
    index: number;
}

const MatchView = memo(({ matchData, index }: MatchViewProps) => {
    const [showFirstBoard, setShowFirstBoard] = useState(false);

    const toggleBoard = useCallback(() => {
        setShowFirstBoard(prev => !prev);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="w-full shadow-lg rounded-xl bg-white hover:shadow-2xl transition-all duration-300 overflow-hidden"
        >
            <div className="p-4">
                <div className="mb-3 pb-2 border-b border-gray-100">
                    <h4 className="text-lg font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Match {index + 1}
                    </h4>
                    {matchData.tpsglobal !== undefined && (
                        <p className="text-xs text-center text-gray-500 mt-1">
                            Type: {matchData.tpsglobal === 0 ? "Nombre" :
                                matchData.tpsglobal === 1 ? "Couleur" :
                                    matchData.tpsglobal === 2 ? "Image" :
                                        matchData.tpsglobal === 3 ? "Lettre" : "Global"}
                        </p>
                    )}
                </div>

                <div className="mt-2 text-center">
                    {showFirstBoard ? (
                        <PloaderEndGame match={matchData} initiale />
                    ) : (
                        <PloaderEndGame match={matchData} />
                    )}
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={toggleBoard}
                    className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl transition-all duration-300 hover:from-blue-600 hover:to-purple-600 font-medium shadow-md"
                    aria-label={showFirstBoard ? "Voir P2" : "Voir P1"}
                >
                    {showFirstBoard ? "🎯 Voir P1" : "👀 Voir P2"}
                </motion.button>

                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-green-50 rounded-lg p-2">
                        <span className="text-green-600 font-bold">{matchData.score?.toFixed(0) || 0}%</span>
                        <span className="text-gray-500 block">Score</span>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2">
                        <span className="text-blue-600 font-bold">{matchData.trouves || 0}</span>
                        <span className="text-gray-500 block">Trouvés</span>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-2">
                        <span className="text-orange-600 font-bold">{matchData.rates || 0}</span>
                        <span className="text-gray-500 block">Ratés</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

interface PloaderEndGameProps {
    match: MatchInfo;
    initiale?: boolean;
}

const PloaderEndGame = memo(({ match, initiale = false }: PloaderEndGameProps) => {
    const cases = useMemo(() =>
        initiale ? match?.listeCaseOpLabInitiale || [] : match?.listeCaseOpLab || [],
        [initiale, match?.listeCaseOpLab, match?.listeCaseOpLabInitiale]
    );

    const gridStyles = useMemo(() => {
        const size = match?.niveau || Math.sqrt(cases.length) || 3;
        return {
            gridTemplateColumns: `repeat(${size}, 1fr)`,
            gridTemplateRows: `repeat(${size}, 1fr)`,
        };
    }, [match?.niveau, cases.length]);

    if (!cases.length) {
        return (
            <div className="text-center text-gray-500 py-8">
                Aucune case disponible
            </div>
        );
    }

    return (
        <div className={"w-full grid"} style={gridStyles}>
            {cases.map((c) => (
                <UnecaseFixe
                    key={c.id}
                    {...c}
                    isLocked={!initiale}
                    size="100%"
                    pieces={match?.pieces || []}
                />
            ))}
        </div>
    );
});

const InfoRowEndgame = memo(({ label, value }: { label: string; value: string | number | undefined }) => (
    <div className="flex justify-between py-2 border-b border-gray-200 last:border-0">
        <span className="font-semibold text-gray-700">{label}:</span>
        <span className="text-gray-900 font-medium">{value ?? 'N/A'}</span>
    </div>
));

const EmptyStateEndGame = memo(() => (
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

const FinMatchView = memo(() => {
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
                            key={index}
                            matchData={match}
                            index={index}
                        />
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
});

export default function ResultatsPage() {
    const router = useRouter();
    const { clearCompletedMatches } = useMonEtoileStore();

    const handleRecommencer = () => {
        clearCompletedMatches();
        router.push('/star/learning');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
            <div className="max-w-2xl mx-auto mb-6 flex items-center gap-2">
                <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRecommencer}
                    className="group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden ml-auto"
                >
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                    <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    <span>Recommencer la competition</span>
                    <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
            </div>

            <FinMatchView />

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