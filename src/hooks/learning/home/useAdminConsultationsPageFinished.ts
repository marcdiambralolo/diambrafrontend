'use client';
import { api } from '@/lib/api/client';
import { CompetitionInfo, LastEndedGame, LastEndedResponse, LearningConfiguration } from '@/lib/interfaces';
import { useDiambraStore } from '@/lib/store/diambra.store';
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';

// ============================================================================
// CONSTANTES
// ============================================================================

const TIME_UPDATE_INTERVAL = 1000;
const QUERY_STALE_TIME = 10 * 1000;
const RETRY_ATTEMPTS = 2;
const REFRESH_CONFIG_INTERVAL = 15 * 1000;
const LAST_ENDED_REFETCH_INTERVAL = 5000;

// ============================================================================
// TYPES
// ============================================================================

interface GameState {
  status: 'not_started' | 'active' | 'waiting_results' | 'results_available' | 'ended_no_proclamation' | 'no_competition';
  countdown: number | null;
  showGameFinishedBanner: boolean;
  canUserPlay: boolean;
}

// ============================================================================
// STORE SELECTORS
// ============================================================================

const selectors = {
  gameIsFinished: (state: any) => state.gameIsFinished,
  afficheStat: (state: any) => state.afficheStat,
  afficheBanana: (state: any) => state.afficheBanana,
  afficheChoix: (state: any) => state.afficheChoix,
  afficheGame: (state: any) => state.afficheGame,
  setGameIsFinished: (state: any) => state.setGameIsFinished,
  setAfficheChoix: (state: any) => state.setAfficheChoix,
  setAfficheGame: (state: any) => state.setAfficheGame,
  resetGameState: (state: any) => state.resetGameState,
  setGameConfig: (state: any) => state.setGameConfig,
  setAfficheBanana: (state: any) => state.setAfficheBanana,
  setAfficheStat: (state: any) => state.setAfficheStat,
  competitions: (state: any) => state.competitions || [],
  isGameConfigLoaded: (state: any) => state.isGameConfigLoaded,
  setIsGameConfigLoaded: (state: any) => state.setIsGameConfigLoaded,
  setCurrentMatchInfo: (state: any) => state.setCurrentMatchInfo,
  currentMatchInfo: (state: any) => state.currentMatchInfo,
} as const;

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export function useAdminConsultationsPageFinished() {
  const [, startTransition] = useTransition();
  const hasRedirectedRef = useRef(false);
  const isMountedRef = useRef(true);

  // Store Subscriptions
  const gameIsFinished = useDiambraStore(selectors.gameIsFinished);
  const afficheChoix = useDiambraStore(selectors.afficheChoix);
  const afficheGame = useDiambraStore(selectors.afficheGame);
  const setGameIsFinished = useDiambraStore(selectors.setGameIsFinished);
  const setAfficheChoix = useDiambraStore(selectors.setAfficheChoix);
  const setAfficheGame = useDiambraStore(selectors.setAfficheGame);
  const resetGameState = useDiambraStore(selectors.resetGameState);
  const setGameConfig = useDiambraStore(selectors.setGameConfig);
  const competitions = useDiambraStore(selectors.competitions);
  const isGameConfigLoaded = useDiambraStore(selectors.isGameConfigLoaded);
  const setIsGameConfigLoaded = useDiambraStore(selectors.setIsGameConfigLoaded);

  const [currentTimestamp, setCurrentTimestamp] = useState<number>(() => Date.now());
  const [gameCountdown, setGameCountdown] = useState<number | null>(null);
  const [hasShownResults, setHasShownResults] = useState(false);

  // ============================================================================
  // QUERIES
  // ============================================================================

  const {
    data: fetchedGameConfig = null,
    isLoading: isConfigLoading,
    isError: isConfigError,
    isSuccess: isConfigSuccess,
    error: configError,
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
    gcTime: 1000 * 60 * 5,
  });

  const { data: lastEndedGame = null } = useQuery<LastEndedGame | null>({
    queryKey: ['game', 'last-ended'],
    queryFn: async () => {
      const { data } = await api.get<LastEndedResponse>('/learning-configurations/last-ended');
      return data?.hasEndedEdition ? data.configuration : null;
    },
    staleTime: QUERY_STALE_TIME,
    refetchInterval: LAST_ENDED_REFETCH_INTERVAL,
    refetchOnWindowFocus: false,
    retry: RETRY_ATTEMPTS,
    gcTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (fetchedGameConfig  ) {
           setGameConfig(fetchedGameConfig);
      
    }
  }, [fetchedGameConfig,   setGameConfig,   ]);

  useEffect(() => {
    if (fetchedGameConfig && !isGameConfigLoaded && isConfigSuccess && isMountedRef.current) {
      startTransition(() => {
        setGameConfig(fetchedGameConfig);
        setIsGameConfigLoaded(true);
      });
    }
  }, [fetchedGameConfig, isGameConfigLoaded, isConfigSuccess, setGameConfig, setIsGameConfigLoaded]);

  // ============================================================================
  // CLOCK TICKER
  // ============================================================================

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isMountedRef.current) {
        setCurrentTimestamp(Date.now());
      }
    }, TIME_UPDATE_INTERVAL);

    return () => {
      clearInterval(intervalId);
      isMountedRef.current = false;
    };
  }, []);

  // ============================================================================
  // CALCUL DES DATES
  // ============================================================================

  const { startDate, endDate, proclamationDate } = useMemo(() => ({
    startDate: fetchedGameConfig?.startgameDate ? new Date(fetchedGameConfig.startgameDate) : null,
    endDate: fetchedGameConfig?.endgameDate ? new Date(fetchedGameConfig.endgameDate) : null,
    proclamationDate: fetchedGameConfig?.proclamationDate ? new Date(fetchedGameConfig.proclamationDate) : null,
  }), [fetchedGameConfig]);

  // ============================================================================
  // CALCUL DES COMPTEURS
  // ============================================================================

  // Compte à rebours avant le début du jeu
  const countdownToStart = useMemo(() => {
    if (!startDate) return null;
    const startMs = startDate.getTime();
    const diff = startMs - currentTimestamp;
    return diff > 0 ? Math.floor(diff / 1000) : 0;
  }, [startDate, currentTimestamp]);

  // Compte à rebours pendant le jeu (temps restant)
  const countdownDuringGame = useMemo(() => {
    if (!endDate) return null;
    const endMs = endDate.getTime();
    const diff = endMs - currentTimestamp;
    return diff > 0 ? Math.floor(diff / 1000) : 0;
  }, [endDate, currentTimestamp]);

  // ============================================================================
  // ÉTATS DU JEU
  // ============================================================================

  const isGameActive = useMemo(() => {
    if (!fetchedGameConfig) return false;
    const startMs = startDate?.getTime() || 0;
    const endMs = endDate?.getTime() || 0;
    return (
      fetchedGameConfig.isActive === true &&
      fetchedGameConfig.status === 'active' &&
      startMs > 0 && endMs > 0 &&
      currentTimestamp >= startMs && currentTimestamp <= endMs
    );
  }, [fetchedGameConfig, startDate, endDate, currentTimestamp]);

  const isGameEnded = useMemo(() => {
    if (!fetchedGameConfig) return false;
    return fetchedGameConfig.status === 'ended' || (endDate && currentTimestamp > endDate.getTime());
  }, [fetchedGameConfig, endDate, currentTimestamp]);

  const isGameNotStarted = useMemo(() => {
    if (!fetchedGameConfig) return false;
    return fetchedGameConfig.status === 'pending' || (startDate && currentTimestamp < startDate.getTime());
  }, [fetchedGameConfig, startDate, currentTimestamp]);

  // Vérifier si les résultats sont disponibles (après proclamation)
  const areResultsAvailable = useMemo(() => {
    if (!proclamationDate) return false;
    return currentTimestamp >= proclamationDate.getTime();
  }, [proclamationDate, currentTimestamp]);

  // Vérifier si l'édition est complètement terminée
  const isCompletelyFinished = useMemo(() => {
    // Le jeu est complètement terminé si :
    // 1. Tous les matchs sont finis ET
    // 2. Les résultats sont disponibles (proclamation passée)
    // 3. OU le statut est 'ended' et nous avons un lastEndedGame
    if (isGameEnded && lastEndedGame) {
      return true;
    }
    if (areResultsAvailable && !isGameActive && isGameEnded) {
      return true;
    }
    return false;
  }, [isGameEnded, areResultsAvailable, isGameActive, lastEndedGame]);

  // ============================================================================
  // GESTION DES COMPTEURS
  // ============================================================================

  // Mettre à jour le compte à rebours en temps réel
  useEffect(() => {
    if (isGameNotStarted && countdownToStart !== null && countdownToStart > 0) {
      setGameCountdown(countdownToStart);
    } else if (isGameActive && countdownDuringGame !== null && countdownDuringGame > 0) {
      setGameCountdown(countdownDuringGame);
    } else if (isGameActive && countdownDuringGame === 0) {
      // Le jeu vient de se terminer
      setGameCountdown(0);
    } else {
      setGameCountdown(null);
    }
  }, [isGameNotStarted, isGameActive, countdownToStart, countdownDuringGame]);

  // ============================================================================
  // ÉTAT DU JEU
  // ============================================================================

  const gameState = useMemo((): GameState => {
    // Priorité 1: Résultats disponibles (après la fin du jeu)
    if (isCompletelyFinished && !hasShownResults) {
      setHasShownResults(true);
      return {
        status: 'results_available',
        countdown: 0,
        showGameFinishedBanner: true,
        canUserPlay: false,
      };
    }

    // Priorité 2: Jeu terminé mais pas encore de proclamation
    if (isGameEnded && !areResultsAvailable) {
      return {
        status: 'ended_no_proclamation',
        countdown: null,
        showGameFinishedBanner: false,
        canUserPlay: false,
      };
    }

    // Priorité 3: Jeu actif
    if (isGameActive) {
      return {
        status: 'active',
        countdown: countdownDuringGame,
        showGameFinishedBanner: false,
        canUserPlay: true,
      };
    }

    // Priorité 4: Jeu pas encore commencé
    if (isGameNotStarted) {
      return {
        status: 'not_started',
        countdown: countdownToStart,
        showGameFinishedBanner: false,
        canUserPlay: false,
      };
    }

    // Priorité 5: Pas de compétition
    return {
      status: 'no_competition',
      countdown: null,
      showGameFinishedBanner: false,
      canUserPlay: false,
    };
  }, [
    isCompletelyFinished,
    isGameEnded,
    isGameActive,
    isGameNotStarted,
    areResultsAvailable,
    countdownDuringGame,
    countdownToStart,
    hasShownResults,
  ]);

  // Réinitialiser hasShownResults quand un nouveau jeu commence
  useEffect(() => {
    if (isGameNotStarted || isGameActive) {
      setHasShownResults(false);
    }
  }, [isGameNotStarted, isGameActive]);

  // ============================================================================
  // ACTIONS
  // ============================================================================

  const completeGameCleanup = useCallback(() => {
    if (gameIsFinished) setGameIsFinished(false);
    if (afficheChoix) setAfficheChoix(false);
    if (afficheGame) setAfficheGame(false);
    if (resetGameState) resetGameState();
  }, [gameIsFinished, afficheChoix, afficheGame, setGameIsFinished, setAfficheChoix, setAfficheGame, resetGameState]);

  const demarrerJeu = useCallback(() => {
    if (hasRedirectedRef.current) return;
    const configId = fetchedGameConfig?._id || fetchedGameConfig?.id;
    const hasActiveCompetition = competitions.some(
      (competition: CompetitionInfo) => competition.idConfig === configId
    );

    hasRedirectedRef.current = true;

    startTransition(() => {
      if (!hasActiveCompetition) {
        setAfficheChoix(true);
      } else {
        setAfficheGame(true);
      }
    });
  }, [fetchedGameConfig, competitions, setAfficheChoix, setAfficheGame]);

  // Nettoyage automatique quand le jeu est complètement terminé
  useEffect(() => {
    if (isCompletelyFinished) {
      completeGameCleanup();
    }
  }, [isCompletelyFinished, completeGameCleanup]);

  // ============================================================================
  // RETOUR
  // ============================================================================

  return {
    // Actions
    demarrerJeu,
    completeGameCleanup,
    
    // Données
    gameConfig: fetchedGameConfig,
    startDate,
    endDate,
    lastEndedGame,
    
    // États
    gameState,
    viewState: {
      isEnded: isGameEnded,
      isActive: isGameActive,
      isNotStarted: isGameNotStarted,
      isEmpty: !fetchedGameConfig,
    },
    countdown: gameCountdown,
    showBandeauButton: gameState.canUserPlay && !afficheChoix && !afficheGame,
    
    // Chargement et erreurs
    isLoading: isConfigLoading || (!isGameConfigLoaded && !fetchedGameConfig),
    error: isConfigError ? configError : null,
  };
}