'use client';
import { api } from '@/lib/api/client';
import { LastEndedGame, LastEndedResponse, LearningConfiguration } from '@/lib/interfaces';
import { useMonEtoileStore } from '@/lib/store/monetoile.store';
import { useQuery } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const TIME_UPDATE_INTERVAL = 1000;
const QUERY_STALE_TIME = 10 * 1000; // 10 secondes d'acceptation de cache obsolète
const RETRY_ATTEMPTS = 2;
const REFRESH_CONFIG_INTERVAL = 15 * 1000; // On vérifie la config fraîche toutes les 15s
const LAST_ENDED_REFETCH_INTERVAL = 5000;

interface ExtendedViewState {
  isEnded: boolean;
  isActive: boolean;
  isNotStarted: boolean;
  isEmpty: boolean;
}

interface ViewStateResult {
  viewState: ExtendedViewState;
  shouldShowBanana: boolean;
  shouldShowStat: boolean;
}

const selectSetGameConfig = (state: any) => state.setGameConfig;
const selectSetAfficheBanana = (state: any) => state.setAfficheBanana;
const selectSetAfficheStat = (state: any) => state.setAfficheStat;
const selectSetAfficheChoix = (state: any) => state.setAfficheChoix;

export function useAdminConsultationsPageFinished() {
  const router = useRouter();
  const hasRedirectedRef = useRef(false);

  const setGameConfig = useMonEtoileStore(selectSetGameConfig);
  const setAfficheBanana = useMonEtoileStore(selectSetAfficheBanana);
  const setAfficheStat = useMonEtoileStore(selectSetAfficheStat);
  const setAfficheChoix = useMonEtoileStore(selectSetAfficheChoix);
    const setAfficheGame = useMonEtoileStore((state) => state.setAfficheGame);
  // 💡 CORRECTION 1 : On récupère les compétitions de façon RÉACTIVE.
  // Dès que le tableau change dans le store, ce hook se ré-exécute.
  const competitions = useMonEtoileStore((state) => state.competitions || []);

  const [currentTimestamp, setCurrentTimestamp] = useState<number>(() => Date.now());

  const {
    data: gameConfig = null,
    isLoading: isConfigLoading,
    isError: isConfigError,
    refetch: refetchConfig
  } = useQuery<LearningConfiguration | null>({
    queryKey: ['game', 'config'],
    queryFn: async () => {
      const { data } = await api.get('learning-configurations/current-config');
      return data as LearningConfiguration;
    },
    staleTime: QUERY_STALE_TIME, 
    refetchInterval: REFRESH_CONFIG_INTERVAL, // Synchro automatique serveur active
    refetchOnWindowFocus: true, // Revalide si l'utilisateur change d'onglet et revient
    refetchOnMount: true,
  });

  useEffect(() => {
    if (gameConfig) {
      setGameConfig(gameConfig);
    }
  }, [gameConfig, setGameConfig]);

  const {
    data: lastEndedGame = null,
    refetch: refetchLastEnded
  } = useQuery<LastEndedGame | null>({
    queryKey: ['game', 'last-ended'],
    queryFn: async () => {
      const { data } = await api.get<LastEndedResponse>('/learning-configurations/last-ended');
      return data?.hasEndedEdition ? data.configuration : null;
    },
    staleTime: QUERY_STALE_TIME,
    refetchInterval: LAST_ENDED_REFETCH_INTERVAL,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTimestamp(Date.now()), TIME_UPDATE_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  const { startDate, endDate } = useMemo(() => ({
    startDate: gameConfig?.startgameDate ? new Date(gameConfig.startgameDate) : null,
    endDate: gameConfig?.endgameDate ? new Date(gameConfig.endgameDate) : null,
  }), [gameConfig?.startgameDate, gameConfig?.endgameDate]);

  const viewStateResult = useMemo((): ViewStateResult => {
    if (!gameConfig) {
      return {
        viewState: { isEnded: false, isActive: false, isNotStarted: false, isEmpty: true },
        shouldShowBanana: false,
        shouldShowStat: false
      };
    }

    const startMs = startDate?.getTime() || 0;
    const endMs = endDate?.getTime() || 0;

    const isGameActive = gameConfig.isActive === true &&
      gameConfig.status === 'active' &&
      startMs > 0 && endMs > 0 &&
      currentTimestamp >= startMs && currentTimestamp <= endMs;

    const isGameEnded = gameConfig.status === 'ended' || (endMs > 0 && currentTimestamp > endMs);
    const isGameNotStarted = gameConfig.status === 'pending' || (startMs > 0 && currentTimestamp < startMs);

    const showEnded = isGameEnded || (!isGameActive && !isGameNotStarted && !!lastEndedGame);
    const showActive = isGameActive && !isGameEnded;
    const showNotStarted = isGameNotStarted && !isGameActive && !isGameEnded;

    const viewState = {
      isEnded: showEnded,
      isActive: !showEnded && showActive,
      isNotStarted: !showEnded && !showActive && showNotStarted,
      isEmpty: false
    };

    return {
      viewState,
      shouldShowBanana: !viewState.isEnded && !viewState.isActive && !viewState.isNotStarted && !viewState.isEmpty,
      shouldShowStat: !viewState.isEmpty
    };
  }, [gameConfig, startDate, endDate, currentTimestamp, lastEndedGame]);

  useEffect(() => {
    setAfficheBanana(viewStateResult.shouldShowBanana);
  }, [viewStateResult.shouldShowBanana, setAfficheBanana]);

  useEffect(() => {
    setAfficheStat(viewStateResult.shouldShowStat);
  }, [viewStateResult.shouldShowStat, setAfficheStat]);

  const demarrerJeu = useCallback(() => {
    if (hasRedirectedRef.current) return;

    const configId = gameConfig?._id || gameConfig?.id;
    if (!configId) {
      router.push('/star/learning/choix');
      return;
    }

    // 💡 CORRECTION 2 : On utilise le tableau réactif issu du store
    const hasActiveCompetition = competitions.some(
      competition => competition.idConfig === configId
    );

    hasRedirectedRef.current = true;

    if (!hasActiveCompetition) {
      setAfficheChoix(true);
      return;
    }
setAfficheGame(true);
  // 💡 AJOUT : Dépendance sur 'competitions' assurée
  }, [gameConfig, competitions, setAfficheChoix, router]);

  return {
    viewState: viewStateResult.viewState,
    isLoading: isConfigLoading,
    error: isConfigError,
    demarrerJeu,
    startDate,
    gameConfig,
    lastEndedGame,
    endDate,
    refetchLastEnded,
    refetchConfig
  };
}