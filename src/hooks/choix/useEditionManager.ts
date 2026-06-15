import { useState, useCallback, useEffect, useMemo } from 'react';
import { api } from '@/lib/api/client';
import { LastEndedGame } from '@/lib/interfaces';
import { useGameConfig } from '../profil/useGameConfig';

export function useEditionManager() {
    const { data: gameConfig, isLoading: configLoading } = useGameConfig();
    const [lastEndedGame, setLastEndedGame] = useState<LastEndedGame | null>(null);
    const [loadingLastEnded, setLoadingLastEnded] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [matchFinished, setMatchFinished] = useState(false);

    const startDate = useMemo(() =>
        gameConfig?.startgameDate ? new Date(gameConfig.startgameDate) : null,
        [gameConfig?.startgameDate]
    );

    const endDate = useMemo(() =>
        gameConfig?.endgameDate ? new Date(gameConfig.endgameDate) : null,
        [gameConfig?.endgameDate]
    );

    const now = useMemo(() => new Date(), []);

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

    const showEnded = isGameEnded || (!isGameActive && !isGameNotStarted && lastEndedGame !== null);
    const affichebanner = isGameActive && !isGameEnded && endDate && startDate;

    const fetchLastEndedGame = useCallback(async () => {
        setLoadingLastEnded(true);
        try {
            const response = await api.get('/game-configurations/last-ended');
            const data = response.data as { success: boolean; hasEndedEdition: boolean; configuration: LastEndedGame };
            setLastEndedGame(data?.hasEndedEdition ? data.configuration : null);
        } catch (error) {
            console.error('Erreur lors de la récupération du dernier jeu terminé:', error);
            setLastEndedGame(null);
        } finally {
            setLoadingLastEnded(false);
        }
    }, []);

    const handleEndMatch = useCallback(() => {
        if (!matchFinished) {
            setMatchFinished(true);
        }
        setRefreshTrigger(prev => prev + 1);
    }, [matchFinished]);

    useEffect(() => {
        fetchLastEndedGame();
    }, [fetchLastEndedGame]);

    useEffect(() => {
        if (refreshTrigger > 0) {
            fetchLastEndedGame();
        }
    }, [refreshTrigger, fetchLastEndedGame]);

    return {
        handleEndMatch, loadingLastEnded: configLoading || loadingLastEnded, gameConfig,
        startDate, endDate, lastEndedGame, isGameActive, isGameEnded, isGameNotStarted,
        showEnded, affichebanner,
    };
}