'use client';
import { useStatsDataWithCache } from '@/hooks/cache/useStatsDataWithCache';
import { api } from '@/lib/api/client';
import { ActiveEdition, Consultation, EndedGameResponse, LastEndedGame, LastEndedResponse, StatisticsData, WinnersData } from '@/lib/interfaces';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGameConfig } from '../useGameConfig';

export const ITEMS_PER_PAGE = 10000;

export function useAdminConsultationsPageFinished() {
  const { stats, isLoading: statsLoading } = useStatsDataWithCache();
  const { data: gameConfig, isLoading: configLoading, error: configError } = useGameConfig();

  const isMountedRef = useRef(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const endGameCalledRef = useRef(false);

  const [gameStarted, setGameStarted] = useState(false);
  const [matchFinished, setMatchFinished] = useState(false);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [activeEdition, setActiveEdition] = useState<ActiveEdition | null>(null);
  const [winners, setWinners] = useState<WinnersData | null>(null);
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [lastEndedGame, setLastEndedGame] = useState<LastEndedGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEndingGame, setIsEndingGame] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mettre à jour l'heure actuelle toutes les secondes
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
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
    startDate !== null &&
    endDate !== null &&
    currentTime >= startDate &&
    currentTime <= endDate,
    [gameConfig?.isActive, gameConfig?.status, startDate, endDate, currentTime]
  );

  const isGameEnded = useMemo(() =>
    gameConfig?.status === 'ended' || (endDate !== null && currentTime > endDate),
    [gameConfig?.status, endDate, currentTime]
  );

  const isGameNotStarted = useMemo(() =>
    gameConfig?.status === 'pending' || (startDate !== null && currentTime < startDate),
    [gameConfig?.status, startDate, currentTime]
  );

  const showNotStarted = useMemo(() =>
    isGameNotStarted && !isGameActive && !isGameEnded,
    [isGameNotStarted, isGameActive, isGameEnded]
  );

  const showActive = useMemo(() =>
    isGameActive && !isGameEnded,
    [isGameActive, isGameEnded]
  );

  const showEnded = useMemo(() =>
    isGameEnded || (!isGameActive && !isGameNotStarted && lastEndedGame !== null),
    [isGameEnded, isGameActive, isGameNotStarted, lastEndedGame]
  );

  const hasWinners = useMemo(() =>
    winners?.totalWinners ? winners.totalWinners > 0 : false,
    [winners?.totalWinners]
  );

  const winningCombination = useMemo(() =>
    statistics?.winningCombination || activeEdition?.winningCombination || null,
    [statistics?.winningCombination, activeEdition?.winningCombination]
  );

  const hasNotStartedEdition = useMemo(() =>
    showNotStarted && startDate,
    [showNotStarted, startDate]
  );

  // 🔥 Fonction unique pour rafraîchir toutes les données
  const refreshAllData = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);

    try {
      // Récupérer les données des consultations terminées
      const [consultationsResponse, lastEndedResponse] = await Promise.all([
        api.get('/consultations/ended-game', {
          params: { page: 1, limit: ITEMS_PER_PAGE },
        }),
        api.get('/game-configurations/last-ended'),
      ]);

      const consultationsData = consultationsResponse.data as EndedGameResponse;
      const lastEndedData = lastEndedResponse.data as LastEndedResponse;

      if (isMountedRef.current) {
        setConsultations(consultationsData?.consultations || []);
        setActiveEdition(consultationsData?.activeEdition || null);
        setWinners(consultationsData?.winners || null);
        setStatistics(consultationsData?.statistics || null);
        setLastEndedGame(lastEndedData?.hasEndedEdition ? lastEndedData.configuration : null);
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
        setIsRefreshing(false);
      }
    }
  }, [isRefreshing]);

  // 🔥 Fonction pour terminer l'édition dans le backend
  const endGameInBackend = useCallback(async () => {
    if (!gameConfig?._id || isEndingGame || endGameCalledRef.current) return;

    setIsEndingGame(true);

    try {
      const response = await api.post(`/game-configurations/${gameConfig._id}/end`);
      const data = response.data as any;

      if (data?.success) {
        endGameCalledRef.current = true;
        setMatchFinished(true);
        // 🔥 Recharger les données immédiatement
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
    if (!gameStarted) {
      setGameStarted(true);
    }
  }, [gameStarted]);

  const handleEndMatch = useCallback(async () => {
    if (!matchFinished && !isEndingGame) {
      setMatchFinished(true);
      await endGameInBackend();
    }
  }, [matchFinished, isEndingGame, endGameInBackend]);

  const handleRefresh = useCallback(() => {
    refreshAllData();
    endGameCalledRef.current = false;
  }, [refreshAllData]);

  // 🔥 Détection de fin d'édition
  useEffect(() => {
    const shouldEnd = (isGameEnded || (endDate && currentTime > endDate)) &&
      !matchFinished &&
      !endGameCalledRef.current &&
      gameConfig?._id;

    if (shouldEnd) {
      endGameInBackend();
    }
  }, [isGameEnded, currentTime, endDate, matchFinished, endGameInBackend, gameConfig?._id]);

  // 🔥 Rechargement périodique pour les mises à jour (toutes les 5 secondes)
  useEffect(() => {
    const reloadInterval = setInterval(() => {
      if (!isRefreshing && !isEndingGame) {
        refreshAllData();
      }
    }, 5000);

    return () => clearInterval(reloadInterval);
  }, [isRefreshing, isEndingGame, refreshAllData]);

  // Chargement initial
  useEffect(() => {
    isMountedRef.current = true;
    refreshAllData();

    return () => {
      isMountedRef.current = false;
    };
  }, [refreshAllData]);

  // Démarrage automatique quand l'édition devient active
  useEffect(() => {
    if (showActive && !gameStarted && !hasNotStartedEdition) {
      setGameStarted(true);
    }
  }, [showActive, gameStarted, hasNotStartedEdition]);

  return {
    handleOpenGame,
    handleEndMatch,
    handleRefresh,
    isLoading: loading || statsLoading || configLoading,
    startDate,
    endDate,
    error: error || configError,
    hasWinners,
    winningCombination,
    hasNotStartedEdition,
    showEnded,
    showNotStarted,
    stats,
    gameConfig,
    consultations,
    activeEdition,
    winners,
    statistics,
    lastEndedGame,
    gameStarted,
    currentTime,
  };
}