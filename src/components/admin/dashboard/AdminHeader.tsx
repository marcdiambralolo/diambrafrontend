'use client';
import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Clock, RefreshCw } from 'lucide-react';

interface AdminHeaderProps {
  lastUpdated?: string;
  isRefreshing: boolean;
  loading: boolean;
  onRefresh: () => void;
}

const AdminHeader = memo<AdminHeaderProps>(({ lastUpdated, isRefreshing, loading, onRefresh }) => {
  const formattedTime = useMemo(() => {
    if (!lastUpdated) return null;
    return new Date(lastUpdated).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }, [lastUpdated]);

  const isDisabled = isRefreshing || loading;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <motion.div
              className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg shadow-amber-500/20"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </motion.div>
            
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent truncate">
                Tableau de bord
              </h1>
              {formattedTime && (
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{formattedTime}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <motion.button
              onClick={onRefresh}
              disabled={isDisabled}
              whileHover={!isDisabled ? { scale: 1.02 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
              className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${isDisabled
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40'
                }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDisabled ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {isRefreshing ? 'Actualisation...' : 'Actualiser'}
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
});

AdminHeader.displayName = 'AdminHeader';

export default AdminHeader;