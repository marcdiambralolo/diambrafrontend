'use client';
import Loader from "@/app/loading";
import { useAdminConsultationsPageFinished } from "@/hooks/learning/lacompetition/useAdminConsultationsPageFinished";
import dynamic from 'next/dynamic';
import { memo, Suspense } from 'react';
import { FooterSection, HeaderSection, HelpButton } from '../commons/Features';
import { CardSkeleton } from "../commons/Skeleton";
import LaMise from "../mise/LaMise";

const LaBanniere = dynamic(
  () => import('@/components/learning/labanniere/LaBanniere').then(mod => ({ default: mod.default })),
  {
    loading: () => <CardSkeleton />,
    ssr: false,
  }
);

const FixedContent = memo(() => {
  return (
    <div className="fixed-bottom-content w-full space-y-4">
      <Suspense fallback={<CardSkeleton />}>
        <LaBanniere />
      </Suspense>
      <FooterSection />
      <HelpButton />
    </div>
  );
});

const ProfilPageLearning = () => {
  const { loading } = useAdminConsultationsPageFinished();

  if (loading) { return (<Loader />); }

  return (
    <div className="w-full mx-auto max-w-md pb-20 min-h-screen">
      <div className="flex flex-col items-center justify-center mb-8 space-y-4">
        <HeaderSection />
        <LaMise />
        <FixedContent />
      </div>
    </div>
  );
};

export default memo(ProfilPageLearning);