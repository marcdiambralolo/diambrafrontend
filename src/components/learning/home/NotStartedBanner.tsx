'use client';
import { formatDateTime, getLabelAbbr } from "@/lib/functions";
import { TimeLeft } from "@/lib/interfaces";
import { TIME_UNITS } from "@/lib/learning/constantes";
import { Clock, Hourglass, History, Trophy, AlertCircle } from "lucide-react";
import { memo, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

// ============================================================================
// CONSTANTES
// ============================================================================

const TIMER_VARIANTS = {
    default: {
        containerClass: 'bg-black/25',
        textColor: 'text-white',
        subTextColor: 'text-white/70',
    },
    celebration: {
        containerClass: 'bg-purple-900/40 border border-purple-400/30',
        textColor: 'text-purple-200',
        subTextColor: 'text-purple-300/70',
    },
    warning: {
        containerClass: 'bg-red-500/30 border border-red-400/30',
        textColor: 'text-white',
        subTextColor: 'text-white/70',
    },
} as const;

type TimerVariant = keyof typeof TIMER_VARIANTS;

// ============================================================================
// TYPES
// ============================================================================

interface CountdownTimerProps {
    targetDate: Date;
    onFinish: () => void;
    variant?: TimerVariant;
    compact?: boolean;
    showSeconds?: boolean;
}

interface NotStartedBannerProps {
    startDate: Date;
    onFinish: () => void;
    countdown?: number | null;
}

interface TimeUpBannerProps {
    onViewHistory?: () => void;
    onClose?: () => void;
}

// ============================================================================
// COMPTEUR À REBOURS
// ============================================================================

const CountdownTimer = memo(({ 
    targetDate, 
    onFinish, 
    variant = 'default',
    compact = false,
    showSeconds = true
}: CountdownTimerProps) => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [hasFinished, setHasFinished] = useState(false);
    const variantStyle = TIMER_VARIANTS[variant];

    const calculateTimeLeft = useCallback((): TimeLeft => {
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
        const updateTimer = () => setTimeLeft(calculateTimeLeft());
        updateTimer();
        const timer = setInterval(updateTimer, 1000);
        return () => clearInterval(timer);
    }, [calculateTimeLeft]);

    // Version compacte pour les petits espaces
    if (compact) {
        const totalSeconds = timeLeft.days * 86400 + timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds;
        if (totalSeconds === 0) return null;

        return (
            <div className="flex items-center gap-1 text-sm font-mono text-white">
                <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
                <span>:</span>
                <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
                {showSeconds && (
                    <>
                        <span>:</span>
                        <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
                    </>
                )}
            </div>
        );
    }

    // Affichage des unités à afficher (filtrer les jours si 0)
    const displayUnits = TIME_UNITS.filter(({ key }) => {
        if (key === 'days' && timeLeft.days === 0) return false;
        return true;
    });

    return (
        <div className="flex gap-2 justify-center flex-wrap">
            {displayUnits.map(({ key, label }) => (
                <div key={key} className={`text-center ${variantStyle.containerClass} rounded-xl px-2 py-1.5 min-w-[55px] shadow-lg transition-all duration-300`}>
                    <p className={`font-black text-xl leading-tight ${variantStyle.textColor}`}>
                        {String(timeLeft[key as keyof TimeLeft]).padStart(2, '0')}
                    </p>
                    <p className={`text-[9px] uppercase tracking-wider ${variantStyle.subTextColor}`}>
                        {getLabelAbbr(label)}
                    </p>
                </div>
            ))}
        </div>
    );
});

CountdownTimer.displayName = 'CountdownTimer';

// ============================================================================
// BANNIÈRE - JEU PAS ENCORE COMMENCÉ
// ============================================================================

const NotStartedBanner = memo(({ startDate, onFinish, countdown }: NotStartedBannerProps) => {
    const isSoon = countdown !== null && countdown! < 300; // Moins de 5 minutes

    return (
        <div className="w-full rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-4 mb-2 shadow-xl">
            <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-white/20 p-2 animate-pulse">
                        <Hourglass className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                        <p className="text-white font-bold">Préparez-vous !</p>
                        <p className="text-white/80 text-xs">La compétition démarre bientôt</p>
                    </div>
                </div>

                {countdown !== null && countdown! > 0 ? (
                    <div className="text-center">
                        <p className="text-white/70 text-xs mb-1">Début dans</p>
                        <div className={`text-3xl font-bold text-white ${isSoon ? 'animate-pulse' : ''}`}>
                            {Math.floor(countdown! / 60)}m {countdown! % 60}s
                        </div>
                    </div>
                ) : (
                    <CountdownTimer targetDate={startDate} onFinish={onFinish} variant="default" />
                )}

                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-xl">
                    <Clock className="w-3 h-3 text-white" aria-hidden="true" />
                    <span className="text-white text-xs">Début {formatDateTime(startDate)}</span>
                </div>

                {isSoon && (
                    <div className="flex items-center gap-2 text-yellow-200 text-xs animate-pulse">
                        <AlertCircle className="w-3 h-3" />
                        <span>Le jeu va bientôt commencer !</span>
                    </div>
                )}
            </div>
        </div>
    );
});

NotStartedBanner.displayName = 'NotStartedBanner';

// ============================================================================
// BANNIÈRE - JEU TERMINÉ / TEMPS ÉCOULÉ
// ============================================================================

const TimeUpBanner = memo(({ onViewHistory, onClose }: TimeUpBannerProps) => {
    return (
        <div className="w-full rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-6 mb-2 shadow-xl animate-in fade-in duration-500">
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="rounded-full bg-yellow-400/20 p-4 animate-bounce">
                    <Trophy className="w-12 h-12 text-yellow-300" aria-hidden="true" />
                </div>

                <h2 className="text-2xl font-bold text-white">🏆 Temps écoulé !</h2>

                <p className="text-white/80 text-sm max-w-xs">
                    La compétition est terminée. Consultez vos résultats et votre historique.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full max-w-xs">
                    <Link
                        href={onViewHistory ? '#' : '/star/learning/historique'}
                        onClick={onViewHistory}
                        className="flex items-center justify-center gap-2 bg-white text-purple-700 font-bold py-3 px-6 rounded-xl hover:scale-105 transition-all"
                    >
                        <History className="w-5 h-5" />
                        Voir l'historique
                    </Link>

                    {onClose && (
                        <button
                            onClick={onClose}
                            className="flex items-center justify-center gap-2 bg-white/20 text-white font-bold py-3 px-6 rounded-xl hover:bg-white/30 transition-all"
                        >
                            Fermer
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
});

TimeUpBanner.displayName = 'TimeUpBanner';

// ============================================================================
// BANNIÈRE - JEU TERMINÉ AVEC STATISTIQUES
// ============================================================================

interface ResultsAvailableBannerProps {
    lastEndedGame?: any;
    onGameCompletelyFinished?: () => void;
    stats?: {
        score?: number;
        rank?: number;
        totalPlayers?: number;
        timeSpent?: string;
    };
}

const ResultsAvailableBanner = memo(({ 
    lastEndedGame, 
    onGameCompletelyFinished,
    stats = {}
}: ResultsAvailableBannerProps) => {
    const { score = 0, rank = 0, totalPlayers = 0, timeSpent = '' } = stats;

    return (
        <div className="w-full rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 mb-2 shadow-xl animate-in fade-in duration-500">
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="rounded-full bg-white/20 p-4">
                    <Trophy className="w-12 h-12 text-yellow-300" aria-hidden="true" />
                </div>

                <h2 className="text-2xl font-bold text-white">🎉 Félicitations !</h2>

                <p className="text-white/80 text-sm max-w-xs">
                    La compétition est terminée. Voici vos résultats.
                </p>

                {/* Statistiques */}
                {(score > 0 || rank > 0 || timeSpent) && (
                    <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                        {score > 0 && (
                            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                                <div className="text-yellow-300 text-xs">Score</div>
                                <div className="text-white font-bold text-xl">{score}</div>
                            </div>
                        )}
                        {rank > 0 && (
                            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                                <div className="text-yellow-300 text-xs">Rang</div>
                                <div className="text-white font-bold text-xl">
                                    {rank}{totalPlayers > 0 ? `/${totalPlayers}` : ''}
                                </div>
                            </div>
                        )}
                        {timeSpent && (
                            <div className="col-span-2 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                                <div className="text-yellow-300 text-xs">Temps total</div>
                                <div className="text-white font-bold text-xl">{timeSpent}</div>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full max-w-xs">
                    <Link
                        href="/star/learning/historique"
                        className="flex items-center justify-center gap-2 bg-white text-green-700 font-bold py-3 px-6 rounded-xl hover:scale-105 transition-all"
                    >
                        <History className="w-5 h-5" />
                        Voir l'historique
                    </Link>

                    {onGameCompletelyFinished && (
                        <button
                            onClick={onGameCompletelyFinished}
                            className="flex items-center justify-center gap-2 bg-white/20 text-white font-bold py-3 px-6 rounded-xl hover:bg-white/30 transition-all"
                        >
                            Fermer
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
});

ResultsAvailableBanner.displayName = 'ResultsAvailableBanner';

// ============================================================================
// EXPORTS
// ============================================================================

export { 
    CountdownTimer, 
    NotStartedBanner, 
    TimeUpBanner, 
    ResultsAvailableBanner 
};

export default NotStartedBanner;