import useTimer from "@/hooks/learning/useTimer";
import { Case, MatchInfo } from '@/lib/interfaces';
import { choix, decoupelimage } from "@/lib/learning/functions";
import { createInitialCases, createMatch, createPlayableCases, getTotalCases, shuffleArray } from "@/lib/learning/services/game.service";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGameConfig } from "./useGame";

const GLOBAL_GAME_ORDER = [0, 3, 1, 2] as const;
const TRANSITION_DELAY = 100;

export const useGameGenerator = () => {
    const { saveFinalResults, clearCompletedMatches, updateCompetitionMatches } = useMonEtoileStore();
    const { data: gameConfig } = useGameConfig();

    const [state, setState] = useState({
        tpsglobal: 0,
        casesdujeuencours: [] as Case[],
        casesinitiales: [] as Case[],
        pieces: [] as string[],
        selectedCase: null as Case | null,
        datedebut: "",
        start: false,
        showPun: false,
        matchEnCours: -1,
        infomatch: [] as MatchInfo[],
        isGameover: false,
        isTransitioning: false,
        isLoading: true,
        competitionId: null as string | null,
    });

    const lancementRef = useRef(false);
    const isLoadingMatch = useRef(false);
    const timeElapsed = useTimer(state.start);

    const updateState = useCallback((updates: Partial<typeof state>) => {
        setState(prev => ({ ...prev, ...updates }));
    }, []);

    const allMatchesFinished = useMemo(() =>
        state.infomatch.length > 0 && state.infomatch.every(m => m.isgameover === true),
        [state.infomatch]);

    const swapCases = useCallback((c1: Case, c2: Case) => {
        const { casesdujeuencours, casesinitiales } = state;
        if (!c1 || !c2 || casesinitiales.length === 0) return;

        const index1 = casesdujeuencours.findIndex(c => c.id === c1.id);
        const index2 = casesdujeuencours.findIndex(c => c.id === c2.id);
        if (index1 === -1 || index2 === -1 || index1 >= casesinitiales.length || index2 >= casesinitiales.length) return;

        setState(prev => ({
            ...prev,
            casesdujeuencours: prev.casesdujeuencours.map((c, idx) => {
                if (idx === index1) {
                    const newTxt = c2.txt;
                    return { ...c, txt: newTxt, isLocked: false, isSelected: false };
                }
                if (idx === index2) {
                    const newTxt = c1.txt;
                    const shouldLock = prev.casesinitiales[idx]?.txt === newTxt;
                    setState(prev => ({ ...prev, showPun: true }));
                    return { ...c, txt: newTxt, isLocked: shouldLock, isSelected: false };
                }
                return c;
            }),
        }));
    }, [state]);

    const selectCase = useCallback((c: Case | null) => {
        if (!c || c.isLocked) return updateState({ selectedCase: null });
        if (!state.selectedCase) return updateState({ selectedCase: c });
        swapCases(state.selectedCase, c);
        updateState({ selectedCase: null });
    }, [state.selectedCase, swapCases, updateState]);

    const lockSelectedCase = useCallback(() => {
        const { selectedCase, casesdujeuencours, casesinitiales } = state;
        if (!selectedCase || casesinitiales.length === 0) return updateState({ selectedCase: null });

        const index = casesdujeuencours.findIndex(c => c.id === selectedCase.id);
        if (index === -1 || index >= casesinitiales.length) return updateState({ selectedCase: null });
        if (selectedCase.txt !== casesinitiales[index]?.txt) return updateState({ selectedCase: null });
        setState(prev => ({ ...prev, showPun: true }));
        updateState({
            casesdujeuencours: casesdujeuencours.map(c =>
                c.id === selectedCase.id ? { ...c, isLocked: true, isSelected: false } : c
            ),
            selectedCase: null,
        });
    }, [state, updateState]);

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

    const generateMatchList = useCallback((): MatchInfo[] => {
        const matchId = gameConfig?.numeromatch || "123456789";
        const competitionId = `${matchId}_${Date.now()}`; // 🔥 Générer un ID unique pour la compétition
        
        return GLOBAL_GAME_ORDER.map((type, index) => ({
            ...createMatch(type, index, matchId),
            competitionId, // 🔥 Ajouter l'ID de compétition à chaque match
            matchNumber: index + 1,
            totalMatches: GLOBAL_GAME_ORDER.length,
        }));
    }, [gameConfig?.numeromatch]);

    const loadMatch = useCallback(async (match: MatchInfo, niveau: number, piecesImages: string[]): Promise<MatchInfo> => {
        const totalCases = getTotalCases(match.tpsglobal!, niveau);
        const gridSize = niveau * niveau;
        const seed = parseInt(match.numeromatch!) + 7;

        let availableCases = Array.from({ length: totalCases }, (_, i) => i.toString());

        if (match.tpsglobal !== 2) {
            availableCases = shuffleArray(availableCases, seed);
        }

        const selectedCases = availableCases.slice(0, gridSize);
        let shuffledCases = shuffleArray([...selectedCases], seed);

        match.listeCaseOpLab = createPlayableCases(shuffledCases, selectedCases, match);
        match.listeCaseOpLabInitiale = createInitialCases(selectedCases, match);
        match.pieces = piecesImages;

        return match;
    }, []);

    useEffect(() => { if (!state.start) updateState({ start: true }); }, [state.start, updateState]);

    useEffect(() => {
        const { matchEnCours, infomatch } = state;
        if (matchEnCours === -1 || !infomatch[matchEnCours] || isLoadingMatch.current) return;

        isLoadingMatch.current = true;
        updateState({ isLoading: true });
        chargerMatch(infomatch[matchEnCours]);
        setTimeout(() => { 
            isLoadingMatch.current = false; 
            updateState({ isTransitioning: false, isLoading: false });
        }, TRANSITION_DELAY);
    }, [state.matchEnCours, state.infomatch, chargerMatch, updateState]);

    useEffect(() => {
        const { casesdujeuencours, isTransitioning, matchEnCours, infomatch } = state;
        if (casesdujeuencours.length === 0 || isTransitioning) return;
        if (!casesdujeuencours.every(c => c.isLocked)) return;

        updateState({ isTransitioning: true, isLoading: true });
        
        const completedMatch = {
            ...infomatch[matchEnCours],
            isgameover: true,
            trouves: (infomatch[matchEnCours].trouves || 0) + casesdujeuencours.filter(c => c.isLocked).length,
            completedAt: new Date().toISOString(),
        };
        
        setState(prev => ({
            ...prev,
            infomatch: prev.infomatch.map((m, idx) =>
                idx === matchEnCours ? completedMatch : m
            ),
        }));

        // 🔥 Mettre à jour la compétition dans le store
        if (state.competitionId) {
            updateCompetitionMatches(state.competitionId, matchEnCours, completedMatch);
        }

        if (matchEnCours + 1 < infomatch.length) {
            setTimeout(() => {
                updateState({ 
                    matchEnCours: matchEnCours + 1, 
                    showPun: false, 
                    selectedCase: null, 
                    isLoading: false 
                });
            }, TRANSITION_DELAY);
        } else {
            setTimeout(() => {
                updateState({ isLoading: false });
            }, TRANSITION_DELAY);
        }
    }, [state.casesdujeuencours, state.isTransitioning, state.matchEnCours, state.infomatch, state.competitionId, updateCompetitionMatches, updateState]);

    useEffect(() => {
        if (allMatchesFinished && state.infomatch.length > 0 && !state.isGameover) {
            saveFinalResults(state.infomatch, state.datedebut, new Date().toISOString(), state.competitionId);
            updateState({ isGameover: true, isLoading: false });
        }
    }, [allMatchesFinished, state.infomatch, state.datedebut, state.isGameover, state.competitionId, saveFinalResults, updateState]);

    useEffect(() => {
        if (lancementRef.current) return;
        lancementRef.current = true;

        const lancerJeu = async () => {
            updateState({ start: false, isTransitioning: false, isLoading: true });
            
            clearCompletedMatches();

            try {
                const matchList = generateMatchList();
                let piecesImages: string[] = [];

                const hasImageMode = matchList.some(m => m.tpsglobal === 2);

                if (hasImageMode) {
                    piecesImages = await decoupelimage("/ephotoquatorze.jpg", gameConfig?.niveau!);
                }

                const updatedMatches = await Promise.all(
                    matchList.map(match => loadMatch(match, gameConfig?.niveau!, piecesImages))
                );

                const competitionId = updatedMatches[0]?.competitionId || null;
                
                updateState({
                    infomatch: updatedMatches,
                    datedebut: new Date().toISOString(),
                    matchEnCours: 0,
                    isLoading: false,
                    competitionId: competitionId,
                });
                
                if (updatedMatches[0]) chargerMatch(updatedMatches[0]);
            } catch (error) {
                console.error("Erreur:", error);
                updateState({ isLoading: false });
            } finally {
                lancementRef.current = false;
            }
        };

        lancerJeu();
    }, [gameConfig?.niveau, generateMatchList, loadMatch, chargerMatch, clearCompletedMatches, updateState]);

    const currentGameType = useMemo(() => {
        const { infomatch, matchEnCours } = state;
        if (!infomatch?.length || matchEnCours === undefined || !infomatch[matchEnCours]) return "Aucun match en cours";
        return choix(infomatch[matchEnCours].tpsglobal || 0);
    }, [state.infomatch, state.matchEnCours]);

    const progression = state.casesdujeuencours.length > 0
        ? (state.casesdujeuencours.filter(c => c.isLocked).length / state.casesdujeuencours.length) * 100
        : 0;

    const currentMatchInfo = useMemo(() => {
        if (state.matchEnCours === -1 || !state.infomatch[state.matchEnCours]) return null;
        return {
            current: state.matchEnCours + 1,
            total: state.infomatch.length,
            match: state.infomatch[state.matchEnCours],
        };
    }, [state.matchEnCours, state.infomatch]);

    return {
        toggleShowPun, 
        lockSelectedCase, 
        selectCase, 
        niveau: gameConfig?.niveau,
        showPun: state.showPun, 
        timeElapsed, 
        matchEnCours: state.matchEnCours,
        infomatch: state.infomatch, 
        tpsglobal: state.tpsglobal, 
        casesdujeuencours: state.casesdujeuencours,
        casesinitiales: state.casesinitiales, 
        pieces: state.pieces, 
        selectedCase: state.selectedCase,
        allMatchesFinished, 
        currentGameType, 
        progression, 
        gameisover: state.isGameover,
        isLoading: state.isLoading,
        currentMatchInfo, // 🔥 Info sur le match en cours
        competitionId: state.competitionId, // 🔥 ID de la compétition
    };
};