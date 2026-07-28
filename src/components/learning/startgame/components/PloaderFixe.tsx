'use client';
import { Case } from '@/lib/interfaces';
import { memo, useMemo } from 'react';
import EmptyState from './EmptyState';
import Unecase from './Unecase';

const GRID_BASE_STYLES = "w-full grid";

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

export default PloaderFixe;