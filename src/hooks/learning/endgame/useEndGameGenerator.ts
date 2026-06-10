import { api } from "@/lib/api/client";
import { CompetitionInfo, Consultation, MatchInfo } from "@/lib/interfaces";
import { INITIAL_VISIBLE_COUNT, LOAD_MORE_INCREMENT, MESSAGE_DURATION } from "@/lib/learning/constantes";
import { formatDuration } from "@/lib/learning/functions";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";

// ============================================================================
// TYPES
// ============================================================================

interface ValidationMessage {
    text: string;
    type: 'success' | 'error';
}

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
    datedebut: string;
    datefin: string;
    idConfig: string;
    matchInfo: MatchInfo[];
    consultationId: string;
    timeSpent?: number;
}

interface LearningStats {
    totalTime?: string;
    totalScore?: number;
    totalTrouves?: number;
    totalRates?: number;
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

const MATCH_TYPES: Record<number, string> = {
    0: 'Chiffre',
    1: 'Couleur',
    2: 'Image',
    3: 'Lettre',
};

const PERMANENT_MESSAGE_DURATION = 10000;

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

export const getMatchType = (tpsglobal?: number): string => {
    if (tpsglobal === undefined) return 'Inconnu';
    return MATCH_TYPES[tpsglobal] || 'Inconnu';
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

const adaptCompetitionToLocal = (competition: CompetitionInfo): MatchInfo[] => {
    return competition.matchInfo.map(match => ({
        id: match.id,
        tpsglobal: match.tpsglobal,
        trouves: match.trouves || 0,
        rates: match.rates || 0,
        isgameover: match.isgameover,
        timeSpent: match.timeSpent ? Number(match.timeSpent) : undefined,
        datedebut: competition.datedebut,
        competitionId: competition.id,
        matchNumber: match.matchNumber,
        score: match.trouves || 0,
    }));
};

const computeCompetitionStats = (matches: MatchInfo[]) => {
    let totalScore = 0;

    const matchResults: MatchResult[] = matches.map((match, idx) => {
        const score = match.trouves || 0;
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
): CompetitionSummary => ({
    id: competition.id,
    name: `N°: ${competition.id.slice(-12)}`,
    startedAt: competition.datedebut,
    finishedAt: competition.datefin,
    totalScore: stats.totalScore,
    matches: stats.matches,
    rawMatches: stats.rawMatches,
    datedebut: competition.datedebut,
    datefin: competition.datefin,
    idConfig: competition.idConfig,
    matchInfo: competition.matchInfo,
    consultationId: competition.consultationId,
});

// ============================================================================
// HOOK useMessage
// ============================================================================

const useMessage = () => {
    const [message, setMessage] = useState<ValidationMessage | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout>();

    const showMessage = useCallback((text: string, type: 'success' | 'error') => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setMessage({ text, type });
        timeoutRef.current = setTimeout(() => setMessage(null), MESSAGE_DURATION);
    }, []);

    const clearMessage = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setMessage(null);
    }, []);

    useEffect(() => () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }, []);

    return { message, showMessage, clearMessage };
};

// ============================================================================
// HOOK useCompetitionValidation
// ============================================================================

export const useCompetitionValidation = (
    onValidate: (competition: CompetitionSummary) => Promise<boolean>,
    competition: CompetitionSummary
) => {
    const [isLocalValidating, setIsLocalValidating] = useState(false);
    const [validationMessage, setValidationMessage] = useState<ValidationMessage | null>(null);
    const [isValidated, setIsValidated] = useState(false);
    const [showPermanentMessage, setShowPermanentMessage] = useState(false);

    useEffect(() => {
        const storageKey = `validated_competition_${competition.id}`;
        const alreadyValidated = localStorage.getItem(storageKey) === 'true';
        setIsValidated(alreadyValidated);
        if (alreadyValidated) setShowPermanentMessage(true);
    }, [competition.id]);

    const handleValidate = useCallback(async () => {
        if (isLocalValidating || !competition.rawMatches?.length || isValidated) return;

        setIsLocalValidating(true);
        setValidationMessage(null);

        const success = await onValidate(competition);

        if (success) {
            setValidationMessage({ text: '✅ Compétition validée avec succès !', type: 'success' });
            setIsValidated(true);
            localStorage.setItem(`validated_competition_${competition.id}`, 'true');
            setShowPermanentMessage(true);
            setTimeout(() => setShowPermanentMessage(false), PERMANENT_MESSAGE_DURATION);
        } else {
            setValidationMessage({ text: '❌ Erreur lors de la validation. Veuillez réessayer.', type: 'error' });
        }

        setIsLocalValidating(false);
    }, [competition, isLocalValidating, isValidated, onValidate]);

    const handleCloseMessage = useCallback(() => setValidationMessage(null), []);
    const handleClosePermanentMessage = useCallback(() => setShowPermanentMessage(false), []);
    const clearValidationStatus = useCallback(() => {
        localStorage.removeItem(`validated_competition_${competition.id}`);
        setIsValidated(false);
        setShowPermanentMessage(false);
        setValidationMessage(null);
    }, [competition.id]);

    const formattedStartDate = useMemo(() => new Date(competition.startedAt).toLocaleString(), [competition.startedAt]);
    const formattedFinishedDate = useMemo(() => competition.finishedAt ? new Date(competition.finishedAt).toLocaleString() : null, [competition.finishedAt]);
    const totalTimeSpent = useMemo(() => formatDuration(competition.matches.reduce((sum, m) => sum + (m.timeSpent || 0), 0)), [competition.matches]);

    return {
        isLoading: isLocalValidating,
        validationMessage,
        formattedStartDate,
        formattedFinishedDate,
        totalTimeSpent,
        handleValidate,
        handleCloseMessage,
        isValidated,
        showPermanentMessage,
        handleClosePermanentMessage,
        clearValidationStatus
    };
};

// ============================================================================
// HOOK useEndGameGenerator
// ============================================================================

export const useEndGameGenerator = () => {
    const { getAllCompetitions, gameConfig } = useMonEtoileStore();
    const { message: validateMessage, showMessage: showValidateMessage } = useMessage();
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

    const competitions = useMemo(() => {
        const allCompetitions = getAllCompetitions();
        const filtered = allCompetitions.filter(comp => comp.idConfig === gameConfig?.id);
        
        return filtered.map(comp => {
            const localMatches = adaptCompetitionToLocal(comp);
            const stats = computeCompetitionStats(localMatches);
            return createCompetitionSummary(comp, stats);
        }).sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
    }, [getAllCompetitions, gameConfig?.id]);

    const handleValidateCompetition = useCallback(async (competition: CompetitionSummary): Promise<boolean> => {
        if (!competition.consultationId) {
            showValidateMessage('Aucune consultation en cours', 'error');
            return false;
        }

        if (!competition.rawMatches?.length) {
            showValidateMessage('Aucun match à valider', 'error');
            return false;
        }

        try {
            const totalScore = competition.rawMatches.reduce((acc, m) => acc + (m.trouves || 0), 0);
            const totalTrouves = competition.rawMatches.reduce((acc, m) => acc + (m.trouves || 0), 0);
            const totalRates = competition.rawMatches.reduce((acc, m) => acc + (m.rates || 0), 0);
            const startDate = competition.rawMatches[0]?.datedebut || new Date().toISOString();
            const endDate = new Date().toISOString();
            const duration = calculateDuration(startDate, endDate);
            const durationInSeconds = calculateDurationInSeconds(startDate, endDate);

            const { data: consultation } = await api.get(`/consultations/${competition.consultationId}`);
            const dataconsultation = consultation as Consultation;
            const existingStats = (dataconsultation?.learningStats || {}) as LearningStats;
            const existingMatches = existingStats.matchesDetails || [];

            const updatedPayload = {
                ...dataconsultation,
                timeSpent: durationInSeconds,
                learningStats: {
                    totalTime: duration,
                    totalScore: (existingStats.totalScore || 0) + totalScore,
                    totalTrouves: (existingStats.totalTrouves || 0) + totalTrouves,
                    totalRates: (existingStats.totalRates || 0) + totalRates,
                    competitionsCount: (existingStats.competitionsCount || 0) + 1,
                    completedAt: endDate,
                    matchesDetails: [
                        ...existingMatches,
                        ...competition.rawMatches.map(m => ({
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

    const clearValidateMessage = useCallback(() => showValidateMessage('', 'success'), [showValidateMessage]);

    const hasCompetitions = competitions.length > 0;
    const competitionList = useMemo(() => {
        if (!hasCompetitions) return null;
        return competitions.slice(0, visibleCount);
    }, [competitions, visibleCount, hasCompetitions]);

    const handleLoadMore = useCallback(() => {
        startTransition(() => {
            setVisibleCount(prev => Math.min(prev + LOAD_MORE_INCREMENT, competitions.length));
        });
    }, [competitions.length]);

    const hasMore = visibleCount < competitions.length;
    const remainingCount = competitions.length - visibleCount;

    return {
        handleValidateCompetition,
        handleLoadMore,
        clearValidateMessage,
        competitionList,
        hasMore,
        remainingCount,
        validateMessage,
    };
};