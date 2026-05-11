"use client";
import { memo } from 'react';
import { motion } from 'framer-motion';

interface DateRange {
  value: string;
  label: string;
}

const DateRangeButton = memo(({ range, isActive, onClick }: { range: DateRange, isActive: boolean, onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.08, y: -2 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`
      relative px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap flex-shrink-0
      transition-all duration-300 overflow-hidden
      ${isActive
        ? 'bg-gradient-to-r from-cosmic-purple to-cosmic-indigo text-white shadow-xl shadow-cosmic-indigo/40 scale-105'
        : 'bg-ocean-50 dark:bg-[#162A56] text-cosmic-purple dark:text-cosmic-pink/80 hover:bg-ocean-100 dark:hover:bg-cosmic-indigo/30 hover:text-cosmic-indigo dark:hover:text-cosmic-pink'
      }
    `}
  >
    {isActive && (
      <motion.div
        layoutId="activeTab"
        className="absolute inset-0 bg-gradient-to-r from-cosmic-purple to-cosmic-indigo"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    <span className="relative z-10">{range.label}</span>
  </motion.button>
));

DateRangeButton.displayName = 'DateRangeButton';

export default DateRangeButton;