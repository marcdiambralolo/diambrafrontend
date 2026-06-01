'use client';
import { useGameGenerator } from '@/hooks/learning/useGameGenerator';
import { Case } from '@/lib/interfaces';
import { formatTime } from '@/lib/learning/functions';
import { BarChartOutlined, TrophyOutlined } from '@ant-design/icons';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { memo, useCallback, useMemo, useState } from 'react';
import ResultatsPage from '../endgame/ResultatsPage';
import { ActionButton, EmptyState, InfoRowGame, ObjectiveCard, Unecase } from './Features';
import Loader from '@/app/loading';

const GRID_BASE_STYLES = "w-full grid";

// ============================================================================
// ANIMATIONS POUR P1 (FLIP 3D) - UNIQUEMENT À L'ENTRÉE
// ============================================================================

// Animation de flip 3D pour chaque case de P1
const flipCardVariants: Variants = {
    hidden: {
        opacity: 0,
        rotateY: 90,
        scale: 0.8,
        transition: { duration: 0.1 }
    },
    visible: (delay: number) => ({
        opacity: 1,
        rotateY: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 25,
            delay: delay * 0.01
        }
    }),
    // Pas d'animation de sortie pour P1
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.1 }
    }
};

// Animation du plateau P1 en cascade
const boardStaggerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.04,
            delayChildren: 0.1,
        }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.1 }
    }
};

// ============================================================================
// ANIMATIONS POUR P2 (TRÈS SIMPLE, PAS DE FLIP)
// ============================================================================

// Animation simple pour P2
const simpleCardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: (delay: number) => ({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.15, delay: delay * 0.01 }
    }),
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.1 } }
};

const simpleBoardVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.01 }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.1 }
    }
};

// ============================================================================
// AUTRES ANIMATIONS
// ============================================================================

const buttonGlowVariants: Variants = {
    idle: { scale: 1, boxShadow: "0px 0px 0px rgba(168, 85, 247, 0)" },
    hover: {
        scale: 1.05,
        boxShadow: "0px 0px 20px rgba(168, 85, 247, 0.5)",
        transition: { type: "spring", stiffness: 400 }
    },
    tap: { scale: 0.95 }
};

const titleVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 200, damping: 15 }
    }
};

// ============================================================================
// COMPOSANTS
// ============================================================================

interface PloaderFixeProps {
    niveau: number;
    casesun: Case[];
    pieces: string[];
}

// P1 - Animation Flip 3D uniquement à l'entrée
const PloaderFixe = memo(({ niveau, casesun, pieces }: PloaderFixeProps) => {
    if (!casesun?.length || !pieces?.length || niveau <= 0) {
        return <EmptyState message="Aucune case disponible" />;
    }

    const gridStyles = useMemo(() => ({
        gridTemplateColumns: `repeat(${niveau}, 1fr)`,
        gridTemplateRows: `repeat(${niveau}, 1fr)`,
    }), [niveau]);

    const renderedCases = useMemo(() =>
        casesun.map((c, index) => (
            <motion.div
                key={c.id}
                custom={index}
                variants={flipCardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="transform-gpu preserve-3d"
            >
                <Unecase
                    {...c}
                    pieces={pieces}
                    mode={false}
                    size="100%"
                    aria-label={`Case ${c.id}`}
                />
            </motion.div>
        )),
        [casesun, pieces]
    );

    return (
        <motion.div
            variants={boardStaggerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={GRID_BASE_STYLES}
            style={gridStyles}
            aria-label="Grille de cases P1"
        >
            {renderedCases}
        </motion.div>
    );
});

interface PloaderProps {
    niveau: number;
    cases: Case[];
    selectedCase: Case | null;
    tpsglobal: number;
    selectCase: (c: Case) => void;
    pieces: string[];
}

// P2 - Animation simple
const Ploader = memo(({ tpsglobal, niveau, cases, selectedCase, selectCase, pieces }: PloaderProps) => {
    if (!cases?.length) {
        return <EmptyState message="Aucune case disponible" />;
    }

    const gridStyles = useMemo(() => ({
        gridTemplateColumns: `repeat(${niveau}, 1fr)`,
        gridTemplateRows: `repeat(${niveau}, 1fr)`,
    }), [niveau]);

    const renderedCases = useMemo(() =>
        cases.map((c, index) => (
            <motion.div
                key={c.id}
                custom={index}
                variants={simpleCardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <Unecase
                    {...c}
                    tpsglobal={tpsglobal}
                    size="100%"
                    pieces={pieces}
                    isSelected={selectedCase?.id === c.id}
                    onClick={() => selectCase(c)}
                />
            </motion.div>
        )),
        [cases, tpsglobal, pieces, selectedCase, selectCase]
    );

    return (
        <motion.div
            variants={simpleBoardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={GRID_BASE_STYLES}
            style={gridStyles}
            aria-label="Grille de cases P2"
        >
            {renderedCases}
        </motion.div>
    );
});

const AnimatedProgressBar = ({ progression }: { progression: number }) => (
    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progression}%` }}
            transition={{ duration: 0.5, ease: "easeOut", type: "spring", stiffness: 100 }}
        />
    </div>
);

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

export default function TheGame() {
    const {
        toggleShowPun, lockSelectedCase, selectCase, gameisover, casesdujeuencours, casesinitiales,
        pieces, selectedCase, currentGameType, progression, tpsglobal, niveau, showPun, timeElapsed, isLoading
    } = useGameGenerator();

    const [boardKey, setBoardKey] = useState(0);

    const handleToggleShowPun = useCallback(() => {
        toggleShowPun();
        setBoardKey(prev => prev + 1);
    }, [toggleShowPun]);

    if (isLoading) return <Loader />

    if (gameisover) { return <ResultatsPage />; }

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto mb-4">
            <div className="w-full text-center">
                {/* Plateau de jeu */}
                <div className="mb-4 perspective-1000">
                    <AnimatePresence mode="wait">
                        {showPun ? (
                            <motion.div
                                key={`p1-${boardKey}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.1 }}

                            >
                                {/* P1 - Animation Flip 3D WAOUH à l'entrée */}
                                <PloaderFixe niveau={niveau!} casesun={casesinitiales} pieces={pieces} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key={`p2-${boardKey}`}
                                initial={{ opacity: 0, rotateX: 5, scale: 0.98 }}
                                animate={{ opacity: 1, rotateX: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.2, type: "spring", stiffness: 300 }
                                }
                            >
                                {/* P2 - Pas d'animation, transition instantanée */}
                                <Ploader
                                    niveau={niveau!}
                                    cases={casesdujeuencours}
                                    selectedCase={selectedCase}
                                    selectCase={selectCase}
                                    pieces={pieces}
                                    tpsglobal={tpsglobal}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Contrôles et informations */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={titleVariants}
                    className="flex flex-col items-center justify-center w-full mt-4"
                >
                    <motion.h2
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-xs font-bold text-blue-700 mb-3 tracking-wide"
                    >
                        {showPun ? "👤 Plateau P1 (Référence)" : "🕹️ Plateau P2"}
                    </motion.h2>

                    <div className="flex items-center justify-center gap-3 flex-wrap">
                        <motion.button
                            variants={buttonGlowVariants}
                            initial="idle"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={handleToggleShowPun}
                            className={`px-6 py-2 font-semibold text-xl rounded-xl shadow-md transition-all duration-300 ${showPun
                                ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                                : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                                }`}
                        >
                            <motion.span
                                animate={{ rotate: showPun ? [0, 5, -5, 0] : [0, -5, 5, 0] }}
                                transition={{ duration: 0.3 }}
                            >
                                {showPun ? "✨ Jouer" : "👀 Voir P1"}
                            </motion.span>
                        </motion.button>

                        {!showPun && (
                            <motion.button
                                variants={buttonGlowVariants}
                                initial="idle"
                                whileHover="hover"
                                whileTap="tap"
                                onClick={lockSelectedCase}
                                className="px-6 py-2 font-semibold text-xl rounded-xl shadow-md transition-all duration-300 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
                            >
                                🔒 Ajuster
                            </motion.button>
                        )}
                    </div>

                    {/* Chronomètre */}
                    <motion.div
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="font-bold text-blue-600 mt-4 flex items-center gap-2 text-lg bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm"
                    >
                        <motion.span
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="text-sm inline-block"
                        >
                            ⏱
                        </motion.span>
                        <span>{formatTime(timeElapsed)}</span>
                    </motion.div>

                    {/* Progression */}
                    <div className="mt-4 w-full space-y-3 mb-4">
                        {casesdujeuencours.length > 0 && (
                            <div className="mt-2">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>🎯 Progression</span>
                                    <motion.span
                                        key={casesdujeuencours.filter(c => c.isLocked).length}
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 500 }}
                                        className="font-bold text-purple-600"
                                    >
                                        {casesdujeuencours.filter(c => c.isLocked).length}/{casesdujeuencours.length}
                                    </motion.span>
                                </div>
                                <AnimatedProgressBar progression={progression} />
                            </div>
                        )}

                        <ObjectiveCard />

                        <InfoRowGame
                            icon={<TrophyOutlined />}
                            iconBg="bg-yellow-100 dark:bg-yellow-900/30"
                            iconColor="text-yellow-600 dark:text-yellow-400"
                            label="JEU EN COURS"
                            value={currentGameType}
                        />

                        <InfoRowGame
                            icon={<BarChartOutlined />}
                            iconBg="bg-green-100 dark:bg-green-900/30"
                            iconColor="text-green-600 dark:text-green-400"
                            label="NIVEAU DU JEU"
                            value={niveau ?? "N/A"}
                        />
                    </div>
                </motion.div>
            </div>

            <style jsx>{`
                .preserve-3d {
                    transform-style: preserve-3d;
                    backface-visibility: hidden;
                }
                .perspective-1000 {
                    perspective: 1000px;
                }
            `}</style>
        </div>
    );
}