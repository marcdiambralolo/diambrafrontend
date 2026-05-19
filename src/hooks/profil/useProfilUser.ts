import { useGameConfig } from "@/hooks/game/useGame";
import { useMemo } from 'react';
import { useStatsDataWithCache } from "../cache/useStatsDataWithCache";

export function useProfilUser() {
  const { stats, isLoading: statsLoading } = useStatsDataWithCache();
  const { data: gameConfig, isLoading: configLoading } = useGameConfig();
  // Dates dynamiques depuis le backend
  const startDate = useMemo(() =>
    gameConfig?.startgameDate ? new Date(gameConfig.startgameDate) : null,
    [gameConfig?.startgameDate]
  );

  const endDate = useMemo(() =>
    gameConfig?.endgameDate ? new Date(gameConfig.endgameDate) : null,
    [gameConfig?.endgameDate]
  );

  const isGameActive = useMemo(() =>
    gameConfig?.isActive && gameConfig?.status === 'active',
    [gameConfig?.isActive, gameConfig?.status]
  );

  const isGameEnded = useMemo(() =>
    endDate && new Date() > endDate,
    [endDate]
  );

  const isGameNotStarted = useMemo(() =>
    startDate && new Date() < startDate,
    [startDate]
  );



  const formatDate = (date: Date) => date.toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  const formatDateTime = (date: Date) => date.toLocaleString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const getTimeRemaining = () => {
    if (!endDate) return null;
    const diff = endDate.getTime() - new Date().getTime();
    if (diff <= 0) return null;
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % 86400000) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % 3600000) / (1000 * 60))
    };
  };

  const timeRemaining = getTimeRemaining();
  const gameState = {
    notStarted: isGameNotStarted,
    active: isGameActive,
    ended: isGameEnded
  };
  
  return { loading: statsLoading, stats,
isGameActive,
isGameEnded,
isGameNotStarted,
timeRemaining,
formatDate,
formatDateTime,
startDate,
endDate,gameState,
 


   } as const;
}