'use client';
import { useStatsDataWithCache } from '@/hooks/cache/useStatsDataWithCache';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGameConfig } from './useGame';

export const ITEMS_PER_PAGE = 10000;

export function useAdminConsultationsPageFinished() {
  const { stats } = useStatsDataWithCache();
  const { data: gameConfig } = useGameConfig();

  const [gameStarted, setGameStarted] = useState(false);
  const [matchFinished, setMatchFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEndingGame, setIsEndingGame] = useState(false);

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

  const hasNotStartedEdition = useMemo(() =>
    showNotStarted && startDate,
    [showNotStarted, startDate]
  );

  const handleEndMatch = useCallback(() => {
    if (!matchFinished && !isEndingGame) {
      setMatchFinished(true);
    }
  }, [matchFinished, isEndingGame,]);

  useEffect(() => {
    if (showActive && !gameStarted && !hasNotStartedEdition) {
      setGameStarted(true);
    }
  }, [showActive, gameStarted, hasNotStartedEdition]);

  return { handleEndMatch, error, stats, startDate, endDate, gameConfig, };
}