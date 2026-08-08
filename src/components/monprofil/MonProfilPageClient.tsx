"use client";
import Loader from "@/app/loading";
import { useConsultationsListPage } from "@/hooks/consultations/useConsultationsListPage";
import { staggerContainer } from "@/lib/animations";
import { AnimatePresence, motion } from "framer-motion";
import { Gamepad2, History } from "lucide-react";
import { memo } from "react";
import ConsultationCard from "../commons/ConsultationCard";
import EditionsList from "./components/EditionsList";
import ErrorState from "./components/ErrorState";
import IdentityOverview from "./components/IdentityOverview";
import NewGameButton from "./components/NewGameButton";
import TabButton from "./components/TabButton";

function MonProfilPageClientImpl() {
  const {
    setActiveTab, getGamesCountByEdition, consultations, editions, loading, activeTab,
    processedData, fullName, dateNaissanceLabel,
  } = useConsultationsListPage();

  if (loading) return <Loader />;
  if (!processedData) return <ErrorState />;

  const isGamesTab = activeTab === 'games';

  return (
    <main className="relative max-w-2xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8">
        <div className="flex gap-3 p-2">
          <TabButton
            active={activeTab === 'games'}
            onClick={() => setActiveTab('games')}
            icon={<Gamepad2 className="w-4 h-4" />}
            label="Mes Jeux"
            count={editions.length}
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
        {isGamesTab ? (
          <motion.div
            key="games"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            <EditionsList
              editions={editions}
              getGamesCountByEdition={getGamesCountByEdition}
            />
          </motion.div>
        ) : (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="relative mt-8"
          >
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
                />

                {consultations.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <History className="w-5 h-5 text-purple-500" />
                      Dernières parties (top 10)
                    </h3>
                    <div className="space-y-3">
                      {consultations.slice(0, 10).map((consultation, index) => (
                        <ConsultationCard
                          key={consultation?._id ?? consultation?.id ?? index}
                          consultation={consultation}
                          index={index}
                          showDate={true}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <NewGameButton />
    </main>
  );
}

const MonProfilPageClient = memo(MonProfilPageClientImpl);

export default MonProfilPageClient;