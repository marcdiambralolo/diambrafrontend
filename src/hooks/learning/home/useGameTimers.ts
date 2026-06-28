import { useEffect, useMemo, useState } from 'react';

interface DateInfo {
  startDate: Date | null;
  endDate: Date | null;
}

interface CountdownInfo {
  countdownToStart: number | null;
  countdownDuringGame: number | null;
}

const TIME_UPDATE_INTERVAL = 1000;

export function useGameTimers(gameConfig: any) {
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(() => Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTimestamp(Date.now());
    }, TIME_UPDATE_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  const dates = useMemo((): DateInfo => ({
    startDate: gameConfig?.startgameDate ? new Date(gameConfig.startgameDate) : null,
    endDate: gameConfig?.endgameDate ? new Date(gameConfig.endgameDate) : null,
  }), [gameConfig]);

  const countdowns = useMemo((): CountdownInfo => {
    const countdownToStart = dates.startDate
      ? Math.max(0, Math.floor((dates.startDate.getTime() - currentTimestamp) / 1000))
      : null;

    const countdownDuringGame = dates.endDate
      ? Math.max(0, Math.floor((dates.endDate.getTime() - currentTimestamp) / 1000))
      : null;

    return { countdownToStart, countdownDuringGame };
  }, [dates, currentTimestamp]);

  return { currentTimestamp, dates, countdowns, };
}