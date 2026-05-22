'use client';
import Loader from "@/app/loading";
import { useProfilUser } from "@/hooks/profil/useProfilUser";
import { formatDateFRJeu, formatNumber } from "@/lib/functions";
import { LastEndedGame } from "@/lib/interfaces";
import { AnimatePresence, motion } from 'framer-motion';
import {
  Award, Calendar, Clock, Crown, Flame, History, Hourglass,
  Rocket, Sparkles, Star, Trophy, Users, Zap
} from "lucide-react";
import Link from 'next/link';
import React, { memo } from 'react';
import CacheLink from "../commons/CacheLink";

interface StatCardProps {
  value: number | null;
  label: string;
  icon: React.ReactNode;
  loading: boolean;
  color: string;
  delay?: number;
}

const StatCard = memo<StatCardProps>(({ value, label, icon, loading, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.5, type: "spring", stiffness: 200 }}
    whileHover={{ scale: 1.02, y: -4 }}
    whileTap={{ scale: 0.98 }}
    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-5 text-white shadow-xl cursor-pointer group border border-white/20`}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-white/15 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold opacity-90">{label}</span>
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">{icon}</div>
      </div>
      {loading ? (
        <div className="h-10 w-20 bg-white/30 rounded-xl animate-pulse" />
      ) : (
        <div className="relative">
          <p className="text-3xl font-extrabold tracking-tight">
            {value !== null ? formatNumber(value) : '--'}
          </p>
          <div className="absolute -top-2 -right-2">
            <Star className="w-3 h-3 text-yellow-300 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  </motion.div>
));

const GlowButton = ({ href, children, variant = 'primary' }: { href: string; children: React.ReactNode; variant?: 'primary' | 'secondary' }) => {
  const gradient = variant === 'primary'
    ? 'from-purple-600 via-pink-600 to-orange-500'
    : 'from-blue-600 via-cyan-500 to-teal-600';

  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="relative group w-full sm:w-auto">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition duration-500" />
      <Link
        href={href}
        className={`relative flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r ${gradient} text-white font-bold rounded-2xl shadow-lg transition-all duration-300 text-sm sm:text-base w-full sm:w-auto`}
      >
        <Sparkles className="w-4 h-4 animate-pulse" />
        <span>{children}</span>
        <Zap className="w-4 h-4" />
      </Link>
    </motion.div>
  );
};

const CountdownTimer = ({ targetDate, variant = 'light', onFinish }: { targetDate: Date; variant?: 'light' | 'dark'; onFinish?: () => void }) => {
  const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [hasFinished, setHasFinished] = React.useState(false);

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(timer);
        if (!hasFinished) {
          setHasFinished(true);
          onFinish?.();
        }
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % 86400000) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % 3600000) / (1000 * 60)),
        seconds: Math.floor((diff % 60000) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, hasFinished, onFinish]);

  const textColor = variant === 'light' ? 'text-white' : 'text-gray-800';
  const bgColor = variant === 'light' ? 'bg-black/25' : 'bg-white/80';

  return (
    <div className="flex gap-2 justify-center flex-wrap">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className={`text-center ${bgColor} backdrop-blur-lg rounded-xl px-2 py-1.5 min-w-[55px] shadow-lg`}>
          <p className={`${textColor} font-black text-xl sm:text-2xl leading-tight`}>
            {value.toString().padStart(2, '0')}
          </p>
          <p className={`${textColor}/70 text-[9px] uppercase tracking-wider font-medium`}>
            {unit === 'days' ? 'j' : unit === 'hours' ? 'h' : unit === 'minutes' ? 'm' : 's'}
          </p>
        </div>
      ))}
    </div>
  );
};

const HistoryButton = memo(({ gameId }: { gameId?: string }) => (
  <CacheLink
    href={`/star/historique${gameId ? `/${gameId}` : ''}`}
    className="group flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-sm w-full sm:w-auto"
  >
    <History className="w-4 h-4" />
    <span>Historique</span>
  </CacheLink>
));

const GameStatusBadge = ({ children, variant = 'primary' }: { children: React.ReactNode; variant?: 'primary' | 'success' | 'error' }) => {
  const colors = {
    primary: 'from-purple-600 to-pink-600',
    success: 'from-green-600 to-emerald-600',
    error: 'from-red-600 to-orange-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${colors[variant]} px-4 py-2 shadow-xl`}
    >
      {children}
    </motion.div>
  );
};

const NotStartedBanner = ({ startDate, handleOpenGame, formatDateTime }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-5 mb-6 shadow-xl"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    <div className="relative flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-white/20 p-3">
          <Hourglass className="w-8 h-8 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-lg">Préparez-vous !</p>
          <p className="text-white/80 text-xs">Le jeu n'a pas encore commencé</p>
        </div>
      </div>
      <CountdownTimer targetDate={startDate} variant="light" onFinish={handleOpenGame} />
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl">
        <Clock className="w-4 h-4 text-white" />
        <span className="text-white text-xs font-medium">Ouverture {formatDateTime(startDate)}</span>
      </div>
    </div>
  </motion.div>
);

const EndedBanner = ({ lastEndedGame }: { lastEndedGame: LastEndedGame | null }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 p-5 mb-6 shadow-xl"
  >
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-yellow-500/20 p-3">
          <Award className="w-8 h-8 text-yellow-400" />
        </div>
        <div>
          <p className="text-white font-bold text-lg">Édition terminée !</p>
          <p className="text-gray-300 text-xs">
            {lastEndedGame ? (
              <>Terminée le {new Date(lastEndedGame.endgameDate).toLocaleDateString('fr-FR')}</>
            ) : (
              'Merci pour votre participation'
            )}
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <div>
            <p className="text-[10px] text-gray-300">Prochaine édition</p>
            <p className="font-bold text-white text-sm">Très bientôt</p>
          </div>
        </div>
        <HistoryButton gameId={lastEndedGame?.id} />
      </div>
    </div>
  </motion.div>
);

const ActiveBanner = ({ endDate, handleEndMatch, startDate, formatDate, gameConfig }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-5 mb-6 shadow-xl"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    <div className="relative flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-white/20 p-3">
          <Flame className="w-8 h-8 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-lg flex items-center gap-1">
            <Rocket className="w-4 h-4" />
            Jeu en cours !
          </p>
          <p className="text-white/80 text-xs">Temps restant pour jouer</p>
        </div>
      </div>

      <CountdownTimer targetDate={endDate} variant="light" onFinish={handleEndMatch} />

      <div className="flex items-center justify-between bg-white/10 rounded-xl p-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-white" />
          <span className="text-white text-xs">Du {formatDate(startDate)}</span>
        </div>
        <div className="text-white text-xs">au {formatDate(endDate)}</div>
      </div>

      <GlowButton href={`/star/choix/${gameConfig?.id || ''}`}>
        Jouer Maintenant
      </GlowButton>
    </div>
  </motion.div>
);

export default function ProfilPageClient() {
  const {
    handleOpenGame, formatDateTime, handleEndMatch,
    loading, stats, startDate, endDate, gameConfig,
    loadingLastEnded, showNotStarted, lastEndedGame, showActive, showEnded,
  } = useProfilUser();

  if (loading || loadingLastEnded) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 dark:from-gray-950 dark:to-purple-950/20 px-4 py-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-30 animate-ping" />
        <div className="absolute top-20 right-16 w-2 h-2 bg-pink-400 rounded-full opacity-30 animate-ping delay-75" />
        <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-orange-400 rounded-full opacity-30 animate-ping delay-150" />
      </div>

      <div className="text-center pt-6 pb-4">
        <GameStatusBadge>
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="text-xs font-black uppercase tracking-wide text-white">DIAMBRA WIN</span>
          <Crown className="w-4 h-4 text-yellow-400" />
        </GameStatusBadge>
      </div>

      <div className="max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {showNotStarted && startDate && (
            <NotStartedBanner key="not-started" startDate={startDate} handleOpenGame={handleOpenGame} formatDateTime={formatDateTime} />
          )}

          {showActive && endDate && startDate && (
            <ActiveBanner
              key="active"
              endDate={endDate}
              handleEndMatch={handleEndMatch}
              startDate={startDate}
              formatDate={formatDateFRJeu}
              gameConfig={gameConfig}
            />
          )}

          {showEnded && (<EndedBanner key="ended" lastEndedGame={lastEndedGame} />)}
        </AnimatePresence>

        <StatCard
          value={stats?.subscribers ?? null}
          label="Participants"
          icon={<Users className="w-3.5 h-3.5" />}
          loading={loading}
          color="from-purple-600 to-indigo-600"
          delay={0.2}
        />
      </div>
    </div>
  );
}