'use client';
import { Case } from "@/lib/learning/interface";
import { memo, useMemo } from "react";
import Unecase from "./Unecase";

interface PloaderProps {
    niveau: number;
    casesun: Case[];
    pieces: string[];
}

const PloaderFixe: React.FC<PloaderProps> = memo(({ niveau, casesun, pieces }) => {

    const renderedCases = useMemo(() => (
        casesun.map((c) => (<Unecase key={c.id} {...c} pieces={pieces} mode={false} size="100%" aria-label={`Case ${c.id}`} />))
    ), [casesun, pieces]);

    if (!casesun || casesun.length === 0 || !pieces || pieces.length === 0 || niveau <= 0) {
        return <div className="text-center text-gray-600">Aucune case disponible</div>;
    }

    const gridStyles = {
        gridTemplateColumns: `repeat(${niveau}, 1fr)`,
        gridTemplateRows: `repeat(${niveau}, 1fr)`,
    };

    return (
        <div className="w-full grid" style={gridStyles} aria-label="Grille de cases"> {renderedCases}</div>
    );
});

PloaderFixe.displayName = "PloaderFixe";

export default PloaderFixe;