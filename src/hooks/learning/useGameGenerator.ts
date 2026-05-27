import useTimer from "@/hooks/learning/useTimer";
import { Case, MatchInfo } from '@/lib/interfaces';
import { decoupelimage, getChronoTime } from "@/lib/learning/functions";
import { createInitialCases, createMatch, createPlayableCases, generateMatchId, getTotalCases, shuffleArray } from "@/lib/learning/services/game.service";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const GLOBAL_GAME_ORDER = [0, 3, 1, 2] as const;
const MAX_PIECES_SIZE = 10000;
const MAX_NIVEAU = 10;

interface ValidationError {
    field: string;
    message: string;
}

export const useGameGenerator = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const niveau = Number(searchParams.get('niveau')) || 5;
    const tpsglobal = Number(searchParams.get('tpsglobal') || "0");



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

    const generateMatchList = useCallback((tpsglobal: number): MatchInfo[] => {
        if (tpsglobal === 4) {
            // Mode global : tous les types de jeu
            return GLOBAL_GAME_ORDER.map((type, index) => createMatch(type, index));
        }

        // Mode simple : un seul type de jeu
        return [createMatch(0, tpsglobal)];
    }, []);

    const loadMatch = useCallback(async (
        match: MatchInfo,
        niveau: number,
        pieces: string[]
    ): Promise<MatchInfo> => {
        // Validation
        if (match.tpsglobal === undefined || match.numeromatch === undefined) {
            throw new Error("Match incomplet: tpsglobal ou numeromatch manquant");
        }

        // Calcul des paramètres
        const totalCases = getTotalCases(match.tpsglobal, niveau);
        const gridSize = niveau * niveau;
        const seed = parseInt(match.numeromatch) + 7;

        // Génération des cases
        let availableCases = Array.from({ length: totalCases }, (_, i) => i.toString());

        // Mélange initial (sauf pour les images)
        if (match.tpsglobal !== 2) {
            availableCases = shuffleArray(availableCases, seed);
        }

        // Sélection des cases pour la grille
        const selectedCases = availableCases.slice(0, gridSize);

        // Mélange des cases sélectionnées
        const shuffledCases = shuffleArray(selectedCases, seed);

        // Création des cases
        match.listeCaseOpLab = createPlayableCases(shuffledCases, selectedCases, match);
        match.listeCaseOpLabInitiale = createInitialCases(selectedCases, match);
        match.pieces = pieces;

        return match;
    }, []);

    const loadAllMatches = useCallback(async (
        tpsglobal: number,
        niveau: number,
        pieces: string[]
    ): Promise<MatchInfo[]> => {
        const matchList = generateMatchList(tpsglobal);
        return await Promise.all(
            matchList.map((match) => loadMatch(match, niveau, pieces))
        );
    }, [generateMatchList, loadMatch]);

    const validateGameRequest = useCallback((data: any): ValidationError[] => {
        const errors: ValidationError[] = [];

        if (typeof data.tpsglobal !== "number") {
            errors.push({ field: "tpsglobal", message: "Le type de jeu doit être un nombre" });
        } else if (data.tpsglobal < 0 || data.tpsglobal > 4) {
            errors.push({ field: "tpsglobal", message: "Le type de jeu doit être entre 0 et 4" });
        }

        if (typeof data.niveau !== "number") {
            errors.push({ field: "niveau", message: "Le niveau doit être un nombre" });
        } else if (data.niveau < 2 || data.niveau > MAX_NIVEAU) {
            errors.push({ field: "niveau", message: `Le niveau doit être entre 2 et ${MAX_NIVEAU}` });
        }

        if (!Array.isArray(data.pieces)) {
            errors.push({ field: "pieces", message: "Les pièces doivent être un tableau" });
        } else if (data.pieces.length > MAX_PIECES_SIZE) {
            errors.push({ field: "pieces", message: `Trop de pièces (max: ${MAX_PIECES_SIZE})` });
        } else if (!data.pieces.every((p: any) => typeof p === "string")) {
            errors.push({ field: "pieces", message: "Toutes les pièces doivent être des chaînes" });
        }

        return errors;
    }, []);

    const currentYear = useMemo(() => new Date().getFullYear(), []);

    const handleClick = () => {
        window.location.href = '/star/learning';
    };


    return {
        generateMatchList,
        loadMatch,
        loadAllMatches,
        shuffleArray,
        generateMatchId,
        getTotalCases,
        validateGameRequest,
        loading,
        lancementRef,
        chargerMatch,
        niveau,
        tpsglobal,
        pieces,
        setPieces,
        start,
        setStart,
        finmatch,
        setFinmatch,
        showPun,
        setShowPun,
        hasAnimated,
        setHasAnimated,
        animated,
        setAnimated,
        option,
        setOption,
        matchEnCours,
        setMatchEnCours,
        infomatch,
        setInfomatch,
        casesdujeuencours,
        setCasesdujeuencours,
        casesinitiales,
        setCasesinitiales,
        selectedCase,
        setSelectedCase,
        datedebut,
        setDatedebut,
        selectCase,
        lockSelectedCase,
        toggleShowPun,
        timeElapsed,
        handleBack,
        currentYear,
        handleClick,
    };
};