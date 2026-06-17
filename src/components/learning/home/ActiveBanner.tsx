'use client';
import { LearningConfiguration, TimeLeft } from "@/lib/interfaces";
import { TIME_UNITS } from "@/lib/learning/constantes";
import { Trophy } from "lucide-react";
import { memo, useCallback, useEffect, useState } from 'react';
import { GlowButton } from "../commons/Boutons";
import { getLabelAbbr } from "@/lib/functions";

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

interface ActiveBannerProps {
    gameConfig: LearningConfiguration;
    demarrerJeu: () => void;
    endDate: Date;
    showButton: boolean;
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

const ActiveBanner = memo(({ gameConfig, demarrerJeu, endDate, showButton, onFinish }: ActiveBannerProps) => (
    <div className="w-full rounded-3xl bg-gradient-to-br from-yellow-600 to-red-400 p-5 mb-6 shadow-xl">
        <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/20 p-2">
                    <Trophy className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <div>
                    <p className="text-white font-bold">Édition en cours </p>
                    <p className="text-white/80 text-xs">Participez avant la fin!</p>
                </div>
            </div>

            <div className="text-center">
                <p className="text-white/80 text-xs mb-2">Temps restant</p>
                <CountdownTimer targetDate={endDate} onFinish={onFinish} />
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

            {showButton && <GlowButton onClick={demarrerJeu}>🚀 JOUER MAINTENANT</GlowButton>}
        </div>
    </div>
));

export default ActiveBanner;