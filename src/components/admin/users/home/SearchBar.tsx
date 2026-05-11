'use client';
import { memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  loading: boolean;
  onSearch: (value: string) => void;
  onClear: () => void;
}

const SearchBar = memo<SearchBarProps>(({ searchQuery, loading, onSearch, onClear }) => (
  <div className="flex-1 relative">
    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => onSearch(e.target.value)}
      placeholder="Rechercher par nom, téléphone..."
      disabled={loading}
      className="w-full bg-white border border-gray-300 text-sm text-gray-900 pl-8 pr-8 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
      aria-label="Rechercher des utilisateurs"
    />
    
    <AnimatePresence>
      {searchQuery && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={onClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Effacer la recherche"
        >
          <X className="w-4 h-4" />
        </motion.button>
      )}
    </AnimatePresence>
  </div>
));

SearchBar.displayName = 'SearchBar';

export default SearchBar;