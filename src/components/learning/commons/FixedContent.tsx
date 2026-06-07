'use client';
import { useCommon } from '@/hooks/learning/home/useCommon';
import { useAdminConsultationsPageFinished } from "@/hooks/learning/labanniere/useAdminConsultationsPageFinished";
import { formatDateFRJeu, formatNumber } from "@/lib/functions";
import { TimeLeft } from "@/lib/interfaces";
import { COLORS, COUNTDOWN_UPDATE_INTERVAL, CURRENT_YEAR, STATUS_CONFIG, TIME_UNIT_LABELS, TIME_UNITS } from "@/lib/learning/constantes";
import { Calendar, Flame, HelpCircle, Users } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from "next/navigation";

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
    handleEndMatch: () => void;
    startDate: Date;
    formatDate: (date: Date) => string;
}

interface TimeUnitProps {
    unit: string;
    value: number;
}

const StatusBadge = memo(({ text, color }: { text: string; color: string }) => (
    <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${color === 'red' ? 'bg-red-500' : 'bg-green-500'
        } text-white flex items-center gap-1`}>
        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        {text}
    </div>
));

const StatCard = memo(({ value, label, icon, color }: StatCardProps) => {
    const formattedValue = useMemo(() =>
        value !== null ? formatNumber(value) : '--',
        [value]
    );

    return (
        <div className={`relative overflow-hidden mt-4 rounded-2xl bg-gradient-to-br ${color} p-4 text-white shadow-xl cursor-pointer border border-white/20 transition-transform hover:scale-[1.02] active:scale-[0.98]`}>
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
        </div>
    );
});

const TimeUnit = memo(({ unit, value }: TimeUnitProps) => {
    const paddedValue = useMemo(() => String(value).padStart(2, '0'), [value]);
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
    const hasFinishedRef = useRef(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const calculateTimeLeft = useCallback((): TimeLeft => {
        const diff = targetDate.getTime() - Date.now();

        if (diff <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
            days: Math.floor(diff / 86400000),
            hours: Math.floor((diff % 86400000) / 3600000),
            minutes: Math.floor((diff % 3600000) / 60000),
            seconds: Math.floor((diff % 60000) / 1000)
        };
    }, [targetDate]);

    const updateTimer = useCallback(() => {
        const newTimeLeft = calculateTimeLeft();
        setTimeLeft(newTimeLeft);

        const isFinished = newTimeLeft.days === 0 &&
            newTimeLeft.hours === 0 &&
            newTimeLeft.minutes === 0 &&
            newTimeLeft.seconds === 0;

        if (isFinished && !hasFinishedRef.current) {
            hasFinishedRef.current = true;
            onFinish();

            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    }, [calculateTimeLeft, onFinish]);

    useEffect(() => {
        updateTimer();

        timerRef.current = setInterval(updateTimer, COUNTDOWN_UPDATE_INTERVAL);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [updateTimer]);

    return (
        <div className="flex gap-2 justify-center flex-wrap">
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

const ActiveBanner = memo(({ endDate, handleEndMatch, startDate, formatDate }: ActiveBannerProps) => {
    const formattedStartDate = useMemo(() => formatDate(startDate), [formatDate, startDate]);
    const formattedEndDate = useMemo(() => formatDate(endDate), [formatDate, endDate]);

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

const LaBanniere = memo(() => {
    const { handleEndMatch, stats, startDate, endDate, } = useAdminConsultationsPageFinished();

    if (!endDate || !startDate) {
        return null;
    }

    return (
        <div className="w-full max-w-md mx-auto mt-4">
            <ActiveBanner
                endDate={endDate}
                handleEndMatch={handleEndMatch}
                startDate={startDate}
                formatDate={formatDateFRJeu}
            />

            <StatCard
                value={stats?.subscribers ?? null}
                label="Inscrits"
                icon={<Users className="w-4 h-4" aria-hidden="true" />}
                color={COLORS.subscribers}
            />
        </div>
    );
});

const FooterSection = memo(() => {
    const { onlineStatus } = useCommon();
    const status = useMemo(() =>
        onlineStatus ? STATUS_CONFIG.online : STATUS_CONFIG.offline,
        [onlineStatus]
    );

    return (
        <footer className="relative mt-4 bg-gradient-to-r from-gray-900 to-gray-900 rounded-xl p-4 text-center shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10" />
            <div className="relative flex items-center justify-between text-xs text-white">
                <span>© {CURRENT_YEAR}</span>
                <StatusBadge text={status.text} color={status.color} />
            </div>
            <p className="text-white text-center mt-2">DIAMBRA CORPORATION</p>
        </footer>
    );
});

const HelpButton = memo(() => {
    const router = useRouter();

    const handleClick = useCallback(() => {
        router.push('/star/learning/help');
    }, [router]);

    return (
        <button
            onClick={handleClick}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
            aria-label="Aide"
            type="button"
        >
            <HelpCircle className="w-6 h-6" aria-hidden="true" />
        </button>
    );
});

const FixedContent = () => {
    return (
        <div className="fixed-bottom-content w-full space-y-2">
            <LaBanniere />
            <FooterSection />
            <HelpButton />
        </div>
    );
};

export default FixedContent;