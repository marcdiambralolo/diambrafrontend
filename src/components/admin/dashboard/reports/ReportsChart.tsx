'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Cell, ResponsiveContainer } from 'recharts';

interface ChartDataPoint {
  name: string;
  consultations: number;
  revenue: number;
  users: number;
}

interface ChartConfig {
  dataKey: string;
  color: string;
  title: string;
}

interface ReportsChartProps {
  chartData: ChartDataPoint[];
  chartConfig: ChartConfig;
  selectedReport: string;
}

const CHART_COLORS = {
  consultations: '#3b82f6',
  revenue: '#10b981',
  users: '#8b5cf6',
  gradient: ['#3b82f6', '#60a5fa', '#93c5fd']
};

const ReportsChart: React.FC<ReportsChartProps> = ({ chartData, chartConfig, selectedReport }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-lg"
  >
    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">{chartConfig.title}</h2>
    <ResponsiveContainer width="100%" height={300}>
      {selectedReport === 'overview' ? (
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
          <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: '12px' }} iconType="circle" />
          <Bar dataKey="consultations" name="Consultations" fill={CHART_COLORS.consultations} radius={[8, 8, 0, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-c-${index}`} fill={CHART_COLORS.gradient[index % CHART_COLORS.gradient.length]} />
            ))}
          </Bar>
          <Bar dataKey="revenue" name="Revenus" fill={CHART_COLORS.revenue} radius={[8, 8, 0, 0]} />
          <Bar dataKey="users" name="Utilisateurs" fill={CHART_COLORS.users} radius={[8, 8, 0, 0]} />
        </BarChart>
      ) : (
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
          <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey={chartConfig.dataKey} fill={chartConfig.color} radius={[8, 8, 0, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? chartConfig.color : `${chartConfig.color}cc`} />
            ))}
          </Bar>
        </BarChart>
      )}
    </ResponsiveContainer>
  </motion.div>
);

export default ReportsChart;