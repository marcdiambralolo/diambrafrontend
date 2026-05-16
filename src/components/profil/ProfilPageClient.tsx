'use client';
import { useProfilUser } from "@/hooks/profil/useProfilUser";
import { formatNumber } from "@/lib/functions";
import { motion } from 'framer-motion';
import { AlertCircle, Eye, TrendingUp, Users } from "lucide-react";
import React, { useMemo } from 'react';
import CategoryConsulterPageWrapper from "../categorie/consulter/CategoryConsulterPageWrapper";

function ProfilPageLoader() {

  return (
    <section className="mx-auto mt-4 w-full max-w-6xl animate-pulse">
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        <div className="w-full rounded-3xl border border-[#1C3A6B] bg-[#0F1C3F] p-6 shadow-md md:w-1/2">
          <div className="mx-auto h-24 w-24 rounded-full bg-[#162A56]" />
          <div className="mx-auto mt-4 h-6 w-40 rounded-full bg-[#2E5AA6]" />
          <div className="mx-auto mt-3 h-4 w-56 rounded-full bg-[#4F83D1]" />
          <div className="mx-auto mt-6 h-10 w-36 rounded-2xl bg-[#162A56]" />
        </div>

        <div className="w-full rounded-3xl border border-[#1C3A6B] bg-[#0F1C3F] p-6 shadow-md md:w-1/2">
          <div className="h-6 w-36 rounded-full bg-[#2E5AA6]" />
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="h-24 rounded-2xl bg-[#162A56]" />
            <div className="h-24 rounded-2xl bg-[#162A56]" />
            <div className="h-24 rounded-2xl bg-[#162A56]" />
            <div className="h-24 rounded-2xl bg-[#162A56]" />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-[#1C3A6B] bg-[#0F1C3F] p-6 shadow-md">
        <div className="h-6 w-40 rounded-full bg-[#2E5AA6]" />
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="h-28 rounded-2xl bg-[#162A56]" />
          <div className="h-28 rounded-2xl bg-[#162A56]" />
          <div className="h-28 rounded-2xl bg-[#162A56]" />
        </div>
      </div>
    </section>
  );
}

interface StatCardProps {
  value: number | null;
  label: string;
  icon: React.ReactNode;
  loading: boolean;
  color: 'primary' | 'accent';
}

const cardVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

const STAT_COLORS = {
  primary: {
    text: 'text-[var(--accent-violet)]',
    border: 'border-[var(--accent-violet)]/30',
    bg: 'bg-[var(--bg-light)]',
    iconBg: 'bg-[var(--accent-gold)]/10',
  },
  accent: {
    text: 'text-[var(--accent-gold)]',
    border: 'border-[var(--accent-gold)]/30',
    bg: 'bg-[var(--bg-light)]',
    iconBg: 'bg-[var(--accent-violet)]/10',
  },
} as const;

const StatCard = React.memo<StatCardProps>(({ value, label, icon, loading, color }) => {
  const colors = STAT_COLORS[color];

  const displayValue = useMemo(() => {
    if (loading) return <span className="animate-pulse">...</span>;
    if (value !== null) return formatNumber(value);
    return '--';
  }, [loading, value]);

  const showTrend = useMemo(() => !loading && value !== null && value > 0, [loading, value]);

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        flex flex-col items-center justify-center
        bg-[var(--bg-light)] dark:bg-[var(--bg-dark)]/80
        rounded-xl shadow-sm hover:shadow-md
        px-4 py-3 sm:px-6 sm:py-4
        border ${colors.border} dark:border-[var(--accent-violet)]/30
        transition-all duration-300
        relative overflow-hidden
        min-w-[140px] sm:min-w-[160px] backdrop-blur-sm
      `}
    >
      <div className={`absolute inset-0 ${colors.bg} opacity-5 dark:opacity-10 -z-10`} />

      <div className={`${colors.iconBg} dark:bg-opacity-20 p-2 sm:p-2.5 rounded-lg mb-2`}>
        {icon}
      </div>

      <div className={`text-3xl sm:text-4xl font-bold ${colors.text} dark:text-[var(--accent-gold)] dark:opacity-90 tracking-tight text-center leading-none`}>
        {displayValue}
      </div>

      <div className="text-xs sm:text-sm font-medium text-[var(--accent-violet)] dark:text-[var(--accent-gold)] mt-1.5 uppercase tracking-wide text-center">
        {label}
      </div>

      {showTrend && (
        <div className="flex items-center gap-0.5 mt-1.5 text-green-600 dark:text-green-400 text-[10px] sm:text-xs font-medium">
          <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          <span>+{Math.floor(Math.random() * 15)}%</span>
        </div>
      )}
    </motion.div>
  );
});

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}


const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="w-full max-w-md bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3"
  >
    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
    <div className="flex-1">
      <p className="text-red-700 text-sm font-medium">{message}</p>
      <button
        onClick={onRetry}
        className="text-red-600 hover:text-red-800 text-xs font-semibold mt-2 underline"
      >
        Réessayer
      </button>
    </div>
  </motion.div>
);

const LoadingSkeleton: React.FC = () => (
  <div className="flex flex-col sm:flex-row gap-6 items-center justify-center py-6">
    {[1, 2].map((i) => (
      <div
        key={i}
        className="flex flex-col items-center bg-white rounded-2xl shadow-lg px-8 py-6 border-2 border-gray-100 animate-pulse min-w-[160px]"
      >
        <div className="w-12 h-12 bg-gray-200 rounded-xl mb-3" />
        <div className="w-20 h-10 bg-gray-200 rounded mb-2" />
        <div className="w-16 h-4 bg-gray-200 rounded" />
      </div>
    ))}
  </div>
);

const StatsCounter: React.FC<{ loading: boolean; stats: any; error: any; fetchStats: () => void }> = ({ loading, stats, error, fetchStats }) => {

  if (loading && !stats) { return <LoadingSkeleton />; }

  return (
    <div className="w-full">
      <div className="flex flex-row gap-3 items-center justify-center py-4">
        <StatCard
          value={stats?.subscribers ?? null}
          label="Joueurs"
          icon={<Users className="h-6 w-6 text-[#2E5AA6]" />}
          loading={loading}
          color="primary"
        />

        <StatCard
          value={stats?.visits ?? null}
          label="Visites"
          icon={<Eye className="h-6 w-6 text-[#4F83D1]" />}
          loading={loading}
          color="accent"
        />
      </div>

      {error && (
        <div className="flex justify-center mt-4">
          <ErrorMessage message={typeof error === 'string' ? error : (error ? String(error) : '')} onRetry={fetchStats} />
        </div>
      )}
    </div>
  );
};

export default function ProfilPageClient() {
  const { fetchStats, loading, stats, error, } = useProfilUser();

  if (loading) return <ProfilPageLoader />;

  return (
    <div className="relative w-full flex flex-col items-center justify-center px-2 sm:px-0 overflow-x-hidden bg-white dark:bg-none dark:bg-[#0C0B1D] dark:bg-gradient-to-b dark:from-[#0C0B1D] dark:to-[#162A56]">
      <CategoryConsulterPageWrapper />
      <StatsCounter loading={loading} stats={stats} error={error} fetchStats={fetchStats} />
    </div>
  );
}