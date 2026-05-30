'use client';
import { toastVariants } from '@/hooks/choix/useCategoryConsulterClient';
import { formatDateFRJeu, formatNumber } from "@/lib/functions";
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Calendar, Flame, HelpCircle, Users } from "lucide-react";
import Image from "next/image";
import React, { memo } from 'react';

export const StatusBadge = memo(({ text, color }: { text: string; color: string }) => (
  <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${color === 'red' ? 'bg-red-500' : 'bg-green-500'} text-white flex items-center gap-1`}>
    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
    {text}
  </div>
));

export const FooterSection = memo(({ currentYear, onlineStatus }: { currentYear: number; onlineStatus: { text: string; color: string } }) => (
  <footer className="relative mt-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 text-center shadow-lg overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10" />
    <div className="relative flex items-center justify-between text-xs text-gray-400">
      <div className="flex items-center gap-2">
        <span>© {currentYear}</span>
      </div>
      <StatusBadge text={onlineStatus.text} color={onlineStatus.color} />
    </div>
    <p className="relative text-gray-500 text-[10px] mt-2">
      DIAMBRA CORPORATION • Tous droits réservés
    </p>
  </footer>
));

export const FooterImage = memo(({ randomImage, currentYear, onlineStatus }: any) => (
  <div className="w-full max-w-md mx-auto mt-2">
    <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden"
      >
        <Image
          src={randomImage}
          width={400}
          height={300}
          alt="DIAMBRA"
          className="w-full h-144 object-cover rounded-3xl transition-transform duration-700 group-hover:scale-110"
          priority
        />
      </motion.div>
      <FooterSection currentYear={currentYear} onlineStatus={onlineStatus} />
    </div>
  </div>
));

export const BannerSection = memo(({ affichebanner, endDate, handleEndMatch, startDate, gameConfig, stats, loading }: any) => (
  <div className="w-full max-w-md mx-auto mt-8">
    <AnimatePresence mode="wait">
      {affichebanner && (
        <ActiveBanner
          key="active"
          endDate={endDate}
          handleEndMatch={handleEndMatch}
          startDate={startDate}
          formatDate={formatDateFRJeu}
          gameConfig={gameConfig}
        />
      )}
    </AnimatePresence>

    <StatCard
      value={stats?.subscribers ?? null}
      label="Participants"
      icon={<Users className="w-4 h-4" />}
      loading={loading}
      color="from-purple-600 to-indigo-600"
      delay={0.2}
    />
  </div>
));

export const HeaderSection = memo(() => (
  <div className="relative flex flex-col items-center justify-center mb-8">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="relative flex flex-col items-center justify-center gap-2"
    >
      <div className="relative">
        <h1 className="text-xl sm:text-2xl font-black text-center bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
          DIAMBRA LEARNING
        </h1>
        <div className="absolute -top-2 -right-6 w-8 h-8">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-yellow-400 rounded-full absolute top-0 right-0"
          />
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mt-2">
        <div className="w-8 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
        <div className="w-8 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
      </div>
    </motion.div>
  </div>
));

export const HelpButton = memo(({ onClick }: { onClick: () => void }) => (
  <motion.button
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
    aria-label="Aide"
  >
    <HelpCircle className="w-6 h-6" />
  </motion.button>
));

interface StatCardProps {
  value: number | null;
  label: string;
  icon: React.ReactNode;
  loading: boolean;
  color: string;
  delay?: number;
}

export const StatCard = memo<StatCardProps>(({ value, label, icon, loading, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.5, type: "spring", stiffness: 200 }}
    whileHover={{ scale: 1.02, y: -4 }}
    whileTap={{ scale: 0.98 }}
    className={`relative overflow-hidden rounded-2xl mb-8 bg-gradient-to-br ${color} p-5 text-white shadow-xl cursor-pointer group border border-white/20`}
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
        </div>
      )}
    </div>
  </motion.div>
));

export const CountdownTimer = ({ targetDate, variant = 'light', onFinish }: { targetDate: Date; variant?: 'light' | 'dark'; onFinish?: () => void }) => {
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

export const ActiveBanner = ({ endDate, handleEndMatch, startDate, formatDate }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-5 mb-6 shadow-xl"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    <div className="relative flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-white/20 p-3">
          <Flame className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-white/80 text-xs">Temps restant pour jouer</p>
        </div>
      </div>

      <CountdownTimer targetDate={endDate} variant="light" onFinish={handleEndMatch} />

      <div className="flex items-center justify-between bg-white/10 rounded-xl p-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-white" />
          <span className="text-white text-xs">Du {formatDate(startDate)}</span>
        </div>
        <div className="text-white text-xs">au {formatDate(endDate)}</div>
      </div>
    </div>
  </motion.div>
);

interface ErrorToastProps {
  message: string;
  onClose: () => void;
}

export const ErrorToast = memo<ErrorToastProps>(({ message, onClose }) => (
  <motion.div
    variants={toastVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="fixed bottom-4 right-4 z-50 max-w-sm"
  >
    <div className="bg-gradient-to-r from-red-500 to-red-600 backdrop-blur-sm text-white rounded-2xl shadow-2xl px-5 py-4 flex items-start gap-3 border border-red-400/30">
      <div className="rounded-full bg-white/20 p-1.5">
        <AlertCircle className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-snug">Erreur</p>
        <p className="text-xs text-white/90 mt-0.5">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-white/80 hover:text-white transition-all duration-200 hover:scale-110 text-xl leading-none w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10"
        aria-label="Fermer"
      >
        ×
      </button>
    </div>
  </motion.div>
));