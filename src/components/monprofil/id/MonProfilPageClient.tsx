"use client";
import Loader from "@/app/loading";
import CacheLink from "@/components/commons/CacheLink";
import ConsultationCard from "@/components/commons/ConsultationCard";
import { useConsultationsListPageWithId } from "@/hooks/consultations/useConsultationsListPageWithId";
import { cx } from "@/lib/functions";
import { AnimatePresence, motion } from "framer-motion";
import { Gamepad2, History, Plus } from "lucide-react";
import { memo, type ReactNode } from "react";

interface TabButtonProps {
  active: boolean;
  icon: ReactNode;
  label: string;
  count: number;
}

const TabButton = memo(({ active, icon, label, count }: TabButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
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
}

function ConsultationsEmpty({ consultationsLength }: ConsultationsEmptyProps) {
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
        {consultationsLength === 0 ? '📜 Aucun jeu en historique' : '🎮 Aucun jeu'}
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
    <CacheLink
      href="/star/profil"
      className="group relative flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="relative z-10 flex items-center gap-2">
        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        <span className="font-bold">Nouveau jeu</span>
        <Gamepad2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
      </div>
    </CacheLink>
  </motion.div>
));

function MonProfilPageClientImpl() {
  const { consultations, loading, gamesCount, } = useConsultationsListPageWithId();

  if (loading) return <Loader />;

  return (
    <main className="relative max-w-2xl mx-auto px-4 py-8 sm:px-6 sm:py-12 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20">
      <div className="mb-8">
        <div className="flex gap-3 p-1.5 bg-gray-100/50 dark:bg-gray-800/30 rounded-2xl">
          <TabButton
            active={true}
            icon={<Gamepad2 className="w-4 h-4" />}
            label="Mes Jeux"
            count={gamesCount}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key="games"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="space-y-5"
        >
          {gamesCount === 0 ? (
            <ConsultationsEmpty consultationsLength={gamesCount} />
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
      </AnimatePresence>

      <NewGameButton />
    </main>
  );
}

const MonProfilPageClient = memo(MonProfilPageClientImpl);

export default MonProfilPageClient;