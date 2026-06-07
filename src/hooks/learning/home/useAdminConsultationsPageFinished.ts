'use client';
import { api } from '@/lib/api/client';
import { LastEndedGame, LastEndedResponse, LearningConfiguration } from '@/lib/interfaces';
import { useMonEtoileStore } from '@/lib/store/monetoile.store';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

// Structure locale étendue de ViewState pour inclure le cas à null
interface ExtendedViewState {
  isEnded: boolean;
  isActive: boolean;
  isNotStarted: boolean;
  isEmpty: boolean;
}

const TIME_UPDATE_INTERVAL = 1000;
const QUERY_STALE_TIME = 30 * 1000; // 30 secondes
const RETRY_ATTEMPTS = 2;

export function useAdminConsultationsPageFinished() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { setGameConfig,  setAfficheBanana, setAfficheStat } = useMonEtoileStore();

  // État temporel léger sous forme de timestamp numérique pour limiter les re-renders
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(() => Date.now());

  // ============================================================================
  // TANSTACK QUERY : CONFIGURATION DU JEU CURRENT
  // ============================================================================
  const { data: gameConfig = null, isLoading: isConfigLoading, isError: isConfigError } = useQuery<LearningConfiguration | null>({
    queryKey: ['game', 'config'],
    queryFn: async () => {
      const { data } = await api.get('learning-configurations/current-config');
      return data as LearningConfiguration;
    },
    staleTime: QUERY_STALE_TIME,
    retry: RETRY_ATTEMPTS,
    refetchInterval: 10000, // Rafraîchissement automatique en arrière-plan toutes les 10s
  });

  // Synchronisation avec le store Zustand global si une config valide est reçue
  useEffect(() => {
    if (gameConfig) setGameConfig(gameConfig);
  }, [gameConfig, setGameConfig]);

  // ============================================================================
  // TANSTACK QUERY : DERNIÈRE COMPÉTITION TERMINÉE (HISTORIQUE)
  // ============================================================================
  const { data: lastEndedGame = null } = useQuery<LastEndedGame | null>({
    queryKey: ['game', 'last-ended'],
    queryFn: async () => {
      const { data } = await api.get<LastEndedResponse>('/learning-configurations/last-ended');
      return data?.hasEndedEdition ? data.configuration : null;
    },
    staleTime: QUERY_STALE_TIME,
    refetchInterval: 5000,
  });

  // ============================================================================
  // MUTATION : ACTION DE SÉCURITÉ DE CLÔTURE DU MATCH EN BACKEND
  // ============================================================================
  const { mutate: mutateEndGame, isPending: isEndingGame } = useMutation({
    mutationFn: async (configId: string) => {
      const { data } = await api.post(`/learning-configurations/${configId}/end`);
      return data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['game', 'config'] }),
        queryClient.invalidateQueries({ queryKey: ['game', 'last-ended'] })
      ]);
    },
    onError: (err: any) => {
      if (err?.response?.status === 409) {
        queryClient.invalidateQueries({ queryKey: ['game', 'last-ended'] });
      } else {
        console.error('Erreur clôture automatique du jeu:', err);
      }
    }
  });

  // Horloge native haute performance
  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTimestamp(Date.now()), TIME_UPDATE_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  const { startDate, endDate } = useMemo(() => ({
    startDate: gameConfig?.startgameDate ? new Date(gameConfig.startgameDate) : null,
    endDate: gameConfig?.endgameDate ? new Date(gameConfig.endgameDate) : null,
  }), [gameConfig?.startgameDate, gameConfig?.endgameDate]);

  const viewState = useMemo((): ExtendedViewState => {
    if (!gameConfig) {
      return { isEnded: false, isActive: false, isNotStarted: false, isEmpty: true };
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
      isEmpty: false
    };
  }, [gameConfig, startDate, endDate, currentTimestamp, lastEndedGame]);

  useEffect(() => {
    if (endDate && currentTimestamp > endDate.getTime() && gameConfig?.status === 'active' && gameConfig._id && !isEndingGame) {
      mutateEndGame(gameConfig._id);
    }
  }, [currentTimestamp, endDate, gameConfig, isEndingGame, mutateEndGame]);

  const shouldShowBanana = viewState.isActive && !viewState.isNotStarted && !viewState.isEmpty;
  useEffect(() => {
    setAfficheBanana(shouldShowBanana);
  }, [shouldShowBanana, setAfficheBanana]);

    const shouldShowStat =   !viewState.isEmpty;
  useEffect(() => {
    setAfficheStat(shouldShowStat);
  }, [shouldShowStat, setAfficheBanana]); 

  const demarrerJeu = useCallback(() => {
    router.push('/star/learning/choix');
  }, [router]);

  const handleOpenGame = useCallback(() => { 
    setAfficheBanana(true);
  }, [  setAfficheBanana]); 
 
  return {
    demarrerJeu,    handleOpenGame,    startDate,    gameConfig,    viewState,
    lastEndedGame,    endDate,    isLoading: isConfigLoading,    error: isConfigError,
  };
}