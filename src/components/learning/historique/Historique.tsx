'use client';
import Loader from "@/app/loading";
import { useAdminConsultationsPageFinished } from "@/hooks/learning/historique/useAdminConsultationsPageFinished";
import { formatEditionDate } from "@/lib/functions";
import { Winner } from "@/lib/interfaces";
import { Award, Crown, Gift, ListOrdered, Medal, Shuffle, Sparkles, Trophy } from "lucide-react";
import { memo } from 'react';
import CacheLink from "../../commons/CacheLink";

const WinningCombinationCard = ({ combination }: { combination: string }) => (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 p-6 text-white shadow-xl mb-8">
        <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                <Award className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Combinaison Gagnante</span>
                <Trophy className="w-4 h-4" />
            </div>
            <div className="flex justify-center gap-4 mb-4">
                {combination.split('').map((digit, index) => (
                    <div key={index} className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-4xl sm:text-5xl font-black">{digit}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const PodiumItem = ({ rank, winner, color, size, icon, isGold }: any) => (
    <div className={`flex flex-col items-center ${isGold ? '-mt-8' : ''}`}>
        <div className={`${size} rounded-full bg-gradient-to-br from-${color}-400 to-${color}-500 p-1 shadow-lg`}>
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">{icon}</div>
        </div>
        <div className="mt-2 text-center"><p className="font-bold text-gray-800 dark:text-white">{winner.username}</p></div>
        <div className={`mt-1 ${rank === 1 ? 'w-24 h-20' : rank === 2 ? 'w-20 h-16' : 'w-20 h-14'} bg-gradient-to-t from-${color}-500 to-${color}-400 rounded-t-lg flex items-center justify-center`}>
            <span className="text-2xl font-black text-white">{rank}</span>
        </div>
    </div>
);

const Podium = ({ winners }: { winners: Winner[] }) => {
    const gold = winners?.find(w => w.rank === 1);
    const silver = winners?.find(w => w.rank === 2);
    const bronze = winners?.find(w => w.rank === 3);

    return (
        <div className="flex flex-col items-center justify-end gap-4 mb-8">
            <div className="flex flex-wrap justify-center items-end gap-4">
                {silver && <PodiumItem rank={2} winner={silver} color="gray" size="w-24 h-24" icon={<Medal className="w-10 h-10 text-gray-500" />} />}
                {gold && <PodiumItem rank={1} winner={gold} color="yellow" size="w-32 h-32" icon={<Crown className="w-12 h-12 text-yellow-500" />} isGold />}
                {bronze && <PodiumItem rank={3} winner={bronze} color="amber" size="w-24 h-24" icon={<Medal className="w-10 h-10 text-amber-600" />} />}
            </div>
        </div>
    );
};

const WinnersList = ({ title, winners, icon, color }: any) => (
    <div className="rounded-2xl bg-white dark:bg-gray-900 shadow-xl overflow-hidden">
        <div className={`bg-gradient-to-r ${color} p-4`}>
            <div className="flex items-center gap-2">
                {icon}<h3 className="font-bold text-white">{title}</h3>
                <span className="ml-auto px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold text-white">{winners.length} gagnant{winners.length > 1 ? 's' : ''}</span>
            </div>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {winners.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">Aucun gagnant dans cette catégorie</div>
            ) : (
                winners.map((winner: any) => (
                    <div key={winner.consultationId} className="p-4 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${color} flex items-center justify-center text-white font-bold text-sm`}>{winner.rank}</div>
                                <div><p className="font-semibold text-gray-900 dark:text-white">{winner.username}</p><p className="text-xs text-gray-500">Combinaison: {winner.combination}</p></div>
                            </div>
                            <div className="text-right"><p className="text-sm font-mono font-bold text-purple-600 dark:text-purple-400">{winner.country}</p></div>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
);

const WinnersSection = memo(({ hasWinners, winningCombination, winners, consultations }: any) => {
    if (!hasWinners) {
        if (consultations.length === 0) return null;
        return (
            <div className="text-center py-12 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl mb-8">
                <Gift className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Aucun gagnant</h3>
            </div>
        );
    }

    return (
        <div className="space-y-8 mb-8">
            <WinningCombinationCard combination={winningCombination || "????"} />
            <Podium winners={winners.exact} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WinnersList title="🏆 Gagnants - Ordre" winners={winners.exact} icon={<ListOrdered className="w-4 h-4" />} color="from-yellow-500 to-orange-500" />
                <WinnersList title="🔄 Gagnants - Désordre" winners={winners.disordered} icon={<Shuffle className="w-4 h-4" />} color="from-blue-500 to-cyan-500" />
            </div>
        </div>
    );
});

const ParticipationsSection = memo(({ consultations, activeEditionId }: any) => (
    <div className="max-w-7xl mx-auto">
        {consultations.length === 0 ? (
            <div className="text-center py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-purple-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">Aucune partie n'a été jouée dans cette édition</p>
            </div>
        ) : (
            <div className="flex justify-center items-center mb-4">
                <CacheLink href={`/star/historique/${activeEditionId || ''}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 dark:from-purple-900/30 dark:to-indigo-900/30 text-white dark:text-purple-400 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    VOIR TOUTES LES PARTICIPATIONS
                </CacheLink>
            </div>
        )}
    </div>
));

const TitleSection = memo(() => (
    <div className="mb-8">
        <div className="flex flex-col items-start lg:items-center justify-between gap-4">
            <div className="flex items-center text-center gap-2 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 px-4 py-1.5 mb-3 shadow-sm">
                <Crown className="w-4 h-4 text-yellow-500" />
                <span className="text-xs text-center font-black uppercase tracking-wider text-purple-700 dark:text-purple-400">
                    RÉSULTATS DE LA DERNIÈRE ÉDITION
                </span>
                <Sparkles className="w-4 h-4 text-purple-500" />
            </div>
        </div>
    </div>
));

const EditionCard = memo(({ activeEdition }: { activeEdition: { startDate: string; endDate: string } }) => (
    <div className="mb-8 mt-8 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-800 via-indigo-600 to-gray-600 p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div>
                    <p className="text-xs text-white font-bold">Édition Précédente</p>
                    <p className="text-white text-xs">
                        Du {formatEditionDate(new Date(activeEdition.startDate))} au {formatEditionDate(new Date(activeEdition.endDate))}
                    </p>
                </div>
            </div>
        </div>
    </div>
));

function Historique() {
    const data = useAdminConsultationsPageFinished();

    if (data.loading) return <Loader />;

    return (
        <div className="w-full mx-auto max-w-xl px-4 py-4">
            {data.activeEdition && <EditionCard activeEdition={data.activeEdition} />}
            <TitleSection />
            <WinnersSection
                hasWinners={data.hasWinners}
                winningCombination={data.winningCombination}
                winners={data.winners}
                consultations={data.consultations}
            />
            <ParticipationsSection
                consultations={data.consultations}
                activeEditionId={data.activeEdition?.id}
            />
        </div>
    );
}

export default memo(Historique);