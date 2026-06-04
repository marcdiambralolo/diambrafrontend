'use client';
import { useEndGameGenerator } from "@/hooks/learning/endgame/useEndGameGenerator";
import dynamic from 'next/dynamic';
import { Suspense, lazy, memo, useCallback, useEffect, useState } from 'react';
import { FooterSection, HeaderSection, HelpButton, MessageToast } from '../commons/Features';
import { useAdminConsultationsPageFinished } from "@/hooks/learning/lacompetition/useAdminConsultationsPageFinished";
import { CardSkeleton } from "../commons/Skeleton";

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


const LaBanniere = lazy(() => import('@/components/learning/labanniere/LaBanniere'));
 


const GameView = memo(() => {
 
 

  return (
    <Suspense fallback={<LoaderSkeleton />}>
      <div className="animate-in zoom-in-95 duration-200">
        <TheGame />
        
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
 if (loading) {
    return (
      <div className="w-full mx-auto max-w-md pb-20">
        <div className="flex flex-col items-center justify-center mb-8 space-y-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto max-w-md pb-20">
      <div className="flex flex-col items-center justify-center mb-8 space-y-4">
        <HeaderWithToast />
       <GameView />
        <FixedContent />
      </div>
    </div>
  );
};


export default memo(ProfilPageLearning);