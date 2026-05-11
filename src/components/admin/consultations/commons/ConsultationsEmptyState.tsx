'use client';
import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import React from 'react';

export const ConsultationsEmptyState: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center"
  >
    <FileText className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
      Aucune consultation
    </h3>
    
    <p className="text-sm text-gray-500 dark:text-gray-400">
      Les consultations apparaîtront ici.
    </p>
  </motion.div>
);