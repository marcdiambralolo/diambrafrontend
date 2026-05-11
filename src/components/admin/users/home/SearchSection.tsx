'use client';
import { memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SearchBar from '@/components/admin/users/home/SearchBar';
import FilterButton from '@/components/admin/users/home/FilterButton';
import FilterPanel from '@/components/admin/users/home/FilterPanel';

type UserStatus = 'all' | 'active' | 'inactive';
type UserRole = 'all' | 'USER' | 'ADMIN' | 'SUPER_ADMIN';

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