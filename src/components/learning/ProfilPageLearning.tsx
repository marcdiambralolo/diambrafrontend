'use client';
import dynamic from 'next/dynamic';
import { Suspense, memo } from 'react';
import { FooterSection, HelpButton } from './commons/Features';
import { PageSkeleton } from './commons/Skeleton';
import HeaderWithToast from "./home/HeaderWithToast";
import FeuilleDeMatch from "./home/FeuilleDematch";

const Bandeau = dynamic(
  () => import('./home/Bandeau'),
  {
    loading: () => <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />,
    ssr: true,
  }
);

const LaBanniere = dynamic(
  () => import('./home/LaBanniere'),
  {
    loading: () => <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />,
    ssr: true,
  }
);

const Historique = dynamic(
  () => import('./historique/Historique'),
  {
    loading: () => <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />,
    ssr: true,
  }
);

const FixedContent = memo(() => (
  <div className="fixed-bottom-content w-full space-y-4">
    <Suspense fallback={<div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />}>
      <LaBanniere />
    </Suspense>

    <Suspense fallback={<div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />}>
      <Historique />
    </Suspense>

    <FooterSection />

    <HelpButton />
  </div>
));

const MainContent = memo(() => (
  <>
    <HeaderWithToast />
    <Suspense fallback={<div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />}>
      <Bandeau />
    </Suspense>
    <FeuilleDeMatch />
    <FixedContent />
  </>
));

const ProfilPageLearning = memo(() => {
  return (
    <div className="w-full mx-auto max-w-md  mb-8 mt-4">
      <Suspense fallback={<PageSkeleton />}>
        <MainContent />
      </Suspense>
    </div>
  );
});

export default ProfilPageLearning;