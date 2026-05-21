'use client';
import { DateRangeType } from '@/hooks/admin/dashboard/useAdminReportsPage';
import type { LucideIcon } from 'lucide-react';
import { Download, Filter } from 'lucide-react';
import { memo, useCallback } from 'react';

interface DateRange {
  value: string;
  label: string;
}

const DateRangeButton = memo(({ range, isActive, onClick }: { range: DateRange, isActive: boolean, onClick: () => void }) => (
  <button
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
      <div
        className="absolute inset-0 bg-gradient-to-r from-cosmic-purple to-cosmic-indigo"
      />
    )}
    <span className="relative z-10">{range.label}</span>
  </button>
));

const ActionButton = memo(({ icon: Icon, label, variant = 'outline' }: { icon: LucideIcon, label: string, variant?: 'outline' | 'primary' }) => (
  <button
    className={`
      group relative flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-sm
      transition-all duration-300 shadow-lg backdrop-blur-sm overflow-hidden
      ${variant === 'primary'
        ? 'bg-gradient-to-r from-cosmic-purple to-cosmic-indigo text-white hover:from-cosmic-indigo hover:to-cosmic-pink shadow-cosmic-indigo/40 hover:shadow-cosmic-pink/60'
        : 'bg-white/80 dark:bg-[#162A56] text-cosmic-purple dark:text-cosmic-pink border border-cosmic-indigo dark:border-cosmic-pink hover:bg-ocean-50 dark:hover:bg-cosmic-indigo/30 hover:border-cosmic-pink dark:hover:border-cosmic-pink/80'
      }
    `}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
    <Icon className="w-4 h-4 relative z-10" />
    <span className="relative z-10 hidden sm:inline">{label}</span>
  </button>
));

interface DateRange {
  value: string;
  label: string;
}

interface ReportsHeaderProps {
  dateRange: DateRangeType;
  setDateRange: (v: DateRangeType) => void;
  dateRanges: DateRange[];
}

const ReportsHeader = memo<ReportsHeaderProps>(({ dateRange, setDateRange, dateRanges }) => {
  const handleDateRangeChange = useCallback((value: DateRangeType) => {
    setDateRange(value);
  }, [setDateRange]);

  return (
    < div className="flex flex-col items-center gap-6 text-center"    >
      <div className="flex gap-3">
        <ActionButton icon={Filter} label="Filtrer" variant="outline" />
        <ActionButton icon={Download} label="Exporter" variant="primary" />
      </div>

      < div className="flex gap-2 overflow-x-auto pb-2 px-2 scrollbar-hide max-w-full">
        {dateRanges.map((range) => (
          <DateRangeButton
            key={range.value}
            range={range}
            isActive={dateRange === range.value}
            onClick={() => handleDateRangeChange(range.value as DateRangeType)}
          />
        ))}
      </ div>
    </div>
  );
});

ReportsHeader.displayName = 'ReportsHeader';

export default ReportsHeader;