'use client';
import Loader from "@/app/loading";
import { useAdminConsultationsPageFinished } from "@/hooks/learning/home/useAdminConsultationsPageFinished";
import { useDiambraStore } from "@/lib/store/diambra.store";
import { Award, History } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import CacheLink from "../../commons/CacheLink";
import ErrorMessage from "../commons/ErrorMessage";
import ActiveBanner from "./ActiveBanner";
import GameFinishedBanner from "./GameFinishedBanner";
import NoCompetitionBanner from "./NoCompetitionBanner";
import NotStartedBanner from "./NotStartedBanner";
import ResultsAvailableBanner from "./ResultsAvailableBanner";
import ResultsWaitingBanner from "./ResultsWaitingBanner";

interface GameCompletionState {
    isCompletelyFinished: boolean;
    isWaitingForProclamation: boolean;
    isProclamationPassed: boolean;
}

interface GameState {
    status: 'no_competition' | 'not_started' | 'active' | 'waiting_proclamation' | 'results_available' | 'ended_no_proclamation';
    canUserPlay: boolean;
    showGameFinishedBanner: boolean;
}

const useGameCompletionLogic = () => {
    const gameIsFinished = useDiambraStore((state: any) => state.gameIsFinished);
    const afficheStat = useDiambraStore((state: any) => state.afficheStat);
    const afficheBanana = useDiambraStore((state: any) => state.afficheBanana);
    const afficheChoix = useDiambraStore((state: any) => state.afficheChoix);
    const afficheGame = useDiambraStore((state: any) => state.afficheGame);
    const setGameIsFinished = useDiambraStore((state: any) => state.setGameIsFinished);
    const setAfficheChoix = useDiambraStore((state: any) => state.setAfficheChoix);
    const setAfficheGame = useDiambraStore((state: any) => state.setAfficheGame);
    const resetGameState = useDiambraStore((state: any) => state.resetGameState);

    const isEditionEnCours = afficheChoix || afficheGame;

    const completeGameCleanup = useCallback(() => {
        if (gameIsFinished) setGameIsFinished(false);
        if (afficheChoix) setAfficheChoix(false);
        if (afficheGame) setAfficheGame(false);
        if (resetGameState) resetGameState();
    }, [gameIsFinished, afficheChoix, afficheGame, setGameIsFinished, setAfficheChoix, setAfficheGame, resetGameState]);

    const getGameCompletionState = useCallback((
        proclamationDate: Date | null,
        endDate: Date | null
    ): GameCompletionState => {
        const now = Date.now();
        const hasProclamation = proclamationDate !== null;
        const proclamationMs = proclamationDate?.getTime() || 0;
        const endDateMs = endDate?.getTime() || 0;
        const hasEndDatePassed = endDateMs > 0 && now >= endDateMs;

        const isProclamationPassed = hasProclamation && now >= proclamationMs;
        const isWaitingForProclamation = hasProclamation && now < proclamationMs && hasEndDatePassed;
        const isCompletelyFinished = isProclamationPassed;

        return { isCompletelyFinished, isWaitingForProclamation, isProclamationPassed };
    }, []);

    const getGameState = useCallback((
        completionState: GameCompletionState,
        viewState: any,
        hasGameConfig: boolean
    ): GameState => {
        if (completionState.isProclamationPassed) {
            return { status: 'results_available', canUserPlay: false, showGameFinishedBanner: false };
        }

        if (completionState.isWaitingForProclamation) {
            return { status: 'waiting_proclamation', canUserPlay: false, showGameFinishedBanner: false };
        }

        if (viewState.isEnded && !hasGameConfig) {
            return { status: 'ended_no_proclamation', canUserPlay: false, showGameFinishedBanner: false };
        }

        const shouldShowGameFinished = gameIsFinished && !isEditionEnCours && !afficheStat && !afficheBanana;

        if (shouldShowGameFinished) {
            return { status: 'active', canUserPlay: false, showGameFinishedBanner: true };
        }

        if (viewState.isEmpty) {
            return { status: 'no_competition', canUserPlay: false, showGameFinishedBanner: false };
        }

        if (viewState.isNotStarted) {
            return { status: 'not_started', canUserPlay: false, showGameFinishedBanner: false };
        }

        if (viewState.isActive && !completionState.isWaitingForProclamation) {
            return { status: 'active', canUserPlay: !isEditionEnCours, showGameFinishedBanner: false };
        }

        return { status: 'no_competition', canUserPlay: false, showGameFinishedBanner: false };
    }, [gameIsFinished, isEditionEnCours, afficheStat, afficheBanana]);

    return { completeGameCleanup, getGameCompletionState, getGameState, isEditionEnCours };
};

const DashBoard = memo(() => {
    const afficheChoix = useDiambraStore((state: any) => state.afficheChoix);
    const afficheGame = useDiambraStore((state: any) => state.afficheGame);
    const [hasCleanedUp, setHasCleanedUp] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const { completeGameCleanup, getGameCompletionState, getGameState, isEditionEnCours } = useGameCompletionLogic();

    const {
        demarrerJeu, startDate, gameConfig, viewState, lastEndedGame, endDate, isLoading, error,
    } = useAdminConsultationsPageFinished();

    const proclamationDate = useMemo(
        () => gameConfig?.proclamationDate ? new Date(gameConfig.proclamationDate) : null,
        [gameConfig?.proclamationDate]
    );

    const completionState = useMemo(
        () => getGameCompletionState(proclamationDate, endDate || null),
        [proclamationDate, endDate, getGameCompletionState]
    );

    useEffect(() => {
        if (completionState.isCompletelyFinished && !hasCleanedUp) {
            setHasCleanedUp(true);
            completeGameCleanup();
        }
    }, [completionState.isCompletelyFinished, completeGameCleanup, hasCleanedUp]);

    useEffect(() => {
        if (!isLoading && isInitialLoad) {
            setIsInitialLoad(false);
        }
    }, [isLoading, isInitialLoad]);

    const gameState = useMemo(
        () => getGameState(completionState, viewState, !!gameConfig),
        [completionState, viewState, gameConfig, getGameState]
    );

    const showBandeauButton = !afficheChoix && !afficheGame && gameState.canUserPlay;

    if (isLoading) return <Loader />;
    if (error) return <ErrorMessage />;

    switch (gameState.status) {
        case 'results_available':
            return (
                <ResultsAvailableBanner
                    lastEndedGame={lastEndedGame}
                    onGameCompletelyFinished={completeGameCleanup}
                />
            );

        case 'waiting_proclamation':
            if (proclamationDate) {
                return (
                    <ResultsWaitingBanner
                        proclamationDate={proclamationDate}
                        onFinish={() => { }}
                    />
                );
            }
            break;

        case 'ended_no_proclamation':
            const endGameDate = lastEndedGame
                ? new Date(lastEndedGame.endgameDate).toLocaleDateString('fr-FR')
                : null;
            return (
                <div className="rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 p-5 mb-6 shadow-xl">
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-yellow-500/20 p-2">
                                <Award className="w-6 h-6 text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-white font-bold">Édition terminée</p>
                                <p className="text-gray-300 text-xs">
                                    {lastEndedGame ? `Terminée le ${endGameDate}` : 'Merci pour votre participation'}
                                </p>
                            </div>
                        </div>
                        <CacheLink
                            href="/star/learning/historique/1779760200000"
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            <History className="w-4 h-4" />
                            <span>Historique</span>
                        </CacheLink>
                    </div>
                </div>
            );

        case 'no_competition':
            return <NoCompetitionBanner />;

        case 'not_started':
            if (startDate) {
                return <NotStartedBanner startDate={startDate} onFinish={demarrerJeu} />;
            }
            break;

        case 'active':
            if (gameState.showGameFinishedBanner) {
                return <GameFinishedBanner />;
            }
            if (viewState.isActive && gameConfig && endDate) {
                return (
                    <ActiveBanner
                        gameConfig={gameConfig}
                        demarrerJeu={demarrerJeu}
                        endDate={endDate}
                        showButton={showBandeauButton}
                        onFinish={() => { }}
                    />
                );
            }
            break;
    }

    return <NoCompetitionBanner />;
});

DashBoard.displayName = 'DashBoard';

export default DashBoard;