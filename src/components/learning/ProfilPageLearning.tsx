'use client';
import Loader from "@/app/loading";
import { useEndGameGenerator } from "@/hooks/learning/endgame/useEndGameGenerator";
import { useAdminConsultationsPageFinished } from "@/hooks/learning/lacompetition/useAdminConsultationsPageFinished";
import { formatDateFRJeu } from "@/lib/functions";
import { ValidationMessage } from "@/lib/learning/interface";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { CompetitionDetails, FooterSection, HeaderSection, HelpButton, MessageToast, RestartButton } from "./bannierecompetition/Banana";
import { ActiveBanner, EndedBanner, NotStartedBanner } from "./bannierecompetition/Features";
import TheGame from "./game/TheGame";
import HelpPanel from "./help/HelpPanel";
import Historique from "./historique/Historique";
import LaBanniere from "./labanniere/LaBanniere";
import LaMise from "./mise/LaMise";

// ============================================================================
// SOUS-COMPOSANT : Contenu de la compétition
// ============================================================================

const CompetitionContent = memo(() => {
  const {
    demarrerJeu,
    handleOpenGame,
    startDate,
    gameConfig,
    viewState,
    lastEndedGame,
    endDate,
  } = useAdminConsultationsPageFinished();

  return (
    <>
      {viewState.isEnded && <EndedBanner lastEndedGame={lastEndedGame} />}
      {viewState.isNotStarted && (
        <NotStartedBanner startDate={startDate!} handleOpenGame={handleOpenGame} />
      )}
      {viewState.isActive && (
        <ActiveBanner
          endDate={endDate!}
          startDate={startDate!}
          formatDate={formatDateFRJeu}
          gameConfig={gameConfig}
          demarrerJeu={demarrerJeu}
        />
      )}
    </>
  );
});

CompetitionContent.displayName = 'CompetitionContent';

// ============================================================================
// SOUS-COMPOSANT : Liste des compétitions terminées
// ============================================================================

const CompletedCompetitionsList = memo(() => {
  const {
    handleValidateCompetition,
    handleRestart,
    hasCompetitions,
    isValidating,
    isSubmitting,
    competitions,
  } = useEndGameGenerator();

  const competitionList = useMemo(() =>
    competitions.map((competition) => (
      <CompetitionDetails
        key={competition.id}
        competition={competition}
        onValidate={handleValidateCompetition}
      />
    )),
    [competitions, handleValidateCompetition]
  );

  if (!hasCompetitions) return null;

  return (
    <>
      <RestartButton onClick={handleRestart} disabled={isValidating || isSubmitting} />
      {competitionList}
    </>
  );
});

CompletedCompetitionsList.displayName = 'CompletedCompetitionsList';

// ============================================================================
// SOUS-COMPOSANT : Message global
// ============================================================================

const GlobalMessageToast = memo(() => {
  const { validateMessage } = useEndGameGenerator();
  const [globalMessage, setGlobalMessage] = useState<ValidationMessage | null>(null);

  useEffect(() => {
    setGlobalMessage(validateMessage);
  }, [validateMessage]);

  const handleClose = useCallback(() => setGlobalMessage(null), []);

  return <MessageToast message={globalMessage} onClose={handleClose} />;
});

GlobalMessageToast.displayName = 'GlobalMessageToast';

// ============================================================================
// SOUS-COMPOSANT : Vue aide
// ============================================================================

const HelpView = memo(() => {
  const afficherJeu = useMonEtoileStore((state) => state.afficherJeu);
  const handleCloseHelp = useCallback(() => afficherJeu(), [afficherJeu]);

  return <HelpPanel onClose={handleCloseHelp} />;
});

HelpView.displayName = 'HelpView';

// ============================================================================
// SOUS-COMPOSANT : Vue jeu
// ============================================================================

const GameView = memo(() => {
  const lejeu = useMonEtoileStore((state) => state.lejeu);
  const lamise = useMonEtoileStore((state) => state.lamise);

  if (lamise) return <LaMise />;
  if (lejeu) return <TheGame />;
  return null;
});

GameView.displayName = 'GameView';

// ============================================================================
// SOUS-COMPOSANT : Partie fixe (toujours visible)
// ============================================================================

const FixedContent = memo(() => (
  <>
    <LaBanniere />
    <Historique />
    <FooterSection />
    <HelpButton />
  </>
));

FixedContent.displayName = 'FixedContent';

// ============================================================================
// SOUS-COMPOSANT : En-tête et message
// ============================================================================

const HeaderWithToast = memo(() => (
  <>
    <GlobalMessageToast />
    <HeaderSection />
  </>
));

HeaderWithToast.displayName = 'HeaderWithToast';

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

const ProfilPageLearning = () => {
  const { loading } = useAdminConsultationsPageFinished();
  const afficheaide = useMonEtoileStore((state) => state.afficheaide);
  const jeuenattente = useMonEtoileStore((state) => state.jeuenattente);

  if (loading) return <Loader />;

  return (
    <div className="w-full mx-auto max-w-md">
      <div className="flex flex-col items-center justify-center mb-8">
        <HeaderWithToast />

        {afficheaide && <HelpView />}
        
        {!afficheaide && (
          <>
            <GameView />
            {jeuenattente && <CompetitionContent />}
            <CompletedCompetitionsList />
          </>
        )}

        <FixedContent />
      </div>
    </div>
  );
};

export default memo(ProfilPageLearning);