'use client';
import React from 'react';
import { motion,Variants  } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface ReportMetric {
  label: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
  subLabel?: string;
}

interface ReportsMetricsGridProps {
  metrics: ReportMetric[];
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.05, type: 'spring', stiffness: 200, damping: 20 }
  })
};

const ReportsMetricsGrid: React.FC<ReportsMetricsGridProps> = ({ metrics }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
    {metrics.map((metric, index) => {
      const isPositive = metric.change >= 0;
      return (
        <motion.div
          key={index}
          custom={index}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-5 transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{metric.label}</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1 truncate">{metric.value}</p>
              {metric.subLabel && (
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">{metric.subLabel}</p>
              )}
              <div className="flex items-center gap-1 mt-2">
                {isPositive ? (
                  <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-600 flex-shrink-0" />
                ) : (
                  <TrendingDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-600 flex-shrink-0" />
                )}
                <p className={`text-[10px] sm:text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>{isPositive ? '+' : ''}{metric.change}%</p>
                <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">ce mois</span>
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${metric.color} text-white shadow-lg flex-shrink-0`}
            >
              <div className="w-4 h-4 sm:w-5 sm:h-5">{metric.icon}</div>
            </motion.div>
          </div>
        </motion.div>
      );
    })}
  </div>
);

export default ReportsMetricsGrid;