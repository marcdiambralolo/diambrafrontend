'use client';
import { ANIMATION_CONFIG, toastVariants } from '@/hooks/choix/useCategoryConsulterClient';
import { formatDateFRJeu, formatNumber } from "@/lib/functions";
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle, AlertTriangle, ArrowRight, Calendar, CheckCircle2, ChevronRight, Circle, Coins,
  Flame, Gift, HelpCircle, ShoppingBag, Users, Zap
} from "lucide-react";
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

interface OfferSelectionProps {
  isSufficient: boolean;
  requiredQuantity: number;
  availableQuantity: number;
  cardClasses: string;
  onNext: () => void;
  onGoToMarket: () => void;
}

export const OfferSelection = ({
  isSufficient, requiredQuantity, availableQuantity,
  cardClasses, onNext, onGoToMarket
}: OfferSelectionProps) => (
  <>
    <div className="mb-2 mt-6">
      <StatusBanner
        isSufficient={isSufficient}
        requiredQuantity={requiredQuantity}
        availableQuantity={availableQuantity}
      />
    </div>

    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
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
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="rounded-full bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] p-1.5">
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
              <span><strong>{availableQuantity}</strong> disponible(s)</span>
            </div>
          </div>
        </div>

        {isSufficient ? (
          <motion.div animate={{ x: [0, -5, 0] }} transition={{ duration: 1, repeat: Infinity }} className="flex-shrink-0">
            <Zap className="w-5 h-5 text-[#2E5AA6] dark:text-[#9BC2FF]" />
          </motion.div>
        ) : (
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
        onClick={onNext}
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
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-xs text-red-500 dark:text-red-400 mt-2">
          Vous ne disposez pas d'assez de jetons.
        </motion.p>
      )}

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={onGoToMarket}
        className="group w-full h-10 flex items-center justify-center gap-2 rounded-xl border-2 border-[#DDE7FA] bg-[#EEF4FF] text-sm font-semibold text-[#2E5AA6] transition-all duration-300 active:scale-[0.98] hover:bg-[#DDE7FA] dark:border-[#2E5AA6]/45 dark:bg-[#0F1C3F]/35 dark:text-[#9BC2FF] dark:hover:bg-[#162A56]/45"
      >
        <ShoppingBag className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
        <span>Acquérir des jetons</span>
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
      </motion.button>
    </div>
  </>
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