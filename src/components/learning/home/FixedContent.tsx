'use client';
import Loader from "@/app/loading";
import { useStatsDataWithCache } from "@/hooks/cache/useStatsDataWithCache";
import { COLORS, SKELETON_CLASSES } from "@/lib/learning/constantes";
import { Users } from "lucide-react";
import dynamic from 'next/dynamic';
import { Suspense, memo, useMemo } from 'react';
import ErrorPage from "../commons/Erreur";
import { FooterSection, HelpButton } from '../commons/Features';
import { StatCard } from "../commons/FixedContent";
import { CompetitionInfo } from "@/lib/interfaces";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";


const FeuilleDeMatch = dynamic(
  () => import('../home/FeuilleDematch'),
  {
    loading: () => <div className={SKELETON_CLASSES.feuille} />,
    ssr: true,
  }
);

const Historique = dynamic(
    () => import('../historique/Historique'),
    {
        loading: () => <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />,
        ssr: true,
    }
);

const FixedContent = memo(({ afficheStats }: { afficheStats: boolean }) => {
    const { stats, isLoading, isError } = useStatsDataWithCache();
    const selectCompetitions = (state: any) => state.competitions || [];
  const competitions: CompetitionInfo[] = useMonEtoileStore(selectCompetitions);

  const competitionsLength = competitions.length;
  const validatedCount = useMemo(
    () => competitions.filter(c => c.isValidated).length,
    [competitions]
  );
    if (isLoading) return <Loader />;

    if (isError) return <ErrorPage />;

    return (
        <div className="fixed-bottom-content w-full space-y-4">
              <FeuilleDeMatch key={`feuille-${validatedCount}`} />
            {afficheStats && (
                <StatCard
                    value={stats?.subscribers ?? null}
                    label="Inscrits"
                    icon={<Users className="w-4 h-4" aria-hidden="true" />}
                    color={COLORS.subscribers}
                />
            )}

            <Suspense fallback={<div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />}>
                <Historique />
            </Suspense>

            <FooterSection />
            <HelpButton />
        </div>
    )
});

export default FixedContent;