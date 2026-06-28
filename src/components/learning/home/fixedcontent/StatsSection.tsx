'use client';
import { memo, useMemo } from 'react';
import { Users } from "lucide-react";
import { useDiambraStore } from "@/lib/store/diambra.store";
import { StatCard } from './StatCard';
import { useStatsDataWithCache } from '@/hooks/cache/useStatsDataWithCache';
import { COLORS } from '@/lib/learning/constantes';
import Loader from '@/app/loading';
import ErrorMessage from '../../commons/ErrorMessage';

export const StatsSection = memo(function StatsSection() {
    const afficheStat = useDiambraStore((state) => state.afficheStat);

    const { stats, isLoading, error } = useStatsDataWithCache();
    if (error) return <ErrorMessage />;

    if (isLoading) return <Loader />;
    return useMemo(() => {
        if (!afficheStat) return null;

        return (
            <StatCard
                value={stats?.subscribers!}
                label="Inscrits"
                icon={<Users className="w-4 h-4" aria-hidden="true" />}
                color={COLORS.subscribers}
            />
        );
    }, [afficheStat, stats?.subscribers, COLORS.subscribers]);
});