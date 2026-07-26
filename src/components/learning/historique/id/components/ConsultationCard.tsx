"use client";
import { cx } from "@/lib/functions";
import type { Consultation } from "@/lib/interfaces";
import { formatRelativeDate, formatTimeFromSeconds, parseTimeToSeconds } from "@/lib/learning/functions";
import { Calendar, CheckCircle, Globe, Timer, UserRound } from "lucide-react";
import { memo } from "react";

interface ConsultationCardProps {
    consultation: Consultation;
    index: number;
    isDuplicate?: boolean;
    duplicateCount?: number;
    rank?: number;
}

const ConsultationCard = memo(({
    consultation,
    isDuplicate = false,
    duplicateCount = 0,
    rank
}: ConsultationCardProps) => {
    const client = consultation.clientId;
    const nomJoueur = client?.username || 'Anonyme';
    const country = client?.country || "Côte d'Ivoire";
    const timeSpent = consultation.timeSpent || '0';
    const relativeDate = formatRelativeDate(consultation.createdAt);

    const timeInSeconds = parseTimeToSeconds(timeSpent);
    const formattedTime = formatTimeFromSeconds(timeInSeconds);

    const getMedal = (rank?: number) => {
        if (!rank) return null;
        if (rank === 1) return { emoji: '🥇', color: 'text-yellow-500' };
        if (rank === 2) return { emoji: '🥈', color: 'text-gray-400' };
        if (rank === 3) return { emoji: '🥉', color: 'text-amber-600' };
        return { emoji: `#${rank}`, color: 'text-gray-400' };
    };

    const medal = getMedal(rank);

    return (
        <article
            className={cx(
                "group relative overflow-hidden rounded-xl p-4 m-4 mt-2 space-x-4 space-y-4",
                "bg-white dark:bg-gray-800",
                "border border-gray-100 dark:border-gray-700",
                "shadow-md hover:shadow-xl",
                "transition-all duration-200 hover:scale-[1.01]",
                rank === 1 && "ring-2 ring-yellow-500 ring-offset-2 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20",
                rank === 2 && "ring-2 ring-gray-400 ring-offset-2 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20",
                rank === 3 && "ring-2 ring-amber-600 ring-offset-2 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
                isDuplicate && "ring-2 ring-green-500 ring-offset-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
            )}
        >
            <div className="relative z-10 space-y-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                                <UserRound className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="text-sm font-semibold truncate">{nomJoueur}</span>
                            </div>

                            {medal && (
                                <span className={`text-sm font-bold ${medal.color}`}>
                                    {medal.emoji}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                                <Timer className="w-3 h-3 flex-shrink-0" />
                                {formattedTime}
                            </span>

                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 flex-shrink-0" />
                                {relativeDate}
                            </span>

                            {country && (
                                <span className="flex items-center gap-1">
                                    <Globe className="w-3 h-3 flex-shrink-0" />
                                    {country}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {isDuplicate && (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold shadow-md">
                                <CheckCircle className="w-3 h-3" />
                                {duplicateCount > 1 ? `x${duplicateCount}` : 'Doublon'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
});

ConsultationCard.displayName = 'ConsultationCard';

export default ConsultationCard;