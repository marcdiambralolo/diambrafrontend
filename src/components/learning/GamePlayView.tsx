'use client';
import { choix, formatTime } from "@/lib/learning/functions";
import { Case, MatchInfo } from "@/lib/learning/interface";
import { BarChartOutlined, SettingOutlined, TrophyOutlined, UserOutlined } from "@ant-design/icons";
import { Badge, Card, Space } from "antd";
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

                        <div className="mt-4 mb-4 w-full">
                            <Space direction="vertical" size="middle" className="w-full mt-6">
                                <Badge.Ribbon text="Info" color="green">
                                    <Card
                                        title={
                                            <div className="flex flex-wrap text-wrap font-light m-2 text-gray-800 text-base px-3 py-2 break-words">
                                                🎯 Objectif : Réorganisez P2 pour qu&apos;il corresponde à P1 !
                                            </div>
                                        }
                                        size="small"
                                        className="rounded-2xl shadow-lg border border-gray-200 bg-white"
                                    >
                                        <div className="flex flex-col space-y-3">
                                            <div className="flex items-center bg-gray-100 text-gray-700 py-3 px-4 rounded-lg shadow-sm">
                                                <TrophyOutlined className="text-lg text-yellow-500" />
                                                <span className="font-semibold ml-2">Jeu en cours :</span>
                                                <span className="ml-2">
                                                    {!infomatch || matchEncours === undefined || !infomatch[matchEncours]
                                                        ? "Aucun match en cours"
                                                        : choix(infomatch[matchEncours].tpsglobal || 0)}
                                                </span>
                                            </div>
                                            <div className="flex items-center bg-gray-100 text-gray-700 py-3 px-4 rounded-lg shadow-sm">
                                                <BarChartOutlined className="text-lg text-green-500" />
                                                <span className="font-semibold ml-2">Niveau du jeu :</span>
                                                <span className="ml-2">{niveau ?? "N/A"}</span>
                                            </div>
                                            <div className="flex items-center bg-gray-100 text-gray-700 py-3 px-4 rounded-lg shadow-sm">
                                                <SettingOutlined className="text-lg text-red-500" />
                                                <span className="font-semibold ml-2">Mode :</span>
                                                <span className="ml-2">{option === 0 ? "Manuel" : "Automatique"}</span>
                                            </div>
                                        </div>
                                    </Card>
                                </Badge.Ribbon>
                            </Space>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
});

GamePlayView.displayName = "GamePlayView";

export default GamePlayView;
