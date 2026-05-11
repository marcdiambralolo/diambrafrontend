'use client';
import { memo, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, AlertCircle, Bell, X } from 'lucide-react';

const Toast = memo(({ message, type = 'info', onClose }: {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}) => {

  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = useMemo(() => {
    const configs = {
      success: {
        gradient: 'from-emerald-600 to-green-600',
        icon: <Sparkles className="w-4 h-4 animate-pulse" />
      },
      error: {
        gradient: 'from-rose-600 to-red-600',
        icon: <AlertCircle className="w-4 h-4 animate-pulse" />
      },
      info: {
        gradient: 'from-[#2E5AA6] to-[#4F83D1]',
        icon: <Bell className="w-4 h-4 animate-pulse" />
      }
    };
    return configs[type];
  }, [type]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="fixed bottom-4 right-4 z-50 max-w-sm"
    >
      <div className={`bg-gradient-to-r ${config.gradient} text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-white/20 backdrop-blur-sm`}>
        <span className="flex-shrink-0">{config.icon}</span>
        <p className="text-sm font-medium flex-1 leading-tight">{message}</p>

        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          aria-label="Fermer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
});

Toast.displayName = 'Toast';

export default Toast;