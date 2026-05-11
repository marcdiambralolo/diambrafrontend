'use client';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Shield, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type UsersStatsProps = {
  stats: {
    total: number;
    active: number;
    inactive: number;
    admins: number;
    verified: number;
  };
};

const statStyles = {
  blue: {
    card: 'border-blue-100 bg-blue-50/80 dark:border-[color:var(--theme-border)] dark:bg-[#13274C]/85',
    icon: 'bg-blue-100 text-[#2E5AA6] dark:bg-[#1D3C70] dark:text-[#9BC2FF]',
  },
  green: {
    card: 'border-emerald-100 bg-emerald-50/80 dark:border-emerald-500/20 dark:bg-emerald-500/10',
    icon: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300',
  },
  gray: {
    card: 'border-slate-200 bg-slate-50/85 dark:border-[color:var(--theme-border)] dark:bg-[#0F1C3F]/85',
    icon: 'bg-slate-100 text-slate-600 dark:bg-[#162A56] dark:text-[#DDE7FA]',
  },
  ocean: {
    card: 'border-blue-200 bg-blue-50/85 dark:border-[color:var(--theme-border)] dark:bg-[#162A56]/88',
    icon: 'bg-blue-100 text-[#2E5AA6] dark:bg-[#21457F] dark:text-[#9BC2FF]',
  },
} as const;

const statsConfig: Array<{
  icon: LucideIcon;
  label: string;
  key: keyof UsersStatsProps['stats'];
  color: keyof typeof statStyles;
  span?: string;
}> = [
    { icon: Users, label: 'Total', key: 'total', color: 'blue' },
    { icon: CheckCircle, label: 'Actifs', key: 'active', color: 'green' },
    { icon: Clock, label: 'Inactifs', key: 'inactive', color: 'gray' },
    { icon: Shield, label: 'Admins', key: 'admins', color: 'ocean' },
  ];

export default function UsersStats({ stats }: UsersStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4"
    >
      {statsConfig.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.02 }}
          className={`rounded-lg border bg-white p-2.5 transition-all hover:shadow-md dark:text-white ${statStyles[stat.color].card} ${stat.span || ''}`}
        >
          <div className="flex items-center gap-2">
            <div className={`rounded p-1 ${statStyles[stat.color].icon}`}>
              <stat.icon className="h-3.5 w-3.5" />
            </div>
            
            <div>
              <p className="text-xs text-gray-500 dark:text-[#AFC0DE]">{stat.label}</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stats[stat.key]}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}