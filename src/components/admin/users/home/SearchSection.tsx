'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { Filter, Search, X } from 'lucide-react';
import { memo } from 'react';

const filterPanelVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.2 } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.15 } }
};

type UserStatus = 'all' | 'active' | 'inactive';
type UserRole = 'all' | 'USER' | 'ADMIN' | 'SUPER_ADMIN';

interface FilterPanelProps {
  statusFilter: UserStatus;
  roleFilter: UserRole;
  loading: boolean;
  hasActiveFilters: boolean;
  onStatusChange: (status: UserStatus) => void;
  onRoleChange: (role: UserRole) => void;
  onReset: () => void;
}

const FilterPanel = memo<FilterPanelProps>(({ statusFilter, roleFilter, loading, hasActiveFilters, onStatusChange, onRoleChange, onReset }) => (
  <motion.div
    variants={filterPanelVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="bg-white dark:bg-[#162A56] border border-cosmic-indigo dark:border-cosmic-pink rounded-lg p-3 mt-2 overflow-hidden shadow-sm"
  >
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="text-xs font-medium text-cosmic-indigo dark:text-cosmic-pink mb-1.5 block">Statut</label>
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as UserStatus)}
          disabled={loading}
          className="w-full bg-white dark:bg-[#162A56] border border-cosmic-indigo dark:border-cosmic-pink text-sm text-cosmic-purple dark:text-cosmic-pink px-2 py-2 rounded-lg focus:ring-2 focus:ring-cosmic-indigo dark:focus:ring-cosmic-pink focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-[#0F1C3F] disabled:cursor-not-allowed transition-all"
          aria-label="Filtrer par statut"
        >
          <option value="all">Tous statuts</option>
          <option value="active">Actifs</option>
          <option value="inactive">Inactifs</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-cosmic-indigo dark:text-cosmic-pink mb-1.5 block">Rôle</label>
        <select
          value={roleFilter}
          onChange={(e) => onRoleChange(e.target.value as UserRole)}
          disabled={loading}
          className="w-full bg-white dark:bg-[#162A56] border border-cosmic-indigo dark:border-cosmic-pink text-sm text-cosmic-purple dark:text-cosmic-pink px-2 py-2 rounded-lg focus:ring-2 focus:ring-cosmic-indigo dark:focus:ring-cosmic-pink focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-[#0F1C3F] disabled:cursor-not-allowed transition-all"
          aria-label="Filtrer par rôle"
        >
          <option value="all">Tous rôles</option>
          <option value="USER">Utilisateur</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>
    </div>
    <AnimatePresence>
      {hasActiveFilters && (
        <motion.button
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          onClick={onReset}
          disabled={loading}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 mt-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <X className="w-3 h-3" />
          Réinitialiser les filtres
        </motion.button>
      )}
    </AnimatePresence>
  </motion.div>
));

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

interface SearchSectionProps {
  searchQuery: string;
  loading: boolean;
  handleSearch: (query: string) => void;
  handleClearSearch: () => void;
  showFilters: boolean;
  hasActiveFilters: boolean;
  handleToggleFilters: () => void;
  statusFilter: UserStatus;
  roleFilter: UserRole;
  handleStatusChange: (status: UserStatus) => void;
  handleRoleChange: (role: UserRole) => void;
  handleResetFilters: () => void;
}

export const SearchSection = memo(function SearchSection({
  searchQuery,
  loading,
  handleSearch,
  handleClearSearch,
  showFilters,
  hasActiveFilters,
  handleToggleFilters,
  statusFilter,
  roleFilter,
  handleStatusChange,
  handleRoleChange,
  handleResetFilters,
}: SearchSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
      className="max-w-3xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row gap-2 mb-2">
        <div className="flex-1">
          <SearchBar
            searchQuery={searchQuery}
            loading={loading}
            onSearch={handleSearch}
            onClear={handleClearSearch}
          />
        </div>

        <FilterButton
          showFilters={showFilters}
          hasActiveFilters={hasActiveFilters}
          loading={loading}
          onClick={handleToggleFilters}
        />
      </div>

      <AnimatePresence mode="wait">
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <FilterPanel
              statusFilter={statusFilter}
              roleFilter={roleFilter}
              loading={loading}
              hasActiveFilters={hasActiveFilters}
              onStatusChange={handleStatusChange}
              onRoleChange={handleRoleChange}
              onReset={handleResetFilters}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});