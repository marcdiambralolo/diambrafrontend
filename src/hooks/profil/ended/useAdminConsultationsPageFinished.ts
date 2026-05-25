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

  // ==========================================================================
  // VALEURS DÉRIVÉES
  // ==========================================================================

  const startDate = useMemo(() =>
    gameConfig?.startgameDate ? new Date(gameConfig.startgameDate) : null,
    [gameConfig?.startgameDate]
  );

  const endDate = useMemo(() =>
    gameConfig?.endgameDate ? new Date(gameConfig.endgameDate) : null,
    [gameConfig?.endgameDate]
  );

  const now = useMemo(() => new Date(), []);

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

  const hasActiveEdition = useMemo(() =>
    showActive && endDate && startDate,
    [showActive, endDate, startDate]
  );

  const hasNotStartedEdition = useMemo(() =>
    showNotStarted && startDate,
    [showNotStarted, startDate]
  );

  const isLoading = useMemo(() =>
    loadingConsultations || loadingLastEnded,
    [loadingConsultations, loadingLastEnded]
  );

  const profilLoading = useMemo(() =>
    loadingConsultations || statsLoading || configLoading,
    [loadingConsultations, statsLoading, configLoading]
  );

  // ==========================================================================
  // FONCTIONS API
  // ==========================================================================

  const fetchLastEndedGame = useCallback(async () => {
    // Éviter les appels simultanés
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
    // Éviter les appels simultanés
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

  // ==========================================================================
  // CALLBACKS
  // ==========================================================================

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

  // ==========================================================================
  // EFFETS
  // ==========================================================================

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

  // ==========================================================================
  // RETOUR
  // ==========================================================================

  return {
    // Actions
    handleOpenGame,
    handleEndMatch,
    handleRefresh,
    
    // États booléens
    hasWinners,
    hasActiveEdition,
    hasNotStartedEdition,
    showEnded,
    showActive,
    showNotStarted,
    
    // Données
    stats,
    gameConfig,
    consultations,
    activeEdition,
    winners,
    statistics,
    lastEndedGame,
    winningCombination,
    
    // États de chargement
    isLoading,
    profilLoading,
    loadingLastEnded,
    
    // Dates et erreurs
    startDate,
    endDate,
    error: error || configError,
  };
}