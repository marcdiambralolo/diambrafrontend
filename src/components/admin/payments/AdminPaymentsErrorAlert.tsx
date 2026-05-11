'use client';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import React from 'react';

interface AdminPaymentsErrorAlertProps {
  error: string;
  onRetry: () => void;
}

export const AdminPaymentsErrorAlert: React.FC<AdminPaymentsErrorAlertProps> = ({ error, onRetry }) => (
  <div className="flex items-center justify-center  bg-gray-50 px-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center max-w-sm w-full bg-white rounded-xl shadow-lg p-6"
    >
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
      <h3 className="text-lg font-bold text-gray-900 mb-2">Erreur</h3>
      <p className="text-sm text-gray-600 mb-4">{error}</p>
      
      <button
        onClick={onRetry}
        className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm rounded-lg font-semibold hover:shadow-lg transition-all"
      >
        Réessayer
      </button>
    </motion.div>
  </div>
);