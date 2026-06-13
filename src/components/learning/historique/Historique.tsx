'use client';
import { useAdminConsultationsPageFinished } from "@/hooks/learning/historique/useAdminConsultationsPageFinished";
import { formatEditionDate } from "@/lib/functions";
import { Award, Crown, Gift, Medal, Sparkles, Trophy } from "lucide-react";
import { memo, useMemo } from 'react';
import CacheLink from "../../commons/CacheLink";

const parseTimeToSeconds = (timeStr: string): number => {
    if (!timeStr) return 0;
    const match = timeStr.match(/(\d+(?:\.\d+)?)\s*sec/);
    return match ? parseFloat(match[1]) : 0;
};

const formatTimeFromSeconds = (seconds: number): string => {
    if (seconds < 60) return `${seconds} sec`;
    const minutes = Math.floor(seconds / 60);
    const restSeconds = seconds % 60;
    if (restSeconds === 0) return `${minutes} min`;
    return `${minutes} min ${restSeconds} sec`;
};

const computeRankingFromConsultations = (consultations: any[]) => {
    if (!consultations?.length) return null;

    const bestTimesByUser = new Map();

    for (const consultation of consultations) {
        const clientId = consultation.clientId?._id;
        if (!clientId) continue;

        const timeSpentSeconds = parseTimeToSeconds(consultation.timeSpent);
        const existing = bestTimesByUser.get(clientId);

        if (!existing || timeSpentSeconds < existing.timeSpent) {
            bestTimesByUser.set(clientId, {
                consultationId: consultation._id,
                clientId,
                username: consultation.clientId?.username || 'Anonyme',
                firstName: consultation.clientId?.firstName || '',
                lastName: consultation.clientId?.lastName || '',
                phone: consultation.clientId?.phone || '',
                email: consultation.clientId?.email || '',
                country: consultation.clientId?.country || 'Côte d\'Ivoire',
                timeSpent: timeSpentSeconds,
                timeSpentFormatted: formatTimeFromSeconds(timeSpentSeconds),
                combination: consultation.combinaison,
                createdAt: consultation.createdAt,
            });
        }
    }

    if (bestTimesByUser.size === 0) return null;

    const rankedWinners = Array.from(bestTimesByUser.values())
        .sort((a, b) => a.timeSpent - b.timeSpent)
        .map((winner, index) => ({ ...winner, rank: index + 1 }));

    return {
        winners: rankedWinners,
        totalParticipants: bestTimesByUser.size,
        fastestTime: rankedWinners[0]?.timeSpent || 0,
        fastestTimeFormatted: rankedWinners[0]?.timeSpentFormatted || '0 sec',
    };
};

const WinningInfoCard = ({ fastestTimeFormatted, totalParticipants }: { fastestTimeFormatted: string; totalParticipants: number }) => (
    <div className="relative overflow-hidden mb-4 rounded-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-6 text-white shadow-xl mb-8">
        <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                <Trophy className="w-4 h-4" />
                
                <span className="text-xs font-bold uppercase tracking-wider">🏆 Meilleur temps</span>
                <Award className="w-4 h-4" />
            </div>

            <div className="text-center mb-4">
                <div className="text-5xl sm:text-6xl font-black">{fastestTimeFormatted}</div>
                <p className="text-sm mt-2 opacity-90">sur {totalParticipants} participant{totalParticipants > 1 ? 's' : ''}</p>
            </div>
        </div>
    </div>
);

const PodiumItem = ({ rank, winner, color, size, icon, isGold }: any) => (
    <div className={`flex flex-col items-center ${isGold ? '-mt-8' : ''}`}>
        <div className={`${size} rounded-full bg-gradient-to-br from-${color}-400 to-${color}-500 p-1 shadow-lg`}>
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">{icon}</div>
        </div>
        <div className="mt-2 text-center">
            <p className="font-bold text-gray-800">{winner.username}</p>
            <p className="text-xs text-gray-500">{winner.timeSpentFormatted}</p>
        </div>
        <div className={`mt-1 ${rank === 1 ? 'w-24 h-20' : rank === 2 ? 'w-20 h-16' : 'w-20 h-14'} bg-gradient-to-t from-${color}-500 to-${color}-400 rounded-t-lg flex items-center justify-center`}>
            <span className="text-2xl font-black text-white">{rank}</span>
        </div>
    </div>
);

const Podium = ({ winners }: { winners: any[] }) => {
    if (!winners?.length) return null;

    const gold = winners.find(w => w.rank === 1);
    const silver = winners.find(w => w.rank === 2);
    const bronze = winners.find(w => w.rank === 3);

    return (
        <div className="flex flex-col items-center justify-end gap-4 mb-4 mt-16">
            <div className="flex flex-wrap justify-center items-end gap-4">
                {silver && <PodiumItem rank={2} winner={silver} color="gray" size="w-24 h-24" icon={<Medal className="w-10 h-10 text-gray-500" />} />}
                {gold && <PodiumItem rank={1} winner={gold} color="yellow" size="w-32 h-32" icon={<Crown className="w-12 h-12 text-yellow-500" />} isGold />}
                {bronze && <PodiumItem rank={3} winner={bronze} color="amber" size="w-24 h-24" icon={<Medal className="w-10 h-10 text-amber-600" />} />}
            </div>
        </div>
    );
};

const WinnersList = ({ winners }: { winners: any[] }) => {
    if (!winners?.length) return null;

    return (
        <div className="rounded-2xl bg-white shadow-xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4">
                <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-white" />
                    <h3 className="font-bold text-white">🏅 Classement général</h3>
                    <span className="ml-auto px-2 py-1 rounded-full bg-white/20 text-xs font-bold text-white">
                        {winners.length} gagnant{winners.length > 1 ? 's' : ''}
                    </span>
                </div>
            </div>
            <div className="divide-y divide-gray-100">
                {winners.map((winner) => (
                    <div key={winner.consultationId} className="p-4 hover:bg-purple-50 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                    {winner.rank}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{winner.username}</p>
                                    <p className="text-xs text-gray-500">{winner.country || 'Côte d\'Ivoire'}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-mono font-bold text-green-600">{winner.timeSpentFormatted}</p>
                                <p className="text-xs text-gray-500">⏱️ Temps</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const WinnersSection = memo(({ consultations }: { consultations: any[] }) => {
    const ranking = useMemo(() => computeRankingFromConsultations(consultations), [consultations]);

    if (!consultations?.length) {
        return (
            <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-2xl mb-8">
                <Gift className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">🎮 Aucun participant</h3>
                <p className="text-gray-500">Personne n'a participé à cette édition</p>
            </div>
        );
    }

    if (!ranking) {
        return (
            <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-2xl mb-8">
                <Gift className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">⏳ En attente des résultats</h3>
                <p className="text-gray-500">Les temps de jeu seront bientôt disponibles</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 mb-8 mt-4">
            <WinningInfoCard
                fastestTimeFormatted={ranking.fastestTimeFormatted}
                totalParticipants={ranking.totalParticipants}
            />
            <Podium winners={ranking.winners} />
            <WinnersList winners={ranking.winners} />
        </div>
    );
});

const ParticipationsSection = memo(({ consultations, activeEditionId }: any) => (
    <div className="max-w-7xl mx-auto mt-4">
        {consultations.length === 0 ? (
            <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-purple-400" />
                </div>
                <p className="text-gray-500">📜 Aucune partie n'a été jouée dans cette édition</p>
            </div>
        ) : (
            <div className="flex justify-center items-center mb-4">
                <CacheLink href={`/star/learning/historique/${activeEditionId || ''}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white hover:scale-105 transition-all duration-300 shadow-md">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    📋 VOIR TOUTES LES PARTICIPATIONS
                </CacheLink>
            </div>
        )}
    </div>
));

const TitleSection = memo(() => (
    <div className="mb-8">
        <div className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 px-4 py-1.5 mb-3 shadow-sm w-fit mx-auto">
            <Crown className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-black uppercase tracking-wider text-purple-700">
                🏆 CLASSEMENT DE L'ÉDITION
            </span>
            <Sparkles className="w-4 h-4 text-purple-500" />
        </div>
    </div>
));

const EditionCard = memo(({ activeEdition }: { activeEdition: { startDate: string; endDate: string } }) => (
    <div className="mb-4 mt-4 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-800 via-indigo-600 to-gray-600 p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div>
                    <p className="text-xs text-white font-bold">📅 Édition Précédente</p>
                    <p className="text-white text-xs">
                        Du {formatEditionDate(new Date(activeEdition.startDate))} au {formatEditionDate(new Date(activeEdition.endDate))}
                    </p>
                </div>
            </div>
        </div>
    </div>
));

function Historique() {
    const { activeEdition, consultations } = useAdminConsultationsPageFinished();

    return (
        <div className="w-full mx-auto max-w-xl">
            {activeEdition && (<>
                <EditionCard activeEdition={activeEdition} />
                <TitleSection />
                <WinnersSection consultations={consultations} />
                <ParticipationsSection consultations={consultations} activeEditionId={activeEdition?.id} />
            </>)}
        </div>
    );
}

export default memo(Historique);