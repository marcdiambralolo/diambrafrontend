"use client";
import Loader from '@/app/loading';
import { DIGITS, useNumberGridGame } from "@/hooks/game/useNumberGridGame";
import { useProfilUser } from "@/hooks/profil/work/useProfilUser";
import { formatDateFRJeu, formatNumber } from "@/lib/functions";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award, Calendar, Flame, History,
  MousePointerClick, Move, Rocket, Sparkles, Star, Target, Trash2,
  Trophy, Users, Volume2, VolumeX,
} from "lucide-react";
import React, { memo } from 'react';
import CacheLink from "../commons/CacheLink";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

interface LastEndedGame {
  id: string;
  isActive: boolean;
  status: string;
  startgameDate: string;
  endgameDate: string;
  createdAt?: string;
  updatedAt?: string;
}

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

const ActiveBanner = ({ endDate, handleEndMatch, startDate, formatDate }: any) => (
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

const SlotCard = ({ value, index, mode, selected, dragOverSlot, onDragOver, onDrop, onDragLeave, onPlace, onRemove }: any) => (
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

const DigitButton = ({ digit, isUsed, isSelected, mode, onDragStart, onDragEnd, onClick }: any) => (
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

export function NumberGridGame() {
  const {
    slots, selected, dragOverSlot, isDragging, mode, soundEnabled, used, isComplete,
    handleDragOver, handleDrop, removeFromSlot, setDragOverSlot, setIsDragging,
    setSelected, setMode, setSoundEnabled, placeSelectedDigitInSlot, handleSubmitAndNavigate
  } = useNumberGridGame();

  const {
    handleEndMatch,
    loading, stats, startDate, endDate, gameConfig,
    loadingLastEnded, lastEndedGame, showEnded, showActive,
  } = useProfilUser();

  if (loading || loadingLastEnded) return <Loader />;

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-purple-50/30 px-2 py-4 sm:py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3 mb-8"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 shadow-sm">
          <Trophy className="w-4 h-4 text-yellow-600" />
          <span className="text-xs font-black uppercase tracking-wider text-purple-700">
            DIAMBRA WIN
          </span>
          <Sparkles className="w-4 h-4 text-purple-500" />
        </div>
      </motion.div>

      {!showEnded && (
        <>
          <div className="max-w-4xl mx-auto space-y-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex justify-center gap-3 sm:gap-6 flex-wrap"
            >
              {slots.map((value, i) => (
                <SlotCard
                  key={i}
                  value={value}
                  index={i}
                  mode={mode}
                  selected={selected}
                  dragOverSlot={dragOverSlot}
                  onDragOver={(e: any) => mode === 'drag' && handleDragOver(e, i)}
                  onDragLeave={() => mode === 'drag' && setDragOverSlot(null)}
                  onDrop={(e: any) => mode === 'drag' && handleDrop(e, i)}
                  onPlace={() => {
                    if (mode === 'click' && value === null && selected !== null) {
                      placeSelectedDigitInSlot(i);
                    } else if (mode === 'click' && value !== null) {
                      removeFromSlot(i);
                    }
                  }}
                  onRemove={() => removeFromSlot(i)}
                />
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
              px-10 py-4 rounded-xl font-bold text-white shadow-xl transition-all duration-300
              ${isComplete
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-green-500/30"
                    : "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed opacity-60"
                  }
            `}
                disabled={!isComplete}
                onClick={handleSubmitAndNavigate}
              >
                <span className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Valider
                  <Rocket className="w-5 h-5" />
                </span>
              </motion.button>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <p className="text-center text-xs font-bold uppercase tracking-wider text-purple-600">
                {mode === 'click' ? "🖱️ Chiffres disponibles" : "🎯 Glissez les chiffres"}
              </p>
              <div className="flex gap-2 sm:gap-3 justify-center flex-wrap max-w-xl mx-auto">
                {DIGITS.map(d => (
                  <DigitButton
                    key={d}
                    digit={d}
                    isUsed={used.has(d)}
                    isSelected={selected === d}
                    mode={mode}
                    onDragStart={mode === 'drag' && !used.has(d) ? (e: any) => {
                      // @ts-ignore
                      const dragStart = (window as any).handleDragStart;
                      dragStart?.(e, d);
                    } : undefined}
                    onDragEnd={() => setIsDragging(false)}
                    onClick={() => {
                      if (mode === 'click' && !used.has(d)) {
                        setSelected(selected === d ? null : d);
                      }
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Message de sélection */}
            <AnimatePresence>
              {mode === 'click' && selected !== null && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-indigo-100 px-6 py-3 rounded-full shadow-md">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-bold text-purple-700">
                      Chiffre {selected} sélectionné — cliquez sur une case vide
                    </span>
                    <Sparkles className="w-4 h-4 text-purple-500" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-center gap-4 flex-wrap">
              <div className="flex gap-2 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-md border border-purple-100">
                <button
                  onClick={() => setMode('click')}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 ${mode === 'click'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <MousePointerClick className="w-4 h-4" />
                  <span className="font-semibold">Mode Clic</span>
                </button>
                <button
                  onClick={() => setMode('drag')}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 ${mode === 'drag'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <Move className="w-4 h-4" />
                  <span className="font-semibold">Mode Glisser-Deposer</span>
                </button>
              </div>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:scale-105 transition-all border border-purple-100"
              >
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-purple-600" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>

            <AnimatePresence>
              {isDragging && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full shadow-xl font-bold text-sm z-50"
                >
                  Déposez sur une case
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      <div className="fixed inset-0 overflow-hidden pointer-events-none mt-4">
        <div className="absolute top-10 left-10 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-30 animate-ping" />
        <div className="absolute top-20 right-16 w-2 h-2 bg-pink-400 rounded-full opacity-30 animate-ping delay-75" />
        <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-orange-400 rounded-full opacity-30 animate-ping delay-150" />
      </div>
      <div className="max-w-md mx-auto mt-8">
        <AnimatePresence mode="wait">

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

          {showEnded && (
            <EndedBanner key="ended" lastEndedGame={lastEndedGame} />
          )}
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