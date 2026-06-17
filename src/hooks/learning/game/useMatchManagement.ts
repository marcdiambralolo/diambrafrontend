'use client';
import { CompetitionInfo, MatchInfo } from '@/lib/interfaces';
import { decoupelimage } from "@/lib/learning/functions";
import { GameState } from '@/lib/learning/interface';
import { createInitialCases, createMatch, createPlayableCases, getTotalCases, shuffleArray } from "@/lib/learning/services/game.service";
import { useDiambraStore } from "@/lib/store/diambra.store";
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTimer } from './useTimer';

const GLOBAL_GAME_ORDER = [0, 3, 1, 2] as const;
const TRANSITION_DELAY = 100;
const DEFAULT_IMAGE_PATH = "/ephotoquatorze.jpg";

const useMatchManagement = (
    state: GameState,
    setState: React.Dispatch<React.SetStateAction<GameState>>,
    updateState: (updates: Partial<GameState>) => void
) => {
    const { gameConfig, addCompetition, setAfficheGame, currentConsultationId } = useDiambraStore();
    const timeElapsed = useTimer(state.start);
    const lancementRef = useRef(false);
    const isLoadingMatch = useRef(false);

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
        return GLOBAL_GAME_ORDER.map((type, index) => createMatch(type, index, matchId));
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

    const allMatchesFinished = useMemo(() =>
        state.infomatch.length > 0 && state.infomatch.every(m => m.isgameover === true),
        [state.infomatch]
    );

    const saveFinalResults = useCallback(async () => {
        if (!allMatchesFinished) return;

        const totalDurationSeconds = timeElapsed;
        const competitionId = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

        const competition: CompetitionInfo = {
            id: competitionId,
            matchInfo: state.infomatch,
            datedebut: state.datedebut,
            idConfig: gameConfig?.id!,
            datefin: new Date().toISOString(),
            consultationId: currentConsultationId || '',
            timeSpent: totalDurationSeconds,
            name: gameConfig?.id,
            displayName: gameConfig?.id!,
            niveau: gameConfig?.niveau,
        };

        addCompetition(competition);
    }, [allMatchesFinished, timeElapsed, state.infomatch, state.datedebut, gameConfig?.id, addCompetition, currentConsultationId]);

    useEffect(() => {
        if (lancementRef.current) return;
        lancementRef.current = true;

        const lancerJeu = async () => {
            updateState({ start: false, isTransitioning: false });

            try {
                const matchList = generateMatchList();
                const piecesImages: string[] = await decoupelimage(DEFAULT_IMAGE_PATH, gameConfig?.niveau!);
                const updatedMatches = await Promise.all(
                    matchList.map(match => loadMatch(match, gameConfig?.niveau!, piecesImages))
                );

                updateState({
                    infomatch: updatedMatches,
                    datedebut: new Date().toISOString(),
                    matchEnCours: 0,
                });
                if (updatedMatches[0]) chargerMatch(updatedMatches[0]);
            } catch (error) {
                console.error("Erreur:", error);
            } finally {
                lancementRef.current = false;
            }
        };

        lancerJeu();
    }, [gameConfig?.niveau, generateMatchList, loadMatch, chargerMatch, updateState]);

    useEffect(() => {
        const { matchEnCours, infomatch } = state;
        if (matchEnCours === -1 || !infomatch[matchEnCours] || isLoadingMatch.current) return;

        isLoadingMatch.current = true;
        chargerMatch(infomatch[matchEnCours]);
        setTimeout(() => {
            isLoadingMatch.current = false;
            updateState({ isTransitioning: false });
        }, TRANSITION_DELAY);
    }, [state.matchEnCours, state.infomatch, chargerMatch, updateState]);

    useEffect(() => {
        const { casesdujeuencours, isTransitioning, matchEnCours, infomatch } = state;
        if (casesdujeuencours.length === 0 || isTransitioning) return;
        if (!casesdujeuencours.every(c => c.isLocked)) return;

        updateState({ isTransitioning: true });

        setState(prev => ({
            ...prev,
            infomatch: prev.infomatch.map((m, idx) =>
                idx === matchEnCours ? { ...m, isgameover: true, trouves: (m.trouves || 0) + prev.casesdujeuencours.filter(c => c.isLocked).length } : m
            ),
        }));

        if (matchEnCours + 1 < infomatch.length) {
            updateState({ matchEnCours: matchEnCours + 1, showPun: false, selectedCase: null });
        }
    }, [state.casesdujeuencours, state.isTransitioning, state.matchEnCours, state.infomatch, updateState, setState]);

    useEffect(() => {
        if (allMatchesFinished && state.infomatch.length > 0 && !state.isGameover) {
            updateState({ isGameover: true });
            saveFinalResults();
            setAfficheGame(false);
            window.location.reload();
        }
    }, [allMatchesFinished, state.infomatch, state.isGameover, saveFinalResults, setAfficheGame, updateState]);

    return {
        chargerMatch, timeElapsed, allMatchesFinished,
    };
};

export default useMatchManagement;