'use client';
import Loader from '@/app/loading';
import { ANIMATION_CONFIG, toastVariants, useCategoryConsulterClient } from '@/hooks/choix/useCategoryConsulterClient';
import { formatDateFR, useProfilUser } from "@/hooks/profil/work/useProfilUser";
import { api } from '@/lib/api/client';
import { formatNumber } from "@/lib/functions";
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle, AlertTriangle, ArrowRight, Award, Calendar, CheckCircle2,
  ChevronRight, Circle, Coins, Crown, Flame, Gift, History,
  Rocket, ShoppingBag,
  Star, Trophy, Users, Zap
} from "lucide-react";
import React, { memo, useCallback, useEffect, useState } from 'react';
import CacheLink from "../commons/CacheLink";

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

interface ErrorToastProps {
  message: string;
  onClose: () => void;
}

const ErrorToast = memo<ErrorToastProps>(({ message, onClose }) => (
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

const StatusBanner = memo<StatusBannerProps>(({
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

export default function ProfilPageClient() {
  const {
    handleGoToMarket, handleNext, clearError,
    dataLoading, dataError, showError, currentError, availableQuantity,
    cardClasses, isSufficient, requiredQuantity,
  } = useCategoryConsulterClient();

  const {
    handleEndMatch: originalHandleEndMatch,
    loading, stats, isGameNotStarted, isGameActive, isGameEnded, startDate, endDate, gameConfig,
  } = useProfilUser();

  const [lastEndedGame, setLastEndedGame] = useState<LastEndedGame | null>(null);
  const [loadingLastEnded, setLoadingLastEnded] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchLastEndedGame = useCallback(async () => {
    try {
      const response = await api.get('/game-configurations/last-ended');

      type LastEndedResponse = {
        success: boolean;
        hasEndedEdition: boolean;
        configuration: LastEndedGame;
      };

      const data = response.data as LastEndedResponse;

      if (data?.hasEndedEdition && data?.configuration) {
        setLastEndedGame(data.configuration);
      } else {
        setLastEndedGame(null);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du dernier jeu terminé:', error);
      setLastEndedGame(null);
    } finally {
      setLoadingLastEnded(false);
    }
  }, []);

  // Handler modifié pour rafraîchir quand l'édition se termine
  const handleEndMatch = useCallback(() => {
    originalHandleEndMatch();
    // Déclencher le rafraîchissement du dernier jeu terminé
    setRefreshTrigger(prev => prev + 1);
  }, [originalHandleEndMatch]);

  // Premier chargement
  useEffect(() => {
    fetchLastEndedGame();
  }, [fetchLastEndedGame]);

  // Rafraîchissement déclenché par refreshTrigger
  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchLastEndedGame();
    }
  }, [refreshTrigger, fetchLastEndedGame]);

  if (loading || loadingLastEnded) return <Loader />;

  const showActive = isGameActive && !isGameEnded;
  const showEnded = isGameEnded || (!isGameActive && !isGameNotStarted && lastEndedGame !== null);

  if (dataLoading) {
    return <Loader />;
  }

  return (
    <div className="relative w-full mt-8 flex flex-col items-center justify-center sm:px-0 overflow-x-hidden  dark:bg-none dark:bg-[#0C0B1D] dark:bg-gradient-to-b dark:from-[#0C0B1D] dark:to-[#162A56]">
      <div className="text-center">
        <GameStatusBadge>
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="text-xs font-black uppercase tracking-wide text-white">DIAMBRA WIN</span>
          <Crown className="w-4 h-4 text-yellow-400" />
        </GameStatusBadge>
      </div>

      {!showEnded && (
        <>
          <div className="mb-2 mt-6">
            <StatusBanner
              isSufficient={isSufficient}
              requiredQuantity={requiredQuantity}
              availableQuantity={availableQuantity}
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: ANIMATION_CONFIG.duration.normal }}
              disabled={!isSufficient}
              className={cardClasses}
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <div className="flex-shrink-0">
                {isSufficient ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="rounded-full bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] p-1.5"
                  >
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </motion.div>
                ) : (
                  <div className="rounded-full border-2 border-gray-300 dark:border-gray-600 p-1.5">
                    <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <Coins className="w-3.5 h-3.5" />
                    <span>Jetons requis : <strong className="text-gray-800 dark:text-gray-200">{requiredQuantity}</strong></span>
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${isSufficient ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    <Gift className="w-3.5 h-3.5" />
                    <span><strong>{availableQuantity}</strong> disponible(s) dans votre wallet</span>
                  </div>
                </div>
              </div>

              {isSufficient && (
                <motion.div
                  animate={{ x: [0, -5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="flex-shrink-0"
                >
                  <Zap className="w-5 h-5 text-[#2E5AA6] dark:text-[#9BC2FF]" />
                </motion.div>
              )}

              {!isSufficient && (
                <div className="flex-shrink-0">
                  <div className="px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-semibold">
                    {availableQuantity}/{requiredQuantity}
                  </div>
                </div>
              )}
            </motion.button>
          </motion.div>

          <div className="mt-8 space-y-3">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={handleNext}
              disabled={!isSufficient}
              className={`
                w-full h-12 rounded-xl mb-4 font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98]
                ${isSufficient
                  ? "bg-gradient-to-r from-[#2E5AA6] via-[#3A6BB8] to-[#4F83D1] text-white shadow-lg shadow-[#2E5AA6]/30 hover:shadow-xl hover:scale-[1.02] group cursor-pointer"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60"
                }
              `}
            >
              <span>Jouer Maintenant</span>
              <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isSufficient ? "group-hover:translate-x-1" : ""}`} />
            </motion.button>

            {!isSufficient && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-xs text-red-500 dark:text-red-400 mt-2"
              >
                Vous ne disposez pas d'assez de jetons.
              </motion.p>
            )}

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={handleGoToMarket}
              className="group w-full h-10 flex items-center justify-center gap-2 rounded-xl border-2 border-[#DDE7FA] bg-[#EEF4FF] text-sm font-semibold text-[#2E5AA6] transition-all duration-300 active:scale-[0.98] hover:bg-[#DDE7FA] dark:border-[#2E5AA6]/45 dark:bg-[#0F1C3F]/35 dark:text-[#9BC2FF] dark:hover:bg-[#162A56]/45"
            >
              <ShoppingBag className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
              <span>Acquerir des jetons</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
          </div>

          {(showError || !!dataError) && (
            <ErrorToast message={currentError!} onClose={clearError} />
          )}
        </>
      )}
      <br /><br />
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
              formatDate={formatDateFR}
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