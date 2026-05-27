// hooks/learning/useGameGenerator.ts
import { useCallback, useMemo } from 'react';
import { Case, MatchInfo } from '@/lib/interfaces';

// ============================================================================
// CONSTANTES
// ============================================================================

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

const GLOBAL_GAME_ORDER = [0, 3, 1, 2] as const;

const MAX_PIECES_SIZE = 10000;
const MAX_NIVEAU = 10;

// ============================================================================
// CLASSES UTILITAIRES
// ============================================================================

class SeededRandom {
   private seed: number;

    constructor(seed: number) {
        this.seed = seed % LINEAR_CONGRUENTIAL_GENERATOR.MODULUS;
        if (this.seed <= 0) {
            this.seed += LINEAR_CONGRUENTIAL_GENERATOR.OFFSET;
        }
    }

    next(): number {
        this.seed = (this.seed * LINEAR_CONGRUENTIAL_GENERATOR.MULTIPLIER) % LINEAR_CONGRUENTIAL_GENERATOR.MODULUS;
        return (this.seed - 1) / LINEAR_CONGRUENTIAL_GENERATOR.OFFSET;
    }

    nextInt(max: number): number {
        return Math.floor(this.next() * max);
    }
}

// ============================================================================
// FONCTIONS DE GÉNÉRATION
// ============================================================================

export const generateMatchId = (): string => {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return (array[0] % 1000000000).toString().padStart(9, '0');
    }
    // Fallback pour environnements sans crypto
    return Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
};

export const shuffleArray = <T>(items: T[], seed: number): T[] => {
      const shuffled = [...items];
    const random = new SeededRandom(seed);

    // Fisher-Yates shuffle: O(n)
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = random.nextInt(i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
};

export const createMatch = (ordre: number, tpsglobal: number): MatchInfo => {
    const matchId = generateMatchId();

    return {
        numordrep: ordre + 1,
        isgameover: false,
        numeromatch: matchId,
        entite: parseInt(matchId) % 9 || 0,
        tpsglobal,
    };
};

export const createInitialCases = (items: string[], match: MatchInfo): Case[] => 
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

export const createPlayableCases = (
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

export  const getTotalCases = (tpsglobal: number, niveau: number): number => {
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

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

interface UseGameGeneratorReturn {
    generateMatchList: (tpsglobal: number) => MatchInfo[];
    loadMatch: (match: MatchInfo, niveau: number, pieces: string[]) => Promise<MatchInfo>;
    loadAllMatches: (tpsglobal: number, niveau: number, pieces: string[]) => Promise<MatchInfo[]>;
    shuffleArray: <T>(items: T[], seed: number) => T[];
    generateMatchId: () => string;
    getTotalCases: (tpsglobal: number, niveau: number) => number;
    validateGameRequest: (data: any) => ValidationError[];
}

interface ValidationError {
    field: string;
    message: string;
}

export const useGameGenerator = (): UseGameGeneratorReturn => {
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

    return {
        generateMatchList,
        loadMatch,
        loadAllMatches,
        shuffleArray,
        generateMatchId,
        getTotalCases,
        validateGameRequest,
    };
};