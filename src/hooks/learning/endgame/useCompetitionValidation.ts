'use client';

import { api } from "@/lib/api/client";
import { CompetitionInfo, Consultation } from "@/lib/interfaces";
import { calculateDuration, calculateDurationInSeconds, formatCompetitionDate } from "@/lib/learning/functions";
import { LearningStatsPayload } from "@/lib/learning/interface";
import { useDiambraStore } from "@/lib/store/diambra.store";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useCompetitionStorage from "./useCompetitionStorage";
import { useMessage } from "./useMessage";

// ============================================
// Constantes
// ============================================

const PERMANENT_MESSAGE_DURATION = 10000;
const STORAGE_PREFIX = 'validated_competition_';
const STORAGE_KEY = (competitionId: string): string => `${STORAGE_PREFIX}${competitionId}`;

// ============================================
// Types
// ============================================

interface ValidationMessage {
    text: string;
    type: 'success' | 'error';
}

interface CompetitionStats {
    totalScore: number;
    totalTrouves: number;
    totalRates: number;
    averageScore: number;
}
 

const calculateCompetitionStats = (competition: CompetitionInfo): CompetitionStats => {
    const matches = competition.matchInfo || [];
    const totalMatches = matches.length;

    if (totalMatches === 0) {
        return { totalScore: 0, totalTrouves: 0, totalRates: 0, averageScore: 0 };
    }

    const totalScore = matches.reduce((acc, m) => acc + (m.trouves || 0), 0);
    const totalTrouves = matches.reduce((acc, m) => acc + (m.trouves || 0), 0);
    const totalRates = matches.reduce((acc, m) => acc + (m.rates || 0), 0);
    const averageScore = Math.round(totalScore / totalMatches);

    return { totalScore, totalTrouves, totalRates, averageScore };
};

const getStoredValidationStatus = (competitionId: string): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEY(competitionId)) === 'true';
};

// ============================================
// Hook principal
// ============================================

export const useCompetitionValidation = (competition: CompetitionInfo)    => {
    // États
    const [isLocalValidating, setIsLocalValidating] = useState(false);
    const [validationMessage, setValidationMessage] = useState<ValidationMessage | null>(null);
    const [isValidated, setIsValidated] = useState(() => getStoredValidationStatus(competition.id));
    const [showPermanentMessage, setShowPermanentMessage] = useState(() => getStoredValidationStatus(competition.id));

    // Refs
    const permanentMessageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isMountedRef = useRef(true);

    // Hooks
    const queryClient = useQueryClient();
    const { currentConsultationId, setGameIsFinished } = useDiambraStore();
    const { showMessage } = useMessage();
    const { updateLocalCache } = useCompetitionStorage();

    // ============================================
    // Effets
    // ============================================

    // Nettoyage des timeouts et refs
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            if (permanentMessageTimeoutRef.current) {
                clearTimeout(permanentMessageTimeoutRef.current);
                permanentMessageTimeoutRef.current = null;
            }
        };
    }, []);

    // Synchronisation multi-onglets
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY(competition.id) && isMountedRef.current) {
                const newValue = e.newValue === 'true';
                setIsValidated(newValue);
                setShowPermanentMessage(newValue);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [competition.id]);

    // Persistance automatique du statut
    useEffect(() => {
        if (isValidated) {
            localStorage.setItem(STORAGE_KEY(competition.id), 'true');
        }
    }, [isValidated, competition.id]);

    // ============================================
    // Fonctions de validation
    // ============================================

    const validateCompetition = useCallback(async (competition: CompetitionInfo): Promise<boolean> => {
        // Validations préliminaires
        // if (!currentConsultationId) {
        //     showMessage('Aucune consultation en cours', 'error');
        //     return false;
        // }

        // if (!competition.matchInfo?.length) {
        //     showMessage('Aucun match à valider', 'error');
        //     return false;
        // }
 
        try {
            // 1. Calcul des statistiques
            const { totalScore, totalTrouves, totalRates, averageScore } = calculateCompetitionStats(competition);
            const startDate = competition.matchInfo[0]?.datedebut || new Date().toISOString();
            const endDate = new Date().toISOString();
            const totalTimeSeconds = calculateDurationInSeconds(startDate, endDate);

            // 2. Récupération de la consultation existante
            const { data: consultation } = await api.get<Consultation>(`/consultations/${currentConsultationId||'12345678'}`);
            const existingStats = (consultation?.learningStats || {}) as LearningStatsPayload;
            const existingMatches = existingStats.matchesDetails || [];

            // 3. Construction du payload
            const updatedPayload = {
                ...consultation,
                status: 'completed' as const,
                gameEndDate: endDate,
                totalTimeSeconds,
                finalScore: totalScore,
                matchesCompleted: competition.matchInfo.length,
                learningStats: {
                    totalTime: calculateDuration(startDate, endDate),
                    averageScore,
                    completedAt: endDate,
                    totalMatches: (existingStats.totalMatches || 0) + competition.matchInfo.length,
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

            // 4. Sauvegarde
            const response = await api.put(`/consultations/${currentConsultationId}`, updatedPayload);
            console.log('✅ Validation réussie:', response.data);

            // 5. Mise à jour du cache local
            updateLocalCache(competition.id);
            showMessage('Compétition validée avec succès !', 'success');
            setGameIsFinished(true);

            // 6. Invalidation du cache React Query
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['game'] }),
                queryClient.invalidateQueries({ queryKey: ['consultation', currentConsultationId] }),
                queryClient.invalidateQueries({ queryKey: ['competitions'] }),
            ]);

            return true;
        } catch (error: any) {
            console.error('❌ Erreur validation:', error);
            
            // Gestion des erreurs spécifiques
            if (error?.response?.status === 404) {
                showMessage('Consultation introuvable. Veuillez rafraîchir la page.', 'error');
            } else if (error?.response?.status === 409) {
                showMessage('Cette compétition a déjà été validée.', 'error');
            } else {
                const errorMessage = error?.response?.data?.message || 'Erreur lors de la validation';
                showMessage(errorMessage, 'error');
            }
            
            return false;
        }
    }, [currentConsultationId, showMessage, updateLocalCache, queryClient, setGameIsFinished]);

    // ============================================
    // Gestionnaires d'événements
    // ============================================

    const handleValidate = useCallback(async () => {
     
        // Guard clauses
        if (isLocalValidating) {
            console.log('⏳ Validation déjà en cours...');
            return;
        }

        if (!competition.matchInfo?.length) {
            showMessage('Aucun match à valider', 'error');
            return;
        }

        if (isValidated) {
            showMessage('Cette compétition a déjà été validée', 'success');
            return;
        }

        setIsLocalValidating(true);
        setValidationMessage(null);

        try {
            const success = await validateCompetition(competition);
        

            if (success && isMountedRef.current) {
                // Succès
                setValidationMessage({
                    text: '✅ Compétition validée avec succès !',
                    type: 'success'
                });
                setIsValidated(true);
                setShowPermanentMessage(true);

                // Gestion du timeout pour le message permanent
                if (permanentMessageTimeoutRef.current) {
                    clearTimeout(permanentMessageTimeoutRef.current);
                }

                permanentMessageTimeoutRef.current = setTimeout(() => {
                    if (isMountedRef.current) {
                        setShowPermanentMessage(false);
                    }
                }, PERMANENT_MESSAGE_DURATION);
            } else if (isMountedRef.current) {
                // Échec
                setValidationMessage({
                    text: '❌ Erreur lors de la validation. Veuillez réessayer.',
                    type: 'error'
                });
            }
        } catch (error) {
            if (isMountedRef.current) {
                setValidationMessage({
                    text: '❌ Une erreur inattendue est survenue.',
                    type: 'error'
                });
            }
        } finally {
            if (isMountedRef.current) {
                setIsLocalValidating(false);
            }
        }
    }, [competition, isLocalValidating, isValidated, validateCompetition, showMessage]);

    const clearValidationStatus = useCallback(() => {
        const storageKey = STORAGE_KEY(competition.id);
        localStorage.removeItem(storageKey);
        setIsValidated(false);
        setShowPermanentMessage(false);
        setValidationMessage(null);

        if (permanentMessageTimeoutRef.current) {
            clearTimeout(permanentMessageTimeoutRef.current);
            permanentMessageTimeoutRef.current = null;
        }
    }, [competition.id]);

    const handleCloseMessage = useCallback(() => {
        setValidationMessage(null);
    }, []);

    const handleClosePermanentMessage = useCallback(() => {
        setShowPermanentMessage(false);
        clearValidationStatus();
    }, [clearValidationStatus]);

    // ============================================
    // Mémorisation des valeurs dérivées
    // ============================================

    const formattedStartDate = useMemo(
        () => formatCompetitionDate(competition.datedebut),
        [competition.datedebut]
    );

    const formattedFinishedDate = useMemo(
        () => competition.datefin ? formatCompetitionDate(competition.datefin) : null,
        [competition.datefin]
    );

    // ============================================
    // Retour
    // ============================================

    return {
        handleCloseMessage,
        handleClosePermanentMessage,
        handleValidate,
        isLoading: isLocalValidating,
        isValidated,
        validationMessage,
        formattedStartDate,
        showPermanentMessage,
        formattedFinishedDate,
        clearValidationStatus,
    };
};

export default useCompetitionValidation;