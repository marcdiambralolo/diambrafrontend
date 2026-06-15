'use client';
import Loader from "@/app/loading";
import { useStatsDataWithCache } from "@/hooks/cache/useStatsDataWithCache";
import { COLORS } from "@/lib/learning/constantes";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { Users } from "lucide-react";
import dynamic from 'next/dynamic';
import { Suspense, memo, useMemo } from 'react';
import ErrorMessage from "../commons/ErrorMessage";
import { FooterSection, HelpButton, StatCard } from '../commons/Features';
import FeuilleDeMatch from "./FeuilleDeMatch";

const Historique = dynamic(() => import('../historique/Historique'),
    {
        loading: () => (<Loader />),
        ssr: true,
    }
);

const StatsSection = memo(({
    subscribers,
    color
}: {
    subscribers: number | null;
    color: string;
}) => {
    const afficheStat = useMonEtoileStore((state) => state.afficheStat);

    const statContent = useMemo(() => {
        if (!afficheStat) return null;

        return (
            <StatCard
                value={subscribers}
                label="Inscrits"
                icon={<Users className="w-4 h-4" aria-hidden="true" />}
                color={color}
            />
        );
    }, [afficheStat, subscribers, color]);

    return <>{statContent}</>;
});

const FixedContent = memo(() => {

    const { stats, isLoading, isError, error } = useStatsDataWithCache();

    const statsSectionProps = useMemo(() => ({
        subscribers: stats?.subscribers ?? null,
        color: COLORS.subscribers
    }), [stats?.subscribers]);

    if (isLoading) { return (<Loader />); }

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
});

export default FixedContent;