'use client';
import Loader from "@/app/loading";
import { useAdminConsultationsPageFinished } from "@/hooks/learning/home/useAdminConsultationsPageFinished";
import { formatDateTime } from "@/lib/functions";
import { LastEndedGame, TimeLeft } from "@/lib/interfaces";
import { TIME_UNITS } from "@/lib/learning/constantes";
import { Award, CalendarX, Clock, Gift, History, Hourglass, Medal, Sparkles, Trophy } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import CacheLink from "../../commons/CacheLink";
import { GlowButton } from "../commons/Boutons";
import ErrorPage from "../commons/Erreur";

interface CountdownTimerProps {
    targetDate: Date;
    onFinish: () => void;
    variant?: 'default' | 'celebration' | 'results';
}

interface NotStartedBannerProps {
    startDate: Date;
}

interface EndedBannerProps {
    lastEndedGame: LastEndedGame | null;
    endDate?: Date | null;
    proclamationDate?: Date | null;
}

interface ActiveBannerProps {
    gameConfig: any;
    demarrerJeu: () => void;
    endDate: Date;
}

const CountdownTimer = memo(({ targetDate, onFinish, variant = 'default' }: CountdownTimerProps) => {
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

    const variantClasses = variant === 'celebration'
        ? 'bg-purple-900/40 backdrop-blur-lg border border-purple-400/30'
        : 'bg-black/25 backdrop-blur-lg';

    return (
        <div className="flex gap-2 justify-center flex-wrap">
            {TIME_UNITS.map(({ key, label }) => (
                <div key={key} className={`text-center ${variantClasses} rounded-xl px-2 py-1.5 min-w-[55px] shadow-lg`}>
                    <p className={`font-black text-xl leading-tight ${variant === 'celebration' ? 'text-purple-200' : 'text-white'}`}>
                        {String(timeLeft[key as keyof TimeLeft]).padStart(2, '0')}
                    </p>
                    <p className={`text-[9px] uppercase tracking-wider ${variant === 'celebration' ? 'text-purple-300/70' : 'text-white/70'}`}>
                        {label}
                    </p>
                </div>
            ))}
        </div>
    );
});

const NotStartedBanner = memo(({ startDate }: NotStartedBannerProps) => (
    <div className="w-full rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-5 mb-6 shadow-xl">
        <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/20 p-2">
                    <Hourglass className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <div>
                    <p className="text-white font-bold">Préparez-vous !</p>
                    <p className="text-white/80 text-xs">L'édition n'a pas encore commencé</p>
                </div>
            </div>
            <CountdownTimer targetDate={startDate} onFinish={() => { }} />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-xl">
                <Clock className="w-3 h-3 text-white" aria-hidden="true" />
                <span className="text-white text-xs">Début {formatDateTime(startDate)}</span>
            </div>
        </div>
    </div>
));

const ActiveBanner = memo(({ gameConfig, demarrerJeu, endDate }: ActiveBannerProps) => (
    <div className="w-full rounded-3xl bg-gradient-to-br from-yellow-600 to-red-600 p-5 mb-6 shadow-xl">
        <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/20 p-2">
                    <Trophy className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <div>
                    <p className="text-white font-bold">Édition en cours !</p>
                    <p className="text-white/80 text-xs">Participez avant la fin</p>
                </div>
            </div>

            <div className="text-center">
                <p className="text-white/80 text-xs mb-2">Temps restant</p>
                <CountdownTimer targetDate={endDate} onFinish={() => { }} />
            </div>

            <div className="grid grid-cols-2 gap-4 w-full mt-2">
                <div className="bg-white/15 rounded-2xl p-2 text-center">
                    <div className="text-2xl">🎮</div>
                    <div className="text-[10px] text-white/70">N° Match</div>
                    <div className="text-sm font-bold text-white">{gameConfig?.numeromatch || 'N/A'}</div>
                </div>
                <div className="bg-white/15 rounded-2xl p-2 text-center">
                    <div className="text-2xl">📊</div>
                    <div className="text-[10px] text-white/70">Niveau</div>
                    <div className="text-sm font-bold text-white">{gameConfig?.niveau || 2}</div>
                </div>
            </div>

            <GlowButton onClick={demarrerJeu}>🚀 JOUER MAINTENANT</GlowButton>
        </div>
    </div>
));

const ResultsWaitingBanner = memo(({ proclamationDate }: { proclamationDate: Date }) => (
    <div className="w-full rounded-2xl bg-gradient-to-br from-purple-700 via-indigo-800 to-purple-900 p-6 mb-6 shadow-2xl border border-purple-500/30">
        <div className="flex flex-col items-center gap-4">
            <div className="relative">
                <div className="absolute inset-0 rounded-full bg-purple-400/30 animate-ping" />
                <div className="relative rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-3 shadow-lg">
                    <Medal className="w-8 h-8 text-white" aria-hidden="true" />
                </div>
            </div>

            <div className="text-center">
                <p className="text-white font-extrabold text-lg flex items-center gap-2 justify-center">
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    Édition terminée !
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                </p>
                <p className="text-purple-200 text-xs mt-1">Préparation des résultats en cours...</p>
            </div>

            <div className="text-center">
                <p className="text-purple-200 text-xs mb-2 flex items-center justify-center gap-1">
                    <Gift className="w-3 h-3" />
                    Proclamation des résultats dans
                </p>
                <CountdownTimer targetDate={proclamationDate} onFinish={() => { }} variant="celebration" />
            </div>

            <div className="bg-purple-800/30 rounded-xl p-3 text-center">
                <p className="text-purple-200 text-xs">
                    Les résultats seront annoncés le <strong className="text-yellow-300">
                        {formatDateTime(proclamationDate)}
                    </strong>
                </p>
            </div>
        </div>
    </div>
));

const ResultsAvailableBanner = memo(({ lastEndedGame }: { lastEndedGame: LastEndedGame | null }) => {
    const endGameDate = lastEndedGame
        ? new Date(lastEndedGame.endgameDate).toLocaleDateString('fr-FR')
        : null;

    return (
        <div className="w-full rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 p-6 mb-6 shadow-xl">
            <div className="flex flex-col items-center gap-4">
                <Trophy className="w-16 h-16 text-yellow-300" />

                <div className="text-center">
                    <p className="text-white font-bold text-xl">Résultats disponibles !</p>
                    <p className="text-white/80 text-sm mt-1">
                        {lastEndedGame
                            ? `Édition terminée le ${endGameDate}`
                            : 'Merci pour votre participation'}
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                    <CacheLink
                        href="/star/learning/historique/1779760200000"
                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white/20 backdrop-blur rounded-xl text-white text-sm font-semibold hover:bg-white/30 transition-colors"
                    >
                        <History className="w-4 h-4" />
                        <span>Voir l'historique des résultats</span>
                    </CacheLink>
                </div>
            </div>
        </div>
    );
});

const NoCompetitionBanner = memo(() => (
    <div className="w-full rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 p-6 mb-6 shadow-xl border border-slate-800">
        <div className="flex flex-col items-center text-center gap-4">
            <div className="rounded-full bg-slate-700/50 p-3">
                <CalendarX className="w-8 h-8 text-slate-400" aria-hidden="true" />
            </div>
            <div>
                <p className="text-white font-extrabold text-lg">Aucun match programmé</p>
                <p className="text-slate-400 text-xs max-w-[280px] mt-1">
                    Les administrateurs n'ont pas encore planifié la prochaine session de jeu.
                </p>
            </div>
        </div>
    </div>
));

const EndedBanner = memo(({ lastEndedGame, endDate, proclamationDate }: EndedBannerProps) => {
    const now = Date.now();
    const proclamationMs = proclamationDate?.getTime() || 0;
    const isProclamationPassed = proclamationMs > 0 && now >= proclamationMs;
    const hasProclamationFuture = proclamationMs > 0 && now < proclamationMs;

    if (isProclamationPassed) {
        return <ResultsAvailableBanner lastEndedGame={lastEndedGame} />;
    }

    if (hasProclamationFuture && endDate && now >= endDate.getTime()) {
        return <ResultsWaitingBanner proclamationDate={proclamationDate!} />;
    }

    const endGameDate = lastEndedGame
        ? new Date(lastEndedGame.endgameDate).toLocaleDateString('fr-FR')
        : null;

    return (
        <div className="rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 p-5 mb-6 shadow-xl">
            <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-yellow-500/20 p-2">
                        <Award className="w-6 h-6 text-yellow-400" aria-hidden="true" />
                    </div>
                    <div>
                        <p className="text-white font-bold">Édition terminée</p>
                        <p className="text-gray-300 text-xs">
                            {lastEndedGame ? `Terminée le ${endGameDate}` : 'Merci pour votre participation'}
                        </p>
                    </div>
                </div>

                {proclamationDate && (
                    <div className="bg-white/10 rounded-xl px-3 py-2">
                        <p className="text-gray-300 text-xs">
                            Proclamation des résultats : {formatDateTime(proclamationDate)}
                        </p>
                    </div>
                )}
                <CacheLink
                    href="/star/learning/historique/1779760200000"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors"
                >
                    <History className="w-4 h-4" />
                    <span>Historique</span>
                </CacheLink>
            </div>
        </div>
    );
});

const Bandeau = () => {
    const {
        demarrerJeu, startDate, gameConfig, viewState, lastEndedGame, endDate, isLoading, error,
    } = useAdminConsultationsPageFinished();

    const proclamationDate = useMemo(
        () => gameConfig?.proclamationDate ? new Date(gameConfig.proclamationDate) : null,
        [gameConfig?.proclamationDate]
    );

    if (isLoading) return <Loader />;
    if (error) return <ErrorPage />;

    return (
        <div className="w-full mx-auto max-w-md">
            {viewState.isEmpty && <NoCompetitionBanner />}
            {viewState.isNotStarted && startDate && (
                <NotStartedBanner startDate={startDate} />
            )}

            {viewState.isActive && gameConfig && endDate && (
                <ActiveBanner
                    gameConfig={gameConfig}
                    demarrerJeu={demarrerJeu}
                    endDate={endDate}
                />
            )}

            {viewState.isEnded && (
                <EndedBanner
                    lastEndedGame={lastEndedGame}
                    endDate={endDate}
                    proclamationDate={proclamationDate}
                />
            )}
        </div>
    );
};

export default Bandeau;