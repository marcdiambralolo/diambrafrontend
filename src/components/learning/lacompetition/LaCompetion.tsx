'use client';
import Loader from "@/app/loading";
import { useAdminConsultationsPageFinished } from "@/hooks/learning/lacompetition/useAdminConsultationsPageFinished";
import { formatDateFRJeu, formatDateTime, formatEditionDate, formatNumber } from "@/lib/functions";
import { LastEndedGame, Winner } from "@/lib/interfaces";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { Award, Calendar, Clock, Crown, Gift, History, Hourglass, ListOrdered, Medal, Shuffle, Sparkles, Star, Timer, Trophy, Users, Zap } from "lucide-react";
import { memo, useEffect, useState } from 'react';
import CacheLink from "../../commons/CacheLink";
import ResultatsPage from "../endgame/ResultatsPage";

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

const CountdownTimer = ({ targetDate, variant = 'light', onFinish }: any) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [hasFinished, setHasFinished] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            const diff = targetDate.getTime() - Date.now();
            if (diff <= 0) {
                clearInterval(timer);
                if (!hasFinished) { setHasFinished(true); onFinish?.(); }
                return;
            }
            setTimeLeft({
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                minutes: Math.floor((diff % 3600000) / 60000),
                seconds: Math.floor((diff % 60000) / 1000)
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate, hasFinished, onFinish]);

    const textColor = variant === 'light' ? 'text-white' : 'text-gray-800';
    const bgColor = variant === 'light' ? 'bg-black/25' : 'bg-white/80';

    return (
        <div className="flex gap-2 justify-center flex-wrap">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className={`text-center ${bgColor} backdrop-blur-lg rounded-xl px-2 py-1.5 min-w-[55px] shadow-lg`}>
                    <p className={`${textColor} font-black text-xl sm:text-2xl leading-tight`}>{String(value).padStart(2, '0')}</p>
                    <p className={`${textColor}/70 text-[9px] uppercase tracking-wider font-medium`}>{unit === 'days' ? 'j' : unit === 'hours' ? 'h' : unit === 'minutes' ? 'm' : 's'}</p>
                </div>
            ))}
        </div>
    );
};

const HistoryButton = memo(() => (
    <CacheLink href="/star/historique/1779760200000" className="group flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-sm w-full sm:w-auto">
        <History className="w-4 h-4" /><span>Historique</span>
    </CacheLink>
));


const NotStartedBanner = ({ startDate, handleOpenGame }: any) => (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-5 mb-6 shadow-xl">
        <div className="relative flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/20 p-3"><Hourglass className="w-8 h-8 text-white" /></div>
                <div><p className="text-white font-bold text-lg">Préparez-vous !</p><p className="text-white/80 text-xs">Le jeu n'a pas encore commencé</p></div>
            </div>
            <CountdownTimer targetDate={startDate} variant="light" onFinish={handleOpenGame} />
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl"><Clock className="w-4 h-4 text-white" /><span className="text-white text-xs font-medium">Ouverture {formatDateTime(startDate)}</span></div>
        </div>
    </div>
);

const EndedBanner = ({ lastEndedGame }: { lastEndedGame: LastEndedGame | null }) => (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 p-5 mb-6 shadow-xl">
        <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
                <div className="rounded-full bg-yellow-500/20 p-3"><Award className="w-8 h-8 text-yellow-400" /></div>
                <div><p className="text-white font-bold text-lg">Édition terminée !</p><p className="text-gray-300 text-xs">{lastEndedGame ? `Terminée le ${new Date(lastEndedGame.endgameDate).toLocaleDateString('fr-FR')}` : 'Merci pour votre participation'}</p></div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2"><Trophy className="w-5 h-5 text-yellow-400" /><div><p className="text-[10px] text-gray-300">Prochaine édition</p><p className="font-bold text-white text-sm">Très bientôt</p></div></div>
                <HistoryButton />
            </div>
        </div>
    </div>
);

const CountdownTimerLight = ({ targetDate, onFinish }: any) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [hasFinished, setHasFinished] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            const diff = targetDate.getTime() - Date.now();
            if (diff <= 0) { clearInterval(timer); if (!hasFinished) { setHasFinished(true); onFinish?.(); } return; }
            setTimeLeft({
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                minutes: Math.floor((diff % 3600000) / 60000),
                seconds: Math.floor((diff % 60000) / 1000)
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate, hasFinished, onFinish]);

    return null;
};

const BANNER_CONFIG = {
    ended: (props: any) => <EndedBanner key="ended" lastEndedGame={props.lastEndedGame} />,
    active: (props: any) => (
        <ActiveBanner
            endDate={props.endDate}
            handleEndMatch={props.onEndMatch}
            startDate={props.startDate}
            formatDate={formatDateFRJeu}
            gameConfig={props.gameConfig}
            demarrerlejeu={props.demarrerJeu}
        />
    ),
    'not-started': (props: any) => (
        <NotStartedBanner
            startDate={props.startDate}
            handleOpenGame={props.onOpenGame}
            formatDateTime={formatDateTime}
        />
    ),
} as const;

const GlowButton = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <button onClick={onClick} className="group relative block w-full transition-transform hover:scale-[1.02] active:scale-[0.98]" type="button">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 via-green-500 to-green-800 rounded-xl text-white font-bold text-lg shadow-2xl overflow-hidden">
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="animate-spin-slow"><Star className="w-5 h-5" /></div>
            <span className="relative z-10">{children}</span>
            <div className="animate-pulse-x"><Zap className="w-5 h-5" /></div>
        </div>
    </button>
);

const ActiveBanner = ({ endDate, handleEndMatch, startDate, formatDate, gameConfig, demarrerlejeu }: any) => (
    <div className="relative mb-8 transition-all duration-500">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600 p-0.5 shadow-2xl">
            <div className="relative bg-gradient-to-br from-amber-600/90 to-red-600/90 backdrop-blur-sm p-6 rounded-3xl">
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                        { icon: "🎮", label: "N° Match", value: gameConfig?.numeromatch },
                        { icon: "📊", label: "Niveau", value: gameConfig?.niveau || 2 }
                    ].map((item, i) => (
                        <div key={i} className="bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-lg">
                            <div className="text-center">
                                <div className="text-3xl mb-1">{item.icon}</div>
                                <div className="text-[10px] text-white/70 uppercase tracking-wider">{item.label}</div>
                                <div className="text-sm font-bold text-white">{item.value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <CountdownTimerLight targetDate={endDate} variant="light" onFinish={handleEndMatch} />
                <GlowButton onClick={demarrerlejeu}>🚀 PARTICIPEZ MAINTENANT</GlowButton>

                <div className="grid grid-cols-2 gap-3 mt-4">
                    {[
                        { icon: <Calendar className="w-3 h-3" />, label: "DÉBUT", date: startDate, format: formatDate },
                        { icon: <Timer className="w-3 h-3" />, label: "FIN", date: endDate, format: formatDate }
                    ].map((item, i) => (
                        <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20 transition-all hover:bg-white/20">
                            <div className="flex items-center gap-2 text-white/80 text-[10px] mb-1">
                                {item.icon}
                                <span>{item.label}</span>
                            </div>
                            <div className="text-white font-bold text-[11px]">{item.format(item.date)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const StatCard = memo(({ value, label, icon, color }: { value: number | null; label: string; icon: React.ReactNode; color: string }) => (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-5 text-white shadow-xl cursor-pointer group border border-white/20 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-white/15 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
        <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold opacity-90">{label}</span>
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">{icon}</div>
            </div>
            <p className="text-3xl font-extrabold tracking-tight">{value !== null ? formatNumber(value) : '--'}</p>
        </div>
    </div>
));

const TitleSection = memo(({ showEnded }: { showEnded: boolean }) => (
    <div className="mb-8">
        <div className="flex flex-col items-start lg:items-center justify-between gap-4">
            <div className="flex items-center text-center gap-2 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 px-4 py-1.5 mb-3 shadow-sm">
                <Crown className="w-4 h-4 text-yellow-500" />
                <span className="text-xs text-center font-black uppercase tracking-wider text-purple-700 dark:text-purple-400">
                    {showEnded ? "RÉSULTATS DE LA DERNIÈRE ÉDITION" : "PROCLAMATION DES RÉSULTATS"}
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

const BannersSection = memo((props: any) => {
    const bannerKey = props.showEnded ? 'ended' : (props.showActive && props.endDate && props.startDate) ? 'active' : (props.showNotStarted && props.startDate) ? 'not-started' : 'active';
    const Banner = BANNER_CONFIG[bannerKey as keyof typeof BANNER_CONFIG];

    return (
        <div className="max-w-md mx-auto">
            {Banner && <Banner {...props} />}
            <StatCard value={props.stats?.subscribers ?? null} label="Inscrits" icon={<Users className="w-3.5 h-3.5" />} color="from-purple-600 to-indigo-600" />
        </div>
    );
});

function LaCompetition() {
    const data = useAdminConsultationsPageFinished();
    const { gameStarted } = useMonEtoileStore();

    if (data.loading) return <Loader />;

    return (
        <div className="w-full mx-auto max-w-2xl px-4 py-4">
            <ResultatsPage />
            <BannersSection
                showNotStarted={data.hasNotStartedEdition}
                showActive={gameStarted}
                showEnded={data.showEnded}
                startDate={data.startDate}
                endDate={data.endDate}
                gameConfig={data.gameConfig}
                lastEndedGame={data.lastEndedGame}
                stats={data.stats}
                onOpenGame={data.handleOpenGame}
                onEndMatch={data.handleEndMatch}
                demarrerJeu={data.demarrerJeu}
            />
            {data.activeEdition && <EditionCard activeEdition={data.activeEdition} />}
            <TitleSection showEnded={data.showEnded} />
            <WinnersSection hasWinners={data.hasWinners} winningCombination={data.winningCombination} winners={data.winners} consultations={data.consultations} />
            <ParticipationsSection consultations={data.consultations} activeEditionId={data.activeEdition?.id} />
        </div>
    );
}

export default memo(LaCompetition);