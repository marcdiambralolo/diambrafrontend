'use client';
import { api } from '@/lib/api/client';
import { Case, CompetitionInfo, Consultation, MatchInfo } from '@/lib/interfaces';
import { choix, decoupelimage } from "@/lib/learning/functions";
import { createInitialCases, createMatch, createPlayableCases, getTotalCases, shuffleArray } from "@/lib/learning/services/game.service";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTimer } from './useTimer';

const GLOBAL_GAME_ORDER = [0, 3, 1, 2] as const;
const TRANSITION_DELAY = 100;

export const useGameGenerator = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { gameConfig, addCompetition, } = useMonEtoileStore();

    const consultationIdFromUrl = searchParams.get('idconsultation');
    const existingConsultationId = consultationIdFromUrl;

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

    const updateConsultationWithDuration = useCallback(async (durationInSeconds: number) => {
        if (!existingConsultationId) {
            console.warn('Aucun ID de consultation trouvé');
            return null;
        }

        try {
            const { data: existingConsultation } = await api.get(`/consultations/${existingConsultationId}`);

            if (!existingConsultation) {
                console.warn('Consultation non trouvée');
                return null;
            }

            const timeSpentMs = durationInSeconds * 1000;

            const updatedConsultation: Partial<Consultation> = {
                ...existingConsultation,
                timeSpent: timeSpentMs.toString(),
                endTime: new Date().toISOString(),
                status: 'completed',
            };

            const { data } = await api.put(`/consultations/${existingConsultationId}`, updatedConsultation);

            console.log(`✅ Consultation mise à jour avec durée: ${durationInSeconds}s`);
            return data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la consultation:', error);
            return null;
        }
    }, [existingConsultationId]);

    const createOrUpdateConsultation = useCallback(async (durationInSeconds: number) => {
        let consultationId = existingConsultationId;

        if (!consultationId) {
            try {
                const { data } = await api.post('/consultations', {
                    configId: gameConfig?.id,
                    startTime: state.datedebut,
                    endTime: new Date().toISOString(),
                    timeSpent: durationInSeconds * 1000,
                    status: 'completed',
                });
                consultationId = (data as Consultation)._id;
                console.log(`✅ Nouvelle consultation créée avec durée: ${durationInSeconds}s`);
                return consultationId;
            } catch (error) {
                console.error('Erreur lors de la création de la consultation:', error);
                return null;
            }
        }

        await updateConsultationWithDuration(durationInSeconds);
        return consultationId;
    }, [existingConsultationId, gameConfig?.id, state.datedebut, updateConsultationWithDuration,]);

    const saveFinalResults = useCallback(async () => {
        if (!allMatchesFinished) return;

        const totalDurationSeconds = timeElapsed;
        const consultationId = await createOrUpdateConsultation(totalDurationSeconds);

        const competitionId = `comp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        const competition: CompetitionInfo = {
            id: competitionId,
            matchInfo: state.infomatch,
            datedebut: state.datedebut,
            idConfig: gameConfig?.id!,
            datefin: new Date().toISOString(),
            consultationId: consultationId || '',
            timeSpent: totalDurationSeconds,
            name: gameConfig?.id,
            displayName: gameConfig?.id!,
        };

        addCompetition(competition);

        console.log(`✅ Compétition terminée - Durée: ${totalDurationSeconds}s - Consultation: ${consultationId || 'non créée'}`);

        return consultationId;
    }, [allMatchesFinished, timeElapsed, state.infomatch, state.datedebut, gameConfig?.id, addCompetition, createOrUpdateConsultation]);

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
                    const shouldLock = prev.casesinitiales[idx]?.txt === newTxt;
                    return { ...c, txt: newTxt, isLocked: shouldLock, isSelected: false };
                }
                if (idx === index2) {
                    const newTxt = c1.txt;
                    const shouldLock = prev.casesinitiales[idx]?.txt === newTxt;
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

    useEffect(() => {
        if (!state.start) updateState({ start: true });
    }, [state.start, updateState]);

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
    }, [state.casesdujeuencours, state.isTransitioning, state.matchEnCours, state.infomatch, updateState]);

    useEffect(() => {
        if (allMatchesFinished && state.infomatch.length > 0 && !state.isGameover) {
            updateState({ isGameover: true });
            saveFinalResults();

            const redirectUrl = existingConsultationId
                ? `/star/learning?retour=game&idconsultation=${existingConsultationId}`
                : '/star/learning';
            router.push(redirectUrl);
        }
    }, [allMatchesFinished, state.infomatch, state.isGameover, saveFinalResults, router, existingConsultationId, updateState]);

    useEffect(() => {
        if (lancementRef.current) return;
        lancementRef.current = true;

        const lancerJeu = async () => {
            updateState({ start: false, isTransitioning: false });

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

    const currentGameType = useMemo(() => {
        const { infomatch, matchEnCours } = state;
        if (!infomatch?.length || matchEnCours === undefined || !infomatch[matchEnCours]) return "Aucun match en cours";
        return choix(infomatch[matchEnCours].tpsglobal || 0);
    }, [state.infomatch, state.matchEnCours]);

    const progression = state.casesdujeuencours.length > 0
        ? (state.casesdujeuencours.filter(c => c.isLocked).length / state.casesdujeuencours.length) * 100
        : 0;

    const lockedCount = state.casesdujeuencours.filter(c => c.isLocked).length;
    const totalCount = state.casesdujeuencours.length;
    const hasCases = totalCount > 0;

    return {
        niveau: gameConfig?.niveau,
        showPun: state.showPun,
        tpsglobal: state.tpsglobal,
        casesdujeuencours: state.casesdujeuencours,
        casesinitiales: state.casesinitiales,
        pieces: state.pieces,
        selectedCase: state.selectedCase,
        toggleShowPun, lockSelectedCase, selectCase,
        currentGameType, progression, timeElapsed,
        lockedCount, totalCount, hasCases,
    };
};