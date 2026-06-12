'use client';

import { Case, CompetitionInfo, MatchInfo } from '@/lib/interfaces';
import { choix, decoupelimage } from "@/lib/learning/functions";
import { createInitialCases, createMatch, createPlayableCases, getTotalCases, shuffleArray } from "@/lib/learning/services/game.service";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { useCallback, useEffect, useMemo, useState } from 'react';

// ============================================================================
// CONSTANTES
// ============================================================================

const GLOBAL_GAME_ORDER = [0, 3, 1, 2] as const;
const DEFAULT_MATCH_ID = "123456789";
const DEFAULT_NIVEAU = 2;
const IMAGE_PATH = "/ephotoquatorze.jpg";
const TRANSITION_DELAY = 100;
const BATCH_SIZE = 2;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Types
interface GameState {
    tpsglobal: number;
    casesdujeuencours: Case[];
    casesinitiales: Case[];
    pieces: string[];
    selectedCase: Case | null;
    datedebut: string;
    start: boolean;
    showPun: boolean;
    matchEnCours: number;
    infomatch: MatchInfo[];
    isTransitioning: boolean;
    isLoading: boolean;
    matchestermine: boolean;
    isGameInitializing: boolean;
    error: Error | null;
    lancementStarted: boolean;
    allMatchesFinished: boolean;
    matchLoading: boolean;
}

// ============================================================================
// HOOK PERSONNALISÉ POUR LE TIMER
// ============================================================================

const useTimer = (start: boolean) => {
    const [timeElapsed, setTimeElapsed] = useState(0);

    useEffect(() => {
        if (!start) {
            setTimeElapsed(0);
            return;
        }

        const timer = setInterval(() => {
            setTimeElapsed((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [start]);

    return timeElapsed;
};

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const withRetry = async <T,>(
    fn: () => Promise<T>,
    retries: number = MAX_RETRIES,
    delayMs: number = RETRY_DELAY
): Promise<T> => {
    try {
        return await fn();
    } catch (error) {
        if (retries === 0) throw error;
        await delay(delayMs);
        return withRetry(fn, retries - 1, delayMs);
    }
};

// ============================================================================
// HOOK PRINCIPAL OPTIMISÉ
// ============================================================================

export const useGameGenerator = () => {
    const { gameConfig, setCurrentMatchInfo, addCompetition } = useMonEtoileStore();

    const numeromatch = gameConfig?.numeromatch ?? DEFAULT_MATCH_ID;
    const niveau = gameConfig?.niveau ?? DEFAULT_NIVEAU;

    // État unique regroupé
    const [state, setState] = useState<GameState>({
        tpsglobal: 0,
        casesdujeuencours: [],
        casesinitiales: [],
        pieces: [],
        selectedCase: null,
        datedebut: "",
        start: false,
        showPun: false,
        matchEnCours: 0,
        infomatch: [],
        isTransitioning: false,
        isLoading: true,
        matchestermine: false,
        isGameInitializing: false,
        error: null,
        lancementStarted: false,
        allMatchesFinished: false,
        matchLoading: false,
    });

    const timeElapsed = useTimer(state.start);

    // ============================================================================
    // FONCTIONS DE MISE À JOUR
    // ============================================================================

    const updateState = useCallback((updates: Partial<GameState>) => {
        setState(prev => ({ ...prev, ...updates }));
    }, []);

    const updateMatchInfo = useCallback((index: number, updates: Partial<MatchInfo>) => {
        setState(prev => ({
            ...prev,
            infomatch: prev.infomatch.map((m, idx) =>
                idx === index ? { ...m, ...updates } : m
            ),
        }));
    }, []);

    // ============================================================================
    // LOGIQUE MÉTIER
    // ============================================================================

    const generateMatchList = useCallback((): MatchInfo[] => {
        return GLOBAL_GAME_ORDER.map((type, index) => createMatch(type, index, numeromatch));
    }, [numeromatch]);

    const loadMatch = useCallback(async (
        match: MatchInfo,
        currentNiveau: number,
        piecesImages: string[]
    ): Promise<MatchInfo> => {
        const totalCases = getTotalCases(match.tpsglobal!, currentNiveau);
        const gridSize = currentNiveau * currentNiveau;
        const seed = parseInt(match.numeromatch!) + 7;

        let availableCases = Array.from({ length: totalCases }, (_, i) => i.toString());

        if (match.tpsglobal !== 2) {
            availableCases = shuffleArray(availableCases, seed);
        }

        const selectedCases = availableCases.slice(0, gridSize);
        const shuffledCases = shuffleArray([...selectedCases], seed);

        match.listeCaseOpLab = createPlayableCases(shuffledCases, selectedCases, match);
        match.listeCaseOpLabInitiale = createInitialCases(selectedCases, match);
        match.pieces = piecesImages;

        return match;
    }, []);

    const initializeMatches = useCallback(async (
        matchList: MatchInfo[],
        currentNiveau: number,
        piecesImages: string[]
    ): Promise<MatchInfo[]> => {
        const results: MatchInfo[] = [];

        for (let i = 0; i < matchList.length; i += BATCH_SIZE) {
            const batch = matchList.slice(i, i + BATCH_SIZE);
            const batchResults = await Promise.all(
                batch.map(match => loadMatch(match, currentNiveau, piecesImages))
            );
            results.push(...batchResults);
        }

        return results;
    }, [loadMatch]);

    const chargerMatch = useCallback((matchData: MatchInfo) => {
        if (!matchData) return;
        updateState({
            tpsglobal: matchData.tpsglobal ?? 0,
            casesdujeuencours: matchData.listeCaseOpLab ?? [],
            casesinitiales: matchData.listeCaseOpLabInitiale ?? [],
            pieces: matchData.pieces ?? [],
            selectedCase: null,
            showPun: false,
        });
    }, [updateState]);

    const swapCases = useCallback((c1: Case, c2: Case) => {
        setState(prev => {
            const { casesdujeuencours, casesinitiales } = prev;
            if (!c1 || !c2 || casesinitiales.length === 0) return prev;

            const index1 = casesdujeuencours.findIndex(c => c.id === c1.id);
            const index2 = casesdujeuencours.findIndex(c => c.id === c2.id);
            if (index1 === -1 || index2 === -1 || index1 >= casesinitiales.length || index2 >= casesinitiales.length) return prev;

            const newCases = [...casesdujeuencours];
            newCases[index1] = { ...newCases[index1], txt: c2.txt, isLocked: false, isSelected: false };
            newCases[index2] = { ...newCases[index2], txt: c1.txt, isLocked: casesinitiales[index2]?.txt === c1.txt, isSelected: false };

            return { ...prev, casesdujeuencours: newCases };
        });
    }, []);

    const selectCase = useCallback((c: Case | null) => {
        setState(prev => {
            if (!c || c.isLocked) return { ...prev, selectedCase: null };
            if (!prev.selectedCase) return { ...prev, selectedCase: c };
            
            // Swap cases
            const index1 = prev.casesdujeuencours.findIndex(case_ => case_.id === prev.selectedCase?.id);
            const index2 = prev.casesdujeuencours.findIndex(case_ => case_.id === c.id);
            
            if (index1 === -1 || index2 === -1) return { ...prev, selectedCase: null };
            
            const newCases = [...prev.casesdujeuencours];
            newCases[index1] = { ...newCases[index1], txt: c.txt, isLocked: false, isSelected: false };
            newCases[index2] = { ...newCases[index2], txt: prev.selectedCase.txt, isLocked: prev.casesinitiales[index2]?.txt === prev.selectedCase.txt, isSelected: false };
            
            return { ...prev, casesdujeuencours: newCases, selectedCase: null };
        });
    }, []);

    const lockSelectedCase = useCallback(() => {
        setState(prev => {
            const { selectedCase, casesdujeuencours, casesinitiales } = prev;
            if (!selectedCase || casesinitiales.length === 0) return { ...prev, selectedCase: null };

            const index = casesdujeuencours.findIndex(c => c.id === selectedCase.id);
            if (index === -1 || index >= casesinitiales.length) return { ...prev, selectedCase: null };
            if (selectedCase.txt !== casesinitiales[index]?.txt) return { ...prev, selectedCase: null };

            const newCases = casesdujeuencours.map(c =>
                c.id === selectedCase.id ? { ...c, isLocked: true, isSelected: false } : c
            );

            return { ...prev, casesdujeuencours: newCases, selectedCase: null };
        });
    }, []);

    const shuffleUnlockedCases = useCallback(() => {
        setState(prev => {
            const shuffled = [...prev.casesdujeuencours];
            for (let i = shuffled.length - 1; i > 0; i--) {
                if (shuffled[i].isLocked) continue;
                let j = Math.floor(Math.random() * (i + 1));
                let attempts = 0;
                while (shuffled[j].isLocked && attempts < shuffled.length) {
                    j = Math.floor(Math.random() * (i + 1));
                    attempts++;
                }
                if (!shuffled[j].isLocked && i !== j) {
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
            }
            return { ...prev, casesdujeuencours: shuffled };
        });
    }, []);

    const toggleShowPun = useCallback(() => {
        setState(prev => ({ ...prev, showPun: !prev.showPun, selectedCase: null }));
        if (!state.showPun) shuffleUnlockedCases();
    }, [state.showPun, shuffleUnlockedCases]);

    // ============================================================================
    // INITIALISATION DU JEU
    // ============================================================================

    const initializeGame = useCallback(async () => {
        setState(prev => {
            if (prev.isGameInitializing || prev.lancementStarted) return prev;
            return { ...prev, isGameInitializing: true, error: null, lancementStarted: true };
        });

        try {
            const matchList = generateMatchList();
            const piecesImages = await withRetry(() => decoupelimage(IMAGE_PATH, niveau));

            const updatedMatches = await initializeMatches(matchList, niveau, piecesImages);

            setCurrentMatchInfo(updatedMatches);
            
            setState(prev => ({
                ...prev,
                infomatch: updatedMatches,
                datedebut: new Date().toISOString(),
                matchEnCours: 0,
                isLoading: false,
                isGameInitializing: false,
            }));

            if (updatedMatches[0]) chargerMatch(updatedMatches[0]);

        } catch (err) {
            console.error("Erreur lors de l'initialisation du jeu:", err);
            setState(prev => ({
                ...prev,
                error: err instanceof Error ? err : new Error('Erreur inconnue'),
                isGameInitializing: false,
                isLoading: false,
                infomatch: [],
            }));
        }
    }, [generateMatchList, niveau, initializeMatches, setCurrentMatchInfo, chargerMatch]);

    // ============================================================================
    // GESTION DES TRANSITIONS DE MATCH
    // ============================================================================

    const handleMatchTransition = useCallback(() => {
        setState(prev => {
            const { matchEnCours, infomatch } = prev;
            
            if (matchEnCours + 1 < infomatch.length) {
                const nextMatch = infomatch[matchEnCours + 1];
                return {
                    ...prev,
                    isTransitioning: true,
                    isLoading: true,
                    matchEnCours: matchEnCours + 1,
                    showPun: false,
                    selectedCase: null,
                };
            } else {
                return {
                    ...prev,
                    isLoading: false,
                    matchestermine: true,
                    isTransitioning: false,
                };
            }
        });
    }, []);

    // ============================================================================
    // EFFETS
    // ============================================================================

    // Démarrer l'initialisation
    useEffect(() => {
        initializeGame();
    }, [initializeGame]);

    // Démarrer le timer
    useEffect(() => {
        if (!state.start && state.infomatch.length > 0) {
            updateState({ start: true });
        }
    }, [state.start, state.infomatch.length, updateState]);

    // Gestion du chargement des matches
    useEffect(() => {
        const { matchEnCours, infomatch, matchLoading, isTransitioning } = state;
        
        if (matchEnCours === -1 || !infomatch[matchEnCours] || matchLoading || isTransitioning) return;

        setState(prev => ({ ...prev, matchLoading: true, isLoading: true }));
        chargerMatch(infomatch[matchEnCours]);

        const timer = setTimeout(() => {
            setState(prev => ({ ...prev, matchLoading: false, isLoading: false, isTransitioning: false }));
        }, TRANSITION_DELAY);

        return () => clearTimeout(timer);
    }, [state.matchEnCours, state.infomatch, state.matchLoading, state.isTransitioning, chargerMatch]);

    // Vérifier si le match est terminé
    useEffect(() => {
        const { casesdujeuencours, isTransitioning, matchEnCours, infomatch, matchLoading } = state;
        
        if (casesdujeuencours.length === 0 || isTransitioning || matchLoading) return;
        if (!casesdujeuencours.every(c => c.isLocked)) return;

        const completedCount = casesdujeuencours.filter(c => c.isLocked).length;
        
        updateMatchInfo(matchEnCours, { 
            isgameover: true, 
            trouves: (infomatch[matchEnCours]?.trouves || 0) + completedCount 
        });

        const timer = setTimeout(handleMatchTransition, TRANSITION_DELAY);
        return () => clearTimeout(timer);
    }, [state.casesdujeuencours, state.isTransitioning, state.matchEnCours, state.infomatch, state.matchLoading, updateMatchInfo, handleMatchTransition]);

    // Sauvegarder la compétition
    // useEffect(() => {
    //     const { infomatch, datedebut, matchestermine, allMatchesFinished } = state;
        
    //     const allMatchesCompleted = infomatch.length > 0 && infomatch.every(m => m.isgameover === true);
        
    //     if (allMatchesCompleted && infomatch.length > 0 && !allMatchesFinished && matchestermine) {
    //         const competitionId = `comp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    //         const competition: CompetitionInfo = {
    //             id: competitionId,
    //             matchInfo: infomatch,
    //             datedebut: datedebut,
    //             idConfig: gameConfig?.id!,
    //             consultationId: gameConfig?.id!,
    //             datefin: new Date().toISOString()
    //         };

    //         addCompetition(competition);
    //         setState(prev => ({ ...prev, allMatchesFinished: true }));
    //     }
    // }, [state.infomatch, state.datedebut, state.matchestermine, state.allMatchesFinished, addCompetition]);

    // ============================================================================
    // VALEURS MÉMOISÉES
    // ============================================================================

    const currentGameType = useMemo(() => {
        const { infomatch, matchEnCours } = state;
        if (!infomatch?.length || matchEnCours === undefined || !infomatch[matchEnCours]) {
            return "Aucun match en cours";
        }
        return choix(infomatch[matchEnCours].tpsglobal || 0);
    }, [state.infomatch, state.matchEnCours]);

    const progression = useMemo(() => {
        if (state.casesdujeuencours.length === 0) return 0;
        const lockedCount = state.casesdujeuencours.filter(c => c.isLocked).length;
        return (lockedCount / state.casesdujeuencours.length) * 100;
    }, [state.casesdujeuencours]);

    // ============================================================================
    // RETOUR
    // ============================================================================

    return { 
          showPun: state.showPun,
        tpsglobal: state.tpsglobal,
        casesdujeuencours: state.casesdujeuencours,
        casesinitiales: state.casesinitiales,
        pieces: state.pieces,
        selectedCase: state.selectedCase,
        toggleShowPun, lockSelectedCase, selectCase,
        currentGameType, progression, niveau, timeElapsed,
    };
};