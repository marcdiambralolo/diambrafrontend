'use client';
import { useStatsDataWithCache } from '@/hooks/cache/useStatsDataWithCache';
import { api } from '@/lib/api/client';
import { LastEndedGame, LastEndedResponse, LearningConfiguration, MatchInfo } from '@/lib/interfaces';
import { decoupelimage } from "@/lib/learning/functions";
import { ViewState } from '@/lib/learning/interface';
import { createInitialCases, createMatch, createPlayableCases, getTotalCases, shuffleArray } from "@/lib/learning/services/game.service";
import { useMonEtoileStore } from '@/lib/store/monetoile.store';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCompetitionLauncher } from './useCometitionLauncher';

const REFRESH_INTERVAL = 5000;
const TIME_UPDATE_INTERVAL = 1000;
const QUERY_STALE_TIME = 60 * 1000;
const QUERY_GC_TIME = 5 * 60 * 1000;
const RETRY_ATTEMPTS = 3;
const BASE_RETRY_DELAY = 1000;
const GLOBAL_GAME_ORDER = [0, 3, 1, 2] as const;
const DEFAULT_MATCH_ID = "123456789";
const DEFAULT_NIVEAU = 2;
const IMAGE_PATH = "/ephotoquatorze.jpg";

export function useAdminConsultationsPageFinished() {
  const queryClient = useQueryClient();
  const { stats } = useStatsDataWithCache();
 const { demarrerJeu,   resetGame } = useCompetitionLauncher();
  const {
    setJeuAcommencer,
    resetGameState,
    setGameStarted,
    setGameConfig,
    setCurrentMatchInfo,
    clearCurrentMatchInfo,
    clearAllCompetitions,
    gameStarted,
    gameConfig: storedGameConfig,
    setLamise,
    setJeuenattente,
  } = useMonEtoileStore();

  // Refs
  const isMountedRef = useRef(true);
  const endGameCalledRef = useRef(false);
  const isFetchingRef = useRef(false);
  const isInitializedRef = useRef(false);
  const gameInitializedRef = useRef(false);

  // States
  const [matchFinished, setMatchFinished] = useState(false);
  const [lastEndedGame, setLastEndedGame] = useState<LastEndedGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEndingGame, setIsEndingGame] = useState(false);
  const [isGameInitializing, setIsGameInitializing] = useState(false);
  const [matchinfo, setMatchinfo] = useState<MatchInfo[]>([]);

  // ============================================================================
  // QUERY POUR LA CONFIGURATION
  // ============================================================================

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
    retry: RETRY_ATTEMPTS,
    retryDelay: (attemptIndex) => Math.min(BASE_RETRY_DELAY * 2 ** attemptIndex, 30000),
  });

  const gameConfig = queryGameConfig || null;
  const isConfigLoading = isGameConfigLoading && !storedGameConfig;

  // ============================================================================
  // FONCTIONS DE GÉNÉRATION DE MATCH
  // ============================================================================

  const generateMatchList = useCallback((): MatchInfo[] => {
    const matchId = gameConfig?.numeromatch || DEFAULT_MATCH_ID;
    return GLOBAL_GAME_ORDER.map((type, index) => createMatch(type, index, matchId));
  }, [gameConfig?.numeromatch]);

  const loadMatch = useCallback(async (match: MatchInfo, niveau: number, piecesImages: string[]): Promise<MatchInfo> => {
    const totalCases = getTotalCases(match.tpsglobal!, niveau);
    const gridSize = niveau * niveau;
    const seed = parseInt(match.numeromatch!) + 7;

    let availableCases = Array.from({ length: totalCases }, (_, i) => i.toString());

    if (match.tpsglobal !== 2) {
      availableCases = shuffleArray(availableCases, seed);
    }

    const selectedCases = availableCases.slice(0, gridSize);
    const shuffledCases = shuffleArray([...selectedCases], seed);

    match.listeCaseOpLab = createPlayableCases(shuffledCases, selectedCases, match);
    match.listeCaseOpLabInitiale = createInitialCases(selectedCases, match);
    match.pieces = piecesImages;

    return match;
  }, []);

  const initializeGame = useCallback(async () => {
    if (gameInitializedRef.current || isGameInitializing) return;
    gameInitializedRef.current = true;
    setIsGameInitializing(true);

    try {
      const matchList = generateMatchList();
      const niveau = gameConfig?.niveau || DEFAULT_NIVEAU;
      const piecesImages = await decoupelimage(IMAGE_PATH, niveau);

      const updatedMatches = await Promise.all(
        matchList.map(match => loadMatch(match, niveau, piecesImages))
      );

      clearCurrentMatchInfo();
      setCurrentMatchInfo(updatedMatches);
      setMatchinfo(updatedMatches);
    } catch (error) {
      console.error("Erreur lors de l'initialisation du jeu:", error);
      gameInitializedRef.current = false;
    } finally {
      setIsGameInitializing(false);
    }
  }, [gameConfig?.niveau, generateMatchList, loadMatch, clearCurrentMatchInfo, setCurrentMatchInfo, isGameInitializing]);

  // ============================================================================
  // INITIALISATION
  // ============================================================================

  useEffect(() => {
    if (!isInitializedRef.current && !storedGameConfig && !isGameConfigLoading) {
      isInitializedRef.current = true;
      refetchGameConfig();
    }
  }, [storedGameConfig, isGameConfigLoading, refetchGameConfig]);

  // Mise à jour du temps
  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(new Date()), TIME_UPDATE_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  // ============================================================================
  // CALCULS DES DATES ET ÉTATS
  // ============================================================================

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

  // ============================================================================
  // ACTIONS API
  // ============================================================================

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

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleOpenGame = useCallback(() => {
    clearAllCompetitions();
    if (!gameStarted) setGameStarted(true);
  }, [clearAllCompetitions, gameStarted, setGameStarted]);

  

  // ============================================================================
  // EFFETS
  // ============================================================================

  // Vérifier si le jeu doit se terminer automatiquement
  useEffect(() => {
    const shouldEnd = (isGameEnded || (endDate && currentTime > endDate)) &&
      !matchFinished && !endGameCalledRef.current && gameConfig?._id;
    if (shouldEnd) {
      endGameInBackend();
    }
  }, [isGameEnded, currentTime, endDate, matchFinished, endGameCalledRef, gameConfig?._id, endGameInBackend]);

  // Rafraîchissement périodique
  useEffect(() => {
    const reloadInterval = setInterval(() => {
      if (!isFetchingRef.current && !isEndingGame) {
        refreshLastEndedGame();
      }
    }, REFRESH_INTERVAL);
    return () => clearInterval(reloadInterval);
  }, [isEndingGame, refreshLastEndedGame]);

  // Initialisation
  useEffect(() => {
    isMountedRef.current = true;
    refreshLastEndedGame();
    return () => {
      isMountedRef.current = false;
    };
  }, [refreshLastEndedGame]);

  // Synchronisation du démarrage du jeu
  useEffect(() => {
    if (showActive && !gameStarted && !hasNotStartedEdition) {
      setGameStarted(true);
    }
  }, [showActive, gameStarted, hasNotStartedEdition, setGameStarted]);

  // ============================================================================
  // VALEURS FINALES
  // ============================================================================

  const isLoading = isConfigLoading || loading || isGameInitializing;

  const viewState = useMemo((): ViewState => {
    if (!gameConfig) {
      return { isEnded: true, isActive: false, isNotStarted: false };
    }
    return {
      isEnded: showEnded,
      isActive: !showEnded && showActive,
      isNotStarted: !showEnded && !showActive && showNotStarted,
    };
  }, [gameConfig, showEnded, showActive, showNotStarted]);

  return {
    // Actions
    demarrerJeu,
    handleOpenGame,
    // États
    startDate,
    endDate,
    gameConfig,
    stats,
    viewState,
    loading: isLoading,
    lastEndedGame,
    error, matchinfo,
  };
}