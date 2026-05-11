'use client';
import React, { memo } from 'react';
import { motion } from 'framer-motion';

export interface ProgressBarProps {
  percentage: string | number;
  label: string;
  delay?: number;
  color?: string;
}

export const ProgressBar = memo<ProgressBarProps>(({
  percentage,
  label,
  delay = 0,
  color = 'blue'
}) => (
  <div className="mt-4 pt-3 border-t border-gray-100">
    <div className="flex justify-between text-xs mb-1.5">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900">{percentage}%</span>
    </div>
    
    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: 'easeOut', delay }}
        className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-full`}
      />
    </div>
  </div>
));

ProgressBar.displayName = 'ProgressBar';