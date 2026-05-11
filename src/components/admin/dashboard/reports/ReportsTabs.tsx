'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ReportType } from '@/hooks/admin/dashboard/useAdminReportsPage';

interface ReportsTabsProps {
  selectedReport: ReportType;
  setSelectedReport: (v: ReportType) => void;
  REPORT_TABS: { value: ReportType; label: string }[];
}

const ReportsTabs: React.FC<ReportsTabsProps> = ({ selectedReport, setSelectedReport, REPORT_TABS }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2 }}
    className="border-b border-slate-200 dark:border-slate-700"
  >
    <div className="flex gap-1 overflow-x-auto scrollbar-hide">
      {REPORT_TABS.map((tab) => (
        <motion.button
          key={tab.value}
          whileHover={{ y: -2 }}
          onClick={() => setSelectedReport(tab.value)}
          className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap flex-shrink-0 ${selectedReport === tab.value
            ? 'border-cosmic-indigo text-cosmic-indigo dark:text-cosmic-pink'
            : 'border-transparent text-cosmic-purple dark:text-cosmic-pink/60 hover:text-cosmic-indigo dark:hover:text-cosmic-pink'
            }`}
        >
          {tab.label}
        </motion.button>
      ))}
    </div>
  </motion.div>
);

export default ReportsTabs;