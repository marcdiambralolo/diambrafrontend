'use client';
import Loader from "@/app/loading";
import { useStatsDataWithCache } from "@/hooks/cache/useStatsDataWithCache";
import { COLORS } from "@/lib/learning/constantes";
import dynamic from 'next/dynamic';
import { Suspense, memo, useMemo } from 'react';
import ErrorMessage from '../../commons/ErrorMessage';
import { FooterSection } from '../../commons/Features';
import FeuilleDeMatch from '../matchsheet/FeuilleDeMatch';
import { HelpButton } from './HelpButton';
import { StatsSection } from './StatsSection';

const Historique = dynamic(() => import('../../historique/Historique'), {
  loading: () => <Loader />,
  ssr: true,
});

const FixedContent = () => {
  const { stats, isLoading, isError, error } = useStatsDataWithCache();

  const statsSectionProps = useMemo(() => ({
    subscribers: stats?.subscribers ?? null,
    color: COLORS.subscribers
  }), [stats?.subscribers]);

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="w-full space-y-4">
        <ErrorMessage
          message={error instanceof Error ? error.message : "Erreur de chargement des données"}
        />
        <FooterSection />
        <HelpButton />
      </div>
    );
  }

  return (
    <footer className="fixed-bottom-content w-full space-y-4">
      <FeuilleDeMatch />
      
      <StatsSection {...statsSectionProps} />

      <Suspense fallback={<Loader />}>
        <Historique />
      </Suspense>

      <FooterSection />
      <HelpButton />
    </footer>
  );
};

export default memo(FixedContent);