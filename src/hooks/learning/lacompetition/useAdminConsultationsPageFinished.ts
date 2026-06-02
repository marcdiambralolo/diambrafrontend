'use client';
import { useStatsDataWithCache } from '@/hooks/cache/useStatsDataWithCache';
import { api } from '@/lib/api/client';
import { LastEndedGame, LastEndedResponse, LearningConfiguration } from '@/lib/interfaces';
import { useMonEtoileStore } from '@/lib/store/monetoile.store';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const REFRESH_INTERVAL = 5000;
const TIME_UPDATE_INTERVAL = 1000;
const QUERY_STALE_TIME = 60 * 1000;
const QUERY_GC_TIME = 5 * 60 * 1000;

export function useAdminConsultationsPageFinished() {
  const queryClient = useQueryClient();
  const { stats } = useStatsDataWithCache();

  const {
    setJeuAcommencer, resetGameState, setGameStarted, setGameConfig,
    gameStarted, gameConfig: storedGameConfig,
  } = useMonEtoileStore();

  const isMountedRef = useRef(true);
  const endGameCalledRef = useRef(false);
  const isFetchingRef = useRef(false);
  const isInitializedRef = useRef(false);

  const [matchFinished, setMatchFinished] = useState(false);
  const [lastEndedGame, setLastEndedGame] = useState<LastEndedGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEndingGame, setIsEndingGame] = useState(false);

  const {
    data: queryGameConfig,
    isLoading: isGameConfigLoading,
    refetch: refetchGameConfig
  } = useQuery<LearningConfiguration>({
    queryKey: ['game', 'config'],
    queryFn: async (): Promise<LearningConfiguration> => {
      const response = await api.get('learning-configurations/current-config');
      const config = response.data as LearningConfiguration;
      setGameConfig(config);
      return config;
    },
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const gameConfig = queryGameConfig || null;
  const isConfigLoading = isGameConfigLoading && !storedGameConfig;

  useEffect(() => {
    if (!isInitializedRef.current && !storedGameConfig && !isGameConfigLoading) {
      isInitializedRef.current = true;
      refetchGameConfig();
    }
  }, [storedGameConfig, isGameConfigLoading, refetchGameConfig]);

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(new Date()), TIME_UPDATE_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  const startDate = useMemo(() =>
    gameConfig?.startgameDate ? new Date(gameConfig.startgameDate) : null,
    [gameConfig?.startgameDate]
  );

  const endDate = useMemo(() =>
    gameConfig?.endgameDate ? new Date(gameConfig.endgameDate) : null,
    [gameConfig?.endgameDate]
  );

  const isGameActive = useMemo(() => {
    if (!gameConfig) return false;

    return (
      gameConfig.isActive === true &&
      gameConfig.status === 'active' &&
      startDate !== null && endDate !== null &&
      currentTime >= startDate && currentTime <= endDate
    );
  }, [gameConfig, startDate, endDate, currentTime]);

  const isGameEnded = useMemo(() => {
    if (!gameConfig) return false;

    return gameConfig.status === 'ended' || (endDate !== null && currentTime > endDate);
  }, [gameConfig, endDate, currentTime]);

  const isGameNotStarted = useMemo(() => {
    if (!gameConfig) return false;

    return gameConfig.status === 'pending' || (startDate !== null && currentTime < startDate);
  }, [gameConfig, startDate, currentTime]);

  const showNotStarted = isGameNotStarted && !isGameActive && !isGameEnded;
  const showActive = isGameActive && !isGameEnded;

  const showEnded = useMemo(() => {
    if (!gameConfig && !isConfigLoading) return true;
    if (!gameConfig) return false;

    return isGameEnded || (!isGameActive && !isGameNotStarted && !!lastEndedGame);
  }, [gameConfig, isConfigLoading, isGameEnded, isGameActive, isGameNotStarted, lastEndedGame]);

  const hasNotStartedEdition = showNotStarted && startDate !== null;

  const refreshLastEndedGame = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const { data } = await api.get<LastEndedResponse>('/learning-configurations/last-ended');
      if (isMountedRef.current) {
        setLastEndedGame(data?.hasEndedEdition ? data.configuration : null);
        setError(null);
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        console.error('Erreur refreshLastEndedGame:', err);
        setError(err?.message || 'Erreur lors du chargement');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        isFetchingRef.current = false;
      }
    }
  }, []);

  const endGameInBackend = useCallback(async () => {
    if (!gameConfig?._id || isEndingGame || endGameCalledRef.current) return;
    setIsEndingGame(true);

    try {
      const { data } = await api.post(`/learning-configurations/${gameConfig._id}/end`);
      if ((data as any)?.success) {
        endGameCalledRef.current = true;
        setMatchFinished(true);
        await queryClient.invalidateQueries({ queryKey: ['game', 'config'] });
        const newConfig = await refetchGameConfig();
        if (newConfig.data) {
          setGameConfig(newConfig.data);
        }
        await refreshLastEndedGame();
      }
    } catch (err: any) {
      if (err?.response?.status === 409) {
        endGameCalledRef.current = true;
        setMatchFinished(true);
        await refreshLastEndedGame();
      } else {
        console.error('Erreur endGameInBackend:', err);
      }
    } finally {
      setIsEndingGame(false);
    }
  }, [gameConfig?._id, isEndingGame, refreshLastEndedGame, queryClient, refetchGameConfig, setGameConfig]);

  const handleOpenGame = useCallback(() => {
    if (!gameStarted) setGameStarted(true);
  }, [gameStarted, setGameStarted]);

  const demarrerJeu = useCallback(() => {
    resetGameState();
    setJeuAcommencer(true);
  }, [resetGameState, setJeuAcommencer]);

  useEffect(() => {
    const shouldEnd = (isGameEnded || (endDate && currentTime > endDate)) &&
      !matchFinished && !endGameCalledRef.current && gameConfig?._id;
    if (shouldEnd) {
      endGameInBackend();
    }
  }, [isGameEnded, currentTime, endDate, matchFinished, endGameCalledRef, gameConfig?._id, endGameInBackend]);

  useEffect(() => {
    const reloadInterval = setInterval(() => {
      if (!isFetchingRef.current && !isEndingGame) {
        refreshLastEndedGame();
      }
    }, REFRESH_INTERVAL);
    return () => clearInterval(reloadInterval);
  }, [isEndingGame, refreshLastEndedGame]);

  useEffect(() => {
    isMountedRef.current = true;
    refreshLastEndedGame();
    return () => {
      isMountedRef.current = false;
    };
  }, [refreshLastEndedGame]);

  useEffect(() => {
    if (showActive && !gameStarted && !hasNotStartedEdition) {
      setGameStarted(true);
    }
  }, [showActive, gameStarted, hasNotStartedEdition, setGameStarted]);

  const isLoading = isConfigLoading || loading;

  return {
    demarrerJeu, handleOpenGame,
    loading: isLoading, showActive, showNotStarted, showEnded, error,
    lastEndedGame, endDate, startDate, gameConfig, stats,
  };
}