'use client';
import Loader from "@/app/loading";
import { useAdminConsultationsPageFinished } from "@/hooks/learning/home/useAdminConsultationsPageFinished";
import { memo, useMemo } from 'react';
import { FooterSection } from "../commons/Features";
import Historique from "../historique/Historique";
import ActiveBanner from "./dashboard/ActiveBanner";
import NoCompetitionBanner from "./dashboard/NoCompetitionBanner";
import NotStartedBanner from "./dashboard/NotStartedBanner";
import ResultsAvailableBanner from "./dashboard/ResultsAvailableBanner";
import { HelpButton } from "./fixedcontent/HelpButton";
import { StatsSection } from "./fixedcontent/StatsSection";
import FeuilleDeMatch from "./matchsheet/FeuilleDeMatch";

const LearningFixed = memo(() => {
  const {
    demarrerJeu, completeGameCleanup, startDate,
    endDate, isLoading, gameState, showBandeauButton, countdown,
  } = useAdminConsultationsPageFinished();

  const renderContent = useMemo(() => {
    switch (gameState.status) {
      case 'results_available':
        return (
          <ResultsAvailableBanner
            onGameCompletelyFinished={completeGameCleanup}
          />
        );

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
        return <NoCompetitionBanner />;

      case 'active':
        if (endDate) {
          return (
            <ActiveBanner
              demarrerJeu={demarrerJeu}
              endDate={endDate}
              showButton={showBandeauButton}
              countdown={countdown}
              onFinish={() => { }}
            />
          );
        }
        return <NoCompetitionBanner />;

      default:
        return <NoCompetitionBanner />;
    }
  }, [
    gameState.status,
    startDate,
    endDate,
    demarrerJeu,
    completeGameCleanup,
    showBandeauButton,
    countdown,
  ]);

  if (isLoading) return <Loader />;

  return (
    <footer className="fixed-bottom-content w-full mx-auto max-w-md space-y-4">
      {renderContent}
      <FeuilleDeMatch />
      <StatsSection />
      <Historique />
      <FooterSection />
      <HelpButton />
    </footer>
  );
});

export default LearningFixed;