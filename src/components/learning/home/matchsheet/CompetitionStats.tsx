'use client';
import { formatDuration } from '@/lib/learning/functions';
import { BarChart3, Calendar, Clock } from 'lucide-react';
import { memo } from 'react';
import InfoRow from './InfoRow';

interface CompetitionStatsProps {
    startDate: string;
    finishedDate: string;
    timeSpent?: number;
    niveau?: number;
}

const CompetitionStats = memo(function CompetitionStats({
    startDate,
    finishedDate,
    timeSpent,
    niveau,
}: CompetitionStatsProps) {
    const getElapsedTime = () => {
        if (!startDate || !finishedDate) return null;

        const start = new Date(startDate).getTime();
        const end = new Date(finishedDate).getTime();

        if (Number.isNaN(start) || Number.isNaN(end)) return null;

        const diff = Math.floor((end - start) / 1000);
        return diff < 0 ? 'Négatif' : formatDuration(diff);
    };

    const elapsedTime = getElapsedTime();

    return (
        <div className="w-full  dark:from-gray-800/30 dark:to-gray-900/30 p-3 dark:border-gray-700/50 mt-1">
            <InfoRow
                label="Date de début"
                value={startDate}
                icon={<Calendar className="w-3.5 h-3.5" />}
            />
            <InfoRow
                label="Date de fin"
                value={finishedDate}
                icon={<Calendar className="w-3.5 h-3.5" />}
            />
            {elapsedTime && (
                <InfoRow
                    label="Temps écoulé"
                    value={elapsedTime}
                    highlight
                    icon={<span aria-hidden="true">⏱️</span>}
                />
            )}
            {timeSpent !== undefined && (
                <InfoRow
                    label="Temps total"
                    value={`${timeSpent}s`}
                    icon={<Clock className="w-3.5 h-3.5" />}
                />
            )}
            {niveau !== undefined && (
                <InfoRow
                    label="Niveau"
                    value={niveau}
                    icon={<BarChart3 className="w-3.5 h-3.5" />}
                />
            )}
        </div>
    );
});

export default CompetitionStats;