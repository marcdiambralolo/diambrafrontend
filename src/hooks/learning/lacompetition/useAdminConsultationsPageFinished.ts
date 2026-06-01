'use client';
import { useStatsDataWithCache } from '@/hooks/cache/useStatsDataWithCache';
import { api } from '@/lib/api/client';
import { LastEndedGame, LastEndedResponse } from '@/lib/interfaces';
import { useMonEtoileStore } from '@/lib/store/monetoile.store';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGameConfig } from '../useGame';

export function useAdminConsultationsPageFinished() {
  const { stats } = useStatsDataWithCache();
  const { data: gameConfig } = useGameConfig();
  const { setJeuAcommencer, resetGameState, setGameStarted, gameStarted } = useMonEtoileStore();

  const isMountedRef = useRef(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const endGameCalledRef = useRef(false);
  const isFetchingRef = useRef(false);

  const [matchFinished, setMatchFinished] = useState(false);
  const [lastEndedGame, setLastEndedGame] = useState<LastEndedGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEndingGame, setIsEndingGame] = useState(false);

  useEffect(() => {
    intervalRef.current = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const startDate = useMemo(() =>
    gameConfig?.startgameDate ? new Date(gameConfig.startgameDate) : null,
    [gameConfig?.startgameDate]
  );

  const endDate = useMemo(() =>
    gameConfig?.endgameDate ? new Date(gameConfig.endgameDate) : null,
    [gameConfig?.endgameDate]
  );

  const isGameActive = useMemo(() =>
    gameConfig?.isActive === true &&
    gameConfig?.status === 'active' &&
    startDate && endDate &&
    currentTime >= startDate && currentTime <= endDate,
    [gameConfig?.isActive, gameConfig?.status, startDate, endDate, currentTime]
  );

  const isGameEnded = useMemo(() =>
    gameConfig?.status === 'ended' || (endDate && currentTime > endDate),
    [gameConfig?.status, endDate, currentTime]
  );

  const isGameNotStarted = useMemo(() =>
    gameConfig?.status === 'pending' || (startDate && currentTime < startDate),
    [gameConfig?.status, startDate, currentTime]
  );

  const showNotStarted = isGameNotStarted && !isGameActive && !isGameEnded;
  const showActive = isGameActive && !isGameEnded;
  const showEnded = isGameEnded || (!isGameActive && !isGameNotStarted && !!lastEndedGame);
  const hasNotStartedEdition = showNotStarted && !!startDate;

  const refreshAllData = useCallback(async () => {
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
        console.error('Erreur:', err);
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
        await refreshAllData();
      }
    } catch (err: any) {
      if (err?.response?.status === 409) {
        endGameCalledRef.current = true;
        setMatchFinished(true);
        await refreshAllData();
      } else {
        console.error('Erreur:', err);
      }
    } finally {
      setIsEndingGame(false);
    }
  }, [gameConfig?._id, isEndingGame, refreshAllData]);

  const handleOpenGame = useCallback(() => {
    if (!gameStarted) setGameStarted(true);
  }, [gameStarted, setGameStarted]);

  const handleEndMatch = useCallback(async () => {
    if (!matchFinished && !isEndingGame) {
      setMatchFinished(true);
      await endGameInBackend();
    }
  }, [matchFinished, isEndingGame, endGameInBackend]);

  const demarrerJeu = useCallback(() => {
    resetGameState();
    setJeuAcommencer(true);
  }, [resetGameState, setJeuAcommencer]);

  useEffect(() => {
    const shouldEnd = (isGameEnded || (endDate && currentTime > endDate)) &&
      !matchFinished && !endGameCalledRef.current && gameConfig?._id;
    if (shouldEnd) endGameInBackend();
  }, [isGameEnded, currentTime, endDate, matchFinished, endGameCalledRef, gameConfig?._id, endGameInBackend]);

  useEffect(() => {
    const reloadInterval = setInterval(() => {
      if (!isFetchingRef.current && !isEndingGame) refreshAllData();
    }, 5000);
    return () => clearInterval(reloadInterval);
  }, [isEndingGame, refreshAllData]);

  useEffect(() => {
    isMountedRef.current = true;
    refreshAllData();
    return () => { isMountedRef.current = false; };
  }, [refreshAllData]);

  useEffect(() => {
    if (showActive && !gameStarted && !hasNotStartedEdition) {
      setGameStarted(true);
    }
  }, [showActive, gameStarted, hasNotStartedEdition, setGameStarted]);

  return {
    demarrerJeu, handleOpenGame, handleEndMatch, startDate, gameConfig, stats, error,
    showEnded, loading, showActive, showNotStarted, lastEndedGame, endDate,
  };
}