// hooks/profil/useProfilUser.ts
import { useMemo } from 'react';
import { useStatsDataWithCache } from "../cache/useStatsDataWithCache";
import { api } from "@/lib/api/client";
import { GameConfiguration } from "@/lib/interfaces";
import { useQuery } from "@tanstack/react-query";

export function useGameConfig() {
  return useQuery<GameConfiguration>({
    queryKey: ['game', 'config'],
    queryFn: async (): Promise<GameConfiguration> => {
      const response = await api.get('game-configurations/current-config');
      return response.data as GameConfiguration;
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useProfilUser() {
  const { stats, isLoading: statsLoading } = useStatsDataWithCache();
  const { data: gameConfig, isLoading: configLoading } = useGameConfig();

  const startDate = useMemo(() =>
    gameConfig?.startgameDate ? new Date(gameConfig.startgameDate) : null,
    [gameConfig?.startgameDate]
  );

  const endDate = useMemo(() =>
    gameConfig?.endgameDate ? new Date(gameConfig.endgameDate) : null,
    [gameConfig?.endgameDate]
  );

  const now = new Date();

  const isGameActive = useMemo(() =>
    gameConfig?.isActive === true && 
    gameConfig?.status === 'active' &&
    startDate && endDate &&
    now >= startDate &&
    now <= endDate,
    [gameConfig?.isActive, gameConfig?.status, startDate, endDate, now]
  );

  const isGameEnded = useMemo(() =>
    endDate && now > endDate,
    [endDate, now]
  );

  const isGameNotStarted = useMemo(() =>
    startDate && now < startDate,
    [startDate, now]
  );

  const formatDate = (date: Date) => date.toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  const formatDateTime = (date: Date) => date.toLocaleString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const getTimeRemaining = () => {
    if (!endDate) return null;
    const diff = endDate.getTime() - now.getTime();
    if (diff <= 0) return null;
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % 86400000) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % 3600000) / (1000 * 60)),
      seconds: Math.floor((diff % 60000) / 1000)
    };
  };

  const timeRemaining = getTimeRemaining();

  return {
    loading: statsLoading || configLoading,
    stats,
    isGameActive,
    isGameEnded,
    isGameNotStarted,
    timeRemaining,
    formatDate,
    formatDateTime,
    startDate,
    endDate,
    gameConfig,
  } as const;
}