'use client';
import { Case } from "@/lib/learning/interface";
import { motion } from "framer-motion";
import { memo } from "react";
import Unecase from "./Unecase"; 

interface PloaderProps {
    onAnimationEnd?: () => void;
    hasAnimated?: boolean;
    animated?: boolean;
    niveau: number;
    cases: Case[];
    selectedCase: Case | null;
    tpsglobal: number;
    selectCase: (c: Case) => void;
    pieces: string[];
}

const Ploader: React.FC<PloaderProps> = memo(({tpsglobal, onAnimationEnd, hasAnimated, animated, niveau, cases, selectedCase, selectCase, pieces }) => {
    const renderAnimatedCases = () => (
        cases.map((c) => (<Unecase key={c.id} {...c} tpsglobal={tpsglobal} size="100%" pieces={pieces} isSelected={selectedCase?.id === c.id} onClick={() => selectCase(c)} />))
    );

    const renderAnimatedCasesWithMotion = () => (
        cases.map((c, index) => (
            <motion.div
                key={c.id} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                onAnimationComplete={() => {
                    if (index === cases.length - 1 && onAnimationEnd) {
                        onAnimationEnd();
                    }
                }}
                className="bg-green-500 rounded-lg flex items-center justify-center"
                aria-label={`Case ${c.id}`}
            >
                <Unecase {...c} tpsglobal={tpsglobal} mode={true} size="100%" isSelected={selectedCase?.id === c.id} pieces={pieces} />
            </motion.div>
        ))
    );

    if (!cases || cases.length === 0) {
        return <div className="text-center text-gray-600">Aucune case disponible</div>;
    }

    return (
        <div className="w-full grid"
            style={{
                gridTemplateColumns: `repeat(${niveau}, 1fr)`,
                gridTemplateRows: `repeat(${niveau}, 1fr)`,
            }}
            aria-label="Grille de cases"
        >
            {animated ? (hasAnimated ? renderAnimatedCases() : renderAnimatedCasesWithMotion()) : null}
        </div>
    );
});

Ploader.displayName = "Ploader";

const areEqual = (prev: PloaderProps, next: PloaderProps) => {
    return (
        prev.cases === next.cases &&
        prev.selectedCase === next.selectedCase &&
        prev.animated === next.animated &&
        prev.hasAnimated === next.hasAnimated &&
        prev.niveau === next.niveau &&
        prev.pieces === next.pieces
    );
};

export default memo(Ploader, areEqual);