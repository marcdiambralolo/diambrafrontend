'use client';
import Loader from "@/app/loading";
import { useAdminConsultationsPageFinished } from "@/hooks/learning/lacompetition/useAdminConsultationsPageFinished";
import { formatDateFRJeu, formatDateTime, formatEditionDate, formatNumber } from "@/lib/functions";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Crown, Sparkles, Star, Timer, Users, Zap } from "lucide-react";
import { memo, useMemo } from 'react';
import { CountdownTimerLight, EndedBanner, NotStartedBanner, ParticipationsSection, WinnersSection } from "../Features";
import { fadeInUp } from "@/components/admin/consultations/ConsultationsPageClientEnded";

const GlowButton = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group relative block w-full"
        type="button"
    >
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 via-green-500 to-green-800 rounded-xl text-white font-bold text-lg shadow-2xl overflow-hidden">
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
                <Star className="w-5 h-5" />
            </motion.div>
            <span className="relative z-10">{children}</span>
            <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
            >
                <Zap className="w-5 h-5" />
            </motion.div>
        </div>
    </motion.button>
);

export const ActiveBanner = ({ endDate, handleEndMatch, startDate, formatDate, gameConfig, demarrerlejeu }: any) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95, rotateX: -15 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        exit={{ opacity: 0, scale: 0.95, rotateX: 15 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="relative mb-8"
    >

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600 p-0.5 shadow-2xl">
            <div className="relative bg-gradient-to-br from-amber-600/90 to-red-600/90 backdrop-blur-sm p-6 rounded-3xl">

                <div className="grid grid-cols-2 gap-3 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-lg"
                    >
                        <div className="text-center">
                            <div className="text-3xl mb-1">🎮</div>
                            <div className="text-[10px] text-white/70 uppercase tracking-wider">N° Match</div>
                            <div className="text-sm font-bold text-white">
                                {gameConfig.numeromatch}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-lg"
                    >
                        <div className="text-center">
                            <div className="text-3xl mb-1">📊</div>
                            <div className="text-[10px] text-white/70 uppercase tracking-wider">Niveau</div>
                            <div className="text-sm font-bold text-white">{gameConfig?.niveau || 2}</div>
                        </div>
                    </motion.div>
                </div>

                <CountdownTimerLight
                    monjeuid={gameConfig?.id || ''}
                    targetDate={endDate}
                    variant="light"
                    onFinish={handleEndMatch}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                >
                    <GlowButton onClick={demarrerlejeu}>
                        🚀 PARTICIPEZ MAINTENANT
                    </GlowButton>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-2 gap-3 mt-4"
                >
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20 group hover:bg-white/20 transition-all">
                        <div className="flex items-center gap-2 text-white/80 text-[10px] mb-1">
                            <Calendar className="w-3 h-3 group-hover:scale-110 transition-transform" />
                            <span>DÉBUT</span>
                        </div>
                        <div className="text-white font-bold text-[11px]">{formatDate(startDate)}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20 group hover:bg-white/20 transition-all">
                        <div className="flex items-center gap-2 text-white/80 text-[10px] mb-1">
                            <Timer className="w-3 h-3 group-hover:scale-110 transition-transform" />
                            <span>FIN</span>
                        </div>
                        <div className="text-white font-bold text-[11px]">{formatDate(endDate)}</div>
                    </div>
                </motion.div>
            </div>
        </div>

        <style jsx>{`
            @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            .animate-shimmer {
                animation: shimmer 2s infinite;
            }
            .animation-delay-1000 {
                animation-delay: 1s;
            }
            .animation-delay-2000 {
                animation-delay: 2s;
            }
        `}</style>
    </motion.div>
);

interface StatCardProps {
    value: number | null;
    label: string;
    icon: React.ReactNode;
    color: string;
    delay?: number;
}

export const StatCard = memo<StatCardProps>(({ value, label, icon, color, delay = 0 }) => (
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
            <div className="relative">
                <p className="text-3xl font-extrabold tracking-tight">
                    {value !== null ? formatNumber(value) : '--'}
                </p>
            </div>
        </div>
    </motion.div>
));

export const TitleSection = memo(({ showEnded }: { showEnded: boolean }) => (
    <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
    >
        <div className="flex flex-col items-start lg:items-center justify-between gap-4">
            <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="flex items-center text-center gap-2 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 px-4 py-1.5 mb-3 shadow-sm"
            >
                <Crown className="w-4 h-4 text-yellow-500" />
                <span className="text-xs text-center font-black uppercase tracking-wider text-purple-700 dark:text-purple-400">
                    {showEnded ? "RÉSULTATS DE LA DERNIÈRE ÉDITION" : "PROCLAMATION DES RÉSULTATS"}
                </span>
                <Sparkles className="w-4 h-4 text-purple-500" />
            </motion.div>
        </div>
    </motion.div>
));

interface EditionCardProps {
    activeEdition: {
        id: string;
        startDate: string;
        endDate: string;
    };
}

export const EditionCard = memo(({ activeEdition }: EditionCardProps) => (
    <motion.div
        variants={fadeInUp}
        className="mb-8 mt-8 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-800 via-indigo-600 to-gray-600 p-5 shadow-xl"
    >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div>
                    <p className="text-xs text-white font-bold">Édition Précédente</p>
                    <p className="text-white text-xs ">
                        Du {formatEditionDate(new Date(activeEdition.startDate))} au {formatEditionDate(new Date(activeEdition.endDate))}
                    </p>
                </div>
            </div>
        </div>
    </motion.div>
));

interface BannersSectionProps {
    showNotStarted: boolean;
    showActive: boolean;
    showEnded: boolean;
    startDate: Date | null;
    endDate: Date | null;
    gameConfig: any;
    lastEndedGame: any;
    stats: any;
    onOpenGame: () => void;
    onEndMatch: () => void;
    demarrerJeu: () => void;
}

export const BannersSection = memo(({
    showNotStarted,
    showActive,
    showEnded,
    startDate,
    endDate,
    gameConfig,
    lastEndedGame,
    stats,
    onOpenGame,
    onEndMatch,
    demarrerJeu
}: BannersSectionProps) => {
    const bannerType = useMemo(() => {

        if (showEnded) return 'ended';
        if (showActive && endDate && startDate) return 'active';
        if (showNotStarted && startDate) return 'not-started';
        return 'active';
    }, [showEnded, showActive, showNotStarted, endDate, startDate]);

    const banners = {
        ended: <EndedBanner key="ended" lastEndedGame={lastEndedGame} />,
        active: (
            <ActiveBanner
                key="active"
                endDate={endDate}
                handleEndMatch={onEndMatch}
                startDate={startDate}
                formatDate={formatDateFRJeu}
                gameConfig={gameConfig}
                demarrerlejeu={demarrerJeu}
            />
        ),
        'not-started': (
            <NotStartedBanner
                key="not-started"
                startDate={startDate}
                handleOpenGame={onOpenGame}
                formatDateTime={formatDateTime}
            />
        ),
    };

    return (
        <div className="max-w-md mx-auto">
            <AnimatePresence mode="wait">
                {bannerType && banners[bannerType]}
            </AnimatePresence>

            <StatCard
                value={stats?.subscribers ?? null}
                label="Inscrits"
                icon={<Users className="w-3.5 h-3.5" />}
                color="from-purple-600 to-indigo-600"
                delay={0.2}
            />
        </div>
    );
});

interface CompetitionSectionProps {
    hasNotStartedEdition?: boolean;
    gameStarted?: boolean;
    showEnded?: boolean;
    startDate?: Date | null;
    endDate?: Date | null;
    gameConfig?: any;
    lastEndedGame?: any;
    stats?: any;
    onOpenGame?: () => void;
    onEndMatch?: () => void;
    demarrerJeu?: () => void;
    activeEdition?: any;
    winningCombination?: string | null;
    hasWinners?: boolean;
    winners?: any;
    consultations?: any[];
}

const CompetitionSection = memo(({
    hasNotStartedEdition = false,
    gameStarted = false,
    showEnded = false,
    startDate,
    endDate,
    gameConfig,
    lastEndedGame,
    stats,
    onOpenGame,
    onEndMatch,
    demarrerJeu,
    activeEdition,
    winningCombination,
    hasWinners = false,
    winners,
    consultations = [],
}: CompetitionSectionProps) => {
    return (
        <>
            <BannersSection
                showNotStarted={hasNotStartedEdition}
                showActive={gameStarted}
                showEnded={showEnded}
                startDate={startDate!}
                endDate={endDate!}
                gameConfig={gameConfig}
                lastEndedGame={lastEndedGame}
                stats={stats}
                onOpenGame={onOpenGame!}
                onEndMatch={onEndMatch!}
                demarrerJeu={demarrerJeu!}
            />

            {activeEdition && <EditionCard activeEdition={activeEdition} />}

            <TitleSection showEnded={showEnded} />

            <WinnersSection
                hasWinners={hasWinners}
                winningCombination={winningCombination!}
                winners={winners}
                consultations={consultations}
            />

            <ParticipationsSection
                consultations={consultations}
                activeEditionId={activeEdition?.id}
            />
        </>
    );
});

function LaCompetition() {
    const {
        handleOpenGame, handleEndMatch, demarrerJeu, hasNotStartedEdition, hasWinners,
        stats, startDate, endDate, gameConfig, lastEndedGame, loading,
        winningCombination, showEnded, consultations, activeEdition, winners,
    } = useAdminConsultationsPageFinished();

    const { gameStarted } = useMonEtoileStore();

    if (loading) return <Loader />;

    return (
        <div className="w-full mx-auto max-w-2xl px-4 py-4">
            <CompetitionSection
                hasNotStartedEdition={hasNotStartedEdition as boolean}
                gameStarted={gameStarted}
                showEnded={showEnded}
                startDate={startDate}
                endDate={endDate}
                gameConfig={gameConfig}
                lastEndedGame={lastEndedGame}
                stats={stats}
                onOpenGame={handleOpenGame}
                onEndMatch={handleEndMatch}
                demarrerJeu={demarrerJeu}
                activeEdition={activeEdition}
                winningCombination={winningCombination}
                hasWinners={hasWinners!}
                winners={winners}
                consultations={consultations}
            />
        </div>
    );
}

export default memo(LaCompetition);