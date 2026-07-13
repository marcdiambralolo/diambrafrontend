'use client';
import { useDiambraStore } from '@/lib/store/diambra.store';
import { useGameActions } from './useGameActions';
import { useGameStatus } from './useGameStatus';
import { useGameTimers } from './useGameTimers';
import { useLastEndedGame } from './useLastEndedGame';
import { api } from '@/lib/api/client';
import { LearningConfiguration } from '@/lib/interfaces';
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from 'react';

const QUERY_STALE_TIME = 1000;
const RETRY_ATTEMPTS = 2;
const REFRESH_CONFIG_INTERVAL = 5000; 

export function useAdminConsultationsPageFinished() {
  const setGameConfig = useDiambraStore((state) => state.setGameConfig);
  const afficheChoix = useDiambraStore((state) => state.afficheChoix);
  const afficheGame = useDiambraStore((state) => state.afficheGame);

  const { data: gameConfig = null, isLoading } = useQuery<LearningConfiguration | null>({
    queryKey: ['game', 'config'],
    queryFn: async () => {
      const { data } = await api.get<LearningConfiguration>('learning-configurations/current-config');
      return data;
    },
    staleTime: QUERY_STALE_TIME,
    refetchInterval: REFRESH_CONFIG_INTERVAL,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: RETRY_ATTEMPTS,
    gcTime: 1000 * 60,
  });

  useEffect(() => {
    setGameConfig(gameConfig);
  }, [gameConfig, setGameConfig]);

  const { lastEndedGame, isLoading: isLastEndedLoading } = useLastEndedGame();
  const { currentTimestamp, dates, countdowns } = useGameTimers(gameConfig);

  const { gameState } = useGameStatus({
    gameConfig,
    dates,
    countdowns,
    currentTimestamp,
    lastEndedGame,
  });

  const { completeGameCleanup, demarrerJeu } = useGameActions(gameConfig);

  const showBandeauButton = !!(gameState.canUserPlay && !afficheChoix && !afficheGame);

  return useMemo(() => ({
    demarrerJeu,
    completeGameCleanup,
    startDate: dates.startDate,
    countdown: gameState.countdown,
    endDate: dates.endDate,
    isLoading: isLastEndedLoading || isLoading,
    lastEndedGame,
    gameState,
    showBandeauButton,
  }), [
    demarrerJeu,
    completeGameCleanup,
    dates.startDate,
    dates.endDate,
    gameState,
    isLastEndedLoading,
    isLoading,
    lastEndedGame,
    showBandeauButton
  ]);
}