'use client';
import { Consultation } from '@/lib/interfaces';
import { Winner } from '@/lib/learning/interface';
import { memo, useMemo } from 'react';
import EmptyState from './EmptyState';
import Podium from './Podium';
import WinnersList from './WinnersList';
import WinningInfoCard from './WinningInfoCard';
import { formatToHMS } from '@/lib/learning/functions';

interface Ranking {
    winners: Winner[];
    totalParticipants: number;
    fastestTimeFormatted: string;
}

const TIME_REGEX = /(\d+(?:\.\d+)?)/;

const parseTimeToSeconds = (timeStr: string | number | undefined): number => {
    if (!timeStr) return 0;
    if (typeof timeStr === 'number') return timeStr;

    const match = timeStr.match(TIME_REGEX);
    return match ? parseFloat(match[1]) : 0;
};

const formatTimeFromSeconds = (seconds: number): string => {
    if (seconds < 60) return `${seconds} sec`;
    const minutes = Math.floor(seconds / 60);
    const restSeconds = seconds % 60;
    return restSeconds === 0 ? `${minutes} min` : `${minutes} min ${restSeconds} sec`;
};

const computeRankingFromConsultations = (consultations: Consultation[]): Ranking | null => {
    if (!consultations?.length) return null;

    const bestTimesByUser = new Map<string, Winner>();

    for (let i = 0; i < consultations.length; i++) {

        const consultation = consultations[i];
        const client = consultation.clientId;
        if (!client?._id) continue;

        const timeSpentSeconds = parseTimeToSeconds(consultation.timeSpent);
        if (timeSpentSeconds <= 0) continue;

        const existing = bestTimesByUser.get(client._id);

        if (!existing || timeSpentSeconds < existing.timeSpent) {
            bestTimesByUser.set(client._id, {
                consultationId: consultation._id,
                clientId: client._id,
                username: client.username || 'Anonyme',
                firstName: client.prenoms || 'Anonyme',
                lastName: client.nom || '',
                phone: client.phone || '',
                nom: client.nom || '',
                prenoms: client.prenoms || '',
                country: client.country || "Côte d'Ivoire",
                timeSpent: timeSpentSeconds,
                timeSpentFormatted: formatToHMS( timeSpentSeconds),
                createdAt: consultation.createdAt,
                rank: 0,
                nombredevues: consultation.nombredevues || 0,
            });
        }
    }

    if (bestTimesByUser.size === 0) return null;

    const rankedWinners = Array.from(bestTimesByUser.values()).sort((a, b) => a.timeSpent - b.timeSpent);

    for (let i = 0; i < rankedWinners.length; i++) {
        rankedWinners[i].rank = i + 1;
    }

    return {
        winners: rankedWinners,
        totalParticipants: rankedWinners.length,
        fastestTimeFormatted: rankedWinners[0].timeSpentFormatted,
    };
};

const WinnersSection = memo(function WinnersSection({
    consultations,
}: {
    consultations: Consultation[];
}) {
    const ranking = useMemo(() => computeRankingFromConsultations(consultations), [consultations]);

    if (!consultations?.length) {
        return (
            <EmptyState
                title="🎮 Aucun participant"
                subtitle="Personne n'a participé à cette édition"
            />
        );
    }

    if (!ranking) {
        return (
            <EmptyState
                title="⏳ En attente des résultats"
                subtitle="Les temps de jeu seront bientôt disponibles"
            />
        );
    }

    return (
        <div className="space-y-8 mb-8 mt-4">
            <WinningInfoCard
                fastestTimeFormatted={ranking.fastestTimeFormatted}
                totalParticipants={ranking.totalParticipants}
            />
            <Podium winners={ranking.winners.slice(0, 3)} />
            <WinnersList winners={ranking.winners.slice(0, 3)} />
        </div>
    );
});

export default WinnersSection;