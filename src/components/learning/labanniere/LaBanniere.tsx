'use client';
import { useAdminConsultationsPageFinished } from "@/hooks/learning/useAdminConsultationsPageFinished";
import { formatDateFRJeu, formatNumber } from "@/lib/functions";
import { Calendar, Flame, Users } from "lucide-react";
import { memo, useEffect, useState } from 'react';

const StatCard = memo(({ value, label, icon, color }: any) => (
  <div className={`relative overflow-hidden mt-2 rounded-2xl bg-gradient-to-br ${color} p-5 text-white shadow-xl cursor-pointer group border border-white/20 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1`}>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-white/15 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold opacity-90">{label}</span>
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">{icon}</div>
      </div>
      <p className="text-3xl font-extrabold tracking-tight">{value !== null ? formatNumber(value) : '--'}</p>
    </div>
  </div>
));

const CountdownTimer = ({ targetDate, onFinish }: any) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [hasFinished, setHasFinished] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) {
        clearInterval(timer);
        if (!hasFinished) {
          setHasFinished(true);
          onFinish?.();
        }
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate, hasFinished, onFinish]);

  return (
    <div className="flex gap-2 justify-center flex-wrap">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center bg-black/25 backdrop-blur-lg rounded-xl px-2 py-1.5 min-w-[55px] shadow-lg">
          <p className="text-white font-black text-xl sm:text-2xl leading-tight">{String(value).padStart(2, '0')}</p>
          <p className="text-white/70 text-[9px] uppercase tracking-wider font-medium">
            {unit === 'days' ? 'j' : unit === 'hours' ? 'h' : unit === 'minutes' ? 'm' : 's'}
          </p>
        </div>
      ))}
    </div>
  );
};

const ActiveBanner = ({ endDate, handleEndMatch, startDate, formatDate }: any) => (
  <div className="relative overflow-hidden rounded-2xl mb-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 mb-2 shadow-xl">
    <div className="relative flex flex-col gap-2">
      <div className="flex items-center justify-center gap-2">
        <div className="rounded-full bg-white/20 p-1.5">
          <Flame className="w-3 h-3 text-white" />
        </div>
        <p className="text-white/80 text-center text-xs">Temps restant pour jouer</p>
      </div>
      <CountdownTimer targetDate={endDate} onFinish={handleEndMatch} />
      <div className="flex items-center justify-between bg-white/10 rounded-xl p-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3 text-white" />
          <span className="text-white text-xs">Du {formatDate(startDate)}</span>
        </div>
        <span className="text-white text-xs">au {formatDate(endDate)}</span>
      </div>
    </div>
  </div>
);

const LaBanniere = memo(() => {
  const { handleEndMatch, stats, startDate, endDate } = useAdminConsultationsPageFinished();

  if (!startDate || !endDate) return null;

  return (
    <div className="w-full max-w-md mx-auto">
      <ActiveBanner
        endDate={endDate}
        handleEndMatch={handleEndMatch}
        startDate={startDate}
        formatDate={formatDateFRJeu}
      />
      <StatCard
        value={stats?.subscribers ?? null}
        label="Participants"
        icon={<Users className="w-4 h-4" />}
        color="from-purple-600 to-indigo-600"
      />
    </div>
  );
});

export default LaBanniere;