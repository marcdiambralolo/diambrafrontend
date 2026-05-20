'use client';
import Loader from "@/app/loading";
import { formatDateFR, useProfilUser } from "@/hooks/profil/useProfilUser";
import { formatNumber } from "@/lib/functions";
import { motion } from 'framer-motion';
import {
  Award, Calendar, CheckCircle2, Clock, Crown, Diamond, Flame, History, Hourglass,
  Sparkles, Star, Trophy, Users, Zap
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
    initial={{ opacity: 0, y: 40, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.6, type: "spring", stiffness: 150, damping: 10 }}
    whileHover={{
      scale: 1.08,
      y: -8,
      boxShadow: "0 20px 40px rgba(0,0,0,0.25)"
    }}
    whileTap={{ scale: 0.97 }}
    className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${color} p-8 text-white shadow-3xl cursor-pointer group border border-white/20`}
  >
    {/* Animated gradient background */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    {/* Floating sparkle effect */}
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        animate={{
          x: [0, 20, -20, 0],
          y: [0, -20, 20, 0],
          opacity: [0.3, 0.8, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 1
        }}
        className="absolute top-4 right-4"
      >
        {icon}
      </motion.div>
    </div>

    <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-white/15 rounded-full blur-xl group-hover:scale-150 transition-transform duration-1000" />

    <div className="relative z-10">
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delay + 0.2 }}
        className="text-sm font-semibold opacity-95 mb-3 flex items-center gap-3"
      >
        {icon}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
          {label}
        </span>
      </motion.p>

      {loading ? (
        <div className="h-14 w-32 bg-white/30 rounded-2xl animate-pulse" />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.3, type: "spring", stiffness: 300 }}
          className="relative"
        >
          <motion.p
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
            className="text-5xl font-extrabold tracking-tight drop-shadow-lg"
          >
            {value !== null ? formatNumber(value) : '--'}
          </motion.p>

          <motion.div
            animate={{
              y: [-5, 0, -5],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
            className="absolute -top-3 -right-3 text-lg"
          >
            <Star className="w-6 h-6 text-yellow-300" />
          </motion.div>
        </motion.div>
      )}
    </div>
  </motion.div>
));

const GlowButton = ({ href, children, variant = 'primary' }: { href: string; children: React.ReactNode; variant?: 'primary' | 'secondary' }) => {
  const gradient = variant === 'primary'
    ? 'from-purple-600 via-pink-600 to-orange-500'
    : 'from-blue-600 via-cyan-500 to-teal-600';

  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="relative group"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-3xl blur-2xl opacity-0 group-hover:opacity-75 transition duration-700" />
      <Link
        href={href}
        className={`relative inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r ${gradient} text-white font-bold rounded-3xl shadow-3xl transition-all duration-300 overflow-hidden text-xl hover:shadow-2xl hover:shadow-purple-500/50`}
      >
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            y: [-3, 3, -3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 0.5
          }}
          className="relative"
        >
          <Sparkles className="w-7 h-7 text-yellow-300" />
        </motion.div>

        <span className="relative z-10">{children}</span>

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity
          }}
          className="relative"
        >
          <Zap className="w-6 h-6 text-yellow-300" />
        </motion.div>
      </Link>
    </motion.div>
  );
};

const CountdownTimer = ({
  targetDate,
  variant = 'light',
  onFinish,
}: {
  targetDate: Date;
  variant?: 'light' | 'dark';
  onFinish?: () => void;
}) => {
  const [timeLeft, setTimeLeft] = useState({ j: 0, h: 0, mn: 0, s: 0 });
  const [hasFinished, setHasFinished] = useState(false);

  useEffect(() => {
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
        j: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff % 86400000) / (1000 * 60 * 60)),
        mn: Math.floor((diff % 3600000) / (1000 * 60)),
        s: Math.floor((diff % 60000) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, hasFinished, onFinish]);

  const textColor = variant === 'light' ? 'text-white' : 'text-gray-800';
  const bgColor = variant === 'light' ? 'bg-black/20' : 'bg-white/70';

  return (
    <div className="flex gap-3 sm:gap-5">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <motion.div
          key={unit}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className={`relative text-center ${bgColor} backdrop-blur-xl rounded-2xl px-4 py-3 sm:px-5 sm:py-4 border border-white/20 shadow-2xl`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <p className={`${textColor} font-black text-3xl sm:text-4xl leading-none`}>
            {value.toString().padStart(2, '0')}
          </p>

          <p className={`${textColor}/80 text-[11px] sm:text-xs uppercase tracking-wider font-medium`}>
            {unit}
          </p>

          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity
            }}
            className="absolute bottom-1.5 left-1/2 -translate-x-1/2"
          >
            <div className="w-1 h-1 rounded-full bg-white/60" />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

const HistoryButton = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.7 }}
    className="flex justify-center"
  >
    <Link
      href="/star/historique"
      className="group relative inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      <motion.div
        animate={{
          y: [-3, 3, -3],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity
        }}
        className="relative"
      >
        <History className="w-6 h-6 text-white" />
      </motion.div>

      <span className="relative z-10">Historique des participations</span>

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          y: [-5, 5, -5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity
        }}
        className="relative"
      >
        <Star className="w-5 h-5 text-yellow-300" />
      </motion.div>
    </Link>
  </motion.div>
));

const GameStatusBadge = ({ children, variant = 'primary' }: { children: React.ReactNode; variant?: 'primary' | 'success' | 'error' }) => {
  const colors = {
    primary: 'from-purple-500 to-pink-500',
    success: 'from-green-500 to-emerald-500',
    error: 'from-red-500 to-orange-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`inline-flex items-center gap-3 rounded-full bg-gradient-to-r ${colors[variant]} px-6 py-3 shadow-2xl`}
    >
      {children}
    </motion.div>
  );
};

export default function ProfilPageClient() {
  const {
    handleOpenGame, handleEndMatch, formatDateTime, loading, stats,
    isGameNotStarted, startDate, endDate, gameConfig, shouldShowEnded,
  } = useProfilUser();

  if (loading) return <Loader />;

  return (
    <div className="w-full max-w-4xl mx-auto relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center pt-10 pb-6 relative"
      >
        <GameStatusBadge variant="primary">
          <motion.div
            animate={{
              rotate: [0, 8, -8, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2
            }}
            className="relative"
          >
            <Trophy className="w-6 h-6 text-yellow-400" />
          </motion.div>

          <span className="text-sm font-black uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
            DIAMBRA WIN
          </span>

          <motion.div
            animate={{
              y: [0, 5, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
            className="relative"
          >
            <Crown className="w-6 h-6 text-yellow-400" />
          </motion.div>
        </GameStatusBadge>
      </motion.div>

      {isGameNotStarted ? (
        <motion.div
          key="not-started"
          initial={{ opacity: 0, x: -100, rotateY: -90 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          exit={{ opacity: 0, x: 100, rotateY: 90 }}
          transition={{ type: "spring", stiffness: 250, damping: 20 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-500 p-8 mb-10 shadow-3xl border border-white/20"
        >
          {/* Animated glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-90" />

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left - Animated Hourglass */}
            <motion.div
              animate={{
                rotate: [0, 12, -12, 0],
                y: [0, 5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity
              }}
              className="flex items-center gap-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/30 rounded-full blur-xl animate-pulse" />
                <div className="rounded-full bg-white/20 p-5 shadow-lg">
                  <Hourglass className="w-12 h-12 text-white" />
                </div>
              </div>

              <div className="text-left">
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/90 text-xl font-semibold"
                >
                  Préparez-vous !
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-white/80 text-sm mt-1"
                >
                  Le jeu n'a pas encore commencé
                </motion.p>
              </div>
            </motion.div>

            {/* Center - Countdown */}
            <div className="flex flex-col items-center gap-4">
              <CountdownTimer
                targetDate={startDate!}
                variant="light"
                onFinish={handleOpenGame} // 🔥 appelé quand le chrono finit
              />

              <motion.div
                whileHover={{
                  scale: 1.03,
                  y: -2
                }}
                className="text-center"
              >
                <div className="inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-3xl text-amber-800 dark:text-amber-200 font-bold text-lg shadow-2xl border border-white/20">
                  <Clock className="w-7 h-7 animate-pulse" />
                  <span>{startDate && `Ouverture le ${formatDateTime(startDate)}`}</span>
                </div>
              </motion.div>
            </div>

            {/* Right - Floating diamond */}
            <motion.div
              animate={{
                y: [0, 8, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
              className="hidden lg:block"
            >
              <Diamond className="w-16 h-16 text-white/30" />
            </motion.div>
          </div>
        </motion.div>
      ) : (shouldShowEnded) ? (

        <motion.div
          key="ended"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 p-8 mb-10 shadow-3xl border border-gray-600/40"
        >
          {/* Animated glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-60" />

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left - Award */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                y: [0, 5, 0]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity
              }}
              className="flex items-center gap-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl animate-pulse" />
                <div className="rounded-full bg-yellow-500/20 p-5 shadow-lg">
                  <Award className="w-12 h-12 text-yellow-400" />
                </div>
              </div>

              <div className="text-left">
                <p className="text-white font-bold text-3xl flex items-center gap-3">
                  <CheckCircle2 className="w-7 h-7 text-green-400" />
                  Édition terminée
                </p>
                <p className="text-gray-300 text-lg mt-2">
                  Merci pour votre participation exceptionnelle !
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Rendez-vous à la prochaine édition pour remporter encore plus de récompenses !
                </p>
              </div>
            </motion.div>

            {/* Right - Next Edition */}
            <div className="flex flex-col items-center gap-4">
              <motion.div
                whileHover={{
                  scale: 1.05,
                  y: -2
                }}
                className="flex items-center gap-4 bg-white/10 rounded-2xl px-6 py-4"
              >
                <Trophy className="w-8 h-8 text-yellow-400" />
                <div className="text-left">
                  <p className="text-xs text-gray-300">Prochaine édition</p>
                  <p className="font-extrabold text-white text-lg">Très bientôt</p>
                </div>
              </motion.div>

              <HistoryButton />
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="active"
          initial={{ opacity: 0, scale: 0.9, rotateY: 90 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 250, damping: 15 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-8 mb-10 shadow-3xl border border-white/20"
        >
          {/* Animated glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-90" />

          <div className="relative">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-6">
              {/* Left - Game Status */}
              <motion.div
                animate={{
                  y: [0, 5, 0],
                  rotate: [0, 3, -3, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
                className="flex items-center gap-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-white/30 rounded-full blur-xl animate-pulse" />
                  <div className="rounded-full bg-white/20 p-5 shadow-lg">
                    <Flame className="w-12 h-12 text-white" />
                  </div>
                </div>

                <div className="text-left">
                  <p className="text-white/90 text-lg mt-1">Temps restants</p>
                </div>
              </motion.div>

              {/* Right - Countdown */}
              <CountdownTimer
                targetDate={endDate!}
                variant="light"
                onFinish={handleEndMatch}
              />

            </div>

            {/* CTA Button */}
            <div className="flex justify-center mb-4">
              <GlowButton href={`/star/choix/${gameConfig?.id || ''}`}>
                ⭐ Jouer Maintenant
              </GlowButton>
            </div>
            {/* Center - Game Period */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
              className="bg-white/90 dark:bg-gray-800/70 backdrop-blur-2xl rounded-3xl p-4 mb-8 border border-purple-200 dark:border-purple-500/40 shadow-2xl"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-5">
                  <motion.div
                    animate={{
                      rotate: [0, 6, -6, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity
                    }}
                    className="rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 p-4 shadow-lg"
                  >
                    <Calendar className="w-7 h-7 text-purple-600" />
                  </motion.div>

                  <div className="text-left">
                    <p className="font-extrabold text-gray-800 dark:text-white text-xxs">
                      {startDate && endDate ? (
                        <>Du {formatDateFR(startDate)} au {formatDateFR(endDate)}</>
                      ) : (
                        'Dates à venir'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>


          </div>
        </motion.div>
      )}

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
        className="grid grid-cols-1 sm:grid-cols-1 gap-8 mb-10"
      >
        <StatCard
          value={stats?.subscribers ?? null}
          label="Participants champions"
          icon={<Users className="w-7 h-7" />}
          loading={loading}
          color="from-purple-600 to-indigo-600"
          delay={0.8}
        />
      </motion.div>
    </div>
  );
}