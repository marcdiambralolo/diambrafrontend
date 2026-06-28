import { useMemo, useState } from 'react';
import { GameState } from '@/lib/interfaces';

interface UseGameStatusProps {
  gameConfig: any;
  dates: { startDate: Date | null; endDate: Date | null; };
  countdowns: { countdownToStart: number | null; countdownDuringGame: number | null };
  currentTimestamp: number;
  lastEndedGame: any;
}

export function useGameStatus({
  gameConfig,
  dates,
  countdowns,
  currentTimestamp,
  lastEndedGame,
}: UseGameStatusProps) {
  const [hasShownResults, setHasShownResults] = useState(false);

  const gameStatus = useMemo(() => {
    if (!gameConfig) return { isActive: false, isEnded: false, isNotStarted: false };

    const { startDate, endDate } = dates;
    const startMs = startDate?.getTime() || 0;
    const endMs = endDate?.getTime() || 0;

    const isActive = gameConfig.isActive === true &&
      gameConfig.status === 'active' &&
      startMs > 0 && endMs > 0 &&
      currentTimestamp >= startMs && currentTimestamp <= endMs;

    const isEnded = gameConfig.status === 'ended' || (endMs > 0 && currentTimestamp > endMs);
    const isNotStarted = gameConfig.status === 'pending' || (startMs > 0 && currentTimestamp < startMs);

    return { isActive, isEnded, isNotStarted };
  }, [gameConfig, dates, currentTimestamp]);

  const isCompletelyFinished = useMemo(() => {
    if (gameStatus.isEnded && lastEndedGame) return true;

    return false;
  }, [gameStatus.isEnded, gameStatus.isActive, lastEndedGame]);

  const gameState = useMemo((): GameState => {
    if (isCompletelyFinished && !hasShownResults) {
      setHasShownResults(true);
      return {
        status: 'results_available',
        countdown: 0,
        showGameFinishedBanner: true,
        canUserPlay: false,
      };
    }

    if (gameStatus.isActive) {
      return {
        status: 'active',
        countdown: countdowns.countdownDuringGame,
        showGameFinishedBanner: false,
        canUserPlay: true,
      };
    }

    if (gameStatus.isNotStarted) {
      return {
        status: 'not_started',
        countdown: countdowns.countdownToStart,
        showGameFinishedBanner: false,
        canUserPlay: false,
      };
    }

    return {
      status: 'no_competition',
      countdown: null,
      showGameFinishedBanner: false,
      canUserPlay: false,
    };
  }, [isCompletelyFinished, gameStatus, countdowns, hasShownResults]);

  const resetResultsFlag = () => setHasShownResults(false);

  return { gameStatus, gameState, isCompletelyFinished, resetResultsFlag, };
}