'use client';
import { memo, useMemo } from 'react';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  total: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  loading: boolean;
}

const PaginationControls = memo(({
  currentPage,
  totalPages,
  total,
  itemsPerPage,
  onPageChange,
  loading
}: PaginationControlsProps) => {
  const getVisiblePageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-200 bg-white p-2.5 shadow-sm dark:border-[color:var(--theme-border)] dark:bg-[#0F1C3F]"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="text-[10px] text-gray-600 dark:text-gray-400 font-medium">
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {((currentPage - 1) * itemsPerPage) + 1}
          </span>
          {' - '}
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {Math.min(currentPage * itemsPerPage, total)}
          </span>
          {' sur '}
          <span className="font-bold text-gray-900 dark:text-gray-100">{total}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1 || loading}
            className="p-1 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronsLeft className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="p-1 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="hidden sm:flex items-center gap-1">
            {getVisiblePageNumbers.map((page, index) => (
              page === '...'
                ? <span key={`ellipsis-${index}`} className="px-1.5 text-gray-400 text-[10px]">•••</span>
                : <button
                  key={page}
                  onClick={() => onPageChange(page as number)}
                  disabled={loading}
                  className={`min-w-[28px] px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${page === currentPage ? 'scale-105 bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] text-white shadow-md' : 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-[#13274C]'} disabled:opacity-30`}
                >
                  {page}
                </button>
            ))}
          </div>
          <div className="rounded-lg bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] px-2.5 py-1 text-[10px] font-bold text-white shadow-md sm:hidden">
            {currentPage} / {totalPages}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="p-1 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
          </button>
          
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || loading}
            className="p-1 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronsRight className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </motion.div>
  );
});
PaginationControls.displayName = 'PaginationControls';

export default PaginationControls;