'use client';
import { useAdminConsultationsPageFinished } from "@/hooks/learning/labanniere/useAdminConsultationsPageFinished";
import { formatDateFRJeu, formatNumber } from "@/lib/functions";
import { TimeLeft } from "@/lib/interfaces";
import { COLORS, COUNTDOWN_UPDATE_INTERVAL, TIME_UNIT_LABELS, TIME_UNITS } from "@/lib/learning/constantes";
import { Calendar, Flame, Users } from "lucide-react";
import { memo, useEffect, useState } from 'react';
import { FooterSection, HelpButton } from './Features';

interface StatCardProps {
    value: number | null;
    label: string;
    icon: React.ReactNode;
    color: string;
}

interface CountdownTimerProps {
    targetDate: Date;
    onFinish: () => void;
}

interface ActiveBannerProps {
    endDate: Date;
    startDate: Date;
    formattedStartDate: string;
    formattedEndDate: string;
    handleEndMatch: () => void;
}

interface TimeUnitProps {
    unit: string;
    value: number;
}

export const StatCard = memo(({ value, label, icon, color }: StatCardProps) => {
    const formattedValue = value !== null ? formatNumber(value) : '--';

    return (
        <button
            type="button"
            className={`w-full text-left relative overflow-hidden mt-4 rounded-2xl bg-gradient-to-br ${color} p-4 text-white shadow-xl border border-white/20 transition-transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white/50`}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-white/15 rounded-full blur-xl pointer-events-none" />
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold opacity-90">{label}</span>
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center" aria-hidden="true">
                        {icon}
                    </div>
                </div>
                <p className="text-3xl text-center font-extrabold tracking-tight">{formattedValue}</p>
            </div>
        </button>
    );
});

const TimeUnit = memo(({ unit, value }: TimeUnitProps) => {
    const paddedValue = String(value).padStart(2, '0');
    const label = TIME_UNIT_LABELS[unit] || unit.charAt(0);

    return (
        <div className="text-center bg-black/25 backdrop-blur-lg rounded-xl px-2 py-1.5 min-w-[55px] shadow-lg">
            <p className="text-white font-black text-xl sm:text-2xl leading-tight">
                {paddedValue}
            </p>
            <p className="text-white/70 text-[9px] uppercase tracking-wider font-medium">
                {label}
            </p>
        </div>
    );
});

const CountdownTimer = memo(({ targetDate, onFinish }: CountdownTimerProps) => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const targetTime = targetDate.getTime();

        const updateTimer = () => {
            const now = Date.now();
            const diff = targetTime - now;

            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                onFinish();
                return false;
            }

            setTimeLeft({
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                minutes: Math.floor((diff % 3600000) / 60000),
                seconds: Math.floor((diff % 60000) / 1000)
            });
            return true;
        };

        // Exécution immédiate initiale
        const shouldContinue = updateTimer();
        if (!shouldContinue) return;

        const intervalId = setInterval(() => {
            const shouldContinueInterval = updateTimer();
            if (!shouldContinueInterval) {
                clearInterval(intervalId);
            }
        }, COUNTDOWN_UPDATE_INTERVAL);

        return () => clearInterval(intervalId);
    }, [targetDate, onFinish]);

    return (
        <div className="flex gap-2 justify-center flex-wrap" aria-label="Compte à rebours">
            {TIME_UNITS.map(({ key }) => (
                <TimeUnit
                    key={key}
                    unit={key}
                    value={timeLeft[key as keyof TimeLeft]}
                />
            ))}
        </div>
    );
});

const ActiveBanner = memo(({ endDate, handleEndMatch, startDate, formattedStartDate, formattedEndDate }: ActiveBannerProps) => {
    return (
        <div className="relative overflow-hidden rounded-2xl mb-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 shadow-xl">
            <div className="relative flex flex-col gap-2 p-3">
                <div className="flex items-center justify-center gap-2">
                    <div className="rounded-full bg-white/20 p-1.5">
                        <Flame className="w-3 h-3 text-white" aria-hidden="true" />
                    </div>
                    <p className="text-white/80 text-center text-xs font-medium">
                        Temps de jeu restant
                    </p>
                </div>

                <CountdownTimer targetDate={endDate} onFinish={handleEndMatch} />

                <div className="flex items-center justify-between bg-white/10 rounded-xl p-2">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-white" aria-hidden="true" />
                        <span className="text-white text-xs">
                            Du {formattedStartDate}
                        </span>
                    </div>
                    <span className="text-white text-xs">
                        Au {formattedEndDate}
                    </span>
                </div>
            </div>
        </div>
    );
});

const FixedContent = () => {
    const { handleEndMatch, stats, startDate, endDate } = useAdminConsultationsPageFinished();

    if (!endDate || !startDate) {
        return null;
    }

    const formattedStartDate = formatDateFRJeu(startDate);
    const formattedEndDate = formatDateFRJeu(endDate);

    return (
        <div className="fixed-bottom-content w-full space-y-2">
            <div className="w-full max-w-md mx-auto mt-4 px-4 sm:px-0">
                <ActiveBanner
                    endDate={endDate}
                    startDate={startDate}
                    formattedStartDate={formattedStartDate}
                    formattedEndDate={formattedEndDate}
                    handleEndMatch={handleEndMatch}
                />

                <StatCard
                    value={stats?.subscribers ?? null}
                    label="Inscrits"
                    icon={<Users className="w-4 h-4" aria-hidden="true" />}
                    color={COLORS.subscribers}
                />
            </div>
            
            <FooterSection />
            <HelpButton />
        </div>
    );
};

export default FixedContent;