'use client';
import { useDiambraStore } from '@/lib/store/diambra.store';
import { useGameActions } from './useGameActions';
import { useGameStatus } from './useGameStatus';
import { useGameTimers } from './useGameTimers';
import { useLastEndedGame } from './useLastEndedGame';

export function useAdminConsultationsPageFinished() {
  const { gameConfig } = useDiambraStore();

  const { lastEndedGame, isLoading: isLastEndedLoading } = useLastEndedGame();
  const { currentTimestamp, dates, countdowns } = useGameTimers(gameConfig);

  const { gameState } = useGameStatus({
    gameConfig,
    dates,
    countdowns,
    currentTimestamp,
    lastEndedGame,
  });

  const { completeGameCleanup, demarrerJeu } = useGameActions(gameConfig);

  const { afficheChoix, afficheGame } = useDiambraStore();

  const showBandeauButton = gameState.canUserPlay && !afficheChoix && !afficheGame;

  return {
    demarrerJeu, completeGameCleanup,
    startDate: dates.startDate, countdown: gameState.countdown,
    endDate: dates.endDate, isLoading: isLastEndedLoading,
    lastEndedGame, gameState, showBandeauButton,
  };
}