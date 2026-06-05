'use client';
import { useEndGameGenerator } from "@/hooks/learning/endgame/useEndGameGenerator";
import { useAdminConsultationsPageFinished } from "@/hooks/learning/home/useAdminConsultationsPageFinished";
import { formatDateFRJeu } from "@/lib/functions";
import { LOAD_MORE_INCREMENT } from "@/lib/learning/constantes";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { lazy, memo, useMemo } from 'react';
import { CompetitionDetails, FooterSection, HeaderSection, HelpButton, MessageToast, RestartButton } from './commons/Features';

const LaBanniere = lazy(() => import('@/components/learning/home/LaBanniere'));
const Historique = lazy(() => import('@/components/learning/historique/Historique'));
const ActiveBanner = lazy(() => import('@/components/learning/commons/Features').then(m => ({ default: m.ActiveBanner })));
const EndedBanner = lazy(() => import('@/components/learning/commons/Features').then(m => ({ default: m.EndedBanner })));
const NotStartedBanner = lazy(() => import('@/components/learning/commons/Features').then(m => ({ default: m.NotStartedBanner })));

const HeaderWithToast = memo(() => {
  const { validateMessage } = useEndGameGenerator();

  if (!validateMessage) { return <HeaderSection />; }

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
  const afficheBanana = useMonEtoileStore((state) => state.afficheBanana);
  const {
    demarrerJeu, handleOpenGame, startDate, gameConfig, viewState, lastEndedGame, endDate
  } = useAdminConsultationsPageFinished();

  const {
    handleValidateCompetition, handleRestart, handleLoadMore,
    hasCompetitions, isValidating, isSubmitting, competitionList, hasMore, remainingCount,
  } = useEndGameGenerator();

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

  return (
    <div className="w-full mx-auto max-w-md pb-20">
      <div className="flex flex-col items-center justify-center mb-8 space-y-4">
        <HeaderWithToast />
        {!hasCompetitions ? (
          <>
            {BannerComponent}
          </>) : (
          <>
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
            </div></>)}

        <div className="fixed-bottom-content w-full">
          <LaBanniere affichebanner={(afficheBanana || viewState.isActive) && !viewState.isNotStarted} />
          <Historique />
          <FooterSection />
          <HelpButton />
        </div>
      </div>
    </div>
  );
};

export default memo(ProfilPageLearning);