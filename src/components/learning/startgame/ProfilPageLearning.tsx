'use client';
import { useGameGenerator } from '@/hooks/learning/game/useGameGenerator';
import { formatTime } from '@/lib/learning/functions';
import { BarChartOutlined, TrophyOutlined } from '@ant-design/icons';
import { memo } from 'react';
import { ActionButton, InfoRowGame, ObjectiveCard, Ploader, PloaderFixe } from './Features';

const GameBoard = memo(({ showPun, niveau, casesdujeuencours, casesinitiales, pieces, selectedCase, selectCase, tpsglobal }: any) => (
    <div className="w-full max-w-md text-center mb-2">
        {showPun ? (
            <PloaderFixe niveau={niveau} casesun={casesinitiales} pieces={pieces} />
        ) : (
            <Ploader
                niveau={niveau}
                cases={casesdujeuencours}
                selectedCase={selectedCase}
                selectCase={selectCase}
                pieces={pieces}
                tpsglobal={tpsglobal}
            />
        )}
    </div>
));

const GameControls = memo(({ showPun, onToggleShowPun, onLockSelectedCase, timeElapsed }: any) => (
    <div className="flex flex-col items-center justify-center w-full">
        <h2 className="text-xs font-bold text-blue-700 mb-3 tracking-wide">
            {showPun ? "👤 Plateau P1 (Référence)" : "🕹️ Plateau P2"}
        </h2>

        <div className="flex items-center justify-center gap-3 flex-wrap">
            <ActionButton
                onClick={onToggleShowPun}
                variant="secondary"
                ariaLabel={showPun ? "Jouer" : "Voir P1"}
            >
                {showPun ? "Jouer" : "Voir P1"}
            </ActionButton>

            {!showPun && (
                <ActionButton
                    onClick={onLockSelectedCase}
                    variant="primary"
                    ariaLabel="Ajuster la sélection."
                >
                    Ajuster
                </ActionButton>
            )}

            <div className="font-bold text-blue-600 flex items-center gap-2 text-lg bg-white/50 px-3 py-1.5 rounded-full shadow-sm">
                <span className="text-sm">⏱</span>
                <span>{formatTime(timeElapsed)}</span>
            </div>
        </div>
    </div>
));

const ProgressBar = memo(({ lockedCount, totalCount, progression }: { lockedCount: number; totalCount: number; progression: number }) => (
    <div className="mt-2">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progression</span>
            <span>{lockedCount}/{totalCount}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
            <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progression}%` }}
            />
        </div>
    </div>
));

const TheGame = () => {
    const {
        toggleShowPun, lockSelectedCase, selectCase, casesdujeuencours, casesinitiales, timeElapsed, selectedCase,
        currentGameType, progression, tpsglobal, niveau, showPun, lockedCount, totalCount, hasCases, pieces,
    } = useGameGenerator();

    return (
        <div className="w-full mx-auto max-w-md  flex flex-col items-center justify-center mb-4">
            <GameBoard
                showPun={showPun}
                niveau={niveau}
                casesdujeuencours={casesdujeuencours}
                casesinitiales={casesinitiales}
                pieces={pieces}
                selectedCase={selectedCase}
                selectCase={selectCase}
                tpsglobal={tpsglobal}
            />
            <GameControls
                showPun={showPun}
                onToggleShowPun={toggleShowPun}
                onLockSelectedCase={lockSelectedCase}
                timeElapsed={timeElapsed}
            />

            <div className="mt-2 w-full space-y-2">
                {hasCases && (
                    <ProgressBar
                        lockedCount={lockedCount}
                        totalCount={totalCount}
                        progression={progression}
                    />
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
    );
};

export default TheGame;