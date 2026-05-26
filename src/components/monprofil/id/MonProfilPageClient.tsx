"use client";
import Loader from "@/app/loading";
import CacheLink from "@/components/commons/CacheLink";
import ConsultationCard from "@/components/commons/ConsultationCard";
import { useConsultationsListPageWithId } from "@/hooks/consultations/useConsultationsListPageWithId";
import { formatEditionDate } from "@/lib/functions";
import { EditionInfo } from "@/lib/interfaces";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Crown, Flame, Gamepad2, History, Plus, Trophy } from "lucide-react";
import { memo } from "react";

interface NewGameButtonProps {
  gameId?: string;
}

const NewGameButton = memo(({ gameId }: NewGameButtonProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.02 }}
    className="fixed bottom-6 right-6 z-50"
  >
    <CacheLink
      href={`/star/choix/${gameId || ''}`}
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

interface EditionBannerProps {
  edition: EditionInfo;
}

const EditionBanner = memo(({ edition }: EditionBannerProps) => {
  const now = new Date();
  const startDate = new Date(edition.startDate);
  const endDate = new Date(edition.endDate);
  const isActive = now >= startDate && now <= endDate && edition.status === 'active';
  const isEnded = edition.status === 'ended' || now > endDate;

  const getStatusBadge = () => {
    if (isActive) {
      return { text: "Édition en cours", color: "bg-green-500", icon: <Flame className="w-3 h-3" /> };
    }
    if (isEnded) {
      return { text: "Édition terminée", color: "bg-red-500", icon: <Trophy className="w-3 h-3" /> };
    }
    return { text: "Édition à venir", color: "bg-yellow-500", icon: <Calendar className="w-3 h-3" /> };
  };

  const status = getStatusBadge();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 p-5 shadow-xl mb-6"
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg...%3E')] opacity-10" />

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs text-white/80">Édition</p>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${status.color} text-white`}>
                {status.icon}
                {status.text}
              </span>
            </div>
            <p className="text-white font-bold text-sm mt-1">
              Du {formatEditionDate(startDate)} au {formatEditionDate(endDate)}
            </p>
          </div>
        </div>

        {edition.winningCombination && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-semibold text-white">
              Combinaison gagnante : {edition.winningCombination}
            </span>
          </div>
        )}

        {!isEnded && (
          <CacheLink
            href={`/star/choix/${edition.id}`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white text-sm font-semibold hover:bg-white/30 transition-all"
          >
            <Gamepad2 className="w-4 h-4" />
            Jouer
          </CacheLink>
        )}
      </div>
    </motion.div>
  );
});

interface ConsultationsEmptyProps {
  consultationsLength: number;
  edition: EditionInfo | null;
}

function ConsultationsEmpty({ edition }: ConsultationsEmptyProps) {
  const isEditionActive = edition && new Date(edition.startDate) <= new Date() && new Date(edition.endDate) >= new Date();

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
        {isEditionActive ? (
          <Gamepad2 className="h-20 w-20 text-purple-400 mx-auto" strokeWidth={1.5} />
        ) : (
          <History className="h-20 w-20 text-purple-400 mx-auto" strokeWidth={1.5} />
        )}
      </motion.div>

      <h3 className="text-2xl font-bold text-white mb-3">
        {isEditionActive ? "🎮 Prêt à jouer ?" : "📜 Aucun jeu en historique"}
      </h3>

      <p className="text-white/70 mb-6">
        {isEditionActive
          ? "Vous n'avez pas encore participé à cette édition. Lancez votre première partie !"
          : "Vous n'avez pas encore joué dans cette édition."
        }
      </p>

      {isEditionActive && (
        <CacheLink
          href={`/star/choix/${edition?.id || ''}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
        >
          <Gamepad2 className="w-4 h-4" />
          Commencer
        </CacheLink>
      )}
    </motion.div>
  );
}

function MonProfilPageClientImpl() {
  const { consultations, loading, gamesCount, gameId, edition, error } = useConsultationsListPageWithId();

  if (loading) return <Loader />;

  if (error && !edition) {
    return (
      <main className="relative max-w-2xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <div className="text-center py-20 bg-red-50 dark:bg-red-900/20 rounded-2xl">
          <p className="text-red-600 dark:text-red-400">Erreur : {error}</p>
          <CacheLink href="/star/profil" className="mt-4 inline-block text-purple-600 underline">
            Retour à l'accueil
          </CacheLink>
        </div>
      </main>
    );
  }

  return (
    <main className="relative max-w-2xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
      {edition && <EditionBanner edition={edition} />}

      {gamesCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between bg-white/50 dark:bg-gray-800/30 rounded-xl p-4 mb-6"
        >
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Total des parties</span>
          </div>
          <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{gamesCount}</span>
        </motion.div>
      )}

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
            <ConsultationsEmpty consultationsLength={gamesCount} edition={edition}
            />
          ) : (
            <div className="space-y-3">
              {consultations.map((consultation, index) => {
                const formattedConsultation = {
                  ...consultation,
                  timeSpent: consultation.timeSpent
                    ? typeof consultation.timeSpent === 'number'
                      ? `${consultation.timeSpent}s`
                      : consultation.timeSpent
                    : '0s',
                };

                return (
                  <ConsultationCard
                    key={consultation?._id ?? consultation?.id ?? index}
                    consultation={formattedConsultation}
                    index={index}
                    showDate={false}
                    showState={edition?.status === 'ended'}
                  />
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {edition && edition.status !== 'ended' && new Date(edition.endDate) >= new Date() && (
        <NewGameButton gameId={gameId} />
      )}
    </main>
  );
}

const MonProfilPageClient = memo(MonProfilPageClientImpl);

export default MonProfilPageClient;