import { api } from '@/lib/api/client';
import { LearningConfiguration } from '@/lib/interfaces';
import { useDiambraStore } from '@/lib/store/diambra.store';
import { useQuery } from "@tanstack/react-query";
import { useEffect } from 'react';

const QUERY_STALE_TIME = 1 * 1000;
const RETRY_ATTEMPTS = 2;
const REFRESH_CONFIG_INTERVAL = 1 * 1000;

export function useGameConfig() {
  const { setGameConfig } = useDiambraStore();

  const {
    data: gameConfig = null,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery<LearningConfiguration | null>({
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
    if (gameConfig && isSuccess) {
      setGameConfig(gameConfig);
    }
  }, [gameConfig, isSuccess, setGameConfig,]);

  return { gameConfig, isLoading, isError, error, };
}