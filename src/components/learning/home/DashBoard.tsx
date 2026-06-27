'use client';
import Loader from "@/app/loading";
import { useAdminConsultationsPageFinished } from "@/hooks/learning/home/useAdminConsultationsPageFinished";
import { memo } from 'react';
import ErrorMessage from "../commons/ErrorMessage";
import GameFinishedBanner from "./GameFinishedBanner";
import NotStartedBanner from "./NotStartedBanner";
import ActiveBanner from "./dashboard/ActiveBanner";
import { EndedNoProclamationBanner } from "./dashboard/EndedNoProclamationBanner";
import NoCompetitionBanner from "./dashboard/NoCompetitionBanner";
import ResultsAvailableBanner from "./dashboard/ResultsAvailableBanner";

const DashBoard = () => {
    const {
        demarrerJeu,
        startDate,
        gameConfig,
        completeGameCleanup,
        lastEndedGame,
        endDate,
        isLoading,
        error,
        gameState,
        showBandeauButton,
        countdown,
    } = useAdminConsultationsPageFinished();

    if (isLoading) return <Loader />;
    if (error) return <ErrorMessage />;

    // Afficher les résultats disponibles en priorité
    if (gameState.status === 'results_available') {
        return (
            <ResultsAvailableBanner
                lastEndedGame={lastEndedGame}
                onGameCompletelyFinished={completeGameCleanup}
            />
        );
    }

    // Afficher la bannière de fin de jeu
    if (gameState.showGameFinishedBanner) {
        return <GameFinishedBanner />;
    }

    // Afficher les autres états selon le statut
    switch (gameState.status) {
        case 'ended_no_proclamation':
            return <EndedNoProclamationBanner lastEndedGame={lastEndedGame} />;

        case 'no_competition':
            return <NoCompetitionBanner />;

        case 'not_started':
            if (startDate) {
                return (
                    <NotStartedBanner 
                        startDate={startDate} 
                        onFinish={demarrerJeu} 
                        countdown={countdown}
                    />
                );
            }
            break;

        case 'active':
            if (gameConfig && endDate) {
                return (
                    <ActiveBanner
                        gameConfig={gameConfig}
                        demarrerJeu={demarrerJeu}
                        endDate={endDate}
                        showButton={showBandeauButton}
                        countdown={countdown}
                        onFinish={() => {}}
                    />
                );
            }
            break;
    }

    return <NoCompetitionBanner />;
};

export default memo(DashBoard);