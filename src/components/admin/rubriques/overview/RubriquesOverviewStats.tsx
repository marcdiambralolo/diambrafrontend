'use client';
import { memo } from 'react';
import StatCard from '@/components/admin/rubriques/overview/StatCard';
import { motion,Variants  } from 'framer-motion';
import { Book, Calendar, Star } from 'lucide-react';

type OverviewStats = {
  totalDomaines?: number;
  totalRubriques?: number;
  totalConsultations?: number;
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 20 },
  },
};

export const RubriquesOverviewStats = memo(function RubriquesOverviewStats({ stats }: { stats: OverviewStats | null | undefined }) {
  if (!stats) return null;
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex justify-center items-center w-full mb-6 sm:mb-8"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full max-w-4xl px-2 sm:px-4">
        <motion.div variants={itemVariants}>
          <StatCard icon={<Book className="w-4 h-4 sm:w-5 sm:h-5" />} label="Domaines" value={stats.totalDomaines || 0} color="ocean" />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <StatCard icon={<Star className="w-4 h-4 sm:w-5 sm:h-5" />} label="Rubriques" value={stats.totalRubriques || 0} color="blue" />
        </motion.div>

        <motion.div variants={itemVariants} className="sm:col-span-2 lg:col-span-1">
          <StatCard icon={<Calendar className="w-4 h-4 sm:w-5 sm:h-5" />} label="Consultations" value={stats.totalConsultations || 0} color="cyan" />
        </motion.div>
      </div>
    </motion.div>
  );
});