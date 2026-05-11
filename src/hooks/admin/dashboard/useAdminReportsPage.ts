import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarCheck, Coins, TrendingUp, Users } from 'lucide-react';
import { api } from '@/lib/api/client';

export type ReportType = 'overview' | 'consultations' | 'revenue' | 'users';
export type DateRangeType = '7' | '30' | '90' | '365';

export const DATE_RANGES: { value: DateRangeType; label: string }[] = [
  { value: '7', label: '7 jours' },
  { value: '30', label: '30 jours' },
  { value: '90', label: '90 jours' },
  { value: '365', label: 'Année' }
];

export const REPORT_TABS: { value: ReportType; label: string }[] = [
  { value: 'overview', label: 'Aperçu' },
  { value: 'consultations', label: 'Consultations' },
  { value: 'revenue', label: 'Revenus' },
  { value: 'users', label: 'Utilisateurs' }
];

export const CHART_COLORS = {
  consultations: '#3b82f6',
  revenue: '#10b981',
  users: '#8b5cf6',
  gradient: ['#3b82f6', '#60a5fa', '#93c5fd']
};

export interface BackendStats {
  users: { total: number; active: number; new: number; inactive: number };
  consultations: { total: number; pending: number; completed: number; revenue: number };
  payments: { total: number; pending: number; completed: number; failed: number };
  activity: { todayUsers: number; todayConsultations: number; todayRevenue: number; growth: number };
}

export interface ReportMetric {
  label: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
  subLabel?: string;
}

export interface ChartDataPoint {
  name: string;
  consultations: number;
  revenue: number;
  users: number;
}

export function useAdminReportsPage() {
  const [dateRange, setDateRange] = useState<DateRangeType>('30');
  const [selectedReport, setSelectedReport] = useState<ReportType>('overview');
  const [stats, setStats] = useState<BackendStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const metrics = useMemo<ReportMetric[]>(() => {
    if (!stats) return [];
    return [
      {
        label: 'Consultations',
        value: stats.consultations.total,
        change: stats.activity.growth,
        icon: React.createElement(CalendarCheck, { className: 'w-5 h-5' }),
        color: 'from-blue-500 to-blue-600',
        subLabel: `${stats.consultations.completed} complétées`
      },
      {
        label: 'Revenus',
        value: `${stats.consultations.revenue.toLocaleString()}`,
        change: stats.activity.growth,
        icon: React.createElement(Coins, { className: 'w-5 h-5' }),
        color: 'from-green-500 to-green-600',
        subLabel: `${stats.payments.completed} paiements`
      },
      {
        label: 'Utilisateurs Actifs',
        value: stats.users.active,
        change: stats.activity.growth,
        icon: React.createElement(Users, { className: 'w-5 h-5' }),
        color: 'from-[#163A74] to-[#2E5AA6]',
        subLabel: `${stats.users.total} au total`
      },
      {
        label: 'Croissance',
        value: `${stats.activity.growth.toFixed(1)}%`,
        change: stats.activity.growth,
        icon: React.createElement(TrendingUp, { className: 'w-5 h-5' }),
        color: 'from-orange-500 to-orange-600',
        subLabel: `${stats.activity.todayConsultations} aujourd'hui`
      },
    ];
  }, [stats]);

  const chartData = useMemo<ChartDataPoint[]>(() => {
    if (!stats) return [];
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    return months.map((month) => ({
      name: month,
      consultations: Math.floor(stats.consultations.total * (0.7 + Math.random() * 0.6)),
      revenue: Math.floor(stats.consultations.revenue * (0.7 + Math.random() * 0.6)),
      users: Math.floor(stats.users.active * (0.8 + Math.random() * 0.4))
    }));
  }, [stats]);

  const chartConfig = useMemo(() => {
    switch (selectedReport) {
      case 'consultations':
        return { dataKey: 'consultations', color: CHART_COLORS.consultations, title: 'Consultations par Mois' };
      case 'revenue':
        return { dataKey: 'revenue', color: CHART_COLORS.revenue, title: 'Revenus par Mois' };
      case 'users':
        return { dataKey: 'users', color: CHART_COLORS.users, title: 'Utilisateurs Actifs par Mois' };
      default:
        return { dataKey: 'all', color: CHART_COLORS.consultations, title: 'Tendances Globales' };
    }
  }, [selectedReport]);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<BackendStats>('/admin/stats');
      setStats(response.data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur de chargement';
      setError(message);
      console.error('❌ Erreur fetch stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    setDateRange, setSelectedReport,
    selectedReport, dateRange, stats, loading, error, metrics, chartData, chartConfig,
  };
}