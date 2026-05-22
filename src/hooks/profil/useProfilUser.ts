import { api } from "@/lib/api/client";
import { LastEndedGame } from "@/lib/interfaces";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStatsDataWithCache } from "../cache/useStatsDataWithCache";
import { useGameConfig } from "./useGameConfig";

export function useProfilUser() {
  const { stats, isLoading: statsLoading } = useStatsDataWithCache();
  const { data: gameConfig, isLoading: configLoading, error: configError } = useGameConfig();

  const [gameStarted, setGameStarted] = useState(false);
  const [matchFinished, setMatchFinished] = useState(false);
  const [lastEndedGame, setLastEndedGame] = useState<LastEndedGame | null>(null);
  const [loadingLastEnded, setLoadingLastEnded] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
    startDate !== null &&
    endDate !== null &&
    now >= startDate &&
    now <= endDate,
    [gameConfig?.isActive, gameConfig?.status, startDate, endDate, now]
  );

  const isGameEnded = useMemo(() =>
    gameConfig?.status === 'ended' || (endDate !== null && now > endDate),
    [gameConfig?.status, endDate, now]
  );

  const isGameNotStarted = useMemo(() =>
    gameConfig?.status === 'pending' || (startDate !== null && now < startDate),
    [gameConfig?.status, startDate, now]
  );

  const fetchLastEndedGame = useCallback(async () => {
    try {
      const response = await api.get('/game-configurations/last-ended');

      type LastEndedResponse = {
        success: boolean;
        hasEndedEdition: boolean;
        configuration: LastEndedGame;
      };

      const data = response.data as LastEndedResponse;

      if (data?.hasEndedEdition && data?.configuration) {
        setLastEndedGame(data.configuration);
      } else {
        setLastEndedGame(null);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du dernier jeu terminé:', error);
      setLastEndedGame(null);
    } finally {
      setLoadingLastEnded(false);
    }
  }, []);

  const formatDateTime = useCallback((date: Date) =>
    date.toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }), []
  );

  const handleOpenGame = () => {
    if (!gameStarted) {
      setGameStarted(true);
    }
  };

  const handleEndMatch = useCallback(() => {
    if (!matchFinished) {
      setMatchFinished(true);
    }
    setRefreshTrigger(prev => prev + 1);
  }, [matchFinished, setRefreshTrigger, setMatchFinished]);

  useEffect(() => {
    fetchLastEndedGame();
  }, [fetchLastEndedGame]);

  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchLastEndedGame();
    }
  }, [refreshTrigger, fetchLastEndedGame]);

  const showNotStarted = isGameNotStarted && !isGameActive && !isGameEnded;
  const showActive = isGameActive && !isGameEnded;
  const showEnded = isGameEnded || (!isGameActive && !isGameNotStarted && lastEndedGame !== null);

  return {
    handleOpenGame, formatDateTime, handleEndMatch,
    loading: statsLoading || configLoading, error: configError, stats, startDate, endDate, gameConfig,
    loadingLastEnded, showNotStarted, lastEndedGame, showActive, showEnded,
  } as const;
}