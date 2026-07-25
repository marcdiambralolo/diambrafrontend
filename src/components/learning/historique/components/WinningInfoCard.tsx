'use client';
import { Award, Trophy } from "lucide-react";

const WinningInfoCard = ({
    fastestTimeFormatted,
    totalParticipants
}: {
    fastestTimeFormatted: string;
    totalParticipants: number;
}) => (
    <div className="relative overflow-hidden mb-8 rounded-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                <Trophy className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">🏆 Meilleur temps</span>
                <Award className="w-4 h-4" />
            </div>

            <div className="text-center mb-4">
                <div className="text-5xl sm:text-6xl font-black">{fastestTimeFormatted}</div>
                <p className="text-sm mt-2 opacity-90">
                    sur {totalParticipants} participant{totalParticipants > 1 ? 's' : ''}
                </p>
            </div>
        </div>
    </div>
);

export default WinningInfoCard;