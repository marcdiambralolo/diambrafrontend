'use client';
import { useGameGenerator } from '@/hooks/learning/game/useGameGenerator';
import { Case } from '@/lib/interfaces';
import { colorReference, Theme } from "@/lib/learning/data";
import { formatTime, generateLetterPairs } from '@/lib/learning/functions';
import Image from "next/image";
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import ActionButton from './components/ActionButton';
import EmptyState from './components/EmptyState';
import GameInfo from './components/GameInfo';

const GRID_BASE_STYLES = "w-full grid";

const Unecase = memo(({ tpsglobal, txt, onClick, isSelected, isLocked, size, mode, pieces }: Case & { pieces: string[] }) => {
    const caseRef = useRef<HTMLDivElement>(null);
    const letterPairs = generateLetterPairs();

    const updateFontSize = useCallback(() => {
        if (caseRef.current) {
            const newFontSize = `${caseRef.current.clientWidth * 0.5}px`;
            caseRef.current.style.fontSize = newFontSize;
            return newFontSize;
        }
        return "45px";
    }, []);

    const fontSize = useMemo(() => updateFontSize(), [updateFontSize]);
    const txtIndex = useMemo(() => parseInt(txt || "", 10), [txt]);

    const couleurdefond = useMemo(() => {
        if (tpsglobal === 1) return colorReference[txtIndex] || "black";
        if (isLocked) return Theme.coulfondcaseverouille;
        if (isSelected) return "blue";
        return "black";
    }, [isLocked, isSelected, tpsglobal, txtIndex]);

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
                if (mode && isSelected) return <Image src="/mamain.png" {...iconProps} alt="Main" />;
                if (mode && isLocked) return <Image src="/momok.png" {...iconProps} alt="OK" />;
                break;
            case 2:
                if (mode && isSelected) return <Image src="/mamain.png" {...iconProps} alt="Main" />;
                if (mode && isLocked) return <Image src="/momok.png" {...iconProps} alt="OK" />;
                break;
            default:
                return txt;
        }
    }, [fontSize, isLocked, isSelected, letterPairs, mode, tpsglobal, txt, txtIndex]);

    useEffect(() => {
        if (!caseRef.current) return;
        const observer = new ResizeObserver(updateFontSize);
        observer.observe(caseRef.current);
        return () => observer.disconnect();
    }, [updateFontSize]);

    return (
        <div
            ref={caseRef}
            onClick={onClick}
            className="text-white font-semibold flex items-center justify-center border border-white cursor-pointer overflow-hidden whitespace-nowrap aspect-square"
            style={{
                width: size,
                height: size,
                backgroundColor: couleurdefond,
                backgroundImage: imagedefond,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        ><span className="overflow-hidden min-w-0">{content}</span>
        </div>
    );
});

interface PloaderFixeProps {
    niveau: number;
    casesun: Case[];
    pieces: string[];
}

const PloaderFixe = memo(({ niveau, casesun, pieces }: PloaderFixeProps) => {
    if (!casesun?.length || !pieces?.length || niveau <= 0) {
        return <EmptyState message="Aucune case disponible" />;
    }

    const gridStyles = useMemo(() => ({
        gridTemplateColumns: `repeat(${niveau}, 1fr)`,
        gridTemplateRows: `repeat(${niveau}, 1fr)`,
    }), [niveau]);

    const renderedCases = useMemo(() =>
        casesun.map((c) => (
            <Unecase
                key={c.id}
                {...c}
                pieces={pieces}
                mode={false}
                size="100%"
                aria-label={`Case ${c.id}`}
            />
        )),
        [casesun, pieces]
    );

    return (
        <div className={GRID_BASE_STYLES} style={gridStyles} aria-label="Grille de cases P1">
            {renderedCases}
        </div>
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

const Ploader = memo(({ tpsglobal, niveau, cases, selectedCase, selectCase, pieces }: PloaderProps) => {
    if (!cases?.length) {
        return <EmptyState message="Aucune case disponible" />;
    }

    const gridStyles = useMemo(() => ({
        gridTemplateColumns: `repeat(${niveau}, 1fr)`,
        gridTemplateRows: `repeat(${niveau}, 1fr)`,
    }), [niveau]);

    const renderedCases = useMemo(() =>
        cases.map((c) => (
            <Unecase
                key={c.id}
                {...c}
                tpsglobal={tpsglobal}
                size="100%"
                pieces={pieces}
                isSelected={selectedCase?.id === c.id}
                onClick={() => selectCase(c)}
            />
        )),
        [cases, tpsglobal, pieces, selectedCase, selectCase]
    );

    return (
        <div className={GRID_BASE_STYLES} style={gridStyles} aria-label="Grille de cases P2">
            {renderedCases}
        </div>
    );
});

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
            <GameInfo
                currentGameType={currentGameType}
                progression={progression}
                niveau={niveau!}
                lockedCount={lockedCount}
                totalCount={totalCount}
                hasCases={hasCases}
            />
        </div>
    );
};

export default TheGame;