'use client';
import { Winner } from "@/lib/learning/interface";
import { Clock, MapPin } from "lucide-react";

const ParticipantCard = ({ winner, onToggle }: {
    winner: Winner;
    isExpanded: boolean;
    onToggle: () => void;
}) => {
    const medalEmoji = winner.rank === 1 ? '🥇' : winner.rank === 2 ? '🥈' : winner.rank === 3 ? '🥉' : `#${winner.rank}`;

    return (
        <div
            className="p-4 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0"
            onClick={onToggle}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                        {winner.rank <= 3 ? medalEmoji : winner.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                                {winner.username}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {winner.timeSpentFormatted}
                            </span>
                            {winner.country && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {winner.country}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParticipantCard;