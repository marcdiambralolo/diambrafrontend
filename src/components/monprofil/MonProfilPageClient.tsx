"use client";
import { useMonProfil } from "@/hooks/carteduciel/useMonProfil";
import { useConsultationsListPage } from "@/hooks/consultations/useConsultationsListPage";
import { cx } from "@/lib/functions";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { AlertCircle, CalendarDays, Gamepad2, History, Loader2, MapPin, Plus, UserRound } from "lucide-react";
import Link from "next/link";
import { memo, type ReactNode } from "react";
import ConsultationCard from "../commons/ConsultationCard";
import Loader from "@/app/loading";

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
    {count >= 0 && <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={cx(
        "px-2 py-0.5 rounded-full text-xs font-bold",
        active
          ? "bg-white/20 text-white"
          : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
      )}
    >
      {count > 0 && count}
    </motion.span>}
    {active && (
      <motion.div
        layoutId="activeTab"
        className="absolute -bottom-4 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    )}
  </motion.button>
));

interface ConsultationsEmptyProps {
  consultationsLength: number;
  type?: 'history' | 'games';
}

function ConsultationsEmpty({ consultationsLength, type = 'history' }: ConsultationsEmptyProps) {
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
        {type === 'history' ? (
          <History className="h-20 w-20 text-purple-400 mx-auto" strokeWidth={1.5} />
        ) : (
          <Gamepad2 className="h-20 w-20 text-purple-400 mx-auto" strokeWidth={1.5} />
        )}
      </motion.div>

      <h3 className="text-2xl font-bold text-white mb-3">
        {consultationsLength === 0
          ? type === 'history'
            ? '📜 Aucun jeu en historique'
            : '🎮 Commencez à jouer'
          : '🔍 Aucun résultat trouvé'}
      </h3>
    </motion.div>
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

const IdentityOverview = memo(function IdentityOverview({
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

const IdentityPill = memo(function IdentityPill({
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

function MonProfilPageClientImpl() {
  const { processedData, fullName, dateNaissanceLabel, heureNaissance, lieuNaissance } = useMonProfil();
  const { consultations, loading, gamesCount, setActiveTab, activeTab, } = useConsultationsListPage();

  if (loading) return <Loader />;
  if (!processedData) return <ErrorState />;

  return (
    <main className="relative max-w-2xl mx-auto px-4 py-8 sm:px-6 sm:py-12 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20">
      <div className="mb-8">
        <div className="flex gap-3 p-1.5 bg-gray-100/50 dark:bg-gray-800/30 rounded-2xl">
          <TabButton
            active={activeTab === 'games'}
            onClick={() => setActiveTab('games')}
            icon={<Gamepad2 className="w-4 h-4" />}
            label="Mes Jeux"
            count={gamesCount}
          />
          <TabButton
            active={activeTab === 'history'}
            onClick={() => setActiveTab('history')}
            icon={<History className="w-4 h-4" />}
            label="Mon Profil"
            count={-1}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'games' && (
          <motion.div
            key="games"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            {gamesCount === 0 ? (
              <ConsultationsEmpty consultationsLength={gamesCount} type="games" />
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
          </motion.div>
        )}
        {activeTab === 'history' && (
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
        )}
      </AnimatePresence>
      <NewGameButton />
    </main>
  );
}

const MonProfilPageClient = memo(MonProfilPageClientImpl);

export default MonProfilPageClient;