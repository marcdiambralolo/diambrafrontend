'use client';
import CacheLink from '@/components/commons/CacheLink';
import { useAdminConsultationsPageFinished } from '@/hooks/admin/competitions/useAdminConsultationsPageFinished';
import { formatEditionDate, formatTime } from '@/lib/functions';
import { motion, Variant } from 'framer-motion';
import {
  ArrowLeft, Clock, FileText, Flame, Medal, RefreshCw, Sparkles,
  TrendingUp, Trophy, Users, Zap,
} from 'lucide-react';
import { useMemo } from 'react';

// ============================================================================
// ANIMATIONS
// ============================================================================



// ============================================================================
// COMPOSANTS
// ============================================================================

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

const StatCard = ({ icon, label, value, subValue, color }: any) => (
  <div
  

    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-5 text-white shadow-xl group cursor-pointer`}
  >
    <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-white/10 group-hover:scale-150 transition-transform duration-700" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">{icon}</div>
      </div>
      <div className="text-3xl font-black tracking-tight">{value}</div>
      <div className="text-xs font-medium opacity-90 mt-1">{label}</div>
      {subValue && <div className="text-[10px] opacity-75 mt-2">{subValue}</div>}
    </div>
  </div>
);

const TopCard = ({ title, icon, items, color }: any) => (
  <div

    className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-xl group"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-full blur-2xl" />
    <div className="relative p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className={`p-2 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>{icon}</div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h3>
      </div>
      <div className="space-y-3">
        {items.map((item : any) => (
          <div
            key={item.name}
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
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

export default function ConsultationsPage() {
  const { consultations, loading, error, isRefreshing, activeEdition, handleRefresh } = useAdminConsultationsPageFinished();

  const stats = useMemo(() => {
    if (!consultations.length) return null;

    const times = consultations
      .filter(c => c.timeSpent && parseFloat(c.timeSpent) > 0)
      .map(c => parseFloat(c.timeSpent));

    const playerMap = new Map();

    consultations.forEach(c => {
      const clientId = c.clientId?._id;
      const username = c.clientId?.username;
      const time = parseFloat(c.timeSpent);
      if (clientId && username && time > 0) {
        const existing = playerMap.get(clientId);
        if (!existing || time < existing.bestTime) {
          playerMap.set(clientId, { username, bestTime: time, games: (existing?.games || 0) + 1 });
        } else if (existing) {
          existing.games++;
        }
      }
    });

    return {
      totalGames: consultations.length,
      uniquePlayers: playerMap.size,
      averageTime: times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0,
      fastestTime: times.length ? Math.min(...times) : 0,
      timeDistribution: {
        under30s: times.filter(t => t < 30).length,
        under60s: times.filter(t => t >= 30 && t < 60).length,
        under120s: times.filter(t => t >= 60 && t < 120).length,
        over120s: times.filter(t => t >= 120).length,
      },
      topPlayers: Array.from(playerMap.values())
        .sort((a, b) => a.bestTime - b.bestTime)
        .slice(0, 15),
    };
  }, [consultations]);

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <div className="text-center max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 border border-red-100 dark:border-red-900/30">
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
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" />
      </div>

      <div className="relative max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
          <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent">
            Édition Learning
          </h1>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            <CacheLink
              href="/admin/consultations/archives"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:shadow-md transition-all group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Archives
            </CacheLink>
          </div>
        </div>

        {/* Édition active */}
        {activeEdition && stats && (
          <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <p className="text-white font-bold">
                  Du {formatEditionDate(new Date(activeEdition.startDate))} au {formatEditionDate(new Date(activeEdition.endDate))}
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span className="text-xs font-semibold text-white">
                  Meilleur temps: {formatTime(stats.fastestTime)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Statistiques */}
        {stats && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              <StatCard icon={<Trophy className="w-4 h-4" />} label="Total parties" value={stats.totalGames} color="from-purple-600 to-indigo-600" />
              <StatCard icon={<Users className="w-4 h-4" />} label="Joueurs uniques" value={stats.uniquePlayers} color="from-blue-600 to-cyan-600" />
              <StatCard icon={<Clock className="w-4 h-4" />} label="Temps moyen" value={formatTime(stats.averageTime)} color="from-green-600 to-emerald-600" />
              <StatCard icon={<Zap className="w-4 h-4" />} label="Record" value={formatTime(stats.fastestTime)} subValue="le plus rapide" color="from-amber-600 to-orange-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <TopCard
                title="Top joueurs"
                icon={<Medal className="w-5 h-5 text-yellow-400" />}
                items={stats.topPlayers.map((p, i) => ({ name: p.username, value: formatTime(p.bestTime), subValue: `${p.games} partie${p.games > 1 ? 's' : ''}`, rank: i + 1 }))}
                color="from-purple-600 to-indigo-600"
              />
              <TopCard
                title="Distribution des temps"
                icon={<Clock className="w-5 h-5 text-blue-400" />}
                items={[
                  { name: "⚡ Moins de 30s", value: stats.timeDistribution.under30s, rank: 1 },
                  { name: "🐢 30s - 60s", value: stats.timeDistribution.under60s, rank: 2 },
                  { name: "🐌 60s - 120s", value: stats.timeDistribution.under120s, rank: 3 },
                  { name: "🦥 Plus de 120s", value: stats.timeDistribution.over120s, rank: 4 },
                ]}
                color="from-blue-600 to-cyan-600"
              />
            </div>
          </>
        )}

        {/* Aucune partie */}
        {!stats && (
          <div className="text-center py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Aucune partie</h3>
            <p className="text-gray-500 dark:text-gray-400">Aucune partie n'a encore été jouée dans cette édition</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer { animation: shimmer 1.5s infinite; }
      `}</style>
    </main>
  );
}