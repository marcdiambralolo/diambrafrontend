import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from 'react';

const GAME_ROUTES = {
    LEARNING: '/star/learning',
    ENDGAME: '/star/learning/endgame',
    GAME_BASE: '/star/learning/game',
} as const;

export const useGameGenerator = () => {
    const router = useRouter();
    const { completedMatches } = useMonEtoileStore();
    const currentYear = useMemo(() => new Date().getFullYear(), []);

    const handleBack = useCallback(() => {
        router.push(GAME_ROUTES.LEARNING);
    }, [router]);

    const handleClick = useCallback(() => {
        window.location.href = GAME_ROUTES.LEARNING;
    }, []);

    const navigateToGame = useCallback((gameId: string) => {
        router.push(`${GAME_ROUTES.GAME_BASE}/${gameId}`);
    }, [router]);

    const navigateToResults = useCallback(() => {
        router.push(GAME_ROUTES.ENDGAME);
    }, [router]);

      const displayMatches = useMemo(() =>
    completedMatches?.length ? completedMatches : [],
    [completedMatches]
  );

    return {
        handleBack,
        handleClick,
        currentYear,
        navigateToGame,
        navigateToResults,
        completedMatches,
        displayMatches
    };
};