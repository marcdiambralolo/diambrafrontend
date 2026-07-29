'use client';
import { Winner } from "@/lib/learning/interface";
import { Trophy } from "lucide-react";
import ParticipantCard from "./ParticipantCard";

const WinnersList = ({ winners }: { winners: Winner[] }) => {

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
                    />
                ))}
            </div>
        </div>
    );
};

export default WinnersList;