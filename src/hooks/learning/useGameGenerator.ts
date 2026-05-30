import useTimer from "@/hooks/learning/useTimer";
import { Case, MatchInfo } from '@/lib/interfaces';
import { choix, decoupelimage } from "@/lib/learning/functions";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGameConfig } from "./useGame";

const LINEAR_CONGRUENTIAL_GENERATOR = {
    MODULUS: 2147483647,
    MULTIPLIER: 16807,
    OFFSET: 2147483646,
} as const;

const CASE_COUNTS_BY_TYPE: Readonly<Record<number, number>> = {
    0: 199,  // Nombre
    1: 101,  // Couleur
    2: 0,    // Image (calculé dynamiquement)
    3: 650,  // Lettre
} as const;

const MAX_PIECES_SIZE = 10000;
const MAX_NIVEAU = 10;

// ==================== GÉNÉRATEUR ALÉATOIRE DÉTERMINISTE ====================
/**
 * Générateur pseudo-aléatoire linéaire congruentiel (LCG)
 * Implémentation du générateur Park-Miller (MINSTD)
 * Garantit la reproductibilité avec la même seed
 */
class SeededRandom {
    private seed: number;

    constructor(seed: number) {
        this.seed = seed % LINEAR_CONGRUENTIAL_GENERATOR.MODULUS;
        if (this.seed <= 0) {
            this.seed += LINEAR_CONGRUENTIAL_GENERATOR.OFFSET;
        }
    }

    /**
     * Génère le prochain nombre aléatoire entre 0 et 1
     * Complexité: O(1)
     */
    next(): number {
        this.seed = (this.seed * LINEAR_CONGRUENTIAL_GENERATOR.MULTIPLIER) % LINEAR_CONGRUENTIAL_GENERATOR.MODULUS;
        return (this.seed - 1) / LINEAR_CONGRUENTIAL_GENERATOR.OFFSET;
    }

    /**
     * Génère un entier aléatoire entre 0 (inclus) et max (exclus)
     * Complexité: O(1)
     */
    nextInt(max: number): number {
        return Math.floor(this.next() * max);
    }
}




interface ValidationError {
    field: string;
    message: string;
}


// ============================================================================
// FONCTIONS DE GÉNÉRATION
// ============================================================================


const shuffleArray = <T>(items: T[], seed: number): T[] => {
    const shuffled = [...items];
    const random = new SeededRandom(seed);

    // Fisher-Yates shuffle: O(n)
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = random.nextInt(i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
};

const createMatch = (ordre: number, tpsglobal: number, matchId: string): MatchInfo => {
    return {
        numordrep: ordre + 1,
        isgameover: false,
        numeromatch: matchId,
        entite: parseInt(matchId) % 9 || 0,
        tpsglobal,
    };
};

const createInitialCases = (items: string[], match: MatchInfo): Case[] =>
    items.map((txt, index) => ({
        id: index + 1,
        index,
        txt,
        itxt: txt,
        numordrep: match.numordrep,
        tpsglobal: match.tpsglobal,
        place: false,
        isLocked: true,
        mode: false,
    }));

const createPlayableCases = (
    shuffledItems: string[],
    originalItems: string[],
    match: MatchInfo
): Case[] =>
    shuffledItems.map((txt, index) => ({
        id: index + 1,
        index,
        txt,
        itxt: originalItems[index],
        numordrep: match.numordrep,
        tpsglobal: match.tpsglobal,
        place: false,
        isLocked: false,
        mode: true,
    }));

const getTotalCases = (tpsglobal: number, niveau: number): number => {
    if (tpsglobal === 2) {
        // Type Image : dépend du niveau
        return niveau * niveau;
    }

    const count = CASE_COUNTS_BY_TYPE[tpsglobal];
    if (count === undefined) {
        throw new Error(`Type de jeu invalide: ${tpsglobal}`);
    }

    return count;
};

const GLOBAL_GAME_ORDER = [0, 3, 1, 2] as const;

export const useGameGenerator = () => {
    const { saveFinalResults, clearCompletedMatches,   setJouer } = useMonEtoileStore();
    const { data: gameConfig } = useGameConfig();

    const [tpsglobal, setTpsglobal] = useState(0);
    const [casesdujeuencours, setCasesdujeuencours] = useState<Case[]>([]);
    const [casesinitiales, setCasesinitiales] = useState<Case[]>([]);
    const [pieces, setPieces] = useState<string[]>([]);
    const [selectedCase, setSelectedCase] = useState<Case | null>(null);
    const [datedebut, setDatedebut] = useState<string>("");
    const [start, setStart] = useState(false);
    const [showPun, setShowPun] = useState(false);
    const [gameisover,setGameisover] = useState(false);
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

        if (index1 >= casesinitiales.length || index2 >= casesinitiales.length) {
            console.warn("Indices hors limites pour casesinitiales");
            return;
        }

        setCasesdujeuencours((prevCases) =>
            prevCases.map((c, index) => {
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

    const chargerMatch = useCallback((matchData: MatchInfo) => {
        if (!matchData) return;

        const casesJeu = matchData.listeCaseOpLab ?? [];
        const casesInit = matchData.listeCaseOpLabInitiale ?? [];
        const piecesMatch = matchData.pieces ?? [];
        setTpsglobal(matchData.tpsglobal ?? 0);
        setCasesdujeuencours(casesJeu);
        setCasesinitiales(casesInit);
        setPieces(piecesMatch);
        setSelectedCase(null);
        setShowPun(false);
    }, []);

    const generateMatchList = useCallback((): MatchInfo[] => {
        const matchId = gameConfig?.numeromatch || "123456789";
        return GLOBAL_GAME_ORDER.map((type, index) => createMatch(type, index, matchId));
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
        console.log(`🔄 CHARGEMENT du match ${matchEnCours + 1}/${infomatch.length}`);
        console.log(`   - Type de jeu: ${infomatch[matchEnCours].tpsglobal}`);
        console.log(`   - Nombre de cases: ${infomatch[matchEnCours].listeCaseOpLab?.length}`);
        chargerMatch(infomatch[matchEnCours]);
        setTimeout(() => {
            isLoadingMatch.current = false;
        }, 100);

    }, [matchEnCours, infomatch, chargerMatch]);

    useEffect(() => {
        if (matchEnCours === -1 || !infomatch.length) return;

        // Tous les matchs sont terminés
        if (matchEnCours >= infomatch.length) {
            setGameisover(true);
           // setJouer(true);
        }
    }, [matchEnCours, infomatch.length]);



    useEffect(() => {
        if (casesdujeuencours.length === 0) return;

        const allLocked = casesdujeuencours.every((c) => c.isLocked);

        if (allLocked) {
            console.log(`✅ Match ${matchEnCours + 1}/${infomatch.length} terminé !`);

            // Mettre à jour le match actuel dans infomatch
            setInfomatch(prev => {
                const updated = [...prev];
                const uptodate = updated[matchEnCours];
                const trouves = uptodate.trouves || 0;

                if (uptodate) {
                    updated[matchEnCours] = {
                        ...updated[matchEnCours],
                        isgameover: true,
                        trouves: trouves + casesdujeuencours.filter(c => c.isLocked).length,
                    };
                }
                return updated;
            });

            // Vérifier si c'est le dernier match
            const isLastMatch = matchEnCours + 1 >= infomatch.length;

            if (isLastMatch) {
                console.log("🏁 Tous les matchs sont terminés !");
                const datefin = new Date().toISOString();
                const updatedMatches = infomatch.map((match, index) => {
                    if (index === matchEnCours) {
                        return {
                            ...match,
                            isgameover: true,
                            datefin,
                            niveau: gameConfig?.niveau,
                            tpsglobal,
                            trouves: (match.trouves || 0) + casesdujeuencours.filter(c => c.isLocked).length,
                        };
                    }
                    return match;
                });
                saveFinalResults(updatedMatches, datedebut, datefin);
                setGameisover(true);
               // setJouer(true);
            } else {
                // 🔥 Passer au match suivant
                console.log(`🔄 Passage au match ${matchEnCours + 2}/${infomatch.length}`);
                setMatchEnCours(prev => prev + 1);
                setShowPun(false); // Réinitialiser l'affichage
                setSelectedCase(null);
            }
        }
    }, [casesdujeuencours, infomatch.length, matchEnCours, datedebut, gameConfig?.niveau, tpsglobal, saveFinalResults]);



    useEffect(() => {
        if (lancementRef.current) return;

        const lancerJeu = async () => {
            lancementRef.current = true;
            setStart(false);

            clearCompletedMatches();

            try {
                const matchList = generateMatchList();
                const pieces = await decoupelimage("/ephotoquatorze.jpg", gameConfig?.niveau!);
                const updatedMatches = await Promise.all(
                    matchList.map((match) => loadMatch(match, gameConfig?.niveau!, pieces))
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
                lancementRef.current = false;
            }
        };

        lancerJeu();
    }, [gameConfig?.niveau, chargerMatch]);

    const currentGameType = useMemo(() => {
        if (!infomatch?.length || matchEnCours === undefined || !infomatch[matchEnCours]) {
            return "Aucun match en cours";
        }
        return choix(infomatch[matchEnCours].tpsglobal || 0);
    }, [infomatch, matchEnCours]);

    const progression = casesdujeuencours.length > 0
        ? (casesdujeuencours.filter(c => c.isLocked).length / casesdujeuencours.length) * 100
        : 0;

    return {
        toggleShowPun, lockSelectedCase, selectCase, niveau: gameConfig?.niveau, showPun, timeElapsed,
        matchEnCours, infomatch, tpsglobal, casesdujeuencours, casesinitiales, pieces, selectedCase,
        gameisover, currentGameType, progression,
    };
};