'use client';
import { api } from "@/lib/api/client";
import { CompetitionInfo, Consultation } from "@/lib/interfaces";
import { INITIAL_VISIBLE_COUNT, LOAD_MORE_INCREMENT } from "@/lib/learning/constantes";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { useCallback, useMemo, useState, useTransition } from "react";
import { useMessage } from "./useMessage";

export interface MatchResult {
    matchNumber: number;
    type: string;
    score: number;
    timeSpent?: number;
    trouves?: number;
    rates?: number;
}

interface MatchesDetails {
    tpsglobal?: number;
    score?: number;
    trouves?: number;
    rates?: number;
    isgameover?: boolean;
    timeSpent?: number;
    validatedAt?: string;
}

interface LearningStats {
    totalTime?: string;
    totalScore?: number;
    totalTrouves?: number;
    totalRates?: number;
    competitionsCount?: number;
    completedAt?: string;
    matchesDetails?: MatchesDetails[];
}

const MATCH_TYPES: Record<number, string> = {
    0: 'Chiffre',
    1: 'Couleur',
    2: 'Image',
    3: 'Lettre',
} as const;

const STORAGE_PREFIX = 'validated_competition_';

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


const createCompetitionSummary = (competition: CompetitionInfo): CompetitionInfo => ({
    ...competition,
    displayName: `N°: ${competition.id.slice(-12)}`,
    isValidated: isCompetitionValidated(competition.id),
});

export const useEndGameGenerator = () => {
    const { getAllCompetitions, gameConfig } = useMonEtoileStore();
    const { message: validateMessage, showMessage: showValidateMessage } = useMessage();
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [, startTransition] = useTransition();

    const competitions = useMemo(() => {
        const allCompetitions = getAllCompetitions();
        return allCompetitions
            .filter(comp => comp.idConfig === gameConfig?.id)
            .map(createCompetitionSummary)
            .sort((a, b) => {
                if (a.isValidated !== b.isValidated) return a.isValidated ? -1 : 1;
                return new Date(b.datedebut).getTime() - new Date(a.datedebut).getTime();
            });
    }, [getAllCompetitions, gameConfig?.id]);

    const handleValidateCompetition = useCallback(async (competition: CompetitionInfo): Promise<boolean> => {
        if (!competition.consultationId) {
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
            const startDate = competition.matchInfo[0]?.datedebut || new Date().toISOString();
            const endDate = new Date().toISOString();

            const { data: consultation } = await api.get<Consultation>(`/consultations/${competition.consultationId}`);

            const existingStats = (consultation?.learningStats || {}) as LearningStats;
            const existingMatches = existingStats.matchesDetails || [];

            const updatedPayload = {
                ...consultation,
                timeSpent: calculateDurationInSeconds(startDate, endDate),
                learningStats: {
                    totalTime: calculateDuration(startDate, endDate),
                    totalScore: (existingStats.totalScore || 0) + totalScore,
                    totalTrouves: (existingStats.totalTrouves || 0) + totalTrouves,
                    totalRates: (existingStats.totalRates || 0) + totalRates,
                    competitionsCount: (existingStats.competitionsCount || 0) + 1,
                    completedAt: endDate,
                    matchesDetails: [
                        ...existingMatches,
                        ...competition.matchInfo.map(m => ({
                            tpsglobal: m.tpsglobal,
                            score: m.trouves,
                            trouves: m.trouves,
                            rates: m.rates,
                            isgameover: m.isgameover,
                            timeSpent: m.timeSpent,
                            validatedAt: endDate,
                        }))
                    ],
                },
            };

            await api.put(`/consultations/${competition.consultationId}`, updatedPayload);
            showValidateMessage('Compétition validée avec succès !', 'success');
            return true;
        } catch (error: any) {
            console.error('Erreur validation:', error);
            showValidateMessage(error?.response?.data?.message || 'Erreur lors de la validation', 'error');
            return false;
        }
    }, [showValidateMessage]);

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

    return {
        handleValidateCompetition,
        handleLoadMore,
        competitionList: displayList,
        hasMore,
        remainingCount,
        validateMessage,
        displayList
    };
};