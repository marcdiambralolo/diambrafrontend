'use client';
import Loader from "@/app/loading";
import { useStatsDataWithCache } from "@/hooks/cache/useStatsDataWithCache";
import { formatNumber } from "@/lib/functions";
import { APP_NAME, COLORS } from "@/lib/learning/constantes";
import { useDiambraStore } from "@/lib/store/diambra.store";
import { HelpCircle, Users } from "lucide-react";
import dynamic from 'next/dynamic';
import { useRouter } from "next/navigation";
import { Suspense, memo, useCallback, useMemo } from 'react';
import ErrorMessage from "../commons/ErrorMessage";
import { FooterSection } from '../commons/Features';
import FeuilleDeMatch from "./matchsheet/FeuilleDeMatch";

const Historique = dynamic(() => import('../historique/Historique'),
    {
        loading: () => (<Loader />),
        ssr: true,
    }
);

const BASE_BUTTON_STYLES = "focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

export const HeaderSection = memo(() => (
    <div className="flex flex-col items-center justify-center mt-2 mb-2">
        <h1 className="text-xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            {APP_NAME}
        </h1>
        <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
        </div>
    </div>
));

interface StatCardProps {
    value: number | null;
    label: string;
    icon: React.ReactNode;
    color: string;
}

export const StatCard = memo(({ value, label, icon, color }: StatCardProps) => {
    const formattedValue = value !== null ? formatNumber(value) : '--';

    return (
        <button
            type="button"
            className={`w-full text-left relative overflow-hidden mt-4 rounded-2xl bg-gradient-to-br ${color} p-4 text-white shadow-xl border border-white/20 transition-transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white/50`}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-white/15 rounded-full blur-xl pointer-events-none" />
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold opacity-90">{label}</span>
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center" aria-hidden="true">
                        {icon}
                    </div>
                </div>
                <p className="text-3xl text-center font-extrabold tracking-tight">{formattedValue}</p>
            </div>
        </button>
    );
});

export const HelpButton = memo(() => {
    const router = useRouter();

    const handleClick = useCallback(() => {
        router.push('/star/learning/help');
    }, [router]);

    return (
        <button
            onClick={handleClick}
            className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white shadow-lg hover:shadow-xl transition-shadow ${BASE_BUTTON_STYLES} focus:ring-purple-400`}
            aria-label="Aide"
            type="button"
        >
            <HelpCircle className="w-6 h-6" aria-hidden="true" />
        </button>
    );
});

const StatsSection = memo(({
    subscribers,
    color
}: {
    subscribers: number | null;
    color: string;
}) => {
    const afficheStat = useDiambraStore((state) => state.afficheStat);

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