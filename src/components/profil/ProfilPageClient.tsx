'use client';
import Loader from "@/app/loading";
import { useProfilUser } from "@/hooks/profil/useProfilUser";
import { formatNumber } from "@/lib/functions";
import { motion } from 'framer-motion';
import { AlertCircle, Calendar, Clock, Gamepad2, Shield, Sparkles, Timer, Users } from "lucide-react";
import Link from 'next/link';
import React, { memo } from 'react';

const GAME_START_DATE = new Date('2026-05-18T00:00:00');
const GAME_END_DATE = new Date('2026-05-18T23:59:59');
const IS_GAME_ACTIVE = new Date() >= GAME_START_DATE && new Date() <= GAME_END_DATE;
const GAME_IS_ENDED = new Date() > GAME_END_DATE;
const GAME_NOT_STARTED = new Date() < GAME_START_DATE;

const formatDate = (date: Date) => {
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatDateTime = (date: Date) => {
  return date.toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getTimeRemaining = () => {
  const now = new Date();
  const diff = GAME_END_DATE.getTime() - now.getTime();

  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (86400000)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (3600000)) / (1000 * 60));

  return { days, hours, minutes };
};
interface StatCardProps {
  value: number | null;
  label: string;
  icon: React.ReactNode;
  loading: boolean;
  color: string;
}

const StatCard = memo<StatCardProps>(({ value, label, icon, loading, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.05 }}
    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-6 text-white shadow-xl`}
  >
    <div className="absolute top-0 right-0 opacity-20">
      {icon}
    </div>
    <div className="relative z-10">
      <p className="text-sm font-medium opacity-90 mb-1">{label}</p>
      {loading ? (
        <div className="h-10 w-20 bg-white/20 rounded animate-pulse" />
      ) : (
        <p className="text-3xl font-bold">{value !== null ? formatNumber(value) : '--'}</p>
      )}
    </div>
  </motion.div>
));

const GameStatusBanner = memo(() => {
  const timeRemaining = getTimeRemaining();

  if (GAME_NOT_STARTED) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-4 mb-6"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg...%3E')] opacity-10" />
        <div className="relative flex items-center gap-3">
          <Clock className="w-6 h-6 text-white animate-pulse" />
          <div>
            <p className="text-white font-bold">Le jeu commence bientôt !</p>
            <p className="text-white/80 text-sm">Ouverture le {formatDateTime(GAME_START_DATE)}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (GAME_IS_ENDED) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-600 to-gray-700 p-4 mb-6"
      >
        <div className="relative flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-white" />
          <div>
            <p className="text-white font-bold">Le jeu est terminé</p>
            <p className="text-white/80 text-sm">Merci d'avoir participé ! Rendez-vous pour la prochaine édition.</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 p-4 mb-6"
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg...%3E')] opacity-10" />
      <div className="relative flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-white/20 p-2">
            <Timer className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold">Jeu actif !</p>
            <p className="text-white/80 text-sm">Participez avant la fin</p>
          </div>
        </div>
        {timeRemaining && (
          <div className="flex gap-2 bg-black/20 rounded-xl px-4 py-2">
            <div className="text-center">
              <p className="text-white font-bold text-xl">{timeRemaining.days}</p>
              <p className="text-white/70 text-[10px]">jours</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-xl">{timeRemaining.hours}</p>
              <p className="text-white/70 text-[10px]">heures</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-xl">{timeRemaining.minutes}</p>
              <p className="text-white/70 text-[10px]">mins</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
});

const DatesSection = memo(() => {
  const timeRemaining = getTimeRemaining();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 mb-8 border border-gray-100 dark:border-gray-700 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3">
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Période du jeu</p>
            <p className="font-bold text-gray-800 dark:text-white">
              Du {formatDate(GAME_START_DATE)} au {formatDate(GAME_END_DATE)}
            </p>
          </div>
        </div>

        {IS_GAME_ACTIVE && timeRemaining && (
          <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl px-5 py-3">
            <Timer className="w-5 h-5 text-purple-600 animate-pulse" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Temps restant</p>
              <p className="font-bold text-purple-600">
                {timeRemaining.days}j {timeRemaining.hours}h {timeRemaining.minutes}m
              </p>
            </div>
          </div>
        )}

        {GAME_IS_ENDED && (
          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-xl px-5 py-3">
            <Shield className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Édition terminée</p>
              <p className="font-medium text-gray-600">Prochaine édition bientôt</p>
            </div>
          </div>
        )}

        {GAME_NOT_STARTED && (
          <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl px-5 py-3">
            <Clock className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Début dans</p>
              <p className="font-bold text-amber-600">
                {Math.ceil((GAME_START_DATE.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} jours
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
});

export default function ProfilPageClient() {
  const { loading, stats } = useProfilUser();
  const canPlay = IS_GAME_ACTIVE;

  if (loading) return (<Loader />);

  return (
    <div className="w-full  dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20  max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mt-8"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
          <Gamepad2 className="w-4 h-4 text-purple-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700">DIAMBRA WIN</span>
        </div>
      </motion.div>
      <GameStatusBanner />

      <DatesSection />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center"
      >
        {canPlay ? (
          <Link
            href="/star/choix"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-orange-600 to-purple-600 text-white font-bold rounded-2xl shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 transition-all duration-300 overflow-hidden text-lg"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <Gamepad2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Jouer Maintenant</span>
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </Link>
        ) : GAME_IS_ENDED ? (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-6 py-4 bg-gray-200 dark:bg-gray-700 rounded-2xl text-gray-500 dark:text-gray-400">
              <AlertCircle className="w-5 h-5" />
              <span>Le jeu est terminé</span>
            </div>
            <p className="text-sm text-gray-500 mt-3">Rendez-vous pour la prochaine édition !</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-6 py-4 bg-amber-100 dark:bg-amber-900/30 rounded-2xl text-amber-600 dark:text-amber-400">
              <Clock className="w-5 h-5 animate-pulse" />
              <span>Le jeu commence bientôt</span>
            </div>
            <p className="text-sm text-gray-500 mt-3">Ouverture le {formatDateTime(GAME_START_DATE)}</p>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-1 gap-4 mb-2 mt-4"
      >
        <StatCard
          value={stats?.subscribers ?? null}
          label="Joueurs inscrits"
          icon={<Users className="w-8 h-8" />}
          loading={loading}
          color="from-purple-600 to-indigo-600"
        />
      </motion.div>
    </div>
  );
}