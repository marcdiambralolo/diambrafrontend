import Loader from "@/app/loading";
import { useAdminConsultationsPageFinished } from "@/hooks/learning/home/useAdminConsultationsPageFinished";
import { memo } from 'react';
import ActiveBanner from "./ActiveBanner";
import NoCompetitionBanner from "./NoCompetitionBanner";
import NotStartedBanner from "./NotStartedBanner";

type GameStatus = 'results_available' | 'no_competition' | 'not_started' | 'ended_no_proclamation' | 'active';

interface DashboardContentProps {
  status: GameStatus;
  startDate: Date | null;
  endDate: Date | null;
  countdown: number | null;
  showBandeauButton: boolean;
  onDemarrerJeu: () => void;
  onCompleteGameCleanup: () => void;
}

const DashboardContent = memo(({
  status,
  startDate,
  endDate,
  countdown,
  showBandeauButton,
  onDemarrerJeu,
  onCompleteGameCleanup,
}: DashboardContentProps) => {
  switch (status) {
    case 'no_competition':
      return <NoCompetitionBanner />;

    case 'not_started':
      if (startDate) {
        return (
          <NotStartedBanner
            startDate={startDate}
            onFinish={onDemarrerJeu}
            countdown={countdown}
          />
        );
      }
      return <NoCompetitionBanner />;

    case 'active':
      if (endDate) {
        return (
          <ActiveBanner
            demarrerJeu={onDemarrerJeu}
            endDate={endDate}
            showButton={showBandeauButton}
            countdown={countdown}
            onFinish={onCompleteGameCleanup}
          />
        );
      }

      return <NoCompetitionBanner />;

    default:
      return <NoCompetitionBanner />;
  }
});

const Horloge = memo(() => {
  const {
    demarrerJeu, completeGameCleanup,
    startDate, endDate, isLoading, gameState, showBandeauButton, countdown,
  } = useAdminConsultationsPageFinished();

  if (isLoading) return <Loader />;

  return (
    <DashboardContent
      status={gameState.status}
      startDate={startDate}
      endDate={endDate}
      countdown={countdown}
      showBandeauButton={showBandeauButton}
      onDemarrerJeu={demarrerJeu}
      onCompleteGameCleanup={completeGameCleanup}
    />
  );
});

export default Horloge;