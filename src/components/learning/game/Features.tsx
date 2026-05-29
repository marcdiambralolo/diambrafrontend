'use client';
import { colorReference, Theme } from "@/lib/learning/data";
import { generateLetterPairs } from "@/lib/learning/functions";
import { Case, MatchInfo } from "@/lib/learning/interface";
import { TrophyOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import Image from "next/image";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

const GRID_BASE_STYLES = "w-full grid";
const BUTTON_BASE_STYLES = "px-6 py-2 font-semibold rounded-xl shadow-md transition-all duration-300";
const INFO_CARD_STYLES = "flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-700 transition-all duration-200";

export const UnecaseFixe = memo(({ tpsglobal, txt, isLocked, size, mode, pieces }: Case & { pieces: string[] }) => {
    const letterPairs = generateLetterPairs();
    const caseRef = useRef<HTMLDivElement>(null);

    const updateFontSize = useCallback(() => {
        if (caseRef.current) {
            const newFontSize = `${caseRef.current.clientWidth * 0.5}px`;
            caseRef.current.style.fontSize = newFontSize;
            return newFontSize;
        }
        return "45px";
    }, []);

    const fontSize = useMemo(() => updateFontSize(), [updateFontSize]);
    const txtIndex = useMemo(() => parseInt(txt || "0", 10), [txt]);

    const couleurdefond = useMemo(() => {
        if (tpsglobal === 1) return colorReference[txtIndex] || "black";
        if (isLocked) return Theme.coulfondcaseverouille;
        return "black";
    }, [isLocked, tpsglobal, txtIndex]);

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
                if (mode && isLocked) return <Image src="/momok.png" {...iconProps} alt="OK" />;
                break;
            case 2:
                if (mode && isLocked) return <Image src="/momok.png" {...iconProps} alt="OK" />;
                break;
            default:
                return txt;
        }
    }, [fontSize, isLocked, letterPairs, mode, tpsglobal, txt, txtIndex]);


    useEffect(() => {
        if (!caseRef.current) return;
        const observer = new ResizeObserver(updateFontSize);
        observer.observe(caseRef.current);
        return () => observer.disconnect();
    }, [updateFontSize]);

    return (
        <div ref={caseRef}
            className="text-white font-semibold flex items-center justify-center border border-white cursor-pointer overflow-hidden whitespace-nowrap aspect-square"
            style={{
                width: size,
                height: size,
                backgroundColor: couleurdefond,
                backgroundImage: imagedefond,
            }}
        >
            <span className="overflow-hidden min-w-0">{content}</span>
        </div>
    );
});

export const Unecase = memo(({ tpsglobal, txt, onClick, isSelected, isLocked, size, mode, pieces }: Case & { pieces: string[] }) => {
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

export const PloaderFixe = memo(({ niveau, casesun, pieces }: PloaderFixeProps) => {
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

export const Ploader = memo(({ tpsglobal, niveau, cases, selectedCase, selectCase, pieces }: PloaderProps) => {
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

const EmptyState = memo(({ message }: { message: string }) => (
    <div className="text-center text-gray-600 py-8">{message}</div>
));

export const ObjectiveCard = memo(() => (
    <div className="relative group">
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400" />
            <div className="p-2">
                <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 rounded-xl p-1">
                    <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-md">
                        <TrophyOutlined className="text-xxs text-white" />
                    </div>
                    <p className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200">
                        Objectif : Réorganisez P2 pour qu'il corresponde à P1 !
                    </p>
                </div>
            </div>
        </div>
    </div>
));

export const InfoRowGame = memo(({ icon, iconBg, iconColor, label, value }: {
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
    label: string;
    value: string | number;
}) => (
    <motion.div whileHover={{ x: 5 }} className={INFO_CARD_STYLES}>
        <div className={`p-1 ${iconBg} rounded-lg`}>
            <div className={iconColor}>{icon}</div>
        </div>
        <div className="flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                {label}
            </p>
            <p className="font-semibold text-gray-800 dark:text-gray-200">
                {value}
            </p>
        </div>
    </motion.div>
));

interface ActionButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    variant: 'primary' | 'secondary';
    ariaLabel: string;
}

export const ActionButton = memo(({ onClick, children, variant, ariaLabel }: ActionButtonProps) => {
    const variantStyles = {
        primary: "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white",
        secondary: "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={onClick}
            className={`${BUTTON_BASE_STYLES} ${variantStyles[variant]}`}
            aria-label={ariaLabel}
            role="button"
            tabIndex={0}
        >
            {children}
        </motion.button>
    );
}); 

export const StatusBadge = memo(({ text, color }: { text: string; color: string }) => (
    <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${color === 'red' ? 'bg-red-500' : 'bg-green-500'} text-white flex items-center gap-1`}>
        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        {text}
    </div>
));

export const FooterSection = memo(({ currentYear, onlineStatus }: { currentYear: number; onlineStatus: { text: string; color: string } }) => (
    <footer className="relative mt-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 text-center shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10" />
        <div className="relative flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-2">
                <span>© {currentYear}</span>
            </div>
            <StatusBadge text={onlineStatus.text} color={onlineStatus.color} />
        </div>
        <p className="relative text-gray-500 text-[10px] mt-2">
            DIAMBRA CORPORATION • Tous droits réservés
        </p>
    </footer>
));

interface MatchViewProps {
    matchData: MatchInfo;
    index: number;
}

export const MatchView = memo(({ matchData, index }: MatchViewProps) => {
    const [showFirstBoard, setShowFirstBoard] = useState(false);

    const toggleBoard = useCallback(() => {
        setShowFirstBoard(prev => !prev);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="w-full shadow-lg rounded-xl bg-white hover:shadow-2xl transition-all duration-300 overflow-hidden"
        >
            <div className="p-4">
                <div className="mb-3 pb-2 border-b border-gray-100">
                    <h4 className="text-lg font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Match {index + 1}
                    </h4>
                    {matchData.tpsglobal !== undefined && (
                        <p className="text-xs text-center text-gray-500 mt-1">
                            Type: {matchData.tpsglobal === 0 ? "Nombre" :
                                matchData.tpsglobal === 1 ? "Couleur" :
                                    matchData.tpsglobal === 2 ? "Image" :
                                        matchData.tpsglobal === 3 ? "Lettre" : "Global"}
                        </p>
                    )}
                </div>

                <div className="mt-2 text-center">
                    {showFirstBoard ? (
                        <PloaderEndGame match={matchData} initiale />
                    ) : (
                        <PloaderEndGame match={matchData} />
                    )}
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={toggleBoard}
                    className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl transition-all duration-300 hover:from-blue-600 hover:to-purple-600 font-medium shadow-md"
                    aria-label={showFirstBoard ? "Voir P2" : "Voir P1"}
                >
                    {showFirstBoard ? "🎯 Voir P1" : "👀 Voir P2"}
                </motion.button>

                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-green-50 rounded-lg p-2">
                        <span className="text-green-600 font-bold">{matchData.score?.toFixed(0) || 0}%</span>
                        <span className="text-gray-500 block">Score</span>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2">
                        <span className="text-blue-600 font-bold">{matchData.trouves || 0}</span>
                        <span className="text-gray-500 block">Trouvés</span>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-2">
                        <span className="text-orange-600 font-bold">{matchData.rates || 0}</span>
                        <span className="text-gray-500 block">Ratés</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

interface PloaderEndGameProps {
    match: MatchInfo;
    initiale?: boolean;
}

export const PloaderEndGame = memo(({ match, initiale = false }: PloaderEndGameProps) => {
    const cases = useMemo(() =>
        initiale ? match?.listeCaseOpLabInitiale || [] : match?.listeCaseOpLab || [],
        [initiale, match?.listeCaseOpLab, match?.listeCaseOpLabInitiale]
    );

    const gridStyles = useMemo(() => {
        const size = match?.niveau || Math.sqrt(cases.length) || 3;
        return {
            gridTemplateColumns: `repeat(${size}, 1fr)`,
            gridTemplateRows: `repeat(${size}, 1fr)`,
        };
    }, [match?.niveau, cases.length]);

    if (!cases.length) {
        return (
            <div className="text-center text-gray-500 py-8">
                Aucune case disponible
            </div>
        );
    }

    return (
        <div className={GRID_BASE_STYLES} style={gridStyles}>
            {cases.map((c) => (
                <UnecaseFixe
                    key={c.id}
                    {...c}
                    isLocked={!initiale}
                    size="100%"
                    pieces={match?.pieces || []}
                />
            ))}
        </div>
    );
});