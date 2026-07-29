'use client';
import { cx } from "@/lib/functions";
import { Winner } from "@/lib/learning/interface";
import { Clock, Eye, MapPin } from "lucide-react";

interface ParticipantCardProps {
    winner: Winner;
}

const ParticipantCard = ({
    winner,
}: ParticipantCardProps) => {
    const rank = winner.rank ?? null;
    const hasRank = rank !== null && rank > 0;

    const getRankBadgeStyle = () => {
        if (!hasRank) {
            return "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 border-gray-200 dark:border-gray-700";
        }
        switch (rank) {
            case 1:
                return "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-700/50 shadow-sm";
            case 2:
                return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-600 shadow-sm";
            case 3:
                return "bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-300 dark:border-orange-700/50 shadow-sm";
            default:
                return "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800/40";
        }
    };

    const renderRankContent = () => {
        if (!hasRank) return "-";
        if (rank === 1) return "🥇";
        if (rank === 2) return "🥈";
        if (rank === 3) return "🥉";
        return `#${rank}`;
    };

    return (
        <button
            type="button"
            className={cx(
                "w-full text-left p-3.5 sm:p-4 transition-all duration-200",
                "border-b border-gray-100 dark:border-gray-800/80 last:border-b-0",
                "hover:bg-purple-50/50 dark:hover:bg-purple-950/20",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:z-10",
            )}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                        className={cx(
                            "w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 transition-transform duration-200",
                            getRankBadgeStyle()
                        )}
                    >
                        {renderRankContent()}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 truncate">
                                {winner.username}
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                            <span className="inline-flex items-center gap-1 font-medium text-gray-700 dark:text-gray-300">
                                <Clock className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                                {winner.timeSpentFormatted || "--"}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                {winner.nombredevues ?? 0} vues
                            </span>

                            {winner.country && (
                                <span className="inline-flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                    <span className="truncate">{winner.country}</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </button>
    );
};

export default ParticipantCard;