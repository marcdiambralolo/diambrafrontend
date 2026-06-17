'use client';
import { api } from '@/lib/api/client';
import { CompetitionInfo, LastEndedGame, LastEndedResponse, LearningConfiguration } from '@/lib/interfaces';
import { useDiambraStore } from '@/lib/store/diambra.store';
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';

const TIME_UPDATE_INTERVAL = 1000;
const QUERY_STALE_TIME = 10 * 1000;
const RETRY_ATTEMPTS = 2;
const REFRESH_CONFIG_INTERVAL = 15 * 1000;
const LAST_ENDED_REFETCH_INTERVAL = 5000;

interface ExtendedViewState {
    isEnded: boolean;
    isActive: boolean;
    isNotStarted: boolean;
    isEmpty: boolean;
}

interface ViewStateResult {
    viewState: ExtendedViewState;
    shouldShowBanana: boolean;
    shouldShowStat: boolean;
}

const selectors = {
    setGameConfig: (state: any) => state.setGameConfig,
    setAfficheBanana: (state: any) => state.setAfficheBanana,
    setAfficheStat: (state: any) => state.setAfficheStat,
    setAfficheChoix: (state: any) => state.setAfficheChoix,
    setAfficheGame: (state: any) => state.setAfficheGame,
    competitions: (state: any) => state.competitions || [],
    currentGameConfig: (state: any) => state.gameConfig,
    isGameConfigLoaded: (state: any) => state.isGameConfigLoaded,
    setIsGameConfigLoaded: (state: any) => state.setIsGameConfigLoaded,
} as const;

export function useAdminConsultationsPageFinished() {
    const [isPending, startTransition] = useTransition();

    const hasRedirectedRef = useRef(false);
    const initialLoadDoneRef = useRef(false);
    const isMountedRef = useRef(true);

    const setGameConfig = useDiambraStore(selectors.setGameConfig);
    const setAfficheBanana = useDiambraStore(selectors.setAfficheBanana);
    const setAfficheStat = useDiambraStore(selectors.setAfficheStat);
    const setAfficheChoix = useDiambraStore(selectors.setAfficheChoix);
    const setAfficheGame = useDiambraStore(selectors.setAfficheGame);
    const competitions = useDiambraStore(selectors.competitions);
    const storedGameConfig = useDiambraStore(selectors.currentGameConfig);
    const isGameConfigLoaded = useDiambraStore(selectors.isGameConfigLoaded);
    const setIsGameConfigLoaded = useDiambraStore(selectors.setIsGameConfigLoaded);

    const [currentTimestamp, setCurrentTimestamp] = useState<number>(() => Date.now());

    const {
        data: fetchedGameConfig = null,
        isLoading: isConfigLoading,
        isError: isConfigError,
        refetch: refetchConfig,
        isSuccess: isConfigSuccess,
        error: configError,
    } = useQuery<LearningConfiguration | null>({
        queryKey: ['game', 'config'],
        queryFn: async () => {
            const { data } = await api.get<LearningConfiguration>('learning-configurations/current-config');
            return data;
        },
        staleTime: QUERY_STALE_TIME,
        refetchInterval: REFRESH_CONFIG_INTERVAL,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        retry: RETRY_ATTEMPTS,
        gcTime: 1000 * 60 * 5, // 5 minutes de cache
    });

    const effectiveGameConfig = useMemo((): LearningConfiguration | null => {
        // if (storedGameConfig && isGameConfigLoaded) {
        //     const isGameEnded = storedGameConfig.status === 'ended';
        //     const hasProclamation = !!storedGameConfig.proclamationDate;
        //     const isProclamationPassed = hasProclamation &&
        //         new Date(storedGameConfig.proclamationDate!).getTime() <= Date.now();

        //     const isCompletelyFinished = isGameEnded && (!hasProclamation || isProclamationPassed);

        //     if (!isCompletelyFinished) {
        //         return storedGameConfig;
        //     }
        // }

        return fetchedGameConfig;
    }, [storedGameConfig, fetchedGameConfig, isGameConfigLoaded]);

    const {
        data: lastEndedGame = null,
        refetch: refetchLastEnded,
    } = useQuery<LastEndedGame | null>({
        queryKey: ['game', 'last-ended'],
        queryFn: async () => {
            const { data } = await api.get<LastEndedResponse>('/learning-configurations/last-ended');
            return data?.hasEndedEdition ? data.configuration : null;
        },
        staleTime: QUERY_STALE_TIME,
        refetchInterval: LAST_ENDED_REFETCH_INTERVAL,
        refetchOnWindowFocus: false,
        retry: RETRY_ATTEMPTS,
        gcTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (fetchedGameConfig && !isGameConfigLoaded && isConfigSuccess && isMountedRef.current) {
            startTransition(() => {
                setGameConfig(fetchedGameConfig);
                setIsGameConfigLoaded(true);
                initialLoadDoneRef.current = true;
            });
        }
    }, [fetchedGameConfig, isGameConfigLoaded, isConfigSuccess, setGameConfig, setIsGameConfigLoaded]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (isMountedRef.current) {
                setCurrentTimestamp(Date.now());
            }
        }, TIME_UPDATE_INTERVAL);

        return () => {
            clearInterval(intervalId);
            isMountedRef.current = false;
        };
    }, []);

    const { startDate, endDate } = useMemo(() => ({
        startDate: effectiveGameConfig?.startgameDate
            ? new Date(effectiveGameConfig.startgameDate)
            : null,
        endDate: effectiveGameConfig?.endgameDate
            ? new Date(effectiveGameConfig.endgameDate)
            : null,
    }), [effectiveGameConfig?.startgameDate, effectiveGameConfig?.endgameDate]);

    const viewStateResult = useMemo((): ViewStateResult => {
        if (!effectiveGameConfig) {
            return {
                viewState: { isEnded: false, isActive: false, isNotStarted: false, isEmpty: true },
                shouldShowBanana: false,
                shouldShowStat: false
            };
        }

        const startMs = startDate?.getTime() || 0;
        const endMs = endDate?.getTime() || 0;
        const now = currentTimestamp;

        const isGameActive = effectiveGameConfig.isActive === true &&
            effectiveGameConfig.status === 'active' &&
            startMs > 0 && endMs > 0 &&
            now >= startMs && now <= endMs;

        const isGameEnded = effectiveGameConfig.status === 'ended' ||
            (endMs > 0 && now > endMs);

        const isGameNotStarted = effectiveGameConfig.status === 'pending' ||
            (startMs > 0 && now < startMs);

        const showEnded = isGameEnded || (!isGameActive && !isGameNotStarted && !!lastEndedGame);
        const showActive = isGameActive && !isGameEnded;
        const showNotStarted = isGameNotStarted && !isGameActive && !isGameEnded;

        const viewState = {
            isEnded: showEnded,
            isActive: !showEnded && showActive,
            isNotStarted: !showEnded && !showActive && showNotStarted,
            isEmpty: false
        };

        return {
            viewState,
            shouldShowBanana: !viewState.isEnded && !viewState.isActive &&
                !viewState.isNotStarted && !viewState.isEmpty,
            shouldShowStat: !viewState.isEmpty
        };
    }, [effectiveGameConfig, startDate, endDate, currentTimestamp, lastEndedGame]);

    useEffect(() => {
        startTransition(() => {
            setAfficheBanana(viewStateResult.shouldShowBanana);
        });
    }, [viewStateResult.shouldShowBanana, setAfficheBanana]);

    useEffect(() => {
        startTransition(() => {
            setAfficheStat(viewStateResult.shouldShowStat);
        });
    }, [viewStateResult.shouldShowStat, setAfficheStat]);

    const demarrerJeu = useCallback(() => {
        if (hasRedirectedRef.current || isPending) return;
        const configId = effectiveGameConfig?._id || effectiveGameConfig?.id;
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
    }, [effectiveGameConfig, competitions, setAfficheChoix, setAfficheGame, isPending]);

    return {
        demarrerJeu, startDate, gameConfig: effectiveGameConfig, viewState: viewStateResult.viewState,
        lastEndedGame, endDate, isLoading: isConfigLoading || (!isGameConfigLoaded && !fetchedGameConfig),
        error: isConfigError ? configError : null,
    };
}