'use client';
import { useStatsDataWithCache } from "@/hooks/cache/useStatsDataWithCache";
import { formatNumber } from "@/lib/functions";
import { COLORS } from "@/lib/learning/constantes";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { Users } from "lucide-react";
import { memo, useMemo } from 'react';

interface StatCardProps {
  value: number | null;
  label: string;
  icon: React.ReactNode;
  color: string;
}

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

const LaBanniere = memo(() => {
  const { stats } = useStatsDataWithCache();
  const afficheStat = useMonEtoileStore((state) => state.afficheStat);

  return (
    <div className="w-full max-w-md mx-auto mt-4">
      {afficheStat && (<StatCard
        value={stats?.subscribers ?? null}
        label="Inscrits"
        icon={<Users className="w-4 h-4" aria-hidden="true" />}
        color={COLORS.subscribers}
      />)}
    </div>
  );
});

export default LaBanniere;