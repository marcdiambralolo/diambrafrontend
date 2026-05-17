"use client";
import { useMonProfil } from "@/hooks/carteduciel/useMonProfil";
import { useConsultationsListPage } from "@/hooks/consultations/useConsultationsListPage";
import { cx } from "@/lib/functions";
import type { Consultation } from "@/lib/interfaces";
import { motion, Variants } from "framer-motion";
import {
  AlertCircle, ArrowRight, CalendarDays, Clock, Crown,
  Gamepad2, Loader2, MapPin,
  Plus, Sparkles,
  TrendingUp, Trophy, UserRound
} from "lucide-react";
import Link from "next/link";
import { memo, type ReactNode, useState } from "react";

export interface ConsultationCardProps {
  consultation: Consultation;
  index: number;
}

function ConsultationCard({ consultation, index }: ConsultationCardProps) {
  const [isHovered, setIsHovered] = useState(false);

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
        "transition-all duration-300"
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#4F83D1]/14 to-[#9BC2FF]/6 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-gradient-to-tr from-[#2E5AA6]/14 to-[#7BA9F1]/7 blur-3xl" />
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(420px 280px at var(--sx) var(--sy), rgba(79,131,209,0.22), transparent 60%)",
          }}
        />
        <div className="absolute -left-1/2 top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-130%] transition-transform duration-700 group-hover:translate-x-[320%] dark:via-white/5" />
      </div>

      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-20 transition-opacity duration-300 group-hover:opacity-35"
        style={{
          background:
            "linear-gradient(90deg, rgba(46,90,166,0.85), rgba(79,131,209,0.88), rgba(155,194,255,0.7))",
        }}
      />
      <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br from-white/20 to-transparent" />

      <div className="relative z-10 flex items-center gap-4 w-full">
        <div className="flex-shrink-0">
          <div className={cx(
            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300",
            "bg-gradient-to-br from-purple-500 to-indigo-600",
            isHovered ? "scale-110 shadow-lg shadow-purple-500/30" : ""
          )}>
            <Gamepad2 className="w-7 h-7 text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white truncate">
              Partie du {new Date(consultation.createdAt || Date.now()).toLocaleDateString('fr-FR')}
            </h3>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30">
              <Trophy className="w-3 h-3 text-green-600 dark:text-green-400" />
              <span className="text-[10px] font-bold text-green-700 dark:text-green-400">Terminée</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Il y a 3 jours</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Score: 4/4</span>
            </div>
          </div>
        </div>

        <ArrowRight className={cx(
          "w-5 h-5 text-gray-400 transition-all duration-300",
          isHovered ? "translate-x-1 text-purple-500" : ""
        )} />
      </div>
    </motion.article>
  );
}

interface ConsultationsEmptyProps {
  consultationsLength: number;
}

export function ConsultationsEmpty({ consultationsLength }: ConsultationsEmptyProps) {
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
        <Gamepad2 className="h-20 w-20 text-purple-400 mx-auto" strokeWidth={1.5} />
      </motion.div>

      <h3 className="text-2xl font-bold text-white mb-3">
        {consultationsLength === 0
          ? '🎮 Commencez votre aventure'
          : '🔍 Aucun résultat trouvé'}
      </h3>

      <p className="mb-8 text-purple-200 max-w-md mx-auto">
        {consultationsLength === 0
          ? 'Créez votre première partie de Quatre Cases et défiez votre logique !'
          : 'Essayez de modifier vos filtres pour trouver ce que vous cherchez'}
      </p>

      <Link
        href="/star/profil"
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all hover:scale-105"
      >
        <Plus className="w-4 h-4" />
        Commencer une partie
        <Sparkles className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}

export function ConsultationsListLoading() {
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
          Chargement de vos jeux...
        </motion.p>
      </div>
    </div>
  );
}

const NewGameButton = memo(() => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.02 }}
    className="fixed bottom-6 right-6 z-50"
  >
    <Link
      href="/star/profil"
      className="group relative flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      <div className="relative z-10 flex items-center gap-2">
        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        <span className="font-bold">Nouveau jeu</span>
        <Gamepad2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
      </div>
    </Link>
  </motion.div>
));

NewGameButton.displayName = 'NewGameButton';

const ConsultationsListMain = memo(function ConsultationsListMain() {
  const { consultations, loading, count } = useConsultationsListPage();

  if (loading) return <ConsultationsListLoading />;

  return (
    <div className="w-full space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Mes jeux
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {count} jeu{count > 1 ? 'x' : ''}
          </p>
        </div>

        <Link
          href="/star/profil"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Nouvau jeu
        </Link>
      </div>

      {/* Liste des consultations */}
      {count === 0 ? (
        <ConsultationsEmpty consultationsLength={count} />
      ) : (
        <div className="space-y-3">
          {consultations.map((consultation, index) => (
            <ConsultationCard
              key={consultation?._id ?? consultation?.id ?? index}
              consultation={consultation}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
});

ConsultationsListMain.displayName = 'ConsultationsListMain';

const ErrorState = memo(() => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex items-center justify-center min-h-[400px]"
  >
    <div className="max-w-md rounded-2xl border border-red-500/25 bg-gradient-to-br from-red-950/20 to-red-900/10 p-8 text-center backdrop-blur-xl">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-400" />
      </motion.div>
      <h3 className="text-xl font-bold text-white mb-2">Accès refusé</h3>
      <p className="text-gray-300">Aucun utilisateur connecté. Veuillez vous connecter.</p>
    </div>
  </motion.div>
));

ErrorState.displayName = 'ErrorState';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

export const IdentityOverview = memo(function IdentityOverview({
  fullName,
  dateNaissanceLabel,
  heureNaissance,
  lieuNaissance,
}: {
  fullName: string;
  dateNaissanceLabel: string;
  heureNaissance: string;
  lieuNaissance: string;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 shadow-sm"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-indigo-50/30 dark:from-purple-950/20 dark:to-indigo-950/20" />
      <div className="relative p-6">
        <div className="flex items-center gap-2 mb-4">
          <Crown className="w-5 h-5 text-yellow-500" />
          <h3 className="font-bold text-gray-800 dark:text-white">Mon profil</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <IdentityPill
            icon={<UserRound className="h-4 w-4" />}
            label="Nom complet"
            value={fullName}
          />
          <IdentityPill
            icon={<CalendarDays className="h-4 w-4" />}
            label="Date & heure"
            value={`${dateNaissanceLabel} à ${heureNaissance}`}
          />
          <IdentityPill
            icon={<MapPin className="h-4 w-4" />}
            label="Lieu de naissance"
            value={lieuNaissance}
          />
        </div>
      </div>
    </motion.div>
  );
});

export const IdentityPill = memo(function IdentityPill({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <motion.div
      whileHover={{ x: 2 }}
      className="rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-3 transition-all hover:shadow-sm"
    >
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
        {icon}
        {label}
      </div>
      <div className="mt-1.5 text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
        {value || "—"}
      </div>
    </motion.div>
  );
});

const UserHub = memo(function UserHub() {
  const { processedData, fullName, dateNaissanceLabel, heureNaissance, lieuNaissance, } = useMonProfil();

  if (!processedData) return <ErrorState />;

  return (
    <div className="relative mt-8">
      <div className="relative z-10 w-full">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-6"
        >
          <IdentityOverview
            fullName={fullName}
            dateNaissanceLabel={dateNaissanceLabel}
            heureNaissance={heureNaissance}
            lieuNaissance={lieuNaissance}
          />
        </motion.div>
      </div>
    </div>
  );
});

function MonProfilPageClientImpl() {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <div className="space-y-8">
          <ConsultationsListMain />
          <UserHub />
        </div>
      </div>
      <NewGameButton />
    </main>
  );
}

const MonProfilPageClient = memo(MonProfilPageClientImpl);

export default MonProfilPageClient;