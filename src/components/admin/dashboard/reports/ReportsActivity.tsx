'use client';
import React from 'react';
import { motion } from 'framer-motion';

type ReportsStats = {
  consultations: { completed: number };
  payments: { completed: number };
  users: { new: number };
};

interface ReportsActivityProps {
  stats: ReportsStats | null | undefined;
}

const ReportsActivity: React.FC<ReportsActivityProps> = ({ stats }) => {
  if (!stats) return null;
  const activities = [
    {
      type: 'consultation',
      user: 'Consultations',
      action: `${stats.consultations.completed} complétées`,
      time: 'Actuel'
    },
    {
      type: 'payment',
      user: 'Paiements',
      action: `${stats.payments.completed} traités`,
      time: 'Actuel'
    },
    {
      type: 'registration',
      user: 'Utilisateurs',
      action: `${stats.users.new} nouveaux`,
      time: 'Actuel'
    },
  ];
  const getColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'bg-blue-500';
      case 'payment': return 'bg-green-500';
      case 'registration': return 'bg-[#2E5AA6]';
      default: return 'bg-slate-500';
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-lg"
    >
      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
        Activité Récente
      </h2>
      <div className="space-y-1 sm:space-y-2">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between py-2.5 sm:py-3 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors rounded-lg px-2"
          >
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <motion.div
                whileHover={{ scale: 1.2 }}
                className={`w-2 h-2 rounded-full ${getColor(activity.type)} flex-shrink-0`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">{activity.user}</p>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">{activity.action}</p>
              </div>
            </div>
            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">{activity.time}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ReportsActivity;