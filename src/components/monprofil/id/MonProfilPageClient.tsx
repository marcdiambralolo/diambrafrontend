"use client";
import Loader from "@/app/loading";
import CacheLink from "@/components/commons/CacheLink";
import ConsultationCard from "@/components/commons/ConsultationCard";
import { useConsultationsListPageWithId } from "@/hooks/consultations/useConsultationsListPageWithId";
import { AnimatePresence, motion } from "framer-motion";
import { History } from "lucide-react";
import { memo } from "react";
import ConsultationsEmpty from "./components/ConsultationsEmpty";
import EditionBanner from "./components/EditionBanner";
import GameButton from "./components/GameButton";
import NewGameButton from "./components/NewGameButton";

function MonProfilPageClientImpl() {
  const { consultations, loading, gamesCount, gameId, edition, error } = useConsultationsListPageWithId();

  if (loading) return <Loader />;

  if (error && !edition) {
    return (
      <main className="relative max-w-2xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-red-50 dark:bg-red-900/20 rounded-3xl border border-red-200 dark:border-red-800/30"
        >
          <div className="text-6xl mb-4">😕</div>
          <p className="text-red-600 dark:text-red-400 font-medium">Erreur : {error}</p>
          <CacheLink href="/star/profil" className="mt-6 inline-block text-purple-600 dark:text-purple-400 underline font-semibold hover:no-underline transition-all">
            Retour à l'accueil
          </CacheLink>
        </motion.div>
      </main>
    );
  }

  const isEditionActive = edition && edition.status !== 'ended' && new Date(edition.endDate) >= new Date();

  return (
    <main className="relative max-w-2xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      {edition && <EditionBanner edition={edition} />}

      {isEditionActive && <GameButton gameId={gameId} />}

      {gamesCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <History className="w-5 h-5 text-purple-500" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total des parties</span>
          </div>
          <motion.span
            whileHover={{ scale: 1.1 }}
            className="text-3xl font-bold text-purple-600 dark:text-purple-400"
          >
            {gamesCount}
          </motion.span>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key="games"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="space-y-6 mb-2 mt-2"
        >
          {gamesCount === 0 ? (
            <ConsultationsEmpty consultationsLength={gamesCount} edition={edition} />
          ) : (
            <motion.div
              className="space-y-4"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              animate="show"
            >
              {consultations.map((consultation, index) => {
                const formattedConsultation = {
                  ...consultation,
                  timeSpent: consultation.timeSpent ? typeof consultation.timeSpent === 'number'
                    ? `${consultation.timeSpent}s`
                    : consultation.timeSpent
                    : '0s',
                };

                return (
                  <motion.div
                    key={consultation?._id ?? consultation?.id ?? index}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                  >
                    <ConsultationCard
                      consultation={formattedConsultation}
                      index={index}
                      showDate={false}
                      showState={edition?.status === 'ended'}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
      {isEditionActive && <GameButton gameId={gameId} />}
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />

      {isEditionActive && <NewGameButton gameId={gameId} />}
    </main>
  );
}

const MonProfilPageClient = memo(MonProfilPageClientImpl);

export default MonProfilPageClient;