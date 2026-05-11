'use client';
import { CATEGORIES_OFFRANDES } from '@/lib/constants';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpRight, Award, BarChart3, Calendar, Clock, DollarSign, PieChart,
  ShoppingBag, Star, TrendingDown, TrendingUp
} from 'lucide-react';
import React, { memo, useMemo } from 'react';

interface StatsData {
  byCategory: Array<{ category: string; revenue: number; quantitySold: number }>;
  periods: {
    today: { revenue: number; quantitySold: number };
    last7: { revenue: number; quantitySold: number };
    last30: { revenue: number; quantitySold: number };
  };
  byOffering: Array<{
    offeringId: string;
    name: string;
    icon: string;
    category: string;
    revenue: number;
    quantitySold: number;
    avgUnitPrice: number;
  }>;
}

interface OffrandesStatsProps {
  statsData: StatsData;
}

const CONSTANTS = {
  ANIMATION_DURATION: 0.3,
  TOP_OFFERINGS_LIMIT: 15,
} as const;

const StatCard = memo(({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
  delay
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: any;
  color: string;
  trend?: { value: number; isPositive: boolean };
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-6 text-white shadow-lg`}
  >
    <div className="absolute top-0 right-0 opacity-20">
      <Icon className="w-20 h-20" />
    </div>
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium opacity-90">{title}</p>
        <Icon className="w-5 h-5 opacity-80" />
      </div>
      <p className="text-3xl font-black">{value}</p>
      {subtitle && <p className="text-xs opacity-80 mt-1">{subtitle}</p>}
      {trend && (
        <div className={`flex items-center gap-1 mt-2 text-xs ${trend.isPositive ? 'text-green-300' : 'text-red-300'}`}>
          {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{Math.abs(trend.value)}%</span>
        </div>
      )}
    </div>
  </motion.div>
));

StatCard.displayName = 'StatCard';

const CategoryCard = memo(({
  category,
  revenue,
  quantity,
  totalRevenue,
  index
}: {
  category: any;
  revenue: number;
  quantity: number;
  totalRevenue: number;
  index: number;
}) => {
  const percentage = totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group cursor-pointer"
    >
      <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#0F1C3F] border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-xl`}>
            {category.emoji}
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">{category.label}</p>
            <p className="text-xs text-slate-500">{quantity} vendu{quantity > 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-black text-slate-900 dark:text-white">{revenue.toLocaleString()} F</p>
          <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-1 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`h-full rounded-full bg-gradient-to-r ${category.color}`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
});

CategoryCard.displayName = 'CategoryCard';

const PeriodCard = memo(({
  period,
  data,
  icon: Icon,
  color,
  delay
}: {
  period: string;
  data: { revenue: number; quantitySold: number };
  icon: any;
  color: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className={`rounded-2xl bg-gradient-to-br ${color} p-5 text-white shadow-lg`}
  >
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5" />
        <p className="font-bold">{period}</p>
      </div>
      <ArrowUpRight className="w-4 h-4 opacity-70" />
    </div>
    <p className="text-2xl font-black">{data.revenue.toLocaleString()} F</p>
    <p className="text-xs opacity-90 mt-1">{data.quantitySold} vente{data.quantitySold > 1 ? 's' : ''}</p>
    {data.quantitySold > 0 && (
      <p className="text-xs opacity-75 mt-2">
        Moyenne: {Math.round(data.revenue / data.quantitySold).toLocaleString()} F/vente
      </p>
    )}
  </motion.div>
));

PeriodCard.displayName = 'PeriodCard';

const TopOfferingRow = memo(({
  offering,
  rank,
  totalRevenue
}: {
  offering: StatsData['byOffering'][0];
  rank: number;
  totalRevenue: number;
}) => {
  const percentage = totalRevenue > 0 ? (offering.revenue / totalRevenue) * 100 : 0;

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.05 }}
      className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm">
            {rank}
          </div>
          <span className="text-xl">{offering.icon || '🎁'}</span>
          <span className="font-medium text-slate-900 dark:text-white">{offering.name}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
        {CATEGORIES_OFFRANDES.find(c => c.value === offering.category)?.label || offering.category || '-'}
      </td>
      <td className="px-4 py-3 text-center font-bold text-slate-900 dark:text-white">
        {offering.quantitySold}
      </td>
      <td className="px-4 py-3 text-right font-bold text-indigo-600 dark:text-indigo-400">
        {offering.revenue.toLocaleString()} F
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <div className="w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.6, delay: rank * 0.05 }}
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            />
          </div>
          <span className="text-xs text-slate-500">{percentage.toFixed(1)}%</span>
        </div>
      </td>
    </motion.tr>
  );
});

TopOfferingRow.displayName = 'TopOfferingRow';

// ==================== COMPOSANT PRINCIPAL ====================
const OffrandesStats: React.FC<OffrandesStatsProps> = ({ statsData }) => {
  // Calculs des totaux
  const totalRevenue = statsData.byCategory.reduce((sum, c) => sum + c.revenue, 0);
  const totalQuantity = statsData.byCategory.reduce((sum, c) => sum + c.quantitySold, 0);

  // Top offrandes
  const topOfferings = useMemo(() =>
    [...statsData.byOffering]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, CONSTANTS.TOP_OFFERINGS_LIMIT),
    [statsData.byOffering]
  );

  // Catégories enrichies
  const enrichedCategories = useMemo(() =>
    statsData.byCategory.map(cat => ({
      ...cat,
      categoryInfo: CATEGORIES_OFFRANDES.find(c => c.value === cat.category),
    })),
    [statsData.byCategory]
  );

  // Tendances (simulées - à remplacer par de vraies données)
  const trends = {
    revenue: { value: 12.5, isPositive: true },
    sales: { value: 8.3, isPositive: true },
  };

  if (!statsData) return null;

  return (
    <div className="w-full py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header avec animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 mb-4">
            <BarChart3 className="w-4 h-4" />
            <span className="text-xs font-bold">ANALYSE DES VENTES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Statistiques des offrandes
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Vue d'ensemble des performances et tendances
          </p>
        </motion.div>

        {/* Cartes KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Chiffre d'affaires total"
            value={`${totalRevenue.toLocaleString()} F`}
            subtitle="Toutes catégories confondues"
            icon={DollarSign}
            color="from-indigo-600 to-indigo-700"
            trend={trends.revenue}
            delay={0}
          />
          <StatCard
            title="Nombre de ventes"
            value={totalQuantity}
            subtitle={`${statsData.byOffering.length} offrandes différentes`}
            icon={ShoppingBag}
            color="from-purple-600 to-purple-700"
            trend={trends.sales}
            delay={0.1}
          />
          <StatCard
            title="Panier moyen"
            value={totalQuantity > 0 ? `${Math.round(totalRevenue / totalQuantity).toLocaleString()} F` : '0 F'}
            subtitle="Par transaction"
            icon={TrendingUp}
            color="from-emerald-600 to-emerald-700"
            delay={0.2}
          />
          <StatCard
            title="Offrande la plus vendue"
            value={topOfferings[0]?.name || '-'}
            subtitle={topOfferings[0] ? `${topOfferings[0].quantitySold} ventes` : ''}
            icon={Award}
            color="from-amber-600 to-amber-700"
            delay={0.3}
          />
        </div>

        <div className="grid grid-cols-1  gap-8 mb-8">
          {/* Par catégorie */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-[#0F1C3F] rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Répartition par catégorie
              </h3>
            </div>
            <div className="space-y-3">
              {enrichedCategories.map((cat, idx) => (
                <CategoryCard
                  key={cat.category}
                  category={cat.categoryInfo || { label: cat.category || 'Autre', color: 'from-gray-500 to-gray-600', emoji: '📦' }}
                  revenue={cat.revenue}
                  quantity={cat.quantitySold}
                  totalRevenue={totalRevenue}
                  index={idx}
                />
              ))}
            </div>
          </motion.div>

          {/* Par période */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-[#0F1C3F] rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Évolution temporelle
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <PeriodCard
                period="Aujourd'hui"
                data={statsData.periods.today}
                icon={Clock}
                color="from-blue-500 to-blue-600"
                delay={0}
              />
              <PeriodCard
                period="7 derniers jours"
                data={statsData.periods.last7}
                icon={TrendingUp}
                color="from-indigo-500 to-indigo-600"
                delay={0.1}
              />
              <PeriodCard
                period="30 derniers jours"
                data={statsData.periods.last30}
                icon={Calendar}
                color="from-purple-500 to-purple-600"
                delay={0.2}
              />
            </div>
          </motion.div>
        </div>

        {/* Top offrandes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-[#0F1C3F] rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Top offrandes
              </h3>
            </div>
            <div className="text-xs text-slate-500">
              {statsData.byOffering.length} offrandes au total
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Offrande
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Catégorie
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Quantité
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    CA (F)
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    % du total
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {topOfferings.map((offering, idx) => (
                    <TopOfferingRow
                      key={offering.offeringId}
                      offering={offering}
                      rank={idx + 1}
                      totalRevenue={totalRevenue}
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {statsData.byOffering.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              Aucune donnée de vente disponible
            </div>
          )}
        </motion.div>

        {/* Footer avec métriques supplémentaires */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400"
        >
          <p>Données mises à jour en temps réel • {new Date().toLocaleDateString()}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default OffrandesStats;