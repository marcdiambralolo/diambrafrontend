'use client';
import { Winner } from "@/lib/learning/interface";
import { ChevronDown, ChevronUp, Clock, MapPin, Phone, Trophy, User } from "lucide-react";
import { useState } from 'react';

const formatDate = (dateStr: string): string => {
    if (!dateStr) return 'Date inconnue';
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return dateStr;
    }
};

const ParticipantCard = ({ winner, isExpanded, onToggle }: {
    winner: Winner;
    isExpanded: boolean;
    onToggle: () => void;
}) => {
    const medalEmoji = winner.rank === 1 ? '🥇' : winner.rank === 2 ? '🥈' : winner.rank === 3 ? '🥉' : `#${winner.rank}`;
    const medalColor = winner.rank === 1 ? 'text-yellow-500' : winner.rank === 2 ? 'text-gray-400' : winner.rank === 3 ? 'text-amber-600' : 'text-gray-400';

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
                            <span className={`text-xs font-bold ${medalColor}`}>
                                {winner.rank <= 3 ? medalEmoji : ''}
                            </span>
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
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{formatDate(winner.createdAt)}</span>
                        {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                        <User className="w-3 h-3" />
                        <span>{winner.nom} {winner.prenoms}</span>
                    </div>
                    {winner.phone && (
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                            <Phone className="w-3 h-3" />
                            <span>{winner.phone}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const WinnersList = ({ winners }: { winners: Winner[] }) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    if (!winners?.length) return null;

    return (
        <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4">
                <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-white" />
                    <h3 className="font-bold text-white">🏅 Classement général</h3>
                    <span className="ml-auto px-2 py-1 rounded-full bg-white/20 text-xs font-bold text-white">
                        {winners.length} gagnant{winners.length > 1 ? 's' : ''}
                    </span>
                </div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {winners.map((winner) => (
                    <ParticipantCard
                        key={winner.consultationId}
                        winner={winner}
                        isExpanded={expandedId === winner.consultationId}
                        onToggle={() => setExpandedId(expandedId === winner.consultationId ? null : winner.consultationId)}
                    />
                ))}
            </div>
        </div>
    );
};

export default WinnersList;