'use client';
import { memo, useMemo } from 'react';
import { Users } from "lucide-react";
import { useDiambraStore } from "@/lib/store/diambra.store";
import { StatCard } from './StatCard';

interface StatsSectionProps {
    subscribers: number | null;
    color: string;
}

export const StatsSection = memo(function StatsSection({ subscribers, color }: StatsSectionProps) {
    const afficheStat = useDiambraStore((state) => state.afficheStat);

    return useMemo(() => {
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
});