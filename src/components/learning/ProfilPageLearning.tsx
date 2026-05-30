'use client';
import Loader from "@/app/loading";
import { useCategoryConsulterClient } from '@/hooks/learning/choix/useCategoryConsulterClient';
import { useAdminConsultationsPageFinished } from "@/hooks/learning/useAdminConsultationsPageFinished";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { memo, useCallback, useMemo } from 'react';
import { BannerSection, ErrorToast, FooterImage, HeaderSection, HelpButton } from "./bonchoix/Features";
import TheGame from "./game/TheGame";
import HelpPanel from "./help/HelpPanel";
import LaCompetion from "./lacompetition/LaCompetion";
import LaMise from "./mise/LaMise";

function ProfilPageLearningInner() {
  const {
    handleEndMatch, error, stats, startDate, endDate, gameConfig,
  } = useAdminConsultationsPageFinished();

  const {
    clearError, afficherAide, afficherJeu, afficheselection, loading, currentError, onlineStatus,
    randomImage, currentYear, affichebanner, afficheaide,
  } = useCategoryConsulterClient();

  const { jouer, gameStarted, jeuAcommencer } = useMonEtoileStore();

  const showHelp = useMemo(() => afficheaide, [afficheaide]);
  const showGameContent = useMemo(
    () => gameStarted && jouer && !showHelp,
    [gameStarted, jouer, showHelp]
  );

  const showSelection = useMemo(
    () => afficheselection && !gameStarted && !showHelp,
    [afficheselection, showHelp]
  );

  const handleCloseHelp = useCallback(() => afficherJeu(), [afficherJeu]);
  const handleClickHelp = useCallback(() => afficherAide(), [afficherAide]);
  const handleCloseError = useCallback(() => clearError(), [clearError]);

  if (loading) return <Loader />;

  return (
    <div className="w-full mx-auto max-w-2xl px-4 py-4">
      <HeaderSection />

      {error && (
        <ErrorToast message={currentError!} onClose={handleCloseError} />
      )}

      {showHelp && <HelpPanel onClose={handleCloseHelp} />}

      {jeuAcommencer ? (
        <>
          {showGameContent && <TheGame />}
          {showSelection && <LaMise />}
          <BannerSection
            affichebanner={affichebanner}
            endDate={endDate}
            handleEndMatch={handleEndMatch}
            startDate={startDate}
            gameConfig={gameConfig}
            stats={stats}
            loading={loading}
          />
        </>
      ) : (
        <LaCompetion />
      )}

      <FooterImage
        randomImage={randomImage}
        currentYear={currentYear}
        onlineStatus={onlineStatus}
      />
      {!showHelp && <HelpButton onClick={handleClickHelp} />}
    </div>
  );
}

export default memo(ProfilPageLearningInner);