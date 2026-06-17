'use client';
import { formatDateTime, getLabelAbbr } from "@/lib/functions";
import { TimeLeft } from "@/lib/interfaces";
import { TIME_UNITS } from "@/lib/learning/constantes";
import { Clock, Hourglass } from "lucide-react";
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

interface NotStartedBannerProps {
    startDate: Date;
    onFinish: () => void;
}

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

const NotStartedBanner = memo(({ startDate, onFinish }: NotStartedBannerProps) => (
    <div className="w-full rounded-2xl bg-gradient-to-br from-blue-500 to-orange-500 p-4 mb-2 shadow-xl">
        <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/20 p-2">
                    <Hourglass className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <div>
                    <p className="text-white font-bold">Préparez-vous !</p>
                    <p className="text-white/80 text-xs">La competition demarre bientôt</p>
                </div>
            </div>

            <CountdownTimer targetDate={startDate} onFinish={onFinish} />

            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-xl">
                <Clock className="w-3 h-3 text-white" aria-hidden="true" />
                <span className="text-white text-xs">Début {formatDateTime(startDate)}</span>
            </div>
        </div>
    </div>
));

export default NotStartedBanner;