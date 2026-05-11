'use client';
import { memo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

const Pagination = memo<PaginationProps>(({ currentPage, totalPages, loading, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3 shadow-sm"
    >
      <p className="text-xs text-gray-600 font-medium">
        Page <span className="font-bold text-gray-900">{currentPage}</span> sur{' '}
        <span className="font-bold text-gray-900">{totalPages}</span>
      </p>
      
      <div className="flex gap-2">
        <motion.button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-lg font-medium hover:bg-gray-200 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          aria-label="Page précédente"
        >
          <ChevronLeft className="w-3 h-3" />
          Préc
        </motion.button>
        <motion.button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-lg font-medium hover:shadow-md hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          aria-label="Page suivante"
        >
          Suiv
          <ChevronRight className="w-3 h-3" />
        </motion.button>
      </div>
    </motion.div>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination;