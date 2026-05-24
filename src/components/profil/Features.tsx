'use client';
import { formatNumber } from "@/lib/functions";
import { LastEndedGame } from "@/lib/interfaces";
import { motion } from 'framer-motion';
import {
    Award, Calendar, CheckCircle2, Clock, Crown, TrendingUp, Trophy, Users, Zap,
    Flame, Hash, History, Hourglass, Medal, Rocket, Shuffle, Sparkles, Star,
} from "lucide-react";
import Link from 'next/link';
import React, { memo } from 'react';
import { fadeInUp } from "../admin/consultations/ConsultationsPageClientEnded";
import CacheLink from "../commons/CacheLink";
import { StatisticsData, Winner } from "@/hooks/profil/ended/useAdminConsultationsPageFinished";

interface StatCard2Props {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    subValue?: string;
    color: string;
    delay?: number;
    trend?: number;
}

export const StatCard2 = ({ icon, label, value, subValue, color, delay = 0, trend }: StatCard2Props) => (
    <motion.div
        variants={fadeInUp}
        custom={delay}
        whileHover={{ y: -5, scale: 1.02 }}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-5 text-white shadow-xl group cursor-pointer`}
    >
        <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-white/10 group-hover:scale-150 transition-transform duration-700" />
        <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                    {icon}
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${trend >= 0 ? 'bg-green-500/30' : 'bg-red-500/30'}`}>
                        <TrendingUp className={`w-3 h-3 ${trend < 0 && 'rotate-180'}`} />
                        <span>{Math.abs(trend)}%</span>
                    </div>
                )}
            </div>
            <div className="text-3xl font-black tracking-tight">{value}</div>
            <div className="text-xs font-medium opacity-90 mt-1">{label}</div>
            {subValue && <div className="text-[10px] opacity-75 mt-2">{subValue}</div>}
        </div>
    </motion.div>
);

export const WinningCombinationCard = ({ combination }: { combination: string }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 p-6 text-white shadow-xl mb-8"
    >
        <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                <Award className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Combinaison Gagnante</span>
                <Trophy className="w-4 h-4" />
            </div>
            <div className="flex justify-center gap-4 mb-4">
                {combination.split('').map((digit, index) => (
                    <motion.div
                        key={index}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: index * 0.1, type: "spring" }}
                        className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg"
                    >
                        <span className="text-4xl sm:text-5xl font-black">{digit}</span>
                    </motion.div>
                ))}
            </div>
            <p className="text-sm opacity-90">La combinaison qui rapporte gros ! 🎉</p>
        </div>
    </motion.div>
);

export const Podium = ({ winners }: { winners: Winner[] }) => {
    const gold = winners.find(w => w.rank === 1);
    const silver = winners.find(w => w.rank === 2);
    const bronze = winners.find(w => w.rank === 3);

    return (
        <div className="flex flex-col items-center justify-end gap-4 mb-8">
            <div className="flex flex-wrap justify-center items-end gap-4">
                {/* Silver (2nd) */}
                {silver && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 p-1 shadow-lg">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                <Medal className="w-10 h-10 text-gray-500" />
                            </div>
                        </div>
                        <div className="mt-2 text-center">
                            <p className="font-bold text-gray-800 dark:text-white">{silver.username}</p>
                            <p className="text-xs text-gray-500">{silver.timeSpent}s</p>
                        </div>
                        <div className="mt-1 w-20 h-16 bg-gradient-to-t from-gray-400 to-gray-300 rounded-t-lg flex items-center justify-center">
                            <span className="text-2xl font-black text-white">2</span>
                        </div>
                    </motion.div>
                )}

                {/* Gold (1st) */}
                {gold && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col items-center -mt-8"
                    >
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 p-1 shadow-xl">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                <Crown className="w-12 h-12 text-yellow-500" />
                            </div>
                        </div>
                        <div className="mt-2 text-center">
                            <p className="font-bold text-lg text-gray-800 dark:text-white">{gold.username}</p>
                            <p className="text-xs text-gray-500">{gold.timeSpent}s</p>
                        </div>
                        <div className="mt-1 w-24 h-20 bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-t-lg flex items-center justify-center">
                            <span className="text-3xl font-black text-white">1</span>
                        </div>
                    </motion.div>
                )}

                {/* Bronze (3rd) */}
                {bronze && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 p-1 shadow-lg">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                <Medal className="w-10 h-10 text-amber-600" />
                            </div>
                        </div>
                        <div className="mt-2 text-center">
                            <p className="font-bold text-gray-800 dark:text-white">{bronze.username}</p>
                            <p className="text-xs text-gray-500">{bronze.timeSpent}s</p>
                        </div>
                        <div className="mt-1 w-20 h-14 bg-gradient-to-t from-amber-700 to-amber-600 rounded-t-lg flex items-center justify-center">
                            <span className="text-2xl font-black text-white">3</span>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export const WinnersList = ({ title, winners, icon, color }: { title: string; winners: Winner[]; icon: React.ReactNode; color: string }) => (
    <motion.div
        variants={fadeInUp}
        className="rounded-2xl bg-white dark:bg-gray-900 shadow-xl overflow-hidden"
    >
        <div className={`bg-gradient-to-r ${color} p-4`}>
            <div className="flex items-center gap-2">
                {icon}
                <h3 className="font-bold text-white">{title}</h3>
                <span className="ml-auto px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold text-white">
                    {winners.length} gagnant{winners.length > 1 ? 's' : ''}
                </span>
            </div>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {winners.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    Aucun gagnant dans cette catégorie
                </div>
            ) : (
                winners.map((winner, index) => (
                    <motion.div
                        key={winner.consultationId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${color} flex items-center justify-center text-white font-bold text-sm`}>
                                    {winner.rank}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{winner.username}</p>
                                    <p className="text-xs text-gray-500">Combinaison: {winner.combination}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-mono font-bold text-purple-600 dark:text-purple-400">{winner.timeSpent}s</p>
                                <p className="text-xs text-gray-500">Temps</p>
                            </div>
                        </div>
                    </motion.div>
                ))
            )}
        </div>
    </motion.div>
);

export const StatisticsPanel = ({ stats }: { stats: StatisticsData }) => (
    <motion.div variants={fadeInUp} className="space-y-6">
        {/* Taux de succès */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-xs opacity-80">Ordre</span>
                </div>
                <p className="text-2xl font-bold">{stats.successRate.exact.toFixed(1)}%</p>
                <p className="text-xs opacity-80 mt-1">{stats.successRate.exact > 0 ? `${Math.round(stats.successRate.exact * stats.totalParticipants / 100)} joueurs` : 'Aucun'}</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                    <Shuffle className="w-5 h-5" />
                    <span className="text-xs opacity-80">Désordre</span>
                </div>
                <p className="text-2xl font-bold">{stats.successRate.disordered.toFixed(1)}%</p>
                <p className="text-xs opacity-80 mt-1">{stats.successRate.disordered > 0 ? `${Math.round(stats.successRate.disordered * stats.totalParticipants / 100)} joueurs` : 'Aucun'}</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                    <Users className="w-5 h-5" />
                    <span className="text-xs opacity-80">Participation</span>
                </div>
                <p className="text-2xl font-bold">{stats.uniqueParticipants}</p>
                <p className="text-xs opacity-80 mt-1">joueurs uniques</p>
            </div>
        </div>
    </motion.div>
);

interface StatCardProps {
    value: number | null;
    label: string;
    icon: React.ReactNode;
    loading: boolean;
    color: string;
    delay?: number;
}

export const StatCard = memo<StatCardProps>(({ value, label, icon, loading, color, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay, duration: 0.5, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-5 text-white shadow-xl cursor-pointer group border border-white/20`}
    >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-white/15 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
        <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold opacity-90">{label}</span>
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">{icon}</div>
            </div>
            {loading ? (
                <div className="h-10 w-20 bg-white/30 rounded-xl animate-pulse" />
            ) : (
                <div className="relative">
                    <p className="text-3xl font-extrabold tracking-tight">
                        {value !== null ? formatNumber(value) : '--'}
                    </p>
                    <div className="absolute -top-2 -right-2">
                        <Star className="w-3 h-3 text-yellow-300 animate-pulse" />
                    </div>
                </div>
            )}
        </div>
    </motion.div>
));

export const GlowButton = ({ href, children, variant = 'primary' }: { href: string; children: React.ReactNode; variant?: 'primary' | 'secondary' }) => {
    const gradient = variant === 'primary'
        ? 'from-purple-600 via-pink-600 to-orange-500'
        : 'from-blue-600 via-cyan-500 to-teal-600';

    return (
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="relative group w-full sm:w-auto">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition duration-500" />
            <Link
                href={href}
                className={`relative flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r ${gradient} text-white font-bold rounded-2xl shadow-lg transition-all duration-300 text-sm sm:text-base w-full sm:w-auto`}
            >
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>{children}</span>
                <Zap className="w-4 h-4" />
            </Link>
        </motion.div>
    );
};

export const CountdownTimer = ({ targetDate, variant = 'light', onFinish }: { targetDate: Date; variant?: 'light' | 'dark'; onFinish?: () => void }) => {
    const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [hasFinished, setHasFinished] = React.useState(false);

    React.useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const diff = targetDate.getTime() - now.getTime();

            if (diff <= 0) {
                clearInterval(timer);
                if (!hasFinished) {
                    setHasFinished(true);
                    onFinish?.();
                }
                return;
            }

            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % 86400000) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % 3600000) / (1000 * 60)),
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
                    <p className={`${textColor} font-black text-xl sm:text-2xl leading-tight`}>
                        {value.toString().padStart(2, '0')}
                    </p>
                    <p className={`${textColor}/70 text-[9px] uppercase tracking-wider font-medium`}>
                        {unit === 'days' ? 'j' : unit === 'hours' ? 'h' : unit === 'minutes' ? 'm' : 's'}
                    </p>
                </div>
            ))}
        </div>
    );
};

export const HistoryButton = memo(({ gameId }: { gameId?: string }) => (
    <CacheLink
        href={`/star/historique${gameId ? `/${gameId}` : ''}`}
        className="group flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-sm w-full sm:w-auto"
    >
        <History className="w-4 h-4" />
        <span>Historique</span>
    </CacheLink>
));

export const GameStatusBadge = ({ children, variant = 'primary' }: { children: React.ReactNode; variant?: 'primary' | 'success' | 'error' }) => {
    const colors = {
        primary: 'from-purple-600 to-pink-600',
        success: 'from-green-600 to-emerald-600',
        error: 'from-red-600 to-orange-600'
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${colors[variant]} px-4 py-2 shadow-xl`}
        >
            {children}
        </motion.div>
    );
};

export const NotStartedBanner = ({ startDate, handleOpenGame, formatDateTime }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-5 mb-6 shadow-xl"
    >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="relative flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/20 p-3">
                    <Hourglass className="w-8 h-8 text-white" />
                </div>
                <div>
                    <p className="text-white font-bold text-lg">Préparez-vous !</p>
                    <p className="text-white/80 text-xs">Le jeu n'a pas encore commencé</p>
                </div>
            </div>
            <CountdownTimer targetDate={startDate} variant="light" onFinish={handleOpenGame} />
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl">
                <Clock className="w-4 h-4 text-white" />
                <span className="text-white text-xs font-medium">Ouverture {formatDateTime(startDate)}</span>
            </div>
        </div>
    </motion.div>
);

export const EndedBanner = ({ lastEndedGame }: { lastEndedGame: LastEndedGame | null }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 p-5 mb-6 shadow-xl"
    >
        <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
                <div className="rounded-full bg-yellow-500/20 p-3">
                    <Award className="w-8 h-8 text-yellow-400" />
                </div>
                <div>
                    <p className="text-white font-bold text-lg">Édition terminée !</p>
                    <p className="text-gray-300 text-xs">
                        {lastEndedGame ? (
                            <>Terminée le {new Date(lastEndedGame.endgameDate).toLocaleDateString('fr-FR')}</>
                        ) : (
                            'Merci pour votre participation'
                        )}
                    </p>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <div>
                        <p className="text-[10px] text-gray-300">Prochaine édition</p>
                        <p className="font-bold text-white text-sm">Très bientôt</p>
                    </div>
                </div>
                <HistoryButton gameId={lastEndedGame?.id} />
            </div>
        </div>
    </motion.div>
);

export const ActiveBanner = ({ endDate, handleEndMatch, startDate, formatDate, gameConfig }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-5 mb-6 shadow-xl"
    >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="relative flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/20 p-3">
                    <Flame className="w-8 h-8 text-white" />
                </div>
                <div>
                    <p className="text-white font-bold text-lg flex items-center gap-1">
                        <Rocket className="w-4 h-4" />
                        Jeu en cours !
                    </p>
                    <p className="text-white/80 text-xs">Temps restant pour jouer</p>
                </div>
            </div>

            <CountdownTimer targetDate={endDate} variant="light" onFinish={handleEndMatch} />

            <div className="flex items-center justify-between bg-white/10 rounded-xl p-3">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-white" />
                    <span className="text-white text-xs">Du {formatDate(startDate)}</span>
                </div>
                <div className="text-white text-xs">au {formatDate(endDate)}</div>
            </div>

            <GlowButton href={`/star/choix/${gameConfig?.id || ''}`}>
                Jouer Maintenant
            </GlowButton>
        </div>
    </motion.div>
);