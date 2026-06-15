'use client';
import { api } from "@/lib/api/client";
import { CompetitionInfo, Consultation } from "@/lib/interfaces";
import { INITIAL_VISIBLE_COUNT, LOAD_MORE_INCREMENT } from "@/lib/learning/constantes";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useMessage } from "./useMessage";
import { useQueryClient } from "@tanstack/react-query";

export interface MatchResult {
    matchNumber: number;
    type: string;
    score: number;
    timeSpent?: number;
    trouves?: number;
    rates?: number;
    niveau?: number;
    combinaisons?: string[];
}

interface MatchDetailPayload {
    tpsglobal?: number;
    score?: number;
    trouves?: number;
    rates?: number;
    isgameover?: boolean;
    timeSpent?: number;
    niveau?: number;
    combinaisons?: string[];
}

interface LearningStatsPayload {
    totalTime?: string;
    averageScore?: number;
    completedAt?: string;
    totalMatches?: number;
    totalTrouves?: number;
    totalRates?: number;
    matchesDetails?: MatchDetailPayload[];
}

const MATCH_TYPES: Record<number, string> = {
    0: 'Chiffre',
    1: 'Couleur',
    2: 'Image',
    3: 'Lettre',
} as const;

const STORAGE_PREFIX = 'validated_competition_';
const REFETCH_INTERVAL = 5000;

export const getMatchType = (tpsglobal?: number): string => {
    if (tpsglobal === undefined) return 'Inconnu';
    return MATCH_TYPES[tpsglobal] ?? 'Inconnu';
};

const calculateDuration = (startDate: string, endDate: string): string => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const diffInSeconds = Math.floor((end - start) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    const minutes = Math.floor(diffInSeconds / 60);
    const seconds = diffInSeconds % 60;
    return `${minutes}m ${seconds}s`;
};

const calculateDurationInSeconds = (startDate: string, endDate: string): number => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    return Math.floor((end - start) / 1000);
};

const getValidationStorageKey = (competitionId: string): string => `${STORAGE_PREFIX}${competitionId}`;

const isCompetitionValidated = (competitionId: string): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(getValidationStorageKey(competitionId)) === 'true';
};

export const useEndGameGenerator = () => {
    const queryClient = useQueryClient();
    const {
        getAllCompetitions,
        gameConfig,
        refreshCompetitions,
        currentConsultationId,
        setGameIsFinished
    } = useMonEtoileStore();

    const { message: validateMessage, showMessage: showValidateMessage } = useMessage();

    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [, startTransition] = useTransition();
    const [refreshKey, setRefreshKey] = useState(0);
    const isRefreshingRef = useRef(false);

    const refreshData = useCallback(() => {
        if (isRefreshingRef.current) return;
        isRefreshingRef.current = true;

        setRefreshKey(prev => prev + 1);
        if (refreshCompetitions) {
            refreshCompetitions();
        }

        setTimeout(() => {
            isRefreshingRef.current = false;
        }, 100);
    }, [refreshCompetitions]);

    useEffect(() => {
        const intervalId = setInterval(refreshData, REFETCH_INTERVAL);
        return () => clearInterval(intervalId);
    }, [refreshData]);

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key?.startsWith(STORAGE_PREFIX)) {
                refreshData();
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [refreshData]);

    const competitions = useMemo(() => {
        const allCompetitions = getAllCompetitions();
        return allCompetitions
            .filter(comp => comp.idConfig === gameConfig?.id)
            .map(comp => ({
                ...comp,
                displayName: `N°: ${comp.id.slice(-12)}`,
                isValidated: isCompetitionValidated(comp.id),
            }))
            .sort((a, b) => {
                if (a.isValidated !== b.isValidated) return a.isValidated ? -1 : 1;
                return new Date(b.datedebut).getTime() - new Date(a.datedebut).getTime();
            });
    }, [getAllCompetitions, gameConfig?.id, refreshKey]);

    const updateLocalCache = useCallback((competitionId: string) => {
        localStorage.setItem(getValidationStorageKey(competitionId), 'true');
        refreshData();
    }, [refreshData]);

    const handleValidateCompetition = useCallback(async (competition: CompetitionInfo): Promise<boolean> => {
        if (!currentConsultationId) {
            showValidateMessage('Aucune consultation en cours', 'error');
            return false;
        }

        if (!competition.matchInfo?.length) {
            showValidateMessage('Aucun match à valider', 'error');
            return false;
        }

        try {
            const totalScore = competition.matchInfo.reduce((acc, m) => acc + (m.trouves || 0), 0);
            const totalTrouves = competition.matchInfo.reduce((acc, m) => acc + (m.trouves || 0), 0);
            const totalRates = competition.matchInfo.reduce((acc, m) => acc + (m.rates || 0), 0);
            const totalMatches = competition.matchInfo.length;
            const averageScore = totalMatches > 0 ? Math.round(totalScore / totalMatches) : 0;

            const startDate = competition.matchInfo[0]?.datedebut || new Date().toISOString();
            const endDate = new Date().toISOString();
            const totalTimeSeconds = calculateDurationInSeconds(startDate, endDate);

            const { data: consultation } = await api.get<Consultation>(`/consultations/${currentConsultationId}`);
            const existingStats = (consultation?.learningStats || {}) as LearningStatsPayload;
            const existingMatches = existingStats.matchesDetails || [];

            const updatedPayload = {
                ...consultation,
                status: 'completed',
                gameEndDate: new Date().toISOString(),
                totalTimeSeconds: totalTimeSeconds,
                finalScore: totalScore,
                matchesCompleted: totalMatches,
                learningStats: {
                    totalTime: calculateDuration(startDate, endDate),
                    averageScore: averageScore,
                    completedAt: endDate,
                    totalMatches: (existingStats.totalMatches || 0) + totalMatches,
                    totalTrouves: (existingStats.totalTrouves || 0) + totalTrouves,
                    totalRates: (existingStats.totalRates || 0) + totalRates,
                    matchesDetails: [
                        ...existingMatches,
                        ...competition.matchInfo.map(m => ({
                            tpsglobal: m.tpsglobal,
                            score: m.trouves,
                            trouves: m.trouves,
                            rates: m.rates,
                            isgameover: m.isgameover,
                            timeSpent: m.timeSpent,
                            niveau: competition.niveau,
                        }))
                    ],
                },
            };

            await api.put(`/consultations/${currentConsultationId}`, updatedPayload);

            updateLocalCache(competition.id);
            showValidateMessage('Compétition validée avec succès !', 'success');

            setGameIsFinished(true);
            queryClient.invalidateQueries({ queryKey: ['game'] });

            return true;
        } catch (error: any) {
            console.error('Erreur validation:', error);
            console.log(error)
            showValidateMessage(error?.response?.data?.message || 'Erreur lors de la validation', 'error');
            return false;
        }
    }, [currentConsultationId, showValidateMessage, updateLocalCache, queryClient, setGameIsFinished]);

    const displayList = useMemo(() => {
        const validatedGame = competitions.find(comp => comp.isValidated);
        if (validatedGame) return [validatedGame];
        return competitions.slice(0, visibleCount);
    }, [competitions, visibleCount]);

    const hasMore = useMemo(() => {
        return !competitions.some(comp => comp.isValidated) && visibleCount < competitions.length;
    }, [competitions, visibleCount]);

    const remainingCount = competitions.length - visibleCount;

    const handleLoadMore = useCallback(() => {
        startTransition(() => {
            setVisibleCount(prev => Math.min(prev + LOAD_MORE_INCREMENT, competitions.length));
        });
    }, [competitions.length, startTransition]);

    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const handleLoadMoreClick = useCallback(async () => {
        if (isLoadingMore) return;
        setIsLoadingMore(true);
        try {
            await handleLoadMore();
        } finally {
            setIsLoadingMore(false);
        }
    }, [handleLoadMore, isLoadingMore]);

    const hasValidatedGame = displayList?.some(c => c.isValidated);

    return {
        handleValidateCompetition, refreshData, handleLoadMoreClick,
        competitionList: displayList, hasMore, remainingCount, validateMessage,
        isLoadingMore, hasValidatedGame,
    };
};