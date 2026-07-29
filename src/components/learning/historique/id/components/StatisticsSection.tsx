"use client";
import { Users, Clock, Award } from "lucide-react";
import StatsCard from "./StatsCard";
import { formatTimeFromSeconds } from "@/lib/learning/functions";
 
interface StatisticsSectionProps {
    advancedStats: any;
}

export function StatisticsSection({ advancedStats }: StatisticsSectionProps) {
    if (!advancedStats) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 mt-8">
            <StatsCard
                icon={<Users className="w-4 h-4" />}
                label="Participants"
                value={advancedStats.completedPlayers}
                color="from-purple-600 to-indigo-600"
                subtitle="Joueurs uniques"
            />

            <StatsCard
                icon={<Clock className="w-4 h-4" />}
                label="Temps moyen"
                value={formatTimeFromSeconds(advancedStats.averageTimeSpent)}
                color="from-blue-600 to-cyan-600"
                subtitle="Par participant"
            />

            <StatsCard
                icon={<Award className="w-4 h-4" />}
                label="Meilleur temps"
                value={advancedStats.fastestTimeFormatted}
                color="from-green-600 to-emerald-600"
                subtitle="🏆 Record de l'édition"
            />
        </div>
    );
}