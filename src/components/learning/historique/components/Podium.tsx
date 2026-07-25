'use client';
import { Winner } from "@/lib/learning/interface";
import { Crown, Medal } from "lucide-react";

const PodiumItem = ({
    rank,
    winner,
    color,
    size,
    icon,
    isGold
}: {
    rank: number;
    winner: Winner;
    color: string;
    size: string;
    icon: React.ReactNode;
    isGold?: boolean;
}) => (
    <div className={`flex flex-col items-center ${isGold ? '-mt-8' : ''}`}>
        <div className={`${size} rounded-full bg-gradient-to-br from-${color}-400 to-${color}-500 p-1 shadow-lg`}>
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                {icon}
            </div>
        </div>
        <div className="mt-2 text-center">
            <p className="font-bold text-gray-800 dark:text-gray-200">{winner.username}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{winner.timeSpentFormatted}</p>
            {winner.country && (
                <p className="text-xs text-gray-400 dark:text-gray-500">{winner.country}</p>
            )}
        </div>
        <div className={`mt-1 ${rank === 1 ? 'w-24 h-20' : rank === 2 ? 'w-20 h-16' : 'w-20 h-14'} bg-gradient-to-t from-${color}-500 to-${color}-400 rounded-t-lg flex items-center justify-center shadow-lg`}>
            <span className="text-2xl font-black text-white">{rank}</span>
        </div>
    </div>
);

const Podium = ({ winners }: { winners: Winner[] }) => {
    if (!winners?.length) return null;

    const gold = winners.find(w => w.rank === 1);
    const silver = winners.find(w => w.rank === 2);
    const bronze = winners.find(w => w.rank === 3);

    return (
        <div className="flex flex-col items-center justify-end gap-4 mb-8 mt-16">
            <div className="flex flex-wrap justify-center items-end gap-4">
                {silver && (
                    <PodiumItem
                        rank={2}
                        winner={silver}
                        color="gray"
                        size="w-24 h-24"
                        icon={<Medal className="w-10 h-10 text-gray-500" />}
                    />
                )}
                {gold && (
                    <PodiumItem
                        rank={1}
                        winner={gold}
                        color="yellow"
                        size="w-32 h-32"
                        icon={<Crown className="w-12 h-12 text-yellow-500" />}
                        isGold
                    />
                )}
                {bronze && (
                    <PodiumItem
                        rank={3}
                        winner={bronze}
                        color="amber"
                        size="w-24 h-24"
                        icon={<Medal className="w-10 h-10 text-amber-600" />}
                    />
                )}
            </div>
        </div>
    );
};

export default Podium;