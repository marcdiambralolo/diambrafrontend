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
  const isFetchingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [gameStarted, setGameStarted] = useState(false);
  const [matchFinished, setMatchFinished] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [activeEdition, setActiveEdition] = useState<ActiveEdition | null>(null);
  const [winners, setWinners] = useState<WinnersData | null>(null);
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [lastEndedGame, setLastEndedGame] = useState<LastEndedGame | null>(null);
  const [loadingConsultations, setLoadingConsultations] = useState(true);
  const [loadingLastEnded, setLoadingLastEnded] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date()); // 🔥 État pour la date actuelle

  // 🔥 Mettre à jour l'heure actuelle toutes les secondes
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
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

  // 🔥 Utiliser currentTime au lieu de new Date() pour les comparaisons
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

  const fetchLastEndedGame = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const response = await api.get('/game-configurations/last-ended');
      const data = response.data as LastEndedResponse;

      if (isMountedRef.current) {
        setLastEndedGame(data?.hasEndedEdition ? data.configuration : null);
      }
    } catch (error) {
      if (isMountedRef.current) {
        console.error('Erreur lors de la récupération du dernier jeu terminé:', error);
        setLastEndedGame(null);
      }
    } finally {
      if (isMountedRef.current) {
        setLoadingLastEnded(false);
      }
      isFetchingRef.current = false;
    }
  }, []);

  const fetchConsultationsData = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const response = await api.get('/consultations/ended-game', {
        params: { page: 1, limit: ITEMS_PER_PAGE },
      });

      const data = response.data as EndedGameResponse;

      if (isMountedRef.current) {
        setConsultations(data?.consultations || []);
        setActiveEdition(data?.activeEdition || null);
        setWinners(data?.winners || null);
        setStatistics(data?.statistics || null);
        setError(null);
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        console.error('Erreur:', err);
        setError(err?.message || 'Erreur lors du chargement');
        setConsultations([]);
        setActiveEdition(null);
        setWinners(null);
        setStatistics(null);
      }
    } finally {
      if (isMountedRef.current) {
        setLoadingConsultations(false);
      }
      isFetchingRef.current = false;
    }
  }, []);

  const refreshAllData = useCallback(async () => {
    setLoadingConsultations(true);
    setLoadingLastEnded(true);
    setError(null);

    await Promise.allSettled([
      fetchConsultationsData(),
      fetchLastEndedGame(),
    ]);
  }, [fetchConsultationsData, fetchLastEndedGame]);

  const handleOpenGame = useCallback(() => {
    if (!gameStarted) {
      setGameStarted(true);
    }
  }, [gameStarted]);

  const handleEndMatch = useCallback(() => {
    if (!matchFinished) {
      setMatchFinished(true);
      setRefreshTrigger(prev => prev + 1);
    }
  }, [matchFinished]);

  const handleRefresh = useCallback(() => {
    refreshAllData();
  }, [refreshAllData]);

  // 🔥 Vérifier périodiquement si l'édition est terminée et recharger les données
  useEffect(() => {
    // Si l'édition est terminée et qu'on n'a pas encore chargé les données finales
    if (isGameEnded && !matchFinished) {
      refreshAllData();
      setMatchFinished(true);
    }
  }, [isGameEnded, matchFinished, refreshAllData]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  useEffect(() => {
    if (refreshTrigger > 0) {
      refreshAllData();
    }
  }, [refreshTrigger, refreshAllData]);

  useEffect(() => {
    // Quand l'édition devient active, démarrer automatiquement le jeu
    if (showActive && !gameStarted && !hasNotStartedEdition) {
      setGameStarted(true);
    }
  }, [showActive, gameStarted, hasNotStartedEdition]);

  return {
    handleOpenGame, 
    handleEndMatch, 
    handleRefresh,
    isLoading: loadingConsultations || loadingLastEnded || configLoading || statsLoading,
    startDate, 
    endDate, 
    error: error || configError, 
    hasWinners, 
    winningCombination,
    hasNotStartedEdition, 
    showEnded, 
    showActive, 
    showNotStarted, 
    stats,
    gameConfig, 
    consultations, 
    activeEdition, 
    winners, 
    statistics, 
    lastEndedGame,
    gameStarted,
    currentTime, // 🔥 Exporter pour déboguer si nécessaire
  };
}