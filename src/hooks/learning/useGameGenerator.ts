import useTimer from "@/hooks/learning/useTimer";
import { Case, MatchInfo } from '@/lib/interfaces';
import { decoupelimage } from "@/lib/learning/functions";
import { createInitialCases, createMatch, createPlayableCases, getTotalCases, shuffleArray } from "@/lib/learning/services/game.service";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const GLOBAL_GAME_ORDER = [0, 3, 1, 2] as const;

export const useGameGenerator = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const niveau = Number(searchParams.get('niveau')) || 5;
    const tpsglobal = Number(searchParams.get('tpsglobal') || "0");

    const currentYear = useMemo(() => new Date().getFullYear(), []);

    const [loading, setLoading] = useState(false);
    const [casesdujeuencours, setCasesdujeuencours] = useState<Case[]>([]);
    const [casesinitiales, setCasesinitiales] = useState<Case[]>([]);
    const [pieces, setPieces] = useState<string[]>([]);
    const [selectedCase, setSelectedCase] = useState<Case | null>(null);
    const [datedebut, setDatedebut] = useState<string>("");
    const [start, setStart] = useState(false);
    const [showPun, setShowPun] = useState(false);
    const [matchEnCours, setMatchEnCours] = useState(-1);
    const [infomatch, setInfomatch] = useState<MatchInfo[]>([]);

    const lancementRef = useRef(false);
    const isLoadingMatch = useRef(false);
    const timeElapsed = useTimer(start);

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
        // setFinmatch(false);
        setSelectedCase(null);
        setShowPun(false);
    }, []);

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

    useEffect(() => {
        if (!start) {
            setStart(true);
        }
    }, [start]);

    useEffect(() => {
        if (matchEnCours === -1 || !infomatch[matchEnCours] || isLoadingMatch.current) {
            return;
        }

        isLoadingMatch.current = true;
        chargerMatch(infomatch[matchEnCours]);
        setTimeout(() => {
            isLoadingMatch.current = false;
        }, 100);

    }, [matchEnCours, infomatch, chargerMatch]);

    useEffect(() => {
        if (matchEnCours === -1 || !infomatch.length) return;

        // Tous les matchs sont terminés
        if (matchEnCours >= infomatch.length) {
            window.location.href = '/star/learning/endgame';
        }
    }, [matchEnCours, infomatch.length]);

    useEffect(() => {
        if (casesdujeuencours.length === 0) return;

        const allLocked = casesdujeuencours.every((c) => c.isLocked);

        if (allLocked) {
            // Match actuel terminé
            if (infomatch.length === 1 || matchEnCours >= infomatch.length - 1) {
                // Dernier match
                // setFinmatch(true);
                window.location.href = '/star/learning/endgame';
            } else {
                // Passer au match suivant
                setTimeout(() => {
                    setMatchEnCours((prev) => prev + 1);
                }, 500); // Petit délai pour l'animation
            }
        }
    }, [casesdujeuencours, infomatch.length, matchEnCours]);

    useEffect(() => {
        if (lancementRef.current) return;

        const lancerJeu = async () => {
            lancementRef.current = true;
            setLoading(true);
            setStart(false);

            try {
                const pieces = await decoupelimage("/ephotoquatorze.jpg", niveau!);
                const matchList = generateMatchList(tpsglobal);
                const updatedMatches = await Promise.all(
                    matchList.map((match) => loadMatch(match, niveau!, pieces))
                );

                setInfomatch(updatedMatches);
                setDatedebut(new Date().toISOString());
                setMatchEnCours(0);

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

    const handleClick = () => {
        window.location.href = '/star/learning';
    };

    return {
        lockSelectedCase, selectCase, handleBack, toggleShowPun, handleClick, pieces, start, showPun, currentYear, datedebut,
        loading, niveau, tpsglobal, matchEnCours, infomatch, casesdujeuencours, casesinitiales, selectedCase, timeElapsed,
    };
};