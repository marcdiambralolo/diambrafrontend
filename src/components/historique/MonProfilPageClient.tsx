"use client";
import { useConsultationsListPage } from "@/hooks/historique/useConsultationsListPage";
import { cx } from "@/lib/functions";
import type { Consultation } from "@/lib/interfaces";
import { motion } from "framer-motion";
import {
  CalendarDays, Clock, Gamepad2, History, Loader2, Target, Timer, UserRound
} from "lucide-react";
import { memo, type ReactNode, useState } from "react";

const getRelativeTime = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return `il y a ${diffInSeconds} seconde${diffInSeconds > 1 ? 's' : ''}`;
  if (diffInSeconds < 3600) return `il y a ${Math.floor(diffInSeconds / 60)} minute${Math.floor(diffInSeconds / 60) > 1 ? 's' : ''}`;
  if (diffInSeconds < 86400) return `il y a ${Math.floor(diffInSeconds / 3600)} heure${Math.floor(diffInSeconds / 3600) > 1 ? 's' : ''}`;
  return `le ${past.toLocaleDateString('fr-FR')}`;
};

interface ConsultationCardProps {
  consultation: Consultation;
  index: number;
  type?: 'history' | 'games';
}

function ConsultationCard({ consultation, index, type = 'history' }: ConsultationCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const createdAt = consultation.createdAt;

  const relativeDate = createdAt ? getRelativeTime(createdAt as string) : 'Date inconnue';
  const formattedDate = createdAt ? new Date(createdAt as string).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : 'Date inconnue';

  const nomdujoueur = consultation.clientId?.username;
  const combinaison = consultation.combinaison || 'xxxx';
  const timeSpent = consultation.timeSpent;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cx(
        "group relative isolate overflow-hidden rounded-3xl p-5 cursor-pointer",
        "border border-white/40 dark:border-[color:var(--theme-border)]",
        "bg-gradient-to-br from-white/95 via-white/90 to-white/95",
        "dark:from-[#162A56] dark:via-[#13274C] dark:to-[#162A56]",
        "shadow-2xl shadow-black/5 dark:shadow-[0_18px_48px_-30px_rgba(3,10,25,0.88)]",
        "backdrop-blur-xl",
        "transition-all duration-300",
        "ring-2 ring-emerald-500/30 dark:ring-emerald-400/30"
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#4F83D1]/14 to-[#9BC2FF]/6 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-gradient-to-tr from-[#2E5AA6]/14 to-[#7BA9F1]/7 blur-3xl" />
        <div className="absolute -left-1/2 top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-130%] transition-transform duration-700 group-hover:translate-x-[320%] dark:via-white/5" />
      </div>
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-20 transition-opacity duration-300 group-hover:opacity-35"
        style={{
          background:
            "linear-gradient(90deg, rgba(46,90,166,0.85), rgba(79,131,209,0.88), rgba(155,194,255,0.7))",
        }}
      />

      <div className="relative z-10 flex items-start gap-4 w-full">
        <div className="flex-shrink-0">
          <div className={cx(
            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300",
            type === 'history'
              ? "bg-gradient-to-br from-purple-500 to-indigo-600"
              : "bg-gradient-to-br from-emerald-500 to-teal-600",
            isHovered ? "scale-110 shadow-lg shadow-purple-500/30" : "",
            "ring-2 ring-emerald-400/50 ring-offset-2"
          )}>
            {type === 'history' ? (
              <History className="w-7 h-7 text-white" />
            ) : (
              <Gamepad2 className="w-7 h-7 text-white" />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {nomdujoueur && (
                  <><div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-1">
                    <UserRound className="w-3 h-3 text-purple-600" />
                  </div><h3 className="text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300">
                      {nomdujoueur}
                    </h3></>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-1">
                  <Target className="w-3 h-3 text-indigo-600" />
                </div>
                <p className="text-lg font-black tracking-wider text-slate-800 dark:text-white font-mono">
                  {combinaison.split('').map((digit, i) => (
                    <span
                      key={i}
                      className={cx(
                        "inline-block w-7 text-center",
                        i > 0 && "ml-1"
                      )}
                    >
                      {digit}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-3">
            {timeSpent && (
              <div className="flex items-center gap-1.5">
                <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-1">
                  <Timer className="w-3 h-3 text-gray-500" />
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {timeSpent}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-3 pt-2 border-t border-gray-100 dark:border-gray-700/50">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">{relativeDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarDays className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </motion.div>
      )}
    </motion.article>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  count: number;
}

const TabButton = memo(({ active, onClick, icon, label, count }: TabButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={cx(
      "relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300",
      active
        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25"
        : "bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
    )}
  >
    {icon}
    <span>{label}</span>
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={cx(
        "px-2 py-0.5 rounded-full text-xs font-bold",
        active
          ? "bg-white/20 text-white"
          : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
      )}
    >
      {count}
    </motion.span>
    {active && (
      <motion.div
        layoutId="activeTab"
        className="absolute -bottom-4 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    )}
  </motion.button>
));

function ConsultationsEmpty() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-12 text-center backdrop-blur-lg dark:bg-[color:var(--theme-layer-3)]/78"
    >
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="mx-auto mb-6"
      >
        <History className="h-20 w-20 text-purple-400 mx-auto" strokeWidth={1.5} />
      </motion.div>

      <h3 className="text-2xl font-bold text-white mb-3">
        📜 Aucun jeu
      </h3>
    </motion.div>
  );
}

function ConsultationsListLoading() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mx-auto mb-4"
        >
          <Loader2 className="w-12 h-12 text-purple-500" />
        </motion.div>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-lg font-semibold text-gray-600 dark:text-gray-400"
        >
          Chargement de vos données...
        </motion.p>
      </div>
    </div>
  );
}

function MonProfilPageClientImpl() {
  const { loading, consultationsglobaux, historyCount } = useConsultationsListPage();

  if (loading) return <ConsultationsListLoading />;

  return (
    <main className="relative max-w-2xl mx-auto px-4 py-8 sm:px-6 sm:py-12 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20">
      <div className="mb-8">
        <div className="flex gap-3 p-1.5 bg-gray-100/50 dark:bg-gray-800/30 rounded-2xl">
          <TabButton
            active={true}
            onClick={() => { }}
            icon={<History className="w-4 h-4" />}
            label="Historique"
            count={historyCount}
          />
        </div>
      </div>
      <motion.div
        key="history"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
        className="space-y-5"
      >
        {historyCount === 0 ? (
          <ConsultationsEmpty />
        ) : (
          <div className="space-y-3">
            {consultationsglobaux.map((consultation, index) => (
              <ConsultationCard
                key={consultation?._id ?? consultation?.id ?? index}
                consultation={consultation}
                index={index}
                type="history"
              />
            ))}
          </div>
        )}
      </motion.div>
    </main>
  );
}

const MonProfilPageClient = memo(MonProfilPageClientImpl);

export default MonProfilPageClient;