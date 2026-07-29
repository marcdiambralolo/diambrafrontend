'use client';
import { useGameGenerator } from '@/hooks/learning/game/useGameGenerator';
import GameBoard from './components/GameBoard';
import GameControls from './components/GameControls';
import GameInfo from './components/GameInfo';

const TheGame = () => {
    const {
        toggleShowPun, lockSelectedCase, selectCase, casesdujeuencours, casesinitiales,
        selectedCase, currentGameType, progression, tpsglobal, niveau,
        showPun, lockedCount, totalCount, hasCases, pieces, punChangeCount,
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
            />

            <GameInfo
                currentGameType={currentGameType}
                progression={progression}
                niveau={niveau!}
                lockedCount={lockedCount}
                totalCount={totalCount}
                hasCases={hasCases}
                punChangeCount={punChangeCount}
            />
        </div>
    );
};

export default TheGame;