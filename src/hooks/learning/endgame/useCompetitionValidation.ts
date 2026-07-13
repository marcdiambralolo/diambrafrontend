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
// Types & Utilitaires
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

// Optimisé : Un seul passage (reduce) au lieu de 3 parcours consécutifs du tableau
const calculateCompetitionStats = (competition: CompetitionInfo): CompetitionStats => {
  const matches = competition.matchInfo || [];
  const totalMatches = matches.length;

  if (totalMatches === 0) {
    return { totalScore: 0, totalTrouves: 0, totalRates: 0, averageScore: 0 };
  }

  const stats = matches.reduce((acc, m) => {
    const trouves = m.trouves || 0;
    acc.totalScore += trouves;
    acc.totalTrouves += trouves;
    acc.totalRates += (m.rates || 0);
    return acc;
  }, { totalScore: 0, totalTrouves: 0, totalRates: 0 });

  return {
    ...stats,
    averageScore: Math.round(stats.totalScore / totalMatches)
  };
};

const getStoredValidationStatus = (competitionId: string): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY(competitionId)) === 'true';
};

// ============================================
// Hook Principal
// ============================================
export const useCompetitionValidation = (competition: CompetitionInfo) => {
  // États
  const [isLocalValidating, setIsLocalValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState<ValidationMessage | null>(null);
  const [isValidated, setIsValidated] = useState(() => getStoredValidationStatus(competition.id));
  const [showPermanentMessage, setShowPermanentMessage] = useState(() => getStoredValidationStatus(competition.id));

  // Refs
  const permanentMessageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Hooks tierces
  const queryClient = useQueryClient();
  const { showMessage } = useMessage();
  const { updateLocalCache } = useCompetitionStorage();

  // 1. Extraction sélective de Zustand pour stopper les re-renders en cascade
  const currentConsultationId = useDiambraStore((state) => state.currentConsultationId);
  const setGameIsFinished = useDiambraStore((state) => state.setGameIsFinished);

  // ============================================
  // Effets
  // ============================================

  // Nettoyage des timeouts et statuts de montage
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (permanentMessageTimeoutRef.current) {
        clearTimeout(permanentMessageTimeoutRef.current);
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

  const validateCompetition = useCallback(async (comp: CompetitionInfo): Promise<boolean> => {
    try {
      const { totalScore, totalTrouves, totalRates, averageScore } = calculateCompetitionStats(comp);
      const startDate = comp.matchInfo[0]?.datedebut || new Date().toISOString();
      const endDate = new Date().toISOString();
      const totalTimeSeconds = calculateDurationInSeconds(startDate, endDate);

      const targetConsultationId = currentConsultationId || '12345678';
      const { data: consultation } = await api.get<Consultation>(`/consultations/${targetConsultationId}`);
      
      const existingStats = (consultation?.learningStats || {}) as LearningStatsPayload;
      const existingMatches = existingStats.matchesDetails || [];

      const updatedPayload = {
        ...consultation,
        status: 'completed' as const,
        gameEndDate: endDate,
        totalTimeSeconds,
        finalScore: totalScore,
        matchesCompleted: comp.matchInfo.length,
        learningStats: {
          totalTime: calculateDuration(startDate, endDate),
          averageScore,
          completedAt: endDate,
          totalMatches: (existingStats.totalMatches || 0) + comp.matchInfo.length,
          totalTrouves: (existingStats.totalTrouves || 0) + totalTrouves,
          totalRates: (existingStats.totalRates || 0) + totalRates,
          matchesDetails: [
            ...existingMatches,
            ...comp.matchInfo.map(m => ({
              tpsglobal: m.tpsglobal,
              score: m.trouves,
              trouves: m.trouves,
              rates: m.rates,
              isgameover: m.isgameover,
              timeSpent: m.timeSpent,
              niveau: comp.niveau,
            }))
          ],
        },
      };

      await api.put(`/consultations/${targetConsultationId}`, updatedPayload);

      updateLocalCache(comp.id);
      showMessage('Compétition validée avec succès !', 'success');
      setGameIsFinished(true);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['game'] }),
        queryClient.invalidateQueries({ queryKey: ['consultation', targetConsultationId] }),
        queryClient.invalidateQueries({ queryKey: ['competitions'] }),
      ]);

      return true;
    } catch (error: any) {
      console.error('❌ Erreur validation:', error);
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
    if (isLocalValidating) return;

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
        setValidationMessage({
          text: '✅ Compétition validée avec succès !',
          type: 'success'
        });
        setIsValidated(true);
        setShowPermanentMessage(true);

        if (permanentMessageTimeoutRef.current) {
          clearTimeout(permanentMessageTimeoutRef.current);
        }

        permanentMessageTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            setShowPermanentMessage(false);
          }
        }, PERMANENT_MESSAGE_DURATION);
      } else if (isMountedRef.current) {
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
    localStorage.removeItem(STORAGE_KEY(competition.id));
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

  // Valeurs dérivées
  const formattedStartDate = useMemo(() => formatCompetitionDate(competition.datedebut), [competition.datedebut]);
  const formattedFinishedDate = useMemo(() => competition.datefin ? formatCompetitionDate(competition.datefin) : null, [competition.datefin]);

  // Retour entièrement mémorisé
  return useMemo(() => ({
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
  }), [
    handleCloseMessage,
    handleClosePermanentMessage,
    handleValidate,
    isLocalValidating,
    isValidated,
    validationMessage,
    formattedStartDate,
    showPermanentMessage,
    formattedFinishedDate,
    clearValidationStatus
  ]);
};

export default useCompetitionValidation;