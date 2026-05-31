'use client';
import CacheLink from '@/components/commons/CacheLink';
import ConsultationCard from '@/components/commons/ConsultationCard';
import { useAdminConsultationsPageFinished } from '@/hooks/admin/competitions/parties/useAdminConsultationsPageFinished';
import { formatEditionDate } from '@/lib/functions';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import {
  ArrowLeft, BarChart3, ChevronLeft, ChevronRight, Clock, FileText, Flame, Hash,
  RefreshCw, Sparkles, Target, TrendingUp, Trophy, Users,
} from 'lucide-react';
import { useMemo } from 'react';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, type: "spring", stiffness: 100 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-6">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 animate-pulse">
        <div className="h-48" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      </div>
    ))}
  </div>
);

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  color: string;
  delay?: number;
  trend?: number;
}

const StatCard = ({ icon, label, value, subValue, color, delay = 0, trend }: StatCardProps) => (
  <motion.div
    variants={fadeInUp}
    custom={delay}
    whileHover={{ y: -5, scale: 1.02 }}
    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-5 text-white shadow-xl group cursor-pointer`}
  >
    <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-white/10 group-hover:scale-150 transition-transform duration-700" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${trend >= 0 ? 'bg-green-500/30' : 'bg-red-500/30'}`}>
            <TrendingUp className={`w-3 h-3 ${trend < 0 && 'rotate-180'}`} />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="text-3xl font-black tracking-tight">{value}</div>
      <div className="text-xs font-medium opacity-90 mt-1">{label}</div>
      {subValue && <div className="text-[10px] opacity-75 mt-2">{subValue}</div>}
    </div>
  </motion.div>
);

interface TopCardProps {
  title: string;
  icon: React.ReactNode;
  items: { name: string; value: string | number; subValue?: string; rank: number }[];
  color: string;
}

const TopCard = ({ title, icon, items, color }: TopCardProps) => (
  <motion.div
    variants={fadeInUp}
    whileHover={{ y: -5 }}
    className={`relative overflow-hidden rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-xl group`}
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-full blur-2xl" />
    <div className="relative p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className={`p-2 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
          {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h3>
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-800 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${color} text-white text-xs font-bold flex items-center justify-center shadow-md`}>
                {item.rank}
              </div>
              <span className="font-semibold text-gray-700 dark:text-gray-200">{item.name}</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-purple-600 dark:text-purple-400">{item.value}</div>
              {item.subValue && <div className="text-[10px] text-gray-400">{item.subValue}</div>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

export default function ConsultationsPage() {
  const {
    consultations, totalPages, currentPage, loading, error,
    isRefreshing, activeEdition, remainingDays, handleRefresh, handlePageChange,
  } = useAdminConsultationsPageFinished();

  const stats = useMemo(() => {
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
    const activePlayers = consultations.filter(c => c.clientId?.username).length;
    const avgGamesPerPlayer = uniquePlayers > 0 ? (consultations.length / uniquePlayers).toFixed(1) : 0;

    // Combinaisons uniques
    const combinaisonsMap = new Map();
    consultations.forEach(c => {
      const comb = c.combinaison;
      if (comb && comb !== '????') {
        combinaisonsMap.set(comb, (combinaisonsMap.get(comb) || 0) + 1);
      }
    });
    const uniqueCombinaisons = combinaisonsMap.size;

    // Top combinaisons
    const topCombinaisons = Array.from(combinaisonsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);

    // Top joueurs
    const topPlayers = Array.from(playersMap.entries())
      .map(([username, data]) => ({ username, games: data.games, combinaisons: data.combinaisons.size }))
      .sort((a, b) => b.games - a.games)
      .slice(0, 15);

    // Taux de complétion
    const completedGames = consultations.filter(c => c.combinaison && c.combinaison !== '????').length;
    const completionRate = consultations.length > 0 ? Math.round((completedGames / consultations.length) * 100) : 0;

    // Statistiques de temps
    let totalTime = 0;
    consultations.forEach(c => {
      if (c.timeSpent) {
        const timeInSeconds = parseFloat(c.timeSpent.replace('s', ''));
        if (!isNaN(timeInSeconds)) totalTime += timeInSeconds;
      }
    });

    return {
      totalGames: consultations.length,
      uniquePlayers,
      activePlayers,
      avgGamesPerPlayer,
      uniqueCombinaisons,
      completionRate,
      totalTime: totalTime.toFixed(1),
      avgTime: consultations.length > 0 ? (totalTime / consultations.length).toFixed(1) : 0,
      topCombinaisons,
      topPlayers,
    };
  }, [consultations]);

  if (loading) {
    return <LoadingSkeleton />;
  }

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
            onClick={handleRefresh}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
          >
            <RefreshCw className="w-4 h-4 inline mr-2 animate-spin" />
            Réessayer
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 25, repeat: Infinity, delay: 5 }}
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent">
              Jeux
            </h1>
            <div>

            </div>

            <div className="flex items-center gap-3">

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2.5 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all disabled:opacity-50 border border-gray-100 dark:border-gray-700"
              >
                <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              </motion.button>

              <CacheLink
                href="/admin/consultations/archives"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:shadow-md transition-all group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Archives
              </CacheLink>
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
                  <p className="text-xs text-white/80">Édition active</p>
                  <p className="text-white font-bold">
                    Du {formatEditionDate(new Date(activeEdition.startDate))} {' '} au {formatEditionDate(new Date(activeEdition.endDate))}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                <Target className="w-4 h-4 text-white" />
                <span className="text-xs font-semibold text-white">
                  {remainingDays} jour{remainingDays !== 1 ? 's' : ''} restant{remainingDays !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {consultations.length > 0 && (
          <>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8"
            >
              <StatCard
                icon={<Trophy className="w-4 h-4" />}
                label="Total jeux"
                value={stats.totalGames}
                color="from-purple-600 to-indigo-600"
                trend={12}
              />
              <StatCard
                icon={<Users className="w-4 h-4" />}
                label="Joueurs uniques"
                value={stats.uniquePlayers}
                subValue={`${stats.avgGamesPerPlayer} parties/joueur`}
                color="from-blue-600 to-cyan-600"
                trend={8}
              />
              <StatCard
                icon={<Hash className="w-4 h-4" />}
                label="Combinaisons uniques"
                value={stats.uniqueCombinaisons}
                color="from-amber-600 to-orange-600"
              />
              <StatCard
                icon={<BarChart3 className="w-4 h-4" />}
                label="Taux complétion"
                value={`${stats.completionRate}%`}
                color="from-emerald-600 to-teal-600"
                trend={stats.completionRate > 50 ? 10 : -5}
              />
              <StatCard
                icon={<Clock className="w-4 h-4" />}
                label="Temps moyen"
                value={`${stats.avgTime}s`}
                color="from-rose-600 to-pink-600"
                trend={-3}
              />
            </motion.div>
          </>
        )}

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
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Aucun jeu</h3>
              <p className="text-gray-500 dark:text-gray-400">Aucune partie n'a encore été jouée dans cette édition</p>
            </motion.div>
          ) : (
            <>
              <div className=" grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ">
                <AnimatePresence>
                  {consultations.map((consultation, index) => (
                    <motion.div
                      key={consultation._id ?? index}
                      variants={fadeInUp}
                      layout
                      whileHover={{ y: -5 }}
                    >
                      <ConsultationCard
                        consultation={consultation}
                        index={index}
                        showDate={false}
                        showState={false}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center items-center gap-2 mt-8 pt-4 border-t border-gray-200 dark:border-gray-800"
                >
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <motion.button
                          key={pageNum}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePageChange(pageNum)}
                          className={`min-w-[40px] h-10 px-2 rounded-lg font-medium transition-all ${pageNum === currentPage
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md scale-105'
                            : 'border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                        >
                          {pageNum}
                        </motion.button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </main>
  );
}