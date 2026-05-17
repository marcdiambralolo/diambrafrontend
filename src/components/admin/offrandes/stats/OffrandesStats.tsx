'use client';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  BarChart3, Calendar, Clock, DollarSign,
  ShoppingBag,
  TrendingDown, TrendingUp
} from 'lucide-react';
import React, { memo } from 'react';

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

const StatCard = memo(({
  title,
  value,
  icon: Icon,
  color,
  trend,
  delay
}: {
  title: string;
  value: string | number;
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
      {trend && (
        <div className={`flex items-center gap-1 mt-2 text-xs ${trend.isPositive ? 'text-green-300' : 'text-red-300'}`}>
          {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{Math.abs(trend.value)}%</span>
        </div>
      )}
    </div>
  </motion.div>
));

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

const OffrandesStats: React.FC<OffrandesStatsProps> = ({ statsData }) => {
  const totalRevenue = statsData.byCategory.reduce((sum, c) => sum + c.revenue, 0);
  const totalQuantity = statsData.byCategory.reduce((sum, c) => sum + c.quantitySold, 0);

  const trends = {
    revenue: { value: 12.5, isPositive: true },
    sales: { value: 8.3, isPositive: true },
  };

  if (!statsData) return null;

  return (
    <div className="w-full py-8 px-4">
      <div className="max-w-7xl mx-auto">
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
            Statistiques des jetons
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Vue d'ensemble des performances et tendances
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Chiffre d'affaires total"
            value={`${totalRevenue.toLocaleString()} F`}
            icon={DollarSign}
            color="from-indigo-600 to-indigo-700"
            trend={trends.revenue}
            delay={0}
          />
          <StatCard
            title="Nombre de ventes"
            value={totalQuantity}
            icon={ShoppingBag}
            color="from-purple-600 to-purple-700"
            trend={trends.sales}
            delay={0.1}
          />
          <StatCard
            title="Panier moyen"
            value={totalQuantity > 0 ? `${Math.round(totalRevenue / totalQuantity).toLocaleString()} F` : '0 F'}
            icon={TrendingUp}
            color="from-emerald-600 to-emerald-700"
            delay={0.2}
          />
        </div>

        <div className="grid grid-cols-1  gap-8 mb-8">
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
      </div>
    </div>
  );
};

export default OffrandesStats;