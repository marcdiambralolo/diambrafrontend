'use client';
import { choix, formatTime } from "@/lib/learning/functions";
import { Case, MatchInfo } from "@/lib/learning/interface";
import { BarChartOutlined, SettingOutlined, TrophyOutlined } from "@ant-design/icons";
import { AnimatePresence, motion } from "framer-motion";
import { memo } from "react";
import Ploader from "./Ploader";
import PloaderFixe from "./PloaderFixe";

interface GamePlayViewProps {
    cases: Case[];
    casesun: Case[];
    pieces: string[];
    selectedCase: Case | null;
    selectCase: (c: Case | null) => void;
    showPun: boolean;
    toggleShowPun: () => void;
    lockSelectedCase: () => void;
    animated: boolean;
    hasAnimated: boolean;
    handleAnimationEnd: () => void;
    start: boolean;
    timeElapsed: number;
    niveau: number;
    option: number;
    matchEncours: number;
    infomatch: MatchInfo[];
    tpsglobal: number;
}

const GamePlayView = memo(({
    tpsglobal,
    cases,
    casesun,
    pieces,
    selectedCase,
    selectCase,
    showPun,
    toggleShowPun,
    lockSelectedCase,
    animated,
    hasAnimated,
    handleAnimationEnd,
    start,
    timeElapsed,
    niveau,
    option,
    matchEncours,
    infomatch
}: GamePlayViewProps) => {
    return (
        <div className="flex flex-col items-center justify-center w-full py-4 mb-4 bg-gradient-to-b from-gray-50 to-gray-200 rounded-xl shadow-lg">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md text-center px-4"
            >
                {!hasAnimated && (
                    <AnimatePresence>
                        <motion.div
                            key="loader"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.5 }}
                            className="my-6 flex justify-center items-center gap-4"
                        >
                            <div className="p-6 rounded-full border-4 border-dashed border-blue-400 animate-spin">
                                <div className="w-6 h-6 bg-blue-500 rounded-full" />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                )}

                {showPun ? (
                    <PloaderFixe niveau={niveau} casesun={casesun} pieces={pieces} />
                ) : (
                    <Ploader
                        niveau={niveau}
                        animated={animated}
                        cases={cases}
                        selectedCase={selectedCase}
                        selectCase={selectCase}
                        pieces={pieces}
                        onAnimationEnd={handleAnimationEnd}
                        hasAnimated={hasAnimated}
                        tpsglobal={tpsglobal}
                    />
                )}

                {start && (
                    <div className="flex flex-col items-center justify-center w-full mt-1">
                        <h2 className="text-xxs font-bold text-blue-700 mb-4 tracking-wide">
                            {showPun ? "👤 Plateau P1" : "🕹️ Plateau P2"}
                        </h2>
                        <div className="flex items-center justify-center gap-4 flex-wrap">
                            {!showPun && (
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    whileHover={{ scale: 1.05 }}
                                    onClick={lockSelectedCase}
                                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl shadow-md hover:from-orange-600 hover:to-red-600 transition duration-300"
                                    aria-label="Ajuster la sélection"
                                    role="button"
                                    tabIndex={0}
                                >
                                    Ajuster
                                </motion.button>
                            )}
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                whileHover={{ scale: 1.05 }}
                                onClick={toggleShowPun}
                                className="px-6 py-2 font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-md hover:from-blue-600 hover:to-purple-600 transition duration-300"
                                aria-label={showPun ? "Jouer" : "Voir P1"}
                                role="button"
                                tabIndex={0}
                            >
                                {showPun ? "Jouer" : "Voir P1"}
                            </motion.button>

                            <div className="font-bold text-blue-600 flex items-center gap-2 text-lg">
                                ⏱ {formatTime(timeElapsed)}
                            </div>
                        </div>

                        <div className="mt-6 mb-6 w-full">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="relative group">
                                    {/* Effet de brillance externe */}
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />

                                    <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
                                        {/* Bandeau décoratif supérieur */}
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400" />

                                        <div className="p-5 pb-3">
                                            <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 rounded-xl p-3">
                                                <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-md">
                                                    <TrophyOutlined className="text-xl text-white" />
                                                </div>
                                                <p className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200">
                                                    🎯 Objectif : Réorganisez P2 pour qu'il corresponde à P1 !
                                                </p>
                                            </div>
                                        </div>

                                        {/* Contenu principal */}
                                        <div className="p-5 pt-0 space-y-3">
                                            {/* Jeu en cours */}
                                            <motion.div
                                                whileHover={{ x: 5 }}
                                                className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-700 transition-all duration-200"
                                            >
                                                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                                                    <TrophyOutlined className="text-yellow-600 dark:text-yellow-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">JEU EN COURS</p>
                                                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                                                        {!infomatch || matchEncours === undefined || !infomatch[matchEncours]
                                                            ? "Aucun match en cours"
                                                            : choix(infomatch[matchEncours].tpsglobal || 0)}
                                                    </p>
                                                </div>
                                            </motion.div>

                                            {/* Niveau du jeu */}
                                            <motion.div
                                                whileHover={{ x: 5 }}
                                                className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-700 transition-all duration-200"
                                            >
                                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                                    <BarChartOutlined className="text-green-600 dark:text-green-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">NIVEAU DU JEU</p>
                                                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                                                        {niveau ?? "N/A"}
                                                    </p>
                                                </div>
                                            </motion.div>

                                            {/* Mode */}
                                            <motion.div
                                                whileHover={{ x: 5 }}
                                                className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-700 transition-all duration-200"
                                            >
                                                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                                    <SettingOutlined className="text-red-600 dark:text-red-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">MODE</p>
                                                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                                                        {option === 0 ? "Manuel" : "Automatique"}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
});

GamePlayView.displayName = "GamePlayView";

export default GamePlayView;