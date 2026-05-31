'use client';
import ConsultationCard from '@/components/commons/ConsultationCard';
import { useAdminConsultationsPageFinished } from '@/hooks/admin/competitions/archives/useAdminConsultationsPageFinished';
import { 
  ChevronLeft, ChevronRight, FileText, RefreshCw, 
  Archive, Calendar, Trophy, Award, Clock, TrendingUp,
  Users, Crown, Sparkles, ArrowLeft, Medal, Star, 
  Zap, BarChart3, Activity, Gem, Target,
  Hash, BookOpen, Grid3x3, List
} from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { formatEditionDate } from '@/lib/functions';

// ============================================================================
// ANIMATIONS
// ============================================================================

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

// ============================================================================
// COMPOSANT STATISTIQUE
// ============================================================================

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  color: string;
}

const StatCard = ({ icon, label, value, subValue, color }: StatCardProps) => (
  <motion.div
    variants={fadeInUp}
    whileHover={{ y: -5, scale: 1.02 }}
    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-5 text-white shadow-xl group cursor-pointer`}
  >
    <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-white/10 group-hover:scale-150 transition-transform duration-700" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
          {icon}
        </div>
      </div>
      <div className="text-3xl font-black tracking-tight">{value}</div>
      <div className="text-xs font-medium opacity-90 mt-1">{label}</div>
      {subValue && <div className="text-[10px] opacity-75 mt-2">{subValue}</div>}
    </div>
  </motion.div>
);

// ============================================================================
// COMPOSANT ONGLET
// ============================================================================

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
}

const TabButton = ({ active, onClick, icon, label, count }: TabButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`
      flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300
      ${active
        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
        : 'bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
      }
    `}
  >
    {icon}
    <span>{label}</span>
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`
        px-2 py-0.5 rounded-full text-xs font-bold
        ${active
          ? 'bg-white/20 text-white'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
        }
      `}
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
);

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

export default function ConsultationsArchivePage() {
  const {
    consultations,
    totalPages,
    currentPage,
    loading,
    error,
    isRefreshing,
    editions,
    handleRefresh,
    handlePageChange,
  } = useAdminConsultationsPageFinished();

  const [activeTab, setActiveTab] = useState<'editions' | 'games'>('editions');

  // ============================================================================
  // STATISTIQUES AVANCÉES
  // ============================================================================

  const stats = useMemo(() => {
    const totalGames = consultations.length;
    
    const playersMap = new Map();
    consultations.forEach(c => {
      const username = c.clientId?.username;
      if (username && !playersMap.has(username)) {
        playersMap.set(username, { username, games: 0 });
      }
      if (username) {
        playersMap.get(username).games++;
      }
    });
    const uniquePlayers = playersMap.size;
    
    const completedGames = consultations.filter(c => c.combinaison && c.combinaison !== '????').length;
    const completionRate = totalGames > 0 ? Math.round((completedGames / totalGames) * 100) : 0;
    
    const combinaisonsMap = new Map();
    consultations.forEach(c => {
      const comb = c.combinaison;
      if (comb && comb !== '????') {
        combinaisonsMap.set(comb, (combinaisonsMap.get(comb) || 0) + 1);
      }
    });
    const uniqueCombinaisons = combinaisonsMap.size;

    return {
      totalGames,
      uniquePlayers,
      completionRate,
      uniqueCombinaisons
    };
  }, [consultations]);

  // Affichage du chargement
  if (loading && consultations.length === 0 && editions.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 animate-pulse">
            <div className="h-48" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        ))}
      </div>
    );
  }

  // Affichage de l'erreur
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
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Réessayer
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20">
      {/* Effet de fond animé */}
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
        
        {/* En-tête premium */}
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
                <Archive className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-400">
                  Archives
                </span>
                <Crown className="w-4 h-4 text-yellow-500" />
              </motion.div>
              <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent">
                Éditions terminées
              </h1>
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

              <Link
                href="/admin/consultations"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:shadow-md transition-all group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Retour
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Onglets */}
        <div className="mb-8">
          <div className="flex gap-3 p-1.5 bg-gray-100/50 dark:bg-gray-800/30 rounded-2xl">
            <TabButton
              active={activeTab === 'editions'}
              onClick={() => setActiveTab('editions')}
              icon={<BookOpen className="w-4 h-4" />}
              label="Éditions archivées"
              count={editions.length}
            />
            <TabButton
              active={activeTab === 'games'}
              onClick={() => setActiveTab('games')}
              icon={<Grid3x3 className="w-4 h-4" />}
              label="Parties"
              count={consultations.length}
            />
          </div>
        </div>

        {/* Contenu des onglets */}
        <AnimatePresence mode="wait">
          {activeTab === 'editions' && (
            <motion.div
              key="editions"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {editions.length === 0 ? (
                <motion.div
                  variants={fadeInUp}
                  className="text-center py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-gray-800"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-24 h-24 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center"
                  >
                    <Archive className="w-12 h-12 text-purple-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Aucune archive</h3>
                  <p className="text-gray-500 dark:text-gray-400">Aucune édition terminée n'est encore disponible</p>
                </motion.div>
              ) : (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                  {editions.map((edition, idx) => (
                    <motion.div
                      key={edition.id}
                      variants={fadeInUp}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 p-5 border border-purple-100 dark:border-purple-800 shadow-md group"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500">
                            <Award className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Édition #{idx + 1}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-2">
                          <Calendar className="w-4 h-4" />
                           <span  >
                                              Du {formatEditionDate(new Date(edition.startDate))} {' '} au {formatEditionDate(new Date(edition.endDate))}
                                            </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'games' && (
            <motion.div
              key="games"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Statistiques */}
              {consultations.length > 0 && (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
                >
                  <StatCard
                    icon={<Trophy className="w-4 h-4" />}
                    label="Total parties"
                    value={stats.totalGames}
                    color="from-purple-600 to-indigo-600"
                  />
                  <StatCard
                    icon={<Users className="w-4 h-4" />}
                    label="Joueurs uniques"
                    value={stats.uniquePlayers}
                    color="from-blue-600 to-cyan-600"
                  />
                  <StatCard
                    icon={<BarChart3 className="w-4 h-4" />}
                    label="Taux complétion"
                    value={`${stats.completionRate}%`}
                    color="from-emerald-600 to-teal-600"
                  />
                  <StatCard
                    icon={<Hash className="w-4 h-4" />}
                    label="Combinaisons uniques"
                    value={stats.uniqueCombinaisons}
                      color="from-emerald-600 to-teal-600"
                  />
                </motion.div>
              )}

              {/* Grille des consultations */}
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
                    <Grid3x3 className="w-12 h-12 text-purple-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Aucune partie</h3>
                  <p className="text-gray-500 dark:text-gray-400">Aucune partie n'a été jouée dans ces éditions</p>
                </motion.div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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

                  {/* Pagination */}
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
                              className={`min-w-[40px] h-10 px-2 rounded-lg font-medium transition-all ${
                                pageNum === currentPage
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
          )}
        </AnimatePresence>

        {/* Pied de page */}
        <div className="mt-8 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1"
          >
            <Zap className="w-3 h-3" />
            Dernière mise à jour : {new Date().toLocaleTimeString('fr-FR')}
          </motion.p>
        </div>
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