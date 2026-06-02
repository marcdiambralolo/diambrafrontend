import { api } from "@/lib/api/client";
import { CompetitionInfo, Consultation, MatchInfo } from "@/lib/interfaces";
import { MATCH_TYPES, MESSAGE_DURATION } from "@/lib/learning/constantes";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ============================================================================
// TYPES
// ============================================================================

export interface MatchResult {
    matchNumber: number;
    type: string;
    score: number;
    timeSpent?: number;
    trouves?: number;
    rates?: number;
}

export interface CompetitionSummary {
    id: string;
    name: string;
    startedAt: string;
    finishedAt?: string;
    matches: MatchResult[];
    rawMatches?: MatchInfo[];
    totalScore: number;
}

export interface MessageState {
    text: string;
    type: 'success' | 'error';
}

interface LearningStats {
    totalTime?: string;
    totalScore?: number;
    totalTrouves?: number;
    totalRates?: number;
    averageScore?: string;
    competitionsCount?: number;
    completedAt?: string;
    matchesDetails?: Array<{
        tpsglobal?: number;
        score?: number;
        trouves?: number;
        rates?: number;
        isgameover?: boolean;
        timeSpent?: number;
        validatedAt?: string;
    }>;
}

// ============================================================================
// CONSTANTES
// ============================================================================

const DEFAULT_SCORE = 0;
const DEFAULT_RATES = 0;

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

export const getMatchType = (tpsglobal?: number): string => {
    if (tpsglobal === undefined) return 'Inconnu';
    const types: Record<number, string> = {
        0: 'Chiffres',
        1: 'Couleurs',
        2: 'Images',
        3: 'Mixte',
    };
    return types[tpsglobal] || 'Inconnu';
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

// Adapter les matchs du store vers le format local
const adaptCompetitionToLocal = (competition: CompetitionInfo): MatchInfo[] => {
    return competition.matchInfo.map(match => ({
        id: match.id,
        tpsglobal: match.tpsglobal,
        trouves: match.trouves || DEFAULT_SCORE,
        rates: match.rates || DEFAULT_RATES,
        isgameover: match.isgameover,
        timeSpent: match.timeSpent ? Number(match.timeSpent) : undefined,
        datedebut: competition.datedebut,
        competitionId: competition.id,
        matchNumber: match.matchNumber,
        score: match.trouves || DEFAULT_SCORE,
    }));
};

const computeCompetitionStats = (matches: MatchInfo[]): Pick<CompetitionSummary, 'totalScore' | 'matches' | 'rawMatches'> => {
    let totalScore = 0;

    const matchResults: MatchResult[] = matches.map((match, idx) => {
        const score = match.trouves || DEFAULT_SCORE;
        totalScore += score;
        return {
            matchNumber: idx + 1,
            type: getMatchType(match.tpsglobal),
            score,
            timeSpent: match.timeSpent ? Number(match.timeSpent) : undefined,
            trouves: match.trouves,
            rates: match.rates,
        };
    });

    return {
        totalScore,
        matches: matchResults,
        rawMatches: matches,
    };
};

const createCompetitionSummary = (
    competition: CompetitionInfo,
    stats: ReturnType<typeof computeCompetitionStats>
): CompetitionSummary => {
    return {
        id: competition.id,
        name: `N° Jeu : ${competition.id.slice(-12)}`,
        startedAt: competition.datedebut,
        finishedAt: competition.datefin,
        totalScore: stats.totalScore,
        matches: stats.matches,
        rawMatches: stats.rawMatches,
    };
};

// ============================================================================
// HOOKS
// ============================================================================

const useMessage = () => {
    const [message, setMessage] = useState<MessageState | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout>();

    const showMessage = useCallback((text: string, type: 'success' | 'error') => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setMessage({ text, type });
        timeoutRef.current = setTimeout(() => setMessage(null), MESSAGE_DURATION);
    }, []);

    const clearMessage = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setMessage(null);
    }, []);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return { message, showMessage, clearMessage };
};

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export const useEndGameGenerator = () => {
    const {
        resetGameState,
        currentConsultationId,
        getAllCompetitions,
        addCompetition,
        setJeuAcommencer,
        setGameStarted
    } = useMonEtoileStore();

    const [isValidating, setIsValidating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<MessageState | null>(null);
    const { message: validateMessage, showMessage: showValidateMessage } = useMessage();

    // Mémorisation des compétitions - Conversion depuis le store
    const competitions = useMemo(() => {
        const compList: CompetitionSummary[] = [];
        const allCompetitions = getAllCompetitions();

        for (const competition of allCompetitions) {
            const localMatches = adaptCompetitionToLocal(competition);
            const stats = computeCompetitionStats(localMatches);
            compList.push(createCompetitionSummary(competition, stats));
        }

        return compList.sort(
            (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
        );
    }, [getAllCompetitions]);

    // Validation d'une compétition spécifique (envoi au backend)
    const handleValidateCompetition = useCallback(async (rawMatches: MatchInfo[]): Promise<boolean> => {
        if (!currentConsultationId) {
            showValidateMessage('Aucune consultation en cours', 'error');
            return false;
        }

        if (!rawMatches?.length) {
            showValidateMessage('Aucun match à valider', 'error');
            return false;
        }

        setIsValidating(true);

        try {
            const totalScore = rawMatches.reduce((acc, match) => acc + (match.trouves || DEFAULT_SCORE), 0);
            const totalTrouves = rawMatches.reduce((acc, match) => acc + (match.trouves || DEFAULT_SCORE), 0);
            const totalRates = rawMatches.reduce((acc, match) => acc + (match.rates || DEFAULT_RATES), 0);
            const startDate = rawMatches[0]?.datedebut || new Date().toISOString();
            const endDate = new Date().toISOString();
            const duration = calculateDuration(startDate, endDate);
            const durationInSeconds = calculateDurationInSeconds(startDate, endDate);

            // Récupérer la consultation existante
            const { data: consultation } = await api.get(`/consultations/${currentConsultationId}`);
            const dataconsultation = consultation as Consultation;

            const existingStats = (dataconsultation?.learningStats || {}) as LearningStats;
            const existingMatches = existingStats.matchesDetails || [];

            const updatedPayload = {
                ...dataconsultation,
                timeSpent: durationInSeconds,
                learningStats: {
                    totalTime: duration,
                    totalScore: (existingStats.totalScore || DEFAULT_SCORE) + totalScore,
                    totalTrouves: (existingStats.totalTrouves || DEFAULT_SCORE) + totalTrouves,
                    totalRates: (existingStats.totalRates || DEFAULT_SCORE) + totalRates,
                    competitionsCount: (existingStats.competitionsCount || 0) + 1,
                    completedAt: endDate,
                    matchesDetails: [
                        ...existingMatches,
                        ...rawMatches.map(m => ({
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

            await api.put(`/consultations/${currentConsultationId}`, updatedPayload);

            showValidateMessage('Compétition validée avec succès !', 'success');
            return true;
        } catch (error: any) {
            console.error('Erreur lors de la validation:', error);
            const errorMessage = error?.response?.data?.message || 'Erreur lors de la validation';
            showValidateMessage(errorMessage, 'error');
            return false;
        } finally {
            setIsValidating(false);
        }
    }, [currentConsultationId, showValidateMessage]);

    // Redémarrage du jeu
    const handleRestart = useCallback(() => {
        setJeuAcommencer(true);
        setGameStarted(true);
    }, [resetGameState, setJeuAcommencer, setGameStarted]);

    // Soumission globale (à implémenter selon vos besoins)
    const handleSubmitGame = useCallback(async () => {
        setIsSubmitting(true);
        try {
            // Logique de soumission globale
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSubmitMessage({ text: 'Jeu soumis avec succès !', type: 'success' });
        } catch (error) {
            setSubmitMessage({ text: 'Erreur lors de la soumission', type: 'error' });
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setSubmitMessage(null), MESSAGE_DURATION);
        }
    }, []);

    return {
        handleValidateCompetition,
        handleRestart,
        handleSubmitGame,
        isValidating,
        isSubmitting,
        competitions,
        validateMessage,
        submitMessage,
    };
};