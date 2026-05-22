'use client';
import { DateRangeType } from '@/hooks/admin/dashboard/useAdminReportsPage';
import type { LucideIcon } from 'lucide-react';
import { Download, Filter, Calendar, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DateRange {
  value: string;
  label: string;
  icon?: string;
}

const DateRangeButton = memo(({ range, isActive, onClick }: { range: DateRange; isActive: boolean; onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`
      relative px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap flex-shrink-0
      transition-all duration-300 overflow-hidden group
      ${isActive
        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
        : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
      }
    `}
  >
    {isActive && (
      <motion.div
        layoutId="activeDateRange"
        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600"
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    )}
    <span className="relative z-10 flex items-center gap-2">
      {range.icon && <span className="text-base">{range.icon}</span>}
      {range.label}
    </span>
  </motion.button>
));

DateRangeButton.displayName = 'DateRangeButton';

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  variant?: 'outline' | 'primary';
  onClick?: () => void;
  loading?: boolean;
}

const ActionButton = memo(({ icon: Icon, label, variant = 'outline', onClick, loading = false }: ActionButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    disabled={loading}
    className={`
      group relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm
      transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden
      ${variant === 'primary'
        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500'
      }
      ${loading ? 'opacity-70 cursor-not-allowed' : ''}
    `}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
    {loading ? (
      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    ) : (
      <Icon className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform" />
    )}
    <span className="relative z-10 hidden sm:inline">{label}</span>
  </motion.button>
));

ActionButton.displayName = 'ActionButton';

interface ReportsHeaderProps {
  dateRange: DateRangeType;
  setDateRange: (v: DateRangeType) => void;
  dateRanges: DateRange[];
  onExport?: () => void;
  onFilter?: () => void;
  total?: number;
  trend?: number;
}

const ReportsHeader = memo<ReportsHeaderProps>(({ 
  dateRange, 
  setDateRange, 
  dateRanges, 
  onExport, 
  onFilter,
  total = 0,
  trend = 0 
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleDateRangeChange = useCallback((value: DateRangeType) => {
    setDateRange(value);
  }, [setDateRange]);

  const handleExport = useCallback(async () => {
    if (onExport && !isExporting) {
      setIsExporting(true);
      await onExport();
      setIsExporting(false);
    }
  }, [onExport, isExporting]);

  const isPositiveTrend = trend >= 0;

  return (
    <div className="space-y-6">
      {/* En-tête avec titre et statistiques */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-900/30 px-4 py-1.5 mb-4"
        >
          <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
            Analyse des performances
          </span>
        </motion.div>
        
        <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Statistiques détaillées
        </h2>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Visualisez l'évolution de vos activités
        </p>
      </div>

      {/* Cartes de statistiques rapides */}
      {(total > 0 || trend !== 0) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-2xl border border-purple-100 dark:border-purple-800"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Période sélectionnée</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {dateRanges.find(r => r.value === dateRange)?.label || dateRange}
              </p>
            </div>
          </div>
          
          {total > 0 && (
            <div className="flex items-center gap-3 px-4 border-l border-r border-purple-200 dark:border-purple-800">
              <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total des consultations</p>
                <p className="text-lg font-black text-gray-900 dark:text-white">{total.toLocaleString()}</p>
              </div>
            </div>
          )}
          
          {trend !== 0 && (
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPositiveTrend ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-red-100 dark:bg-red-900/40'}`}>
                {isPositiveTrend ? <TrendingUp className="w-5 h-5 text-emerald-600" /> : <TrendingDown className="w-5 h-5 text-red-600" />}
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Tendance</p>
                <p className={`text-sm font-bold ${isPositiveTrend ? 'text-emerald-600' : 'text-red-600'}`}>
                  {isPositiveTrend ? '+' : ''}{trend}%
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Sélecteurs de période et actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {dateRanges.map((range) => (
            <DateRangeButton
              key={range.value}
              range={range}
              isActive={dateRange === range.value}
              onClick={() => handleDateRangeChange(range.value as DateRangeType)}
            />
          ))}
        </div>

        <div className="flex gap-3">
          <ActionButton 
            icon={Filter} 
            label="Filtrer" 
            variant="outline" 
            onClick={onFilter}
          />
          <ActionButton 
            icon={Download} 
            label="Exporter" 
            variant="primary" 
            onClick={handleExport}
            loading={isExporting}
          />
        </div>
      </div>

      {/* Indicateur de période active */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <p className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1">
          <Calendar className="w-3 h-3" />
          Données actualisées en temps réel
        </p>
      </motion.div>
    </div>
  );
});

ReportsHeader.displayName = 'ReportsHeader';

export default ReportsHeader;