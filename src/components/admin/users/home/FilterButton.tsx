'use client';
import { memo } from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';

interface FilterButtonProps {
  showFilters: boolean;
  hasActiveFilters: boolean;
  loading: boolean;
  onClick: () => void;
}

const FilterButton = memo<FilterButtonProps>(({ showFilters, hasActiveFilters, loading, onClick }) => (
  <motion.button
    onClick={onClick}
    disabled={loading}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${showFilters || hasActiveFilters ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:shadow-sm'}`}
    aria-label="Basculer les filtres"
    aria-expanded={showFilters}
  >
    <Filter className="w-4 h-4" />
    <span className="hidden sm:inline">Filtres</span>
    
    {hasActiveFilters && <span className="w-2 h-2 bg-white rounded-full" />}
  </motion.button>
));

FilterButton.displayName = 'FilterButton';

export default FilterButton;