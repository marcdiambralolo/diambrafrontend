import { api } from "@/lib/api/client";
import { MatchInfo } from "@/lib/learning/interface";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { useCallback, useMemo, useState, useEffect, useRef } from "react";

// ============================================================================
// CONSTANTES
// ============================================================================

export const NO_DATA_PLACEHOLDER = 'N/A';

const MATCH_TYPES: Record<number, string> = {
    0: 'Chiffres',
    1: 'Couleurs',
    2: 'Images',
    3: 'Mixte',
} as const;

const MESSAGE_DURATION = 3000;
const SUBMIT_DELAY = 1000;

// ============================================================================
// TYPES
// ============================================================================

export interface MatchResult {
    matchNumber: number;
    type: string;
    score: number;
    timeSpent?: number;
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

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

export const getMatchType = (tpsglobal?: number): string => {
    if (tpsglobal === undefined) return 'Inconnu';
    return MATCH_TYPES[tpsglobal] || 'Inconnu';
};

const computeCompetitionStats = (matches: MatchInfo[]): Pick<CompetitionSummary, 'totalScore' | 'matches' | 'rawMatches'> => {
    let totalScore = 0;

    const matchResults: MatchResult[] = matches.map((match, idx) => {
        const score = match.trouves || 0;
        totalScore += score;
        return {
            matchNumber: idx + 1,
            type: getMatchType(match.tpsglobal),
            score,
            timeSpent: undefined,
        };
    });

    return {
        totalScore,
        matches: matchResults,
        rawMatches: matches,
    };
};

const createCompetitionSummary = (
    key: string,
    matches: MatchInfo[],
    stats: ReturnType<typeof computeCompetitionStats>
): CompetitionSummary => {
    const firstMatch = matches[0];
    return {
        id: key,
        name: `diambra ${key.slice(-12)}`,
        startedAt: firstMatch?.datedebut || new Date().toISOString(),
        finishedAt: matches.some(m => m.isgameover) ? new Date().toISOString() : undefined,
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

const useValidateCompetition = () => {
    const [isValidating, setIsValidating] = useState(false);
    const { message: validateMessage, showMessage: showValidateMessage } = useMessage();

    const validateCompetition = useCallback(async (rawMatches: MatchInfo[]): Promise<boolean> => {
        setIsValidating(true);

        try {
            const response = await api.post('/learning/competitions/validate', {
                matches: rawMatches
            });

            const isSuccess = (response.data as any)?.success === true;
            
            if (isSuccess) {
                showValidateMessage('Compétition validée avec succès !', 'success');
            } else {
                showValidateMessage((response.data as any)?.message || 'Erreur lors de la validation', 'error');
            }
            
            return isSuccess;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Erreur lors de la validation';
            showValidateMessage(errorMessage, 'error');
            return false;
        } finally {
            setIsValidating(false);
        }
    }, [showValidateMessage]);

    return { validateCompetition, isValidating, validateMessage };
};

const useSubmitGame = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { message: submitMessage, showMessage: showSubmitMessage } = useMessage();

    const submitGame = useCallback(async () => {
        setIsSubmitting(true);

        try {
            // Simulation d'appel API
            await new Promise(resolve => setTimeout(resolve, SUBMIT_DELAY));
            showSubmitMessage('Jeu soumis avec succès !', 'success');
        } catch (error) {
            showSubmitMessage('Erreur lors de la soumission', 'error');
        } finally {
            setIsSubmitting(false);
        }
    }, [showSubmitMessage]);

    return { submitGame, isSubmitting, submitMessage };
};

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export const useEndGameGenerator = () => {
    const { resetGameState, mesComp } = useMonEtoileStore();
    const { submitGame, isSubmitting, submitMessage } = useSubmitGame();
    const { validateCompetition, isValidating, validateMessage } = useValidateCompetition();

    // Mémorisation des compétitions
    const competitions = useMemo(() => {
        const compList: CompetitionSummary[] = [];

        mesComp.forEach((matches, key) => {
            if (matches?.length) {
                const stats = computeCompetitionStats(matches);
                compList.push(createCompetitionSummary(key, matches, stats));
            }
        });

        return compList.sort(
            (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
        );
    }, [mesComp]);

    // Validation d'une compétition spécifique
    const handleValidateCompetition = useCallback(async (rawMatches: MatchInfo[]) => {
        return validateCompetition(rawMatches);
    }, [validateCompetition]);

    // Redémarrage du jeu
    const handleRestart = useCallback(() => {
        resetGameState();
        window.location.reload();
    }, [resetGameState]);

    // Soumission globale
    const handleSubmitGame = useCallback(() => {
        submitGame();
    }, [submitGame]);

    return {
        // États
        isSubmitting,
        isValidating,
        submitMessage,
        validateMessage,
        competitions,
        
        // Actions
        handleValidateCompetition,
        handleSubmitGame,
        handleRestart,
        
        // Compatibilité (anciennes API)
        handleRecommencer: handleRestart,
        validateCompetition: handleValidateCompetition,
    };
};