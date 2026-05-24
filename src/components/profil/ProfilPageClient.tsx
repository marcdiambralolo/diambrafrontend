'use client';
import { useAdminConsultationsPageFinished } from "@/hooks/profil/ended/useAdminConsultationsPageFinished";
import { useProfilUser } from "@/hooks/profil/useProfilUser";
import { formatDateFRJeu, formatEditionDate } from "@/lib/functions";
import { AnimatePresence, motion } from 'framer-motion';
import {
  Award, Crown, FileText, Flame, Gift, Hash, ListOrdered, Medal, RefreshCw,
  Shuffle, Sparkles, Star, Trophy, Users,
} from "lucide-react";
import { useMemo } from 'react';
import { fadeInUp, LoadingSkeleton, staggerContainer, TopCard } from "../admin/consultations/ConsultationsPageClientEnded";
import CacheLink from '../commons/CacheLink';
import { ActiveBanner, EndedBanner, GameStatusBadge, NotStartedBanner, Podium, StatCard, StatCard2, StatisticsPanel, WinnersList, WinningCombinationCard } from "./Features";

export default function ProfilPageClient() {
  const {
    handleOpenGame, formatDateTime, handleEndMatch,
    loading: profilLoading, stats, startDate, endDate, gameConfig,
    loadingLastEnded, showNotStarted, lastEndedGame, showActive, showEnded,
  } = useProfilUser();

  const {
    consultations, activeEdition, winners, statistics, loading: endedLoading, error, refresh,
  } = useAdminConsultationsPageFinished();

  const hasWinners = winners && winners.totalWinners > 0;
  const hasStatistics = statistics !== null;
  const winningCombination = statistics?.winningCombination || activeEdition?.winningCombination || null;

  const localStats = useMemo(() => {
    const playersMap = new Map();
    consultations.forEach(c => {
      const username = c.clientId?.username;
      if (username && !playersMap.has(username)) {
        playersMap.set(username, { username, games: 0, combinaisons: new Set() });
      }
      if (username) {
        const player = playersMap.get(username);
        player.games++;
        if (c.combinaison) player.combinaisons.add(c.combinaison);
      }
    });

    const uniquePlayers = playersMap.size;
    const avgGamesPerPlayer = uniquePlayers > 0 ? (consultations.length / uniquePlayers).toFixed(1) : 0;

    const combinaisonsMap = new Map();
    consultations.forEach(c => {
      const comb = c.combinaison;
      if (comb && comb !== '????') {
        combinaisonsMap.set(comb, (combinaisonsMap.get(comb) || 0) + 1);
      }
    });
    const uniqueCombinaisons = combinaisonsMap.size;

    const topCombinaisons = Array.from(combinaisonsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const topPlayers = Array.from(playersMap.entries())
      .map(([username, data]) => ({ username, games: data.games, combinaisons: data.combinaisons.size }))
      .sort((a, b) => b.games - a.games)
      .slice(0, 5);

    return {
      totalGames: consultations.length,
      uniquePlayers,
      avgGamesPerPlayer,
      uniqueCombinaisons,
      topCombinaisons,
      topPlayers,
    };
  }, [consultations]);

  const isLoading = profilLoading || loadingLastEnded || endedLoading;

  if (isLoading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 border border-red-100 dark:border-red-900/30"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <FileText className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={refresh}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Réessayer
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 dark:from-gray-950 dark:to-purple-950/20 px-4 py-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-30 animate-ping" />
        <div className="absolute top-20 right-16 w-2 h-2 bg-pink-400 rounded-full opacity-30 animate-ping delay-75" />
        <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-orange-400 rounded-full opacity-30 animate-ping delay-150" />
      </div>

      <div className="text-center pt-6 pb-4">
        <GameStatusBadge>
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="text-xs font-black uppercase tracking-wide text-white">DIAMBRA WIN</span>
          <Crown className="w-4 h-4 text-yellow-400" />
        </GameStatusBadge>
      </div>

      <div className="max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {showNotStarted && startDate && (
            <NotStartedBanner key="not-started" startDate={startDate} handleOpenGame={handleOpenGame} formatDateTime={formatDateTime} />
          )}

          {showActive && endDate && startDate && (
            <ActiveBanner
              key="active"
              endDate={endDate}
              handleEndMatch={handleEndMatch}
              startDate={startDate}
              formatDate={formatDateFRJeu}
              gameConfig={gameConfig}
            />
          )}

          {showEnded && (<EndedBanner key="ended" lastEndedGame={lastEndedGame} />)}
        </AnimatePresence>

        <StatCard
          value={stats?.subscribers ?? null}
          label="Inscrits"
          icon={<Users className="w-3.5 h-3.5" />}
          loading={profilLoading}
          color="from-purple-600 to-indigo-600"
          delay={0.2}
        />
      </div>

      <div className="relative max-w-7xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 px-4 py-1.5 mb-3 shadow-sm"
              >
                <Crown className="w-4 h-4 text-yellow-500" />
                <span className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-400">
                  {showEnded ? "RÉSULTATS DE LA DERNIÈRE ÉDITION" : "PROCLAMATION DES RÉSULTATS"}
                </span>
                <Sparkles className="w-4 h-4 text-purple-500" />
              </motion.div>
              <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent">
                DIAMBRA WINNER'S
              </h1>
            </div>
          </div>
        </motion.div>

        {activeEdition && (
          <motion.div
            variants={fadeInUp}
            className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 p-5 shadow-xl"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/80">Édition</p>
                  <p className="text-white font-bold">
                    Du {formatEditionDate(new Date(activeEdition.startDate))} au {formatEditionDate(new Date(activeEdition.endDate))}
                  </p>
                </div>
              </div>
              {winningCombination && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                  <Award className="w-4 h-4 text-white" />
                  <span className="text-xs font-semibold text-white">
                    Combinaison Gagnante de l'Edition : {winningCombination}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* SECTION GAGNANTS (backend) */}
        {hasWinners && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 mb-8"
          >
            <WinningCombinationCard combination={winningCombination || "????"} />
            <Podium winners={winners.exact} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WinnersList
                title="🏆 Gagnants - Ordre Exact"
                winners={winners.exact}
                icon={<ListOrdered className="w-4 h-4" />}
                color="from-yellow-500 to-orange-500"
              />
              <WinnersList
                title="🔄 Gagnants - Désordre"
                winners={winners.disordered}
                icon={<Shuffle className="w-4 h-4" />}
                color="from-blue-500 to-cyan-500"
              />
            </div>
          </motion.div>
        )}

        {/* SECTION STATISTIQUES (backend) */}
        {hasStatistics && (
          <StatisticsPanel stats={statistics} />
        )}


        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 mb-8"
        >
          <StatCard2
            icon={<Trophy className="w-4 h-4" />}
            label="Total jeux"
            value={localStats.totalGames}
            color="from-purple-600 to-indigo-600"
          />
          <StatCard2
            icon={<Users className="w-4 h-4" />}
            label="Joueurs uniques"
            value={localStats.uniquePlayers}
            subValue={`${localStats.avgGamesPerPlayer} parties/joueur`}
            color="from-blue-600 to-cyan-600"
          />
          <StatCard2
            icon={<Hash className="w-4 h-4" />}
            label="Combinaisons uniques"
            value={localStats.uniqueCombinaisons}
            color="from-amber-600 to-orange-600"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TopCard
            title="Top joueurs"
            icon={<Medal className="w-5 h-5 text-yellow-400" />}
            items={localStats.topPlayers.map((player, idx) => ({
              name: player.username,
              value: `${player.games} parties`,
              subValue: `${player.combinaisons} combinaisons`,
              rank: idx + 1
            }))}
            color="from-purple-600 to-indigo-600"
          />
          <TopCard
            title="Top combinaisons"
            icon={<Star className="w-5 h-5 text-yellow-400" />}
            items={localStats.topCombinaisons.map(([comb, count], idx) => ({
              name: comb,
              value: `${count} fois`,
              rank: idx + 1
            }))}
            color="from-green-600 to-emerald-600"
          />
        </div>

        {/* MESSAGE PAS DE GAGNANTS */}
        {!hasWinners && consultations.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl mb-8"
          >
            <Gift className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Aucun gagnant</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Personne n'a trouvé la bonne combinaison dans cette édition.
            </p>
          </motion.div>
        )}

        {/* LISTE DES PARTICIPATIONS */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {consultations.length === 0 ? (
            <motion.div
              variants={fadeInUp}
              className="text-center py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-gray-800"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-24 h-24 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center"
              >
                <Sparkles className="w-12 h-12 text-purple-400" />
              </motion.div>
              <p className="text-gray-500 dark:text-gray-400">Aucune partie n'a été jouée dans cette édition</p>
            </motion.div>
          ) : (
            <div className="flex justify-center items-center mb-4">
              <CacheLink
                href={`/star/historique/${activeEdition?.id || ''}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-400 dark:bg-purple-900/30 text-white dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                VOIR TOUTES LES PARTICIPATIONS
              </CacheLink>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}