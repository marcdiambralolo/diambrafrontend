'use client';
import { useGameGenerator } from '@/hooks/learning/game/useGameGenerator';
import { Case } from '@/lib/interfaces';
import { colorReference, Theme } from "@/lib/learning/data";
import { formatTime, generateLetterPairs } from '@/lib/learning/functions';
import { BarChartOutlined, TrophyOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import Image from "next/image";
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import LaBanniere from '../labanniere/LaBanniere';
import { FooterSection, HeaderSection, HelpButton } from '../commons/Features';


const GRID_BASE_STYLES = "w-full grid";
const BUTTON_BASE_STYLES = "px-6 py-2 font-semibold rounded-xl shadow-md transition-all duration-300";
const INFO_CARD_STYLES = "flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-700 transition-all duration-200";

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

const EmptyState = memo(({ message }: { message: string }) => (
    <div className="text-center text-gray-600 py-8">{message}</div>
));

const ObjectiveCard = memo(() => (
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

const InfoRowGame = memo(({ icon, iconBg, iconColor, label, value }: {
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

const ActionButton = memo(({ onClick, children, variant, ariaLabel }: ActionButtonProps) => {
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

                    <div className="fixed-bottom-content">
                        <LaBanniere />
                        <FooterSection />
                        <HelpButton />
                    </div>
                </div>
            </div>
        </div>
    );
}