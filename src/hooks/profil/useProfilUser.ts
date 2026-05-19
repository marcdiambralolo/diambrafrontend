// hooks/profil/useProfilUser.ts
import { useMemo, useState, useEffect, useCallback } from 'react';
import { useStatsDataWithCache } from "../cache/useStatsDataWithCache";
import { api } from "@/lib/api/client";
import { GameConfiguration } from "@/lib/interfaces";

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

  // Dérivation des dates
  const startDate = useMemo(() =>
    gameConfig?.startgameDate ? new Date(gameConfig.startgameDate) : null,
    [gameConfig?.startgameDate]
  );

  const endDate = useMemo(() =>
    gameConfig?.endgameDate ? new Date(gameConfig.endgameDate) : null,
    [gameConfig?.endgameDate]
  );

  // État actuel du jeu (recalculé à chaque changement)
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
    endDate !== null && now > endDate,
    [endDate, now]
  );

  const isGameNotStarted = useMemo(() =>
    startDate !== null && now < startDate,
    [startDate, now]
  );

  // Formatage des dates
  const formatDate = useCallback((date: Date) => 
    date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }), []
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

  return {
    loading,
    stats,
    isGameActive,
    isGameEnded,
    isGameNotStarted,
    timeRemaining,
    formatDate,
    formatDateTime,
    startDate,
    endDate,
    gameConfig,
    error,
  } as const;
}