'use client';
import Loader from "@/app/loading";
import { useEndGameGenerator } from "@/hooks/learning/endgame/useEndGameGenerator";
import { useAdminConsultationsPageFinished } from "@/hooks/learning/lacompetition/useAdminConsultationsPageFinished";
import { formatDateFRJeu } from "@/lib/functions";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { lazy, memo, startTransition, useCallback, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { CompetitionDetails, FooterSection, HeaderSection, HelpButton, MessageToast, RestartButton } from './commons/Features';

const INITIAL_VISIBLE_COUNT = 5;
const LOAD_MORE_INCREMENT = 10;

const LaBanniere = lazy(() => import('@/components/learning/labanniere/LaBanniere'));
const Historique = lazy(() => import('@/components/learning/historique/Historique'));
const HelpPanel = lazy(() => import('@/components/learning/help/HelpPanel'));
const ActiveBanner = lazy(() => import('@/components/learning/commons/Features').then(m => ({ default: m.ActiveBanner })));
const EndedBanner = lazy(() => import('@/components/learning/commons/Features').then(m => ({ default: m.EndedBanner })));
const NotStartedBanner = lazy(() => import('@/components/learning/commons/Features').then(m => ({ default: m.NotStartedBanner })));

const useStoreSelectors = () => {
  return useMonEtoileStore(
    useShallow((state) => ({
      afficheaide: state.afficheaide,
      afficherJeu: state.afficherJeu,
      setAfficheAide: state.setAfficheaide,
    }))
  );
};

const CompetitionContent = memo(() => {
  const {
    demarrerJeu, handleOpenGame,
    startDate, gameConfig, viewState, lastEndedGame, endDate
  } = useAdminConsultationsPageFinished();

  const {
    handleValidateCompetition, handleRestart,
    hasCompetitions, isValidating, isSubmitting, competitions,
  } = useEndGameGenerator();

  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const handleLoadMore = useCallback(() => {
    startTransition(() => {
      setVisibleCount(prev => Math.min(prev + LOAD_MORE_INCREMENT, competitions.length));
    });
  }, [competitions.length]);

  const competitionList = useMemo(() => {
    if (!hasCompetitions) return null;
    return competitions.slice(0, visibleCount);
  }, [competitions, visibleCount, hasCompetitions]);

  const hasMore = visibleCount < competitions.length;
  const remainingCount = competitions.length - visibleCount;

  const BannerComponent = useMemo(() => {
    const bannerProps = {
      endDate: endDate!,
      startDate: startDate!,
      formatDate: formatDateFRJeu,
      gameConfig,
      demarrerJeu,
      handleOpenGame,
      lastEndedGame
    };

    if (viewState.isEnded) return <EndedBanner {...bannerProps} />;
    if (viewState.isNotStarted) return <NotStartedBanner {...bannerProps} />;
    if (viewState.isActive) return <ActiveBanner {...bannerProps} />;
    return null;
  }, [viewState, endDate, startDate, gameConfig, demarrerJeu, handleOpenGame, lastEndedGame]);

  if (!hasCompetitions) {
    return BannerComponent;
  }

  return (
    <div className="space-y-3 animate-in fade-in duration-300">
      <RestartButton
        onClick={handleRestart}
        disabled={isValidating || isSubmitting}
      />

      <div className="competition-list space-y-2">
        {competitionList?.map((competition, index) => (
          <div
            key={competition.id}
            style={{ animationDelay: `${index * 50}ms` }}
            className="animate-in slide-in-from-bottom-4 fade-in duration-300"
          >
            <CompetitionDetails
              competition={competition}
              onValidate={handleValidateCompetition}
            />
          </div>
        ))}
      </div>
      {hasMore && (
        <button
          onClick={handleLoadMore}
          className="w-full py-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`Charger ${Math.min(LOAD_MORE_INCREMENT, remainingCount)} compétitions supplémentaires`}
        >
          Voir plus ({remainingCount} restantes)
        </button>
      )}
    </div>
  );
});

const HelpView = memo(() => {
  const { afficherJeu, setAfficheAide } = useStoreSelectors();

  const handleCloseHelp = useCallback(() => {
    setAfficheAide(false);
    afficherJeu();
  }, [afficherJeu, setAfficheAide]);

  return (
    <div className="animate-in slide-in-from-right duration-300">
      <HelpPanel onClose={handleCloseHelp} />
    </div>
  );
});

const FixedContent = memo(() => {
  const { setAfficheAide } = useStoreSelectors();

  const handleHelpClick = useCallback(() => {
    setAfficheAide(true);
  }, [setAfficheAide]);

  return (
    <div className="fixed-bottom-content w-full">
      <LaBanniere />
      <Historique />
      <FooterSection />
      <HelpButton onClick={handleHelpClick} />
    </div>
  );
});

const HeaderWithToast = memo(() => {
  const { validateMessage } = useEndGameGenerator();

  if (!validateMessage) {
    return <HeaderSection />;
  }

  return (
    <>
      <MessageToast
        message={validateMessage}
        onClose={() => { }}
      />
      <HeaderSection />
    </>
  );
});

const ProfilPageLearning = () => {
  const { loading } = useAdminConsultationsPageFinished();
  const { afficheaide } = useStoreSelectors();

  if (loading) { return <Loader />; }

  return (
    <div className="w-full mx-auto max-w-md pb-20">
      <div className="flex flex-col items-center justify-center mb-8 space-y-4">
        <HeaderWithToast />
        {afficheaide ? <HelpView /> : <CompetitionContent />}
        <FixedContent />
      </div>
    </div>
  );
};

export default memo(ProfilPageLearning);