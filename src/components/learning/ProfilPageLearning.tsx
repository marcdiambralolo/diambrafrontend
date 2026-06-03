'use client';

import dynamic from 'next/dynamic';
import { Suspense, lazy, memo, useCallback, useMemo, useState, useTransition, useDeferredValue, startTransition, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

// Optimisation des imports avec prefetch
import Loader from "@/app/loading";
import { useEndGameGenerator } from "@/hooks/learning/endgame/useEndGameGenerator";
import { useAdminConsultationsPageFinished } from "@/hooks/learning/lacompetition/useAdminConsultationsPageFinished";
import { formatDateFRJeu } from "@/lib/functions";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";

// Composants critiques préchargés
import { CompetitionDetails, FooterSection, HeaderSection, HelpButton, MessageToast, RestartButton } from './commons/Features';

// ============================================================================
// SQUELETTES OPTIMISÉS (définis avant utilisation)
// ============================================================================

const LoaderSkeleton = memo(() => (
  <div className="animate-pulse bg-gray-200 rounded-lg h-64 w-full will-change-transform" />
));

LoaderSkeleton.displayName = 'LoaderSkeleton';

const CompactSkeleton = memo(() => (
  <div className="space-y-2">
    <div className="animate-pulse bg-gray-200 rounded-lg h-12 w-full" />
    <div className="animate-pulse bg-gray-200 rounded-lg h-32 w-full" />
  </div>
));

CompactSkeleton.displayName = 'CompactSkeleton';

// ============================================================================
// DYNAMIC IMPORTS CORRIGÉS (options en inline)
// ============================================================================

const TheGame = dynamic(
  () => import('@/components/learning/game/TheGame'), 
  {
    loading: () => <LoaderSkeleton />,
    ssr: false,
  }
);

const LaMise = dynamic(
  () => import('@/components/learning/mise/LaMise'), 
  {
    loading: () => <LoaderSkeleton />,
    ssr: false,
  }
);

// Lazy loading pour les composants moins critiques
const LaBanniere = lazy(() => import('@/components/learning/labanniere/LaBanniere'));
const Historique = lazy(() => import('@/components/learning/historique/Historique'));
const HelpPanel = lazy(() => import('@/components/learning/help/HelpPanel'));

// Bannières avec lazy loading
const ActiveBanner = lazy(() => import('@/components/learning/commons/Features').then(m => ({ default: m.ActiveBanner })));
const EndedBanner = lazy(() => import('@/components/learning/commons/Features').then(m => ({ default: m.EndedBanner })));
const NotStartedBanner = lazy(() => import('@/components/learning/commons/Features').then(m => ({ default: m.NotStartedBanner })));

// ============================================================================
// STORE SELECTOR OPTIMISÉ
// ============================================================================

const useStoreSelectors = () => {
  return useMonEtoileStore(
    useShallow((state) => ({
      jeuenattente: state.jeuenattente,
      afficheaide: state.afficheaide,
      lejeu: state.lejeu,
      lamise: state.lamise,
      afficherJeu: state.afficherJeu,
      setAfficheAide: state.setAfficheaide,
    }))
  );
};

// ============================================================================
// CONTENU COMPÉTITION OPTIMISÉ
// ============================================================================

const CompetitionContent = memo(() => {
  const { jeuenattente } = useStoreSelectors();
  const { 
    demarrerJeu, 
    handleOpenGame, 
    startDate, 
    gameConfig, 
    viewState, 
    lastEndedGame, 
    endDate 
  } = useAdminConsultationsPageFinished();
  
  const {
    handleValidateCompetition,
    handleRestart,
    hasCompetitions,
    isValidating,
    isSubmitting,
    competitions,
  } = useEndGameGenerator();

  const [visibleCount, setVisibleCount] = useState(5);
  const [isPending, startTransition] = useTransition();
  const deferredCompetitions = useDeferredValue(competitions);

  const handleLoadMore = useCallback(() => {
    startTransition(() => {
      setVisibleCount(prev => Math.min(prev + 10, competitions.length));
    });
  }, [competitions.length]);

  const competitionList = useMemo(() => {
    if (!hasCompetitions) return null;
    return deferredCompetitions.slice(0, visibleCount);
  }, [deferredCompetitions, visibleCount, hasCompetitions]);

  const hasMore = visibleCount < competitions.length;
  const remainingCount = competitions.length - visibleCount;
  

  // Mémorisation des bannières
  const banners = useMemo(() => {
  

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
  }, [jeuenattente, viewState, endDate, startDate, gameConfig, demarrerJeu, handleOpenGame, lastEndedGame]);

  // Rendu avec chargement progressif
  const renderCompetitions = useMemo(() => {
    if (!hasCompetitions) return banners;

    return (
      <div className="space-y-3 animate-in fade-in duration-300">
        <RestartButton
          onClick={handleRestart}
          disabled={isValidating || isSubmitting || isPending}
          aria-busy={isValidating || isSubmitting || isPending}
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
            disabled={isPending}
            className="w-full py-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            aria-label={`Charger ${Math.min(10, remainingCount)} compétitions supplémentaires`}
          >
            {isPending ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span>Chargement...</span>
              </div>
            ) : (
              `Voir plus (${remainingCount} restantes)`
            )}
          </button>
        )}
      </div>
    );
  }, [hasCompetitions, banners, competitionList, hasMore, remainingCount, isPending, handleLoadMore, handleRestart, isValidating, isSubmitting, handleValidateCompetition]);
  if (!jeuenattente) return null;
  return (
    <Suspense fallback={<CompactSkeleton />}>
      {renderCompetitions}
    </Suspense>
  );
});

CompetitionContent.displayName = 'CompetitionContent';

// ============================================================================
// AIDE OPTIMISÉE
// ============================================================================

const HelpView = memo(() => {
  const { afficherJeu } = useStoreSelectors();
  const [isClosing, setIsClosing] = useState(false);
  
  const handleCloseHelp = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      startTransition(() => {
        afficherJeu();
      });
    }, 200);
  }, [afficherJeu]);

  if (isClosing) return null;

  return (
    <Suspense fallback={<LoaderSkeleton />}>
      <div className="animate-in slide-in-from-right duration-300">
        <HelpPanel onClose={handleCloseHelp} />
      </div>
    </Suspense>
  );
});

HelpView.displayName = 'HelpView';

// ============================================================================
// JEU OPTIMISÉ
// ============================================================================

const GameView = memo(() => {
  const { lejeu, lamise } = useStoreSelectors();
  const deferredLeJeu = useDeferredValue(lejeu);
  const deferredLaMise = useDeferredValue(lamise);

  // Prefetch du jeu si la mise est active
  useEffect(() => {
    if (deferredLaMise && !deferredLeJeu) {
      const prefetchGame = async () => {
        await import('@/components/learning/game/TheGame');
      };
      prefetchGame();
    }
  }, [deferredLaMise, deferredLeJeu]);

  if (!deferredLaMise && !deferredLeJeu) return null;

  return (
    <Suspense fallback={<LoaderSkeleton />}>
      <div className="animate-in zoom-in-95 duration-200">
        {deferredLaMise && <LaMise />}
        {deferredLeJeu && <TheGame />}
      </div>
    </Suspense>
  );
});

GameView.displayName = 'GameView';

// ============================================================================
// CONTENU FIXE OPTIMISÉ
// ============================================================================

const FixedContent = memo(() => {
  useEffect(() => {
    const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 100));
    idleCallback(() => {
      import('@/components/learning/historique/Historique');
      import('@/components/learning/labanniere/LaBanniere');
    });
  }, []);

  return (
    <div className="fixed-bottom-content">
      <Suspense fallback={<div className="h-32 animate-pulse bg-gray-100 rounded-xl" />}>
        <LaBanniere />
      </Suspense>
      <Suspense fallback={<div className="h-24 animate-pulse bg-gray-100 rounded-xl mt-2" />}>
        <Historique />
      </Suspense>
      <FooterSection />
      <HelpButton />
    </div>
  );
});

FixedContent.displayName = 'FixedContent';

// ============================================================================
// HEADER OPTIMISÉ
// ============================================================================

const HeaderWithToast = memo(() => {
  const { validateMessage, clearValidateMessage } = useEndGameGenerator();
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      clearValidateMessage();
      setIsVisible(true);
    }, 300);
  }, [clearValidateMessage]);

  if (!validateMessage) {
    return <HeaderSection />;
  }

  return (
    <>
      {isVisible && (
        <div className="animate-in slide-in-from-top duration-200">
          <MessageToast
            message={validateMessage}
            onClose={handleClose} 
          />
        </div>
      )}
      <HeaderSection />
    </>
  );
});

HeaderWithToast.displayName = 'HeaderWithToast';

// ============================================================================
// COMPOSANT PRINCIPAL OPTIMISÉ
// ============================================================================

const ProfilPageLearning = () => {
  const { loading } = useAdminConsultationsPageFinished();
  const { afficheaide } = useStoreSelectors();
  const [isPageReady, setIsPageReady] = useState(false);

  useEffect(() => {
    const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
    idleCallback(() => {
      setIsPageReady(true);
    });
  }, []);

  const mainContent = useMemo(() => {
    if (afficheaide) return <HelpView />;
    return (
      <>
        <GameView />
        <CompetitionContent />
      </>
    );
  }, [afficheaide]);

  if (loading || !isPageReady) {
    return (
      <div className="w-full mx-auto max-w-md">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto max-w-md pb-20">
      <div className="flex flex-col items-center justify-center mb-8 space-y-4">
        <HeaderWithToast />
        {mainContent}
        <FixedContent />
      </div>
    </div>
  );
};
 

export default memo(ProfilPageLearning);