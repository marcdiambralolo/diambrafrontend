'use client';
import { toastVariants } from '@/hooks/choix/useCategoryConsulterClient';
import { formatNumber } from "@/lib/functions";
import { LastEndedGame } from '@/lib/interfaces';
import { motion } from 'framer-motion';
import {
  AlertCircle, AlertTriangle, Award, Calendar, CheckCircle2,
  Crown,
  Flame, History,
  MousePointerClick, Move,
  Rocket, Star,
  Target, Trash2,
  Trophy,
} from "lucide-react";
import React, { memo } from 'react';
import CacheLink from "../commons/CacheLink";

export const SlotCard = ({ value, index, mode, selected, dragOverSlot, onDragOver, onDrop, onDragLeave, onPlace, onRemove }: any) => (
  <motion.div
    initial={{ scale: 0, rotateY: 180 }}
    animate={{ scale: 1, rotateY: 0 }}
    transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
    whileHover={{ scale: 1.02 }}
    className="relative"
  >
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onPlace}
      className={`
        h-24 w-20 sm:h-32 sm:w-28 flex items-center justify-center rounded-2xl 
        transition-all duration-300 cursor-pointer backdrop-blur-sm
        ${value !== null
          ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-xl ring-2 ring-purple-400/50"
          : dragOverSlot === index && mode === 'drag'
            ? "border-3 border-purple-500 bg-purple-100 shadow-xl ring-4 ring-purple-300 scale-105"
            : selected !== null && mode === 'click' && value === null
              ? "border-3 border-purple-400 bg-purple-100 shadow-lg ring-2 ring-purple-300 scale-105"
              : "border-2 border-dashed border-purple-300 bg-white/80 hover:bg-purple-50 hover:border-purple-400 hover:shadow-lg"
        }
      `}
    >
      {value !== null ? (
        <>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-4xl sm:text-6xl font-black cursor-grab active:cursor-grabbing select-none drop-shadow-lg"
          >
            {value}
          </motion.span>
          <button
            onClick={onRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg transition-all hover:scale-110 hover:bg-red-600 hover:shadow-xl"
          >
            <Trash2 size={16} />
          </button>
        </>
      ) : (
        <div className="text-center">
          <Target className="text-purple-300 w-8 h-8 sm:w-10 sm:h-10 mx-auto" />
          {mode === 'click' && selected !== null && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 text-xs text-purple-500 font-semibold whitespace-nowrap"
            >
              ↓ Déposer ↓
            </motion.span>
          )}
        </div>
      )}
    </div>
  </motion.div>
);

export const DigitButton = ({ digit, isUsed, isSelected, mode, onDragStart, onDragEnd, onClick }: any) => (
  <motion.button
    whileHover={!isUsed ? { scale: 1.1, y: -2 } : {}}
    whileTap={!isUsed ? { scale: 0.95 } : {}}
    draggable={mode === 'drag' && !isUsed}
    onDragStart={onDragStart}
    onDragEnd={onDragEnd}
    onClick={onClick}
    disabled={isUsed}
    className={`
      relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl font-black transition-all duration-300 text-lg sm:text-xl
      ${isUsed
        ? "bg-gray-100 text-gray-400 line-through cursor-not-allowed opacity-50"
        : isSelected && mode === 'click'
          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl ring-4 ring-purple-300 scale-110"
          : "border-2 border-purple-200 bg-white text-purple-700 hover:border-purple-400 hover:shadow-lg hover:bg-purple-50"
      }
    `}
  >
    {digit}
    {!isUsed && mode === 'click' && !isSelected && (
      <MousePointerClick className="absolute -top-1 -right-1 w-4 h-4 text-purple-500" />
    )}
    {!isUsed && mode === 'drag' && (
      <Move className="absolute -top-1 -right-1 w-4 h-4 text-purple-500" />
    )}
  </motion.button>
);

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

export const HistoryButton = memo(({ gameId }: { gameId?: string }) => (
  <CacheLink
    href={`/star/historique${gameId ? `/${gameId}` : ''}`}
    className="group flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-sm w-full sm:w-auto"
  >
    <History className="w-4 h-4" />
    <span>Historique</span>
  </CacheLink>
));

export const GameStatusBadge = ({ children, variant = 'primary' }: { children: React.ReactNode; variant?: 'primary' | 'success' | 'error' }) => {
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

export const EndedBanner = ({ lastEndedGame }: { lastEndedGame: LastEndedGame | null }) => (
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

export const ActiveBanner = ({ endDate, handleEndMatch, startDate, formatDate }: any) => (
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

interface StatusBannerProps {
  isSufficient: boolean;
  requiredQuantity: number;
  availableQuantity: number;
}

export const StatusBanner = memo<StatusBannerProps>(({
  isSufficient,
  requiredQuantity,
  availableQuantity
}) => {
  if (!isSufficient) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative overflow-hidden mb-4 flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-400/5 to-transparent" />
        <div className="rounded-full bg-red-100 dark:bg-red-900/40 p-2">
          <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-red-800 dark:text-red-300">
            Jetons insuffisants
          </p>
          <p className="text-xs text-red-700 dark:text-red-400/80 mt-0.5">
            Il vous manque <strong>{requiredQuantity - availableQuantity}</strong> jeton(s).
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-transparent" />
      <div className="rounded-full bg-green-100 dark:bg-green-900/40 p-2">
        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-green-800 dark:text-green-300">
          Prêt à valider !
        </p>
        <p className="text-xs text-green-700 dark:text-green-400/80 mt-0.5">
          Vous disposez de <strong>{availableQuantity}</strong> jeton(s) pour ce jeu
        </p>
      </div>
    </motion.div>
  );
});

interface GameHeaderProps {
  title: string;
  icon?: React.ReactNode;
}

export const GameHeader = ({ title, icon }: GameHeaderProps) => (
  <div className="text-center">
    <GameStatusBadge>
      <Trophy className="w-4 h-4 text-yellow-400" />
      <span className="text-xs font-black uppercase tracking-wide text-white">{title}</span>
      <Crown className="w-4 h-4 text-yellow-400" />
    </GameStatusBadge>
    {icon && <div className="mt-2">{icon}</div>}
  </div>
);