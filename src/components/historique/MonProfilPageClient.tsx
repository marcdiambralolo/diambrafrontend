"use client";
import Loader from "@/app/loading";
import { useConsultationsListPage } from "@/hooks/historique/useConsultationsListPage";
import { cx } from "@/lib/functions";
import { motion } from "framer-motion";
import { History } from "lucide-react";
import { memo, type ReactNode } from "react";
import ConsultationCard from "../commons/ConsultationCard";

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

function MonProfilPageClientImpl() {
  const { loading, consultationsglobaux, historyCount } = useConsultationsListPage();

  if (loading) return <Loader />;

  return (
    <main className="relative max-w-2xl mx-auto px-4 py-8 sm:px-6 sm:py-12 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20">
      <div className="mb-8">
        <div className="flex gap-3 p-1.5 bg-gray-100/50 dark:bg-gray-800/30 rounded-2xl">
          <TabButton
            active={true}
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