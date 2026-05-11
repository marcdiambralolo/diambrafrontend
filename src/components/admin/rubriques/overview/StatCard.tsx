'use client';
import { memo } from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

const colorClassesMap: Record<string, { bg: string; text: string; glow: string }> = {
  ocean: { bg: 'bg-[#EEF4FF] dark:bg-[#162A56]/60', text: 'text-[#2E5AA6] dark:text-[#9BC2FF]', glow: 'group-hover:shadow-[#2E5AA6]/20' },
  blue: { bg: 'bg-blue-100 dark:bg-blue-950/30', text: 'text-blue-600 dark:text-blue-400', glow: 'group-hover:shadow-blue-500/20' },
  green: { bg: 'bg-green-100 dark:bg-green-950/30', text: 'text-green-600 dark:text-green-400', glow: 'group-hover:shadow-green-500/20' },
  cyan: { bg: 'bg-cyan-100 dark:bg-cyan-950/30', text: 'text-cyan-600 dark:text-cyan-400', glow: 'group-hover:shadow-cyan-500/20' },
  orange: { bg: 'bg-orange-100 dark:bg-orange-950/30', text: 'text-orange-600 dark:text-orange-400', glow: 'group-hover:shadow-orange-500/20' },
};

const StatCard = memo(function StatCard({ icon, label, value, color }: StatCardProps) {
  const colorClasses = colorClassesMap[color] || colorClassesMap.ocean;
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`group bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-800 transition-all ${colorClasses.glow}`}
    >
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        <motion.div
          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${colorClasses.bg} ${colorClasses.text} flex items-center justify-center flex-shrink-0`}
        >
          {icon}
        </motion.div>
        
        <div className="flex-1 text-center sm:text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100"
          >
            {value.toLocaleString()}
          </motion.div>
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</div>
        </div>
      </div>
    </motion.div>
  );
});

export default StatCard;