'use client';
import Loader from "@/app/loading";
import { useEndGameGenerator } from "@/hooks/learning/endgame/useEndGameGenerator";
import { useAdminConsultationsPageFinished } from "@/hooks/learning/lacompetition/useAdminConsultationsPageFinished";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import dynamic from 'next/dynamic';
import { Suspense, lazy, memo, startTransition, useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { FooterSection, HeaderSection, HelpButton, MessageToast } from '../commons/Features';

const LoaderSkeleton = memo(() => (
  <div className="animate-pulse bg-gray-200 rounded-lg h-64 w-full will-change-transform" />
));

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

const LaBanniere = lazy(() => import('@/components/learning/labanniere/LaBanniere'));
const HelpPanel = lazy(() => import('@/components/learning/help/HelpPanel'));

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
      <FooterSection />
      <HelpButton />
    </div>
  );
});

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
    return (<GameView />);
  }, [afficheaide]);

  if (loading || !isPageReady) {
    return (<Loader />);
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