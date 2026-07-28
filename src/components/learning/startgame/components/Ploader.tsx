'use client';
import { Case } from '@/lib/interfaces';
import { memo, useMemo } from 'react';
import EmptyState from './EmptyState';
import Unecase from './Unecase';

const GRID_BASE_STYLES = "w-full grid";

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

export default Ploader;