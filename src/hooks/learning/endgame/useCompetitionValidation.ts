'use client';
import { api } from "@/lib/api/client";
import { CompetitionInfo, Consultation } from "@/lib/interfaces";
import { calculateDuration, calculateDurationInSeconds, formatCompetitionDate } from "@/lib/learning/functions";
import { LearningStatsPayload } from "@/lib/learning/interface";
import { useDiambraStore } from "@/lib/store/diambra.store";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useCompetitionStorage from "./useCompetitionStorage";
import { useMessage } from "./useMessage";

const PERMANENT_MESSAGE_DURATION = 10000;
// Clé unique globale dans le localStorage pour s'assurer qu'un seul jeu est validé à la fois
const ACTIVE_VALIDATED_GAME_KEY = 'active_validated_competition_id';

interface ValidationMessage {
  text: string;
  type: 'success' | 'error';
}

interface CompetitionStats {
  totalScore: number;
  totalTrouves: number;
  totalRates: number;
  averageScore: number;
  totalMatches: number;
  totalTimeGlobal: number;
  completedMatches: number;
  successRate: number;
}

const calculateCompetitionStats = (competition: CompetitionInfo): CompetitionStats => {
  const matches = competition.matchInfo || [];
  const totalMatches = matches.length;

  if (totalMatches === 0) {
    return {
      totalScore: 0,
      totalTrouves: 0,
      totalRates: 0,
      averageScore: 0,
      totalMatches: 0,
      totalTimeGlobal: 0,
      completedMatches: 0,
      successRate: 0
    };
  }

  const stats = matches.reduce((acc, m) => {
    const trouves = m.trouves || 0;
    const rates = m.rates || 0;

    acc.totalScore += trouves;
    acc.totalTrouves += trouves;
    acc.totalRates += rates;
    acc.totalTimeGlobal += m.tpsglobal || 0;
    if (m.isgameover) acc.completedMatches += 1;

    return acc;
  }, {
    totalScore: 0,
    totalTrouves: 0,
    totalRates: 0,
    totalTimeGlobal: 0,
    completedMatches: 0
  });

  const totalAttempts = stats.totalTrouves + stats.totalRates;
  const successRate = totalAttempts > 0 ? Math.round((stats.totalTrouves / totalAttempts) * 100) : 0;

  return {
    ...stats,
    totalMatches,
    averageScore: Math.round(stats.totalScore / totalMatches),
    successRate
  };
};

const getStoredValidationStatus = (competitionId: string): boolean => {
  if (typeof window === 'undefined') return false;
  // Vérifie si la compétition sauvegardée correspond à la compétition courante
  return localStorage.getItem(ACTIVE_VALIDATED_GAME_KEY) === competitionId;
};

export const useCompetitionValidation = (competition: CompetitionInfo) => {
  const router = useRouter();
  const [isLocalValidating, setIsLocalValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState<ValidationMessage | null>(null);
  const [isValidated, setIsValidated] = useState(() => getStoredValidationStatus(competition.id));
  const [showPermanentMessage, setShowPermanentMessage] = useState(() => getStoredValidationStatus(competition.id));

  const permanentMessageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  const queryClient = useQueryClient();
  const { showMessage } = useMessage();
  const { updateLocalCache } = useCompetitionStorage();

  const currentConsultationId = useDiambraStore((state) => state.currentConsultationId);
  const setGameIsFinished = useDiambraStore((state) => state.setGameIsFinished);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (permanentMessageTimeoutRef.current) {
        clearTimeout(permanentMessageTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === ACTIVE_VALIDATED_GAME_KEY && isMountedRef.current) {
        const activeId = e.newValue;
        const isCurrentValidated = activeId === competition.id;
        setIsValidated(isCurrentValidated);
        setShowPermanentMessage(isCurrentValidated);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [competition.id]);

  const validateCompetition = useCallback(async (comp: CompetitionInfo): Promise<boolean> => {
    try {
      const stats = calculateCompetitionStats(comp);

      const startDate = comp.matchInfo[0]?.datedebut || comp.datedebut || new Date().toISOString();
      const endDate = comp.datefin || new Date().toISOString();
      const totalTimeSeconds = calculateDurationInSeconds(startDate, endDate);

      const targetConsultationId = currentConsultationId || '12345678';
      const { data: consultation } = await api.get<Consultation>(`/consultations/${targetConsultationId}`);

      const existingStats = (consultation?.learningStats || {}) as LearningStatsPayload;
      const existingMatches = existingStats.matchesDetails || [];

      const matchesDetails = comp.matchInfo.map(m => ({
        tpsglobal: m.tpsglobal || 0,
        score: m.trouves || 0,
        trouves: m.trouves || 0,
        rates: m.rates || 0,
        timeSpent: comp.timeSpent || 0,
        isgameover: m.isgameover || false,
        niveau: comp.niveau || 0,
        combinaisons: m.combinaisons || [],
        matchNumber: m.matchNumber,
        numeromatch: m.numeromatch,
        numordrep: m.numordrep,
        entite: m.entite
      }));

      const totalTimeFormatted = calculateDuration(startDate, endDate);

      const updatedPayload = {
        ...consultation,
        status: 'completed' as const,
        nombredevues: comp.punChangeCount,
        gameEndDate: endDate,
        totalTimeSeconds,
        timeSpent: totalTimeSeconds || 0,
        finalScore: stats.totalScore,
        matchesCompleted: comp.matchInfo.length,
        niveau: comp.niveau || 0,
        tpsglobal: comp.matchInfo[0]?.tpsglobal || 0,
        learningStats: {
          totalTime: totalTimeFormatted,
          averageScore: stats.averageScore,
          completedAt: endDate,
          totalMatches: (existingStats.totalMatches || 0) + comp.matchInfo.length,
          totalTrouves: (existingStats.totalTrouves || 0) + stats.totalTrouves,
          totalRates: (existingStats.totalRates || 0) + stats.totalRates,
          matchesDetails: [
            ...existingMatches,
            ...matchesDetails
          ],
        },
      };

      await api.put(`/consultations/${targetConsultationId}`, updatedPayload);

      // Enregistre SEULEMENT l'ID de ce jeu validé dans le LocalStorage
      localStorage.setItem(ACTIVE_VALIDATED_GAME_KEY, comp.id);

      updateLocalCache(comp.id);
      showMessage('Compétition validée avec succès !', 'success');
      setGameIsFinished(true);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['game'] }),
        queryClient.invalidateQueries({ queryKey: ['consultation', targetConsultationId] }),
        queryClient.invalidateQueries({ queryKey: ['competitions'] }),
        queryClient.invalidateQueries({ queryKey: ['leaderboard'] }),
      ]);

      

      return true;
    } catch (error: any) {
      console.error('❌ Erreur validation:', error);

      if (error?.response?.status === 404) {
        showMessage('Consultation introuvable. Veuillez rafraîchir la page.', 'error');
      } else if (error?.response?.status === 409) {
        showMessage('Cette compétition a déjà été validée.', 'error');
      } else if (error?.response?.status === 422) {
        showMessage('Données invalides. Vérifiez les informations de la compétition.', 'error');
      } else {
        const errorMessage = error?.response?.data?.message || 'Erreur lors de la validation';
        showMessage(errorMessage, 'error');
      }
      return false;
    }
  }, [currentConsultationId, showMessage, updateLocalCache, queryClient, setGameIsFinished, router]);

  const handleValidate = useCallback(async () => {
    if (isLocalValidating) return;

    if (!competition.matchInfo?.length) {
      showMessage('Aucun match à valider', 'error');
      return;
    }

    const allMatchesComplete = competition.matchInfo.every(m => m.isgameover === true);
    if (!allMatchesComplete) {
      showMessage('Tous les matches doivent être terminés avant la validation', 'error');
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
        const stats = calculateCompetitionStats(competition);
        setValidationMessage({
          text: `✅ Compétition validée ! Score: ${stats.totalScore} pts, Taux: ${stats.successRate}%`,
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

      // Rafraîchissement de la page via le router Next.js
      router.refresh();
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
    if (localStorage.getItem(ACTIVE_VALIDATED_GAME_KEY) === competition.id) {
      localStorage.removeItem(ACTIVE_VALIDATED_GAME_KEY);
    }
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
  }, []);

  const competitionStats = useMemo(() => calculateCompetitionStats(competition), [competition]);
  const formattedStartDate = useMemo(() => formatCompetitionDate(competition.datedebut), [competition.datedebut]);
  const formattedFinishedDate = useMemo(() => competition.datefin ? formatCompetitionDate(competition.datefin) : null, [competition.datefin]);

  const allMatchesCompleted = useMemo(() => {
    return competition.matchInfo?.every(m => m.isgameover === true) ?? false;
  }, [competition.matchInfo]);

  return useMemo(() => ({
    handleCloseMessage,
    handleClosePermanentMessage,
    handleValidate,
    clearValidationStatus,

    isLoading: isLocalValidating,
    isValidated,
    validationMessage,
    showPermanentMessage,

    formattedStartDate,
    formattedFinishedDate,

    stats: competitionStats,
    allMatchesCompleted,

    totalMatches: competition.matchInfo?.length || 0,
    timeSpent: competition.timeSpent,
    niveau: competition.niveau,

  }), [
    handleCloseMessage,
    handleClosePermanentMessage,
    handleValidate,
    clearValidationStatus,
    isLocalValidating,
    isValidated,
    validationMessage,
    showPermanentMessage,
    formattedStartDate,
    formattedFinishedDate,
    competitionStats,
    allMatchesCompleted,
    competition.matchInfo?.length,
    competition.timeSpent,
    competition.niveau,
  ]);
};

export default useCompetitionValidation;