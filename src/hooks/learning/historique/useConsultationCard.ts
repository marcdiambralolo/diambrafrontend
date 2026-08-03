import { Consultation } from "@/lib/interfaces";
import { formatRelativeDate, formatTimeFromSeconds, formatToHMS, parseTimeToSeconds } from "@/lib/learning/functions";

export function useConsultationCard(consultation: Consultation, rank?: number) {
    const client = consultation.clientId;
    const nomJoueur = client?.username || 'Anonyme';
    const country = client?.country || "Côte d'Ivoire";
    const timeSpent = consultation.timeSpent || '0';
    const relativeDate = formatRelativeDate(consultation.createdAt);
    const timeInSeconds = parseTimeToSeconds(timeSpent);
    const formattedTime = formatToHMS(timeInSeconds);
    const nombredevues = consultation.nombredevues || 0;

    const getMedal = (rank?: number) => {
        if (!rank) return null;
        if (rank === 1) return { emoji: '🥇', color: 'text-yellow-500' };
        if (rank === 2) return { emoji: '🥈', color: 'text-gray-400' };
        if (rank === 3) return { emoji: '🥉', color: 'text-amber-600' };
        return { emoji: `#${rank}`, color: 'text-gray-400' };
    };

    const medal = getMedal(rank);

    return {
        client, nomJoueur, country, timeSpent, relativeDate,
        timeInSeconds, formattedTime, medal, nombredevues
    };
}