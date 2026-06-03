'use client';
import { useAdminConsultationsPageFinished } from "@/hooks/learning/admin/useAdminConsultationsPageFinished";
import { formatDateFRJeu, formatNumber } from "@/lib/functions";
import { TimeLeft } from "@/lib/interfaces";
import { COLORS, TIME_UNITS } from "@/lib/learning/constantes";
import { Calendar, Flame, Users } from "lucide-react";
import { memo, useEffect, useState, useCallback, useMemo } from 'react';

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

const StatCard = memo(({ value, label, icon, color }: StatCardProps) => {
  const formattedValue = useMemo(() =>
    value !== null ? formatNumber(value) : '--',
    [value]
  );

  return (
    <div className={`relative overflow-hidden mt-2 rounded-2xl bg-gradient-to-br ${color} p-4 text-white shadow-xl cursor-pointer border border-white/20`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-white/15 rounded-full blur-xl" />
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

const TimeUnit = memo(({ unit, value }: { unit: string; value: number; label: string }) => (
  <div className="text-center bg-black/25 backdrop-blur-lg rounded-xl px-2 py-1.5 min-w-[55px] shadow-lg">
    <p className="text-white font-black text-xl sm:text-2xl leading-tight">
      {String(value).padStart(2, '0')}
    </p>
    <p className="text-white/70 text-[9px] uppercase tracking-wider font-medium">
      {unit === 'days' ? 'j' : unit === 'hours' ? 'h' : unit === 'minutes' ? 'm' : 's'}
    </p>
  </div>
));

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
        <TimeUnit
          key={key}
          unit={key}
          value={timeLeft[key as keyof TimeLeft]}
          label={label}
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
      <div className="relative flex flex-col gap-2">
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="rounded-full bg-white/20 p-1.5">
            <Flame className="w-3 h-3 text-white" aria-hidden="true" />
          </div>
          <p className="text-white/80 text-center text-xs">Temps de jeu restant</p>
        </div>

        <CountdownTimer targetDate={endDate} onFinish={handleEndMatch} />

        <div className="flex items-center justify-between bg-white/10 rounded-xl p-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3 text-white" aria-hidden="true" />
            <span className="text-white text-xs">Du {formattedStartDate}</span>
          </div>
          <span className="text-white text-xs">Au {formattedEndDate}</span>
        </div>
      </div>
    </div>
  );
});

const LoadingPlaceholder = memo(() => (
  <div className="w-full max-w-md mx-auto">
    <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl mb-4 h-32" />
    <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-32" />
  </div>
));

const LaBanniere = memo(() => {
  const { handleEndMatch, stats, startDate, endDate } = useAdminConsultationsPageFinished();

  const hasValidDates = useMemo(() =>
    startDate && endDate && startDate instanceof Date && endDate instanceof Date,
    [startDate, endDate]
  );

  if (!hasValidDates) {
    return <LoadingPlaceholder />;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <ActiveBanner
        endDate={endDate!}
        handleEndMatch={handleEndMatch}
        startDate={startDate!}
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

LaBanniere.displayName = "LaBanniere";

export default LaBanniere;