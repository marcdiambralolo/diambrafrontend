'use client';
import Loader from "@/app/loading";
import { useCategoryConsulterClient } from '@/hooks/learning/choix/useCategoryConsulterClient';
import { useAdminConsultationsPageFinished } from "@/hooks/learning/useAdminConsultationsPageFinished";
import { BannersSection, EditionCard, ParticipationsSection, TitleSection, WinnersSection } from "./Features";
import { BannerSection, ErrorToast, FooterImage, HeaderSection, HelpButton, OfferSelection } from "./bonchoix/Features";
import TheGame from "./game/TheGame";
import HelpPanel from "./help/HelpPanel";

export default function ProfilPageLearning() {
  const {
    handleOpenGame, handleEndMatch, demarrerJeu, jeuAcommencer,
    stats, startDate, endDate, gameConfig, lastEndedGame, winningCombination, gameStarted,
    showEnded, consultations, activeEdition, winners, error, hasNotStartedEdition, hasWinners,
  } = useAdminConsultationsPageFinished();

  const {
    handleGoToMarket, handleNext, clearError, afficherAide, afficherJeu, afficheselection, gamehasStarted, loading,
    onlineStatus, randomImage, currentYear, affichebanner, jouer, afficheaide,
    currentError, availableQuantity, cardClasses, isSufficient, requiredQuantity,
  } = useCategoryConsulterClient();

  const showHelp = afficheaide;
  const showGameContent = gamehasStarted && jouer && !showHelp;
  const showSelection = afficheselection && !showHelp;

  if (loading) return <Loader />;

  return (
    <div className="w-full mx-auto max-w-2xl px-4 py-4">
      <HeaderSection />

      {error && <ErrorToast message={currentError!} onClose={clearError} />}
      {showHelp && <HelpPanel onClose={afficherJeu} />}

      {jeuAcommencer ? (
        <>
          {showGameContent && (<TheGame />)}

          {showSelection && (
            <OfferSelection
              isSufficient={isSufficient}
              requiredQuantity={requiredQuantity}
              availableQuantity={availableQuantity}
              cardClasses={cardClasses}
              onNext={handleNext}
              onGoToMarket={handleGoToMarket}
            />
          )}

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
        <>
          <BannersSection
            showNotStarted={hasNotStartedEdition as boolean}
            showActive={gameStarted}
            showEnded={showEnded}
            startDate={startDate}
            endDate={endDate}
            gameConfig={gameConfig}
            lastEndedGame={lastEndedGame}
            stats={stats}
            onOpenGame={handleOpenGame}
            onEndMatch={handleEndMatch}
            demarrerJeu={demarrerJeu}
          />

          {activeEdition && <EditionCard activeEdition={activeEdition} />}

          <TitleSection showEnded={showEnded} />

          <WinnersSection
            hasWinners={hasWinners!}
            winningCombination={winningCombination}
            winners={winners}
            consultations={consultations}
          />

          <ParticipationsSection
            consultations={consultations}
            activeEditionId={activeEdition?.id}
          />
        </>
      )}

      <FooterImage
        randomImage={randomImage}
        currentYear={currentYear}
        onlineStatus={onlineStatus}
      />

      {!showHelp && <HelpButton onClick={afficherAide} />}
    </div>
  );
}