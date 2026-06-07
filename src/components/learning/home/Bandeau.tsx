'use client';
import Loader from "@/app/loading";
import { useAdminConsultationsPageFinished } from "@/hooks/learning/home/useAdminConsultationsPageFinished";
import { formatDateFRJeu, formatDateTime } from "@/lib/functions";
import { LastEndedGame, TimeLeft } from "@/lib/interfaces";
import { TIME_UNITS } from "@/lib/learning/constantes";
import { Award, CalendarX, Clock, History, Hourglass, Trophy } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import CacheLink from "../../commons/CacheLink";
import { GlowButton } from "../commons/Boutons";
import ErrorPage from "../commons/Erreur";

interface CountdownTimerProps {
    targetDate: Date;
    onFinish: () => void;
}

interface NotStartedBannerProps {
    startDate: Date;
    handleOpenGame: () => void;
}

interface EndedBannerProps {
    lastEndedGame: LastEndedGame | null;
}

interface ActiveBannerProps {
    gameConfig: any;
    demarrerJeu: () => void;
}

const CountdownTimer = memo(({ targetDate, onFinish }: CountdownTimerProps) => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [hasFinished, setHasFinished] = useState(false);

    const calculateTimeLeft = useCallback(() => {
        const diff = targetDate.getTime() - Date.now();

        if (diff <= 0) {
            if (!hasFinished) {
                setHasFinished(true);
                onFinish();
            }
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
            days: Math.floor(diff / 86400000),
            hours: Math.floor((diff % 86400000) / 3600000),
            minutes: Math.floor((diff % 3600000) / 60000),
            seconds: Math.floor((diff % 60000) / 1000)
        };
    }, [targetDate, hasFinished, onFinish]);

    useEffect(() => {
        const updateTimer = () => {
            setTimeLeft(calculateTimeLeft());
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);

        return () => clearInterval(timer);
    }, [calculateTimeLeft]);

    return (
        <div className="flex gap-2 justify-center flex-wrap">
            {TIME_UNITS.map(({ key, label }) => (
                <div key={key} className="text-center bg-black/25 backdrop-blur-lg rounded-xl px-2 py-1.5 min-w-[55px] shadow-lg">
                    <p className="text-white font-black text-xl leading-tight">
                        {String(timeLeft[key as keyof TimeLeft]).padStart(2, '0')}
                    </p>
                    <p className="text-white/70 text-[9px] uppercase tracking-wider">{label}</p>
                </div>
            ))}
        </div>
    );
});

const HistoryButton = memo(() => (
    <CacheLink
        href="/star/learning/historique/1779760200000"
        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors hover:bg-blue-700"
    >
        <History className="w-4 h-4" aria-hidden="true" />
        <span>Historique</span>
    </CacheLink>
));

const NoCompetitionBanner = memo(() => (
    <div className="w-full rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 p-6 mb-6 shadow-xl border border-slate-800">
        <div className="flex flex-col items-center text-center gap-4">
            <div className="rounded-full bg-slate-700/50 p-3 animate-pulse">
                <CalendarX className="w-8 h-8 text-slate-400" aria-hidden="true" />
            </div>
            <div>
                <p className="text-white font-extrabold text-lg">Aucun match programmé</p>
                <p className="text-slate-400 text-xs max-w-[280px] mt-1 mx-auto">
                    Les administrateurs n'ont pas encore planifié la prochaine session de jeu. Revenez un peu plus tard !
                </p>
            </div>
        </div>
    </div>
));

const NotStartedBanner = memo(({ startDate, handleOpenGame }: NotStartedBannerProps) => (
    <div className="w-full rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-5 mb-6 shadow-xl">
        <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/20 p-2">
                    <Hourglass className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <div>
                    <p className="text-white font-bold">Préparez-vous !</p>
                    <p className="text-white/80 text-xs">Le jeu n'a pas encore commencé</p>
                </div>
            </div>
            <CountdownTimer targetDate={startDate} onFinish={handleOpenGame} />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-xl">
                <Clock className="w-3 h-3 text-white" aria-hidden="true" />
                <span className="text-white text-xs">Ouverture {formatDateTime(startDate)}</span>
            </div>
        </div>
    </div>
));

const EndedBanner = memo(({ lastEndedGame }: EndedBannerProps) => {
    const endGameDate = useMemo(() =>
        lastEndedGame ? new Date(lastEndedGame.endgameDate).toLocaleDateString('fr-FR') : null,
        [lastEndedGame]
    );

    return (
        <div className="rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 p-5 mb-6 shadow-xl">
            <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-yellow-500/20 p-2">
                        <Award className="w-6 h-6 text-yellow-400" aria-hidden="true" />
                    </div>
                    <div>
                        <p className="text-white font-bold">Édition terminée !</p>
                        <p className="text-gray-300 text-xs">
                            {lastEndedGame ? `Terminée le ${endGameDate}` : 'Merci pour votre participation'}
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5">
                        <Trophy className="w-4 h-4 text-yellow-400" aria-hidden="true" />
                        <div>
                            <p className="text-[10px] text-gray-300">Prochaine édition</p>
                            <p className="font-bold text-white text-xs">Très bientôt</p>
                        </div>
                    </div>
                    <HistoryButton />
                </div>
            </div>
        </div>
    );
});

const ActiveBanner = memo(({ gameConfig, demarrerJeu }: ActiveBannerProps) => (
    <div className="w-full rounded-3xl bg-gradient-to-br from-yellow-600 to-red-600 p-2 mb-4 shadow-xl">
        <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white/15 rounded-2xl p-3 text-center">
                <div className="text-3xl" aria-hidden="true">🎮</div>
                <div className="text-[10px] text-white/70">N° Match</div>
                <div className="text-sm font-bold text-white">{gameConfig?.numeromatch || 'N/A'}</div>
            </div>
            <div className="bg-white/15 rounded-2xl p-3 text-center">
                <div className="text-3xl" aria-hidden="true">📊</div>
                <div className="text-[10px] text-white/70">Niveau</div>
                <div className="text-sm font-bold text-white">{gameConfig?.niveau || 2}</div>
            </div>
        </div>
        <GlowButton onClick={demarrerJeu}>🚀 JOUER</GlowButton>
    </div>
));

const Bandeau = () => {
    const {
        demarrerJeu, handleOpenGame, startDate, gameConfig, viewState, lastEndedGame, endDate, isLoading, error,
    } = useAdminConsultationsPageFinished();

    const bannerProps = useMemo(() => ({
        endDate: endDate ?? new Date(),
        startDate: startDate ?? new Date(),
        formatDate: formatDateFRJeu,
        gameConfig,
        demarrerJeu,
        handleOpenGame,
        lastEndedGame
    }), [endDate, startDate, gameConfig, demarrerJeu, handleOpenGame, lastEndedGame]);

    if (isLoading) return <Loader />;
    if (error) return <ErrorPage />;

    return (
        <div className="w-full mx-auto max-w-md">
            {viewState.isEmpty && <NoCompetitionBanner />}
            {viewState.isEnded && <EndedBanner {...bannerProps} />}
            {viewState.isNotStarted && <NotStartedBanner startDate={bannerProps.startDate} handleOpenGame={handleOpenGame} />}
            {viewState.isActive && <ActiveBanner gameConfig={gameConfig} demarrerJeu={demarrerJeu} />}
        </div>
    );
};

export default Bandeau;