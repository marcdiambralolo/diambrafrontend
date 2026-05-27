'use client';
import Loader from "@/app/loading";
import { useGameGenerator } from "@/hooks/learning/useGameGenerator";
import useTimer from "@/hooks/learning/useTimer";
import { Case, MatchInfo } from "@/lib/interfaces";
import { decoupelimage, getChronoTime } from "@/lib/learning/functions";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import FinMatchView from "./FinMatchView";
import GamePlayView from "./GamePlayView";

const MenuDiambra = memo(() => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const niveau = Number(searchParams.get('niveau') || "5") || 5;
    const tpsglobal = Number(searchParams.get('tpsglobal') || "0");

    const { generateMatchList, loadMatch } = useGameGenerator();

    const [loading, setLoading] = useState(false);
    const [casesdujeuencours, setCasesdujeuencours] = useState<Case[]>([]);
    const [casesinitiales, setCasesinitiales] = useState<Case[]>([]);
    const [pieces, setPieces] = useState<string[]>([]);
    const [selectedCase, setSelectedCase] = useState<Case | null>(null);
    const [datedebut, setDatedebut] = useState<string>("");
    const [start, setStart] = useState(false);
    const [finmatch, setFinmatch] = useState(false);
    const [showPun, setShowPun] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(true);
    const [animated, setAnimated] = useState(true);
    const [option, setOption] = useState(0);
    const [matchEnCours, setMatchEnCours] = useState(-1);
    const [infomatch, setInfomatch] = useState<MatchInfo[]>([]);

    const isLoadingMatch = useRef(false);

    const swapCases = useCallback((c1: Case, c2: Case) => {
        if (!c1 || !c2 || casesinitiales.length === 0) return;

        const index1 = casesdujeuencours.findIndex(c => c.id === c1.id);
        const index2 = casesdujeuencours.findIndex(c => c.id === c2.id);

        if (index1 === -1 || index2 === -1) return;

        // Validation des indices
        if (index1 >= casesinitiales.length || index2 >= casesinitiales.length) {
            console.warn("Indices hors limites pour casesinitiales");
            return;
        }

        setCasesdujeuencours((prevCases) =>
            prevCases.map((c, index) => {
                // Case à index1 reçoit le texte de c2
                if (index === index1) {
                    const newTxt = c2.txt;
                    // ✅ Compare avec casesinitiales à l'index correspondant
                    const shouldLock = casesinitiales[index]?.txt === newTxt;
                    return {
                        ...c,
                        txt: newTxt,
                        isLocked: shouldLock,
                        isSelected: false
                    };
                }

                // Case à index2 reçoit le texte de c1
                if (index === index2) {
                    const newTxt = c1.txt;
                    // ✅ Compare avec casesinitiales à l'index correspondant
                    const shouldLock = casesinitiales[index]?.txt === newTxt;
                    return {
                        ...c,
                        txt: newTxt,
                        isLocked: shouldLock,
                        isSelected: false
                    };
                }

                return c;
            })
        );

        // Échange des pièces d'image
        setPieces((prevPieces) => {
            if (index1 >= prevPieces.length || index2 >= prevPieces.length) {
                return prevPieces;
            }

            const newPieces = [...prevPieces];
            [newPieces[index1], newPieces[index2]] = [newPieces[index2], newPieces[index1]];
            return newPieces;
        });
    }, [casesdujeuencours, casesinitiales]);

    const selectCase = useCallback((c: Case | null) => {
        if (!c || c.isLocked) {
            setSelectedCase(null);
            return;
        }

        if (!selectedCase) {
            setSelectedCase(c);
            return;
        }

        swapCases(selectedCase, c);
        setSelectedCase(null);
    }, [selectedCase, swapCases]);

    const lockSelectedCase = useCallback(() => {
        if (!selectedCase || casesinitiales.length === 0) {
            setSelectedCase(null);
            return;
        }

        const index = casesdujeuencours.findIndex(c => c.id === selectedCase.id);

        if (index === -1 || index >= casesinitiales.length) {
            setSelectedCase(null);
            return;
        }

        const isCorrect = selectedCase.txt === casesinitiales[index]?.txt;

        if (!isCorrect) {
            // Ne pas verrouiller si incorrect
            setSelectedCase(null);
            return;
        }

        // Verrouiller la case
        setCasesdujeuencours((prevCases) =>
            prevCases.map((c) =>
                c.id === selectedCase.id
                    ? { ...c, isLocked: true, isSelected: false }
                    : c
            )
        );
        setSelectedCase(null);
    }, [selectedCase, casesdujeuencours, casesinitiales]);

    const shuffleUnlockedCases = useCallback(() => {
        setCasesdujeuencours((prevCases) => {
            const shuffled = [...prevCases];

            for (let i = shuffled.length - 1; i > 0; i--) {
                if (shuffled[i].isLocked) continue;

                // Trouver un index non verrouillé aléatoire
                let j = Math.floor(Math.random() * (i + 1));
                let attempts = 0;
                while (shuffled[j].isLocked && attempts < shuffled.length) {
                    j = Math.floor(Math.random() * (i + 1));
                    attempts++;
                }

                // Échanger si trouvé
                if (!shuffled[j].isLocked && i !== j) {
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
            }

            return shuffled;
        });
    }, []);

    const toggleShowPun = useCallback(() => {
        setShowPun((prev) => !prev);
        if (!showPun) {
            shuffleUnlockedCases();
        }
        setSelectedCase(null);
    }, [showPun, shuffleUnlockedCases]);

    const handleBack = useCallback(() => {
        router.push('/star/learning');
    }, []);

    const chargerMatch = useCallback((matchData: MatchInfo) => {
        if (!matchData) return;

        const casesJeu = matchData.listeCaseOpLab ?? [];
        const casesInit = matchData.listeCaseOpLabInitiale ?? [];
        const piecesMatch = matchData.pieces ?? [];

        setCasesdujeuencours(casesJeu);
        setCasesinitiales(casesInit);
        setPieces(piecesMatch);
        setFinmatch(false);
        setSelectedCase(null);
        setShowPun(false);
    }, []);

    const timeElapsed = useTimer(start);

    useEffect(() => {
        if (hasAnimated && !start) {
            setStart(true);
        }
    }, [hasAnimated, start]);

    useEffect(() => {
        if (option === 0 || finmatch) return;

        const delay = showPun ? 5000 : getChronoTime(niveau);
        const timeout = setTimeout(() => {
            toggleShowPun();
        }, delay);

        return () => clearTimeout(timeout);
    }, [niveau, showPun, toggleShowPun, option, finmatch]);

    useEffect(() => {
        if (matchEnCours === -1 || !infomatch[matchEnCours] || isLoadingMatch.current) {
            return;
        }

        isLoadingMatch.current = true;
        chargerMatch(infomatch[matchEnCours]);

        // Reset du flag après un court délai
        setTimeout(() => {
            isLoadingMatch.current = false;
        }, 100);

    }, [matchEnCours, infomatch, chargerMatch]);

    useEffect(() => {
        if (matchEnCours === -1 || !infomatch.length) return;

        // Tous les matchs sont terminés
        if (matchEnCours >= infomatch.length) {
            setFinmatch(true);
        }
    }, [matchEnCours, infomatch.length]);

    useEffect(() => {
        if (casesdujeuencours.length === 0) return;

        const allLocked = casesdujeuencours.every((c) => c.isLocked);

        if (allLocked) {
            // Match actuel terminé
            if (infomatch.length === 1 || matchEnCours >= infomatch.length - 1) {
                // Dernier match
                setFinmatch(true);
            } else {
                // Passer au match suivant
                setTimeout(() => {
                    setMatchEnCours((prev) => prev + 1);
                }, 500); // Petit délai pour l'animation
            }
        }
    }, [casesdujeuencours, infomatch.length, matchEnCours]);

    const lancementRef = useRef(false);

    useEffect(() => {
        if (lancementRef.current) return;

        const lancerJeu = async () => {
            lancementRef.current = true;
            setLoading(true);
            setStart(false);
            setFinmatch(false);

            try {
                const pieces = await decoupelimage("/ephotoquatorze.jpg", niveau!);
                const matchList = generateMatchList(tpsglobal);
                const updatedMatches = await Promise.all(
                    matchList.map((match) => loadMatch(match, niveau!, pieces))
                );

                setInfomatch(updatedMatches);
                setDatedebut(new Date().toISOString());
                setMatchEnCours(0);
                setAnimated(true);

                if (updatedMatches[0]) {
                    chargerMatch(updatedMatches[0]);
                }
            } catch (error) {
                console.error("Erreur:", error);
            } finally {
                setLoading(false);
                lancementRef.current = false;
            }
        };

        lancerJeu();
    }, [niveau, chargerMatch]);

    if (loading) return <Loader />;

    return (
        <div className="p-2">
            <motion.div
                key="content"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto"
            >

                <AnimatePresence mode="wait">
                    {finmatch ? (
                        <FinMatchView
                            niveau={niveau}
                            option={option}
                            datedebut={datedebut}
                            tpsglobal={tpsglobal}
                            infomatch={infomatch}
                        />
                    ) : (
                        <GamePlayView
                            cases={casesdujeuencours}
                            casesun={casesinitiales}
                            pieces={pieces}
                            selectedCase={selectedCase}
                            selectCase={selectCase}
                            showPun={showPun}
                            toggleShowPun={toggleShowPun}
                            lockSelectedCase={lockSelectedCase}
                            animated={animated}
                            hasAnimated={hasAnimated}
                            handleAnimationEnd={() => {
                                if (!hasAnimated) setHasAnimated(true);
                            }}
                            start={start}
                            timeElapsed={timeElapsed}
                            niveau={niveau}
                            option={option}
                            matchEncours={matchEnCours}
                            infomatch={infomatch}
                            tpsglobal={tpsglobal}
                        />
                    )}
                </AnimatePresence>
                <button
                    onClick={handleBack}
                    className="mb-4 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm font-medium text-gray-700"
                >
                    ← Retour au menu
                </button>
            </motion.div>
        </div>
    );
});

MenuDiambra.displayName = "MenuDiambra";

export default MenuDiambra;