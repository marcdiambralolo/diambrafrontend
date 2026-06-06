'use client';

import { api } from '@/lib/api/client';
import { LastEndedGame, LastEndedResponse, LearningConfiguration } from '@/lib/interfaces';
import { ViewState } from '@/lib/learning/interface';
import { useMonEtoileStore } from '@/lib/store/monetoile.store';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

const TIME_UPDATE_INTERVAL = 1000;
const QUERY_STALE_TIME = 30 * 1000; // 30 secondes
const RETRY_ATTEMPTS = 2;

export function useAdminConsultationsPageFinished() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { setGameConfig, clearAllCompetitions, setAfficheBanana } = useMonEtoileStore();

  // On ne garde qu'un seul état temporel léger (timestamp numérique au lieu d'un objet Date lourd)
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(() => Date.now());

  // ============================================================================
  // TANSTACK QUERY : CONFIGURATION DU JEU
  // ============================================================================
  const { data: gameConfig = null, isLoading: isConfigLoading, isError: isConfigError } = useQuery<LearningConfiguration | null>({
    queryKey: ['game', 'config'],
    queryFn: async () => {
      const { data } = await api.get('learning-configurations/current-config');
      return data as LearningConfiguration;
    },
    staleTime: QUERY_STALE_TIME,
    retry: RETRY_ATTEMPTS,
    refetchInterval: 10000, // Remplace avantageusement les setInterval manuels
  });

  // Synchronisation synchrone du store Zustand uniquement quand la config change
  useEffect(() => {
    if (gameConfig) setGameConfig(gameConfig);
  }, [gameConfig, setGameConfig]);

  // ============================================================================
  // TANSTACK QUERY : DERNIÈRE PARTIE TERMINÉE
  // ============================================================================
  const { data: lastEndedGame = null } = useQuery<LastEndedGame | null>({
    queryKey: ['game', 'last-ended'],
    queryFn: async () => {
      const { data } = await api.get<LastEndedResponse>('/learning-configurations/last-ended');
      return data?.hasEndedEdition ? data.configuration : null;
    },
    staleTime: QUERY_STALE_TIME,
    refetchInterval: 5000, // Rafraîchissement automatique en tâche de fond sécurisé
  });

  // ============================================================================
  // MUTATION : CLÔTURE DU JEU EN BACKEND
  // ============================================================================
  const { mutate: mutateEndGame, isPending: isEndingGame } = useMutation({
    mutationFn: async (configId: string) => {
      const { data } = await api.post(`/learning-configurations/${configId}/end`);
      return data;
    },
    onSuccess: async () => {
      // Invalidation en chaîne propre et atomique
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['game', 'config'] }),
        queryClient.invalidateQueries({ queryKey: ['game', 'last-ended'] })
      ]);
    },
    onError: (err: any) => {
      if (err?.response?.status === 409) {
        // Conflit : Déjà clôturé côté serveur, on rafraîchit la donnée locale
        queryClient.invalidateQueries({ queryKey: ['game', 'last-ended'] });
      } else {
        console.error('Erreur clôture automatique du jeu:', err);
      }
    }
  });

  // Horloge atomique : uniquement responsable de mettre à jour le timestamp
  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTimestamp(Date.now()), TIME_UPDATE_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  // ============================================================================
  // LOGIQUE DE DÉDUCTION DES ÉTATS ET DATES
  // ============================================================================
  const { startDate, endDate } = useMemo(() => ({
    startDate: gameConfig?.startgameDate ? new Date(gameConfig.startgameDate) : null,
    endDate: gameConfig?.endgameDate ? new Date(gameConfig.endgameDate) : null,
  }), [gameConfig?.startgameDate, gameConfig?.endgameDate]);

  const viewState = useMemo((): ViewState => {
    if (!gameConfig) {
      return { isEnded: true, isActive: false, isNotStarted: false };
    }

    const startMs = startDate ? startDate.getTime() : 0;
    const endMs = endDate ? endDate.getTime() : 0;

    const isGameActive = gameConfig.isActive === true &&
                         gameConfig.status === 'active' &&
                         startMs > 0 && endMs > 0 &&
                         currentTimestamp >= startMs && currentTimestamp <= endMs;

    const isGameEnded = gameConfig.status === 'ended' || (endMs > 0 && currentTimestamp > endMs);
    const isGameNotStarted = gameConfig.status === 'pending' || (startMs > 0 && currentTimestamp < startMs);

    const showEnded = isGameEnded || (!isGameActive && !isGameNotStarted && !!lastEndedGame);
    const showActive = isGameActive && !isGameEnded;
    const showNotStarted = isGameNotStarted && !isGameActive && !isGameEnded;

    return {
      isEnded: showEnded,
      isActive: !showEnded && showActive,
      isNotStarted: !showEnded && !showActive && showNotStarted,
    };
  }, [gameConfig, startDate, endDate, currentTimestamp, lastEndedGame]);

  // Trigger automatique de fin de jeu
  useEffect(() => {
    if (endDate && currentTimestamp > endDate.getTime() && gameConfig?.status === 'active' && gameConfig._id && !isEndingGame) {
      mutateEndGame(gameConfig._id);
    }
  }, [currentTimestamp, endDate, gameConfig, isEndingGame, mutateEndGame]);

  // Synchronisation de l'affichage du store externe
  const shouldShowBanana = viewState.isActive && !viewState.isNotStarted;
  useEffect(() => {
    setAfficheBanana(shouldShowBanana);
  }, [shouldShowBanana, setAfficheBanana]);

  // ============================================================================
  // ACTIONS UTILISATEURS
  // ============================================================================
  const demarrerJeu = useCallback(() => {
    router.push('/star/learning/choix');
  }, [router]);

  const handleOpenGame = useCallback(() => {
    clearAllCompetitions();
    setAfficheBanana(true);
  }, [clearAllCompetitions, setAfficheBanana]);

  return {
    demarrerJeu,
    handleOpenGame,
    startDate,
    gameConfig,
    viewState,
    lastEndedGame,
    endDate,
    isLoading: isConfigLoading,
    error: isConfigError, // Géré nativement par TanStack query via `isError` si nécessaire
  };
}