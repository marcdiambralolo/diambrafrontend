'use client';
import Loader from "@/app/loading";
import { useCategoryConsulterClient } from '@/hooks/learning/choix/useCategoryConsulterClient';
import { useAdminConsultationsPageFinished } from "@/hooks/learning/useAdminConsultationsPageFinished";
import { useGameGenerator } from '@/hooks/learning/useGameGenerator';
import { BannersSection, EditionCard, ParticipationsSection, TitleSection, WinnersSection } from "./Features";
import { BannerSection, ErrorToast, FooterImage, GamePlayView, HeaderSection, HelpButton, OfferSelection } from "./bonchoix/Features";
import ResultatsPage from "./endgame/ResultatsPage";
import HelpPanel from "./help/HelpPanel";

export default function ProfilPageLearning() {
  const {
    handleOpenGame, handleEndMatch, demarrerJeu, jeuAcommencer,
    stats, startDate, endDate, gameConfig, lastEndedGame, winningCombination, gameStarted,
    showEnded, consultations, activeEdition, winners, error, hasNotStartedEdition, hasWinners,
  } = useAdminConsultationsPageFinished();

  const {
    handleGoToMarket, handleNext, clearError, afficherAide, afficherJeu,
    onlineStatus, randomImage, currentYear, affichebanner, jouer, afficheaide,
    currentError, availableQuantity, tpsglobal, niveau, cardClasses,
    isSufficient, requiredQuantity, afficheselection, gamehasStarted, loading,
  } = useCategoryConsulterClient();

  const {
    toggleShowPun, lockSelectedCase, selectCase, showPun, timeElapsed, matchEnCours, infomatch,
    jeuestfinie, casesdujeuencours, casesinitiales, pieces, selectedCase,
  } = useGameGenerator();

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
          {showGameContent && (
            jeuestfinie ? <ResultatsPage /> : (
              <GamePlayView
                cases={casesdujeuencours}
                casesun={casesinitiales}
                pieces={pieces}
                selectedCase={selectedCase}
                selectCase={selectCase}
                showPun={showPun}
                toggleShowPun={toggleShowPun}
                lockSelectedCase={lockSelectedCase}
                timeElapsed={timeElapsed}
                niveau={niveau}
                matchEncours={matchEnCours}
                infomatch={infomatch}
                tpsglobal={tpsglobal}
              />
            )
          )}

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