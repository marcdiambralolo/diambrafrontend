'use client';
import { useGameGenerator } from '@/hooks/learning/game/useGameGenerator';
import { formatTime } from '@/lib/learning/functions';
import { BarChartOutlined, TrophyOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { HeaderSection } from '../commons/Features';
import FixedContent from '../commons/FixedContent';
import { ActionButton, InfoRowGame, ObjectiveCard, Ploader, PloaderFixe } from './Features';

export default function TheGame() {
    const {
        toggleShowPun, lockSelectedCase, selectCase, casesdujeuencours, casesinitiales,
        pieces, selectedCase, currentGameType, progression, tpsglobal, niveau, showPun, timeElapsed,
    } = useGameGenerator();

    return (
        <div className="flex flex-col items-center justify-center w-full m-0 p-0 py-0 px-0 mb-4">

            <div className="w-full mx-auto max-w-md pb-20">
                <div className="flex flex-col items-center justify-center mb-8 space-y-4">
                    <HeaderSection />
                    <div className="flex flex-col items-center justify-center w-full max-w-md px-0 py-0 m-0 p-0 mb-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="w-full max-w-md text-center px-0 py-0 mb-4"
                        >
                            <div className="mb-4">
                                {showPun ? (
                                    <PloaderFixe niveau={niveau!} casesun={casesinitiales} pieces={pieces} />
                                ) : (
                                    <Ploader
                                        niveau={niveau!}
                                        cases={casesdujeuencours}
                                        selectedCase={selectedCase}
                                        selectCase={selectCase}
                                        pieces={pieces}
                                        tpsglobal={tpsglobal}
                                    />
                                )}
                            </div>

                            <div className="flex flex-col items-center justify-center w-full mt-4">
                                <h2 className="text-xs font-bold text-blue-700 mb-3 tracking-wide">
                                    {showPun ? "👤 Plateau P1 (Référence)" : "🕹️ Plateau P2"}
                                </h2>

                                <div className="flex items-center justify-center gap-3 flex-wrap">
                                    <ActionButton
                                        onClick={toggleShowPun}
                                        variant="secondary"
                                        ariaLabel={showPun ? "Jouer" : "Voir P1"}
                                    >
                                        {showPun ? "Jouer" : "Voir P1"}
                                    </ActionButton>

                                    {!showPun && (
                                        <ActionButton
                                            onClick={lockSelectedCase}
                                            variant="primary"
                                            ariaLabel="Ajuster la sélection"
                                        >
                                            Ajuster
                                        </ActionButton>
                                    )}

                                    <div className="font-bold text-blue-600 flex items-center gap-2 text-lg bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                                        <span className="text-sm">⏱</span>
                                        <span>{formatTime(timeElapsed)}</span>
                                    </div>
                                </div>

                                <div className="mt-4 w-full space-y-3">
                                    {casesdujeuencours.length > 0 && (
                                        <div className="mt-2">
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>Progression</span>
                                                <span>{casesdujeuencours.filter(c => c.isLocked).length}/{casesdujeuencours.length}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${progression}%` }}
                                                />
                                            </div>
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
                            </div>
                        </motion.div>
                    </div>

                    <FixedContent />
                </div>
            </div>
        </div>
    );
}