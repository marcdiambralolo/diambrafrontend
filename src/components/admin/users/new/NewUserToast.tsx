'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import React from 'react';

export function NewUserToast({ toast, onClose }: {
  toast: { type: 'success' | 'error'; message: string } | null;
  onClose: () => void;
}) {
  
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-xl shadow-2xl border
            ${toast.type === 'success' 
              ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
              : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
            }`}
        >
          <div className="flex items-start gap-3">
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${
                toast.type === 'success' ? 'text-green-900' : 'text-red-900'
              }`}>
                {toast.type === 'success' ? 'Succès' : 'Erreur'}
              </p>
              <p className={`text-xs mt-0.5 ${
                toast.type === 'success' ? 'text-green-700' : 'text-red-700'
              }`}>
                {toast.message}
              </p>
            </div>
            
            <button
              onClick={onClose}
              className={`p-1 rounded-lg transition-colors ${
                toast.type === 'success' 
                  ? 'hover:bg-green-100 text-green-600' 
                  : 'hover:bg-red-100 text-red-600'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}