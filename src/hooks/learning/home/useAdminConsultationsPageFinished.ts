'use client';

import { api } from '@/lib/api/client';
import { LastEndedGame, LastEndedResponse, LearningConfiguration } from '@/lib/interfaces';
import { useMonEtoileStore } from '@/lib/store/monetoile.store';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';

// ============================================================================
// CONSTANTES
// ============================================================================

const TIME_UPDATE_INTERVAL = 1000;
const QUERY_STALE_TIME = 30 * 1000;
const RETRY_ATTEMPTS = 2;
const ONE_HOUR_IN_MS = 60 * 60 * 1000;
const ONE_MINUTE_IN_MS = 60 * 1000;
const LAST_ENDED_REFETCH_INTERVAL = 5000;

// ============================================================================
// TYPES
// ============================================================================

interface ExtendedViewState {
  isEnded: boolean;
  isActive: boolean;
  isNotStarted: boolean;
  isEmpty: boolean;
}

interface ViewStateResult {
  viewState: ExtendedViewState;
  shouldShowBanana: boolean;
  shouldShowStat: boolean;
}

// ============================================================================
// SÉLECTEURS STORE (évitent les re-rendus)
// ============================================================================

const selectSetGameConfig = (state: any) => state.setGameConfig;
const selectSetAfficheBanana = (state: any) => state.setAfficheBanana;
const selectSetAfficheStat = (state: any) => state.setAfficheStat;

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export function useAdminConsultationsPageFinished() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Refs pour éviter les re-rendus et redirections multiples
  const hasAutoEndedRef = useRef(false);
  const hasRedirectedRef = useRef(false);

  // Sélecteurs optimisés
  const setGameConfig = useMonEtoileStore(selectSetGameConfig);
  const setAfficheBanana = useMonEtoileStore(selectSetAfficheBanana);
  const setAfficheStat = useMonEtoileStore(selectSetAfficheStat);
  const getAllCompetitions = useMonEtoileStore((state) => state.getAllCompetitions);

  const [currentTimestamp, setCurrentTimestamp] = useState<number>(() => Date.now());

  // ============================================================================
  // QUERY: CONFIGURATION DU JEU
  // ============================================================================
  const {
    data: gameConfig = null,
    isLoading: isConfigLoading,
    isError: isConfigError,
    refetch: refetchConfig
  } = useQuery<LearningConfiguration | null>({
    queryKey: ['game', 'config'],
    queryFn: async () => {
      const { data } = await api.get('learning-configurations/current-config');
      return data as LearningConfiguration;
    },
    staleTime: ONE_HOUR_IN_MS,
    gcTime: ONE_HOUR_IN_MS + ONE_MINUTE_IN_MS,
    retry: RETRY_ATTEMPTS,
    refetchInterval: ONE_HOUR_IN_MS,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: true,
  });

  // Synchronisation du store
  useEffect(() => {
    if (gameConfig) {
      setGameConfig(gameConfig);
    }
  }, [gameConfig, setGameConfig]);

  // ============================================================================
  // QUERY: DERNIÈRE COMPÉTITION
  // ============================================================================
  const {
    data: lastEndedGame = null,
    refetch: refetchLastEnded
  } = useQuery<LastEndedGame | null>({
    queryKey: ['game', 'last-ended'],
    queryFn: async () => {
      const { data } = await api.get<LastEndedResponse>('/learning-configurations/last-ended');
      return data?.hasEndedEdition ? data.configuration : null;
    },
    staleTime: QUERY_STALE_TIME,
    refetchInterval: LAST_ENDED_REFETCH_INTERVAL,
    refetchOnWindowFocus: false,
  });

  // ============================================================================
  // MUTATION: CLÔTURE
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

  // ============================================================================
  // HORLOGE
  // ============================================================================
  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTimestamp(Date.now()), TIME_UPDATE_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  // ============================================================================
  // CALCUL DES DATES (mémorisé)
  // ============================================================================
  const { startDate, endDate } = useMemo(() => ({
    startDate: gameConfig?.startgameDate ? new Date(gameConfig.startgameDate) : null,
    endDate: gameConfig?.endgameDate ? new Date(gameConfig.endgameDate) : null,
  }), [gameConfig?.startgameDate, gameConfig?.endgameDate]);

  // ============================================================================
  // CALCUL DE L'ÉTAT DE LA VUE (mémorisé)
  // ============================================================================
  const viewStateResult = useMemo((): ViewStateResult => {
    if (!gameConfig) {
      return {
        viewState: { isEnded: false, isActive: false, isNotStarted: false, isEmpty: true },
        shouldShowBanana: false,
        shouldShowStat: false
      };
    }

    const startMs = startDate?.getTime() || 0;
    const endMs = endDate?.getTime() || 0;

    const isGameActive = gameConfig.isActive === true &&
      gameConfig.status === 'active' &&
      startMs > 0 && endMs > 0 &&
      currentTimestamp >= startMs && currentTimestamp <= endMs;

    const isGameEnded = gameConfig.status === 'ended' || (endMs > 0 && currentTimestamp > endMs);
    const isGameNotStarted = gameConfig.status === 'pending' || (startMs > 0 && currentTimestamp < startMs);

    const showEnded = isGameEnded || (!isGameActive && !isGameNotStarted && !!lastEndedGame);
    const showActive = isGameActive && !isGameEnded;
    const showNotStarted = isGameNotStarted && !isGameActive && !isGameEnded;

    const viewState = {
      isEnded: showEnded,
      isActive: !showEnded && showActive,
      isNotStarted: !showEnded && !showActive && showNotStarted,
      isEmpty: false
    };

    return {
      viewState,
      shouldShowBanana: viewState.isActive && !viewState.isNotStarted && !viewState.isEmpty,
      shouldShowStat: !viewState.isEmpty
    };
  }, [gameConfig, startDate, endDate, currentTimestamp, lastEndedGame]);

  // ============================================================================
  // CLÔTURE AUTOMATIQUE
  // ============================================================================
  useEffect(() => {
    const shouldAutoEnd = endDate &&
      currentTimestamp > endDate.getTime() &&
      gameConfig?.status === 'active' &&
      gameConfig._id &&
      !isEndingGame &&
      !hasAutoEndedRef.current;

    if (shouldAutoEnd) {
      hasAutoEndedRef.current = true;
      mutateEndGame(gameConfig._id!);
    }
  }, [currentTimestamp, endDate, gameConfig, isEndingGame, mutateEndGame]);

  // ============================================================================
  // SYNCHRONISATION STORE (banana et stat)
  // ============================================================================
  useEffect(() => {
    setAfficheBanana(viewStateResult.shouldShowBanana);
  }, [viewStateResult.shouldShowBanana, setAfficheBanana]);

  useEffect(() => {
    setAfficheStat(viewStateResult.shouldShowStat);
  }, [viewStateResult.shouldShowStat, setAfficheStat]);

  // ============================================================================
  // DÉMARRER LE JEU (avec cache busting et évitement des doubles redirections)
  // ============================================================================
  const demarrerJeu = useCallback(() => {
    if (hasRedirectedRef.current) return;

    const configId = gameConfig?._id || gameConfig?.id;
    if (!configId) {
      router.push('/star/learning/choix');
      return;
    }

    const allCompetitions = getAllCompetitions();
    const hasActiveCompetition = allCompetitions.some(
      competition => competition.idConfig === configId
    );

    hasRedirectedRef.current = true;

    const targetPath = hasActiveCompetition
      ? `/star/learning/startgame?_cb=${Date.now()}`
      : '/star/learning/choix';

    router.push(targetPath);
  }, [gameConfig, getAllCompetitions, router]);

  // ============================================================================
  // HANDLE OPEN GAME
  // ============================================================================
  const handleOpenGame = useCallback(() => {
    setAfficheBanana(true);
  }, [setAfficheBanana]);

  // ============================================================================
  // REFETCH MANUEL
  // ============================================================================
  const refetchAll = useCallback(async () => {
    await Promise.all([refetchConfig(), refetchLastEnded()]);
  }, [refetchConfig, refetchLastEnded]);

  // ============================================================================
  // RETURN
  // ============================================================================
  return {
    demarrerJeu,
    handleOpenGame,
    startDate,
    endDate,
    gameConfig,
    viewState: viewStateResult.viewState,
    lastEndedGame,
    isLoading: isConfigLoading,
    error: isConfigError,
    refetchAll,
    isEndingGame,
  };
}