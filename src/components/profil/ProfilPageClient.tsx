'use client';
import Loader from "@/app/loading";
import { useProfilUser } from "@/hooks/profil/useProfilUser";
import { formatNumber } from "@/lib/functions";
import { motion } from 'framer-motion';
import {
  Award, Calendar, CheckCircle2, Clock, Crown, Flame, Gift, History,
  Hourglass, Lock, PartyPopper, Sparkles, Timer, Trophy, Users, Zap
} from "lucide-react";
import Link from 'next/link';
import React, { memo, useEffect, useState } from 'react';

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
    transition={{ delay, duration: 0.5, type: "spring", stiffness: 100 }}
    whileHover={{ scale: 1.05, y: -5 }}
    whileTap={{ scale: 0.98 }}
    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-6 text-white shadow-2xl cursor-pointer group`}
  >
    <div className="absolute top-0 right-0 opacity-20 group-hover:opacity-30 transition-opacity">
      {icon}
    </div>
    <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700" />
    <div className="relative z-10">
      <p className="text-sm font-medium opacity-90 mb-1 flex items-center gap-2">
        {icon}
        {label}
      </p>
      {loading ? (
        <div className="h-10 w-20 bg-white/20 rounded animate-pulse" />
      ) : (
        <motion.p
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="text-4xl font-bold tracking-tight"
        >
          {value !== null ? formatNumber(value) : '--'}
        </motion.p>
      )}
    </div>
  </motion.div>
));

const GlowButton = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="relative group"
  >
    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
    <Link
      href={href}
      className="relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-bold rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden text-xl"
    >
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform animate-pulse" />
      {children}
      <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
    </Link>
  </motion.div>
);

const CountdownTimer = ({ targetDate, variant = 'light' }: { targetDate: Date; variant?: 'light' | 'dark' }) => {
  const [timeLeft, setTimeLeft] = useState({ jours: 0, heures: 0, minutes: 0, secondes: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        jours: Math.floor(diff / (1000 * 60 * 60 * 24)),
        heures: Math.floor((diff % (86400000)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (3600000)) / (1000 * 60)),
        secondes: Math.floor((diff % (60000)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const textColor = variant === 'light' ? 'text-white' : 'text-gray-800';
  const bgColor = variant === 'light' ? 'bg-black/30' : 'bg-white/80';

  return (
    <div className="flex gap-2 sm:gap-3">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <motion.div
          key={unit}
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className={`text-center ${bgColor} backdrop-blur-sm rounded-xl px-2 sm:px-4 py-2 min-w-[55px] sm:min-w-[70px] shadow-lg`}
        >
          <p className={`${textColor} font-black text-2xl sm:text-3xl`}>{value.toString().padStart(2, '0')}</p>
          <p className={`${textColor}/70 text-[10px] sm:text-xs uppercase tracking-wider`}>{unit}</p>
        </motion.div>
      ))}
    </div>
  );
};

const HistoryButton = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6 }}
    className="flex justify-center"
  >
    <Link
      href="/star/historique"
      className="group relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <History className="w-5 h-5 group-hover:scale-110 transition-transform" />
      <span>Historique des participations</span>
    </Link>
  </motion.div>
));

export default function ProfilPageClient() {
  const {
    formatDate, formatDateTime, loading, stats, isGameActive, isGameEnded,
    isGameNotStarted, timeRemaining, startDate, endDate, gameState,
  } = useProfilUser();

  if (loading) return <Loader />;

  return (
    <div className="w-full max-w-5xl mx-auto relative overflow-hidden px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-8 pb-4 relative"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 px-6 py-2 shadow-lg mb-4"
        >
          <Trophy className="w-5 h-5 text-yellow-500 animate-pulse" />
          <span className="text-sm font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            DIAMBRA WIN
          </span>
          <Crown className="w-5 h-5 text-yellow-500" />
        </motion.div>
      </motion.div>

      {isGameNotStarted ? (
        <motion.div
          key="not-started"
          initial={{ opacity: 0, x: -100, rotateY: -90 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          exit={{ opacity: 0, x: 100, rotateY: 90 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 p-6 mb-8 shadow-2xl"
        >
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="rounded-full bg-white/20 p-3"
              >
                <Hourglass className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <p className="text-white/90">Bientôt!</p>
              </div>
            </div>
            <CountdownTimer targetDate={startDate!} variant="light" />
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl text-amber-700 dark:text-amber-300 font-bold text-lg shadow-lg">
                <Clock className="w-6 h-6 animate-pulse" />
                <span>{startDate && `Ouverture le ${formatDateTime(startDate)}`}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : isGameActive ? (
        <motion.div
          key="active"
          initial={{ opacity: 0, scale: 0.9, rotateY: 90 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-6 mb-8 shadow-2xl"
        >
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center justify-center gap-4">
              <div>  <div className="flex items-center gap-4">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="rounded-full bg-white/20 p-3"
                >
                  <Flame className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <p className="text-white font-bold text-2xl flex items-center gap-2">
                    <PartyPopper className="w-6 h-6" />
                    🔥 Défi en cours ! 🔥
                  </p>
                  <p className="text-white/90">Temps restants</p>
                </div>
              </div>
                <CountdownTimer targetDate={endDate!} variant="light" /></div>
              <div className="flex flex-col items-center"> {/* Période du défi */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-purple-100 dark:border-purple-500/30 shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 p-3"
                      >
                        <Calendar className="w-6 h-6 text-purple-600" />
                      </motion.div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Période du défi</p>
                        <p className="font-bold text-gray-800 dark:text-white text-lg">
                          {startDate && endDate ? (
                            <>Du {formatDate(startDate)} au {formatDate(endDate)}</>
                          ) : (
                            'Dates à venir'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <GlowButton href="/star/choix">
                  Jouer Maintenant
                </GlowButton></div>
            </div>
          </div>
        </motion.div>
      ) : <motion.div
        key="ended"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 p-6 mb-8 shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="rounded-full bg-yellow-500/20 p-3"
            >
              <Award className="w-8 h-8 text-yellow-400" />
            </motion.div>
            <div>
              <p className="text-white font-bold text-2xl flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                Édition terminée
              </p>
              <p className="text-gray-300">Merci pour votre participation ! Rendez-vous à la prochaine édition</p>
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 bg-white/10 rounded-xl px-5 py-3"
          >
            <Trophy className="w-6 h-6 text-yellow-400" />
            <div>
              <p className="text-xs text-gray-300">Prochaine édition</p>
              <p className="font-bold text-white">Très bientôt</p>
            </div>
            <div className="text-center">
              <HistoryButton />
              <p className="text-sm text-gray-500 mt-3">Rendez-vous pour la prochaine édition !</p>
            </div>
          </motion.div>
        </div>
      </motion.div>} 

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-1 gap-6 mb-8"
      >
        <StatCard
          value={stats?.subscribers ?? null}
          label="Participants"
          icon={<Users className="w-6 h-6" />}
          loading={loading}
          color="from-purple-600 to-indigo-600"
          delay={0.7}
        />
      </motion.div>
    </div>
  );
}