// hooks/profil/useProfilUser.ts
import { useMemo, useState, useEffect, useCallback } from 'react';
import { useStatsDataWithCache } from "../cache/useStatsDataWithCache";
import { api } from "@/lib/api/client";
import { GameConfiguration } from "@/lib/interfaces";

export type DateLike = Date | string | number | null | undefined;
export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

export function toSafeDate(value: DateLike, fallback?: Date): Date {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(value);
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return fallback ? new Date(fallback) : new Date();
}
export function formatDateFR(value: DateLike): string {
  const date = toSafeDate(value, new Date());
  if (!isValidDate(date)) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year}` + " à " + `${hour}:${minute}:${second}`;
}

// ============================================================================
// HOOK DE CONFIGURATION DU JEU (SANS REACT QUERY)
// ============================================================================

interface UseGameConfigReturn {
  data: GameConfiguration | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useGameConfig(): UseGameConfigReturn {
  const [data, setData] = useState<GameConfiguration | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchConfig = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('game-configurations/current-config');
      setData(response.data as GameConfiguration);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur lors du chargement de la configuration'));
      console.error('Erreur useGameConfig:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return { data, isLoading, error, refetch: fetchConfig };
}

// ============================================================================
// HOOK PRINCIPAL PROFIL UTILISATEUR
// ============================================================================

export function useProfilUser() {
  const { stats, isLoading: statsLoading } = useStatsDataWithCache();
  const { data: gameConfig, isLoading: configLoading, error: configError } = useGameConfig();
  
  const startDate = useMemo(() =>
    gameConfig?.startgameDate ? new Date(gameConfig.startgameDate) : null,
    [gameConfig?.startgameDate]
  );

  const endDate = useMemo(() =>
    gameConfig?.endgameDate ? new Date(gameConfig.endgameDate) : null,
    [gameConfig?.endgameDate]
  );

  const now = new Date();

  // Vérifier si l'édition est terminée (basé sur la date ET le statut)
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

  const formatDateTime = useCallback((date: Date) =>
    date.toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }), []
  );

  // Calcul du temps restant
  const getTimeRemaining = useCallback(() => {
    if (!endDate) return null;
    const diff = endDate.getTime() - new Date().getTime();
    if (diff <= 0) return null;
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % 86400000) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % 3600000) / (1000 * 60)),
      seconds: Math.floor((diff % 60000) / 1000)
    };
  }, [endDate]);

  const timeRemaining = getTimeRemaining();

  // État de chargement global
  const loading = statsLoading || configLoading;

  // Erreur éventuelle
  const error = configError;



  // État pour savoir si on vient de démarrer (évite redirection multiple)
  const [gameStarted, setGameStarted] = useState(false);
  const [matchFinished, setMatchFinished] = useState(false);
  // 🔥 Fonction appelée quand le chrono d'ouverture finit
  const handleOpenGame = () => {
    if (!gameStarted) {
      setGameStarted(true);
    }
  };

  const handleEndMatch = useCallback(() => {
    if (!matchFinished) {
      setMatchFinished(true);
    }
  }, [matchFinished]);

  const shouldShowEnded = isGameEnded || matchFinished;

  return {
    loading,
    stats,
    isGameActive,
    isGameEnded,
    isGameNotStarted,
    timeRemaining,
    formatDateTime,
    startDate,
    endDate,
    gameConfig,
    error,
    handleOpenGame,
    handleEndMatch,
    shouldShowEnded
  } as const;
}