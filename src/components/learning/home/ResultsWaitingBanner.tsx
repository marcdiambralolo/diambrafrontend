'use client';
import { formatDateTime } from "@/lib/functions";
import { TimeLeft } from "@/lib/interfaces";
import { TIME_UNITS } from "@/lib/learning/constantes";
import { Gift, Medal, Sparkles } from "lucide-react";
import { memo, useCallback, useEffect, useState } from 'react';

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
} as const;

type TimerVariant = keyof typeof TIMER_VARIANTS;

interface CountdownTimerProps {
    targetDate: Date;
    onFinish: () => void;
    variant?: TimerVariant;
}

const getLabelAbbr = (label: string): string => {
    if (label === 'heures') return 'h';
    if (label === 'minutes') return 'm';
    if (label === 'secondes') return 's';
    return label[0];
};

const CountdownTimer = memo(({ targetDate, onFinish, variant = 'default' }: CountdownTimerProps) => {
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

    return (
        <div className="flex gap-2 justify-center flex-wrap">
            {TIME_UNITS.map(({ key, label }) => (
                <div key={key} className={`text-center ${variantStyle.containerClass} rounded-xl px-2 py-1.5 min-w-[55px] shadow-lg`}>
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

const ResultsWaitingBanner = memo(({ proclamationDate, onFinish }: { proclamationDate: Date, onFinish: () => void }) => (
    <div className="w-full rounded-2xl bg-gradient-to-br from-purple-700 via-indigo-800 to-purple-900 p-6 mb-6 shadow-2xl border border-purple-500/30">
        <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-3 shadow-lg">
                <Medal className="w-8 h-8 text-white" aria-hidden="true" />
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
                <CountdownTimer targetDate={proclamationDate} onFinish={onFinish} variant="celebration" />
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

export default ResultsWaitingBanner;