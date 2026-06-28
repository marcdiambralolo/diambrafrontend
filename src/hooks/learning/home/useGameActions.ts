import { useDiambraStore } from '@/lib/store/diambra.store';
import { CompetitionInfo } from '@/lib/interfaces';
import { useCallback, useRef, useTransition } from 'react';

export function useGameActions(gameConfig: any) {
  const [, startTransition] = useTransition();
  const hasRedirectedRef = useRef(false);

  const {
    gameIsFinished, afficheChoix, afficheGame, competitions,
    setGameIsFinished, setAfficheChoix, setAfficheGame, resetGameState,
  } = useDiambraStore();

  const completeGameCleanup = useCallback(() => {
    if (gameIsFinished) setGameIsFinished(false);
    if (afficheChoix) setAfficheChoix(false);
    if (afficheGame) setAfficheGame(false);
    if (resetGameState) resetGameState();
  }, [gameIsFinished, afficheChoix, afficheGame, setGameIsFinished, setAfficheChoix, setAfficheGame, resetGameState]);

  const demarrerJeu = useCallback(() => {
    if (hasRedirectedRef.current) return;
    const configId = gameConfig?._id || gameConfig?.id;
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
  }, [gameConfig, competitions, setAfficheChoix, setAfficheGame]);

  return { completeGameCleanup, demarrerJeu };
}