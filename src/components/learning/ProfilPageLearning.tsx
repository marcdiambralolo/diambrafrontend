'use client';
import Loader from '@/app/loading';
import { useEndGameGenerator } from "@/hooks/learning/endgame/useEndGameGenerator";
import { useAdminConsultationsPageFinished } from "@/hooks/learning/home/useAdminConsultationsPageFinished";
import { formatDateFRJeu } from "@/lib/functions";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { lazy, memo, useCallback, useMemo } from 'react';
import ErrorMessage from './commons/ErrorMessage';
import { ActiveBanner, EndedBanner, FooterSection, HeaderSection, HelpButton, MessageToast, NotStartedBanner } from './commons/Features';
import FeuilleDeMatch from "./home/FeuilleDematch";
import FixedContent from './home/FixedContent';
import LaBanniere from './home/LaBanniere';
import Historique from './historique/Historique';
 
const HeaderWithToast = memo(() => {
  const { validateMessage, clearValidateMessage } = useEndGameGenerator();

  const handleCloseToast = useCallback(() => {
    clearValidateMessage();
  }, [clearValidateMessage]);

  return (
    <>
      {validateMessage && (
        <MessageToast
          message={validateMessage}
          onClose={handleCloseToast}
        />
      )}
      <HeaderSection />
    </>
  );
});

const ProfilPageLearning = () => {
  const afficheBanana = useMonEtoileStore((state) => state.afficheBanana);
  const {
    demarrerJeu, handleOpenGame, startDate, gameConfig, viewState,
    lastEndedGame, endDate, isLoading, error,
  } = useAdminConsultationsPageFinished();

  const bannerProps = useMemo(() => ({
    endDate: endDate!,
    startDate: startDate!,
    formatDate: formatDateFRJeu,
    gameConfig,
    demarrerJeu,
    handleOpenGame,
    lastEndedGame
  }), [endDate, startDate, gameConfig, demarrerJeu, handleOpenGame, lastEndedGame]);

  const BannerComponent = useMemo(() => {
    if (viewState.isEnded) return <EndedBanner {...bannerProps} />;
    if (viewState.isNotStarted) return <NotStartedBanner {...bannerProps} />;
    if (viewState.isActive) return <ActiveBanner {...bannerProps} />;
    return null;
  }, [viewState.isEnded, viewState.isNotStarted, viewState.isActive, bannerProps]);

  const shouldShowBanner = useMemo(() =>
    (afficheBanana || viewState.isActive) && !viewState.isNotStarted,
    [afficheBanana, viewState.isActive, viewState.isNotStarted]
  );

  if (isLoading) { return (<Loader />); }

  if (error) {
    return (
      <div className="w-full mx-auto max-w-md pb-20 min-h-screen">
        <div className="flex flex-col items-center justify-center mb-8 space-y-4">
          <HeaderSection />
          <ErrorMessage
            type="error"
            title="Erreur de chargement"
            message="Impossible de charger les données du jeu"
            description={"Vérifiez votre connexion et réessayez"}
            onRetry={(() => window.location.reload())}
            onBack={() => window.history.back()}
            showHomeButton={true}
            showRetryButton={true}
            autoRetryCount={3}
            size="md"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto max-w-md pb-20 min-h-screen">
      <div className="flex flex-col items-center justify-center mb-8 space-y-4">
        <HeaderWithToast />
        {BannerComponent}
        <FeuilleDeMatch />
     
         <div className="fixed-bottom-content w-full space-y-4">
        <LaBanniere affichebanner={shouldShowBanner} />
        <Historique />

        <FooterSection />
        <HelpButton />
    </div>
      </div>
    </div>
  );
};

export const metadata = {
  title: 'Apprentissage | DIAMBRA',
  description: 'Plateforme d\'apprentissage interactive avec compétitions et récompenses',
  robots: 'index, follow',
};

export default memo(ProfilPageLearning);