'use client';
 import RefreshBanner from '@/components/admin/users/home/RefreshBanner';
import { SearchSection } from '@/components/admin/users/home/SearchSection';
 
import { UsersGrid } from '@/components/admin/users/home/UsersGrid';
import { useUsersPageController } from '@/hooks/admin/users/useUsersPageController';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { memo, useMemo } from 'react';
import { UsersPageError, UsersPageLoading } from './UsersPageStates';
 
import CacheLink from '@/components/commons/CacheLink';
import { Plus, Users } from 'lucide-react';
 
import UsersStats from '@/components/admin/users/home/UsersStats';
 

type UsersStatsData = React.ComponentProps<typeof UsersStats>['stats'];

interface StatsSectionProps {
  stats: UsersStatsData | null | undefined;
}

export const StatsSection = memo(function StatsSection({ stats }: StatsSectionProps) {
  return (
    <div className="flex justify-center"    >
      {stats && <UsersStats stats={stats} />}
    </div>
  );
});

interface PageHeaderProps {
  isRefreshing: boolean;
  loading: boolean;
  onRefresh: () => void;
}

const PageHeader = memo<PageHeaderProps>(({ isRefreshing, loading, onRefresh }) => {
 
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex items-center justify-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
              <Users className="w-4 h-4 text-white" />
            </div>
            <CacheLink
              href="/admin/users/new"
              className="
                flex items-center gap-1.5 px-3 py-2 
                bg-gradient-to-r from-blue-600 to-blue-700 
                text-white text-sm rounded-lg font-semibold 
                hover:shadow-md hover:from-blue-700 hover:to-blue-800
                transition-all active:scale-95
              "
            >
              <Plus className="w-4 h-4" />
              Nouvel utilisateur
            </CacheLink>
            <motion.button
              onClick={onRefresh}
              disabled={isRefreshing || loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                p-2 rounded-lg transition-all
                ${isRefreshing || loading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-sm'
                }
              `}
              aria-label="Rafraîchir la liste"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing || loading ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}); 

interface LoadingOverlayProps {
  loading: boolean;
  users: unknown[] | null | undefined;
}

export const LoadingOverlay = memo(function LoadingOverlay({ loading, users }: LoadingOverlayProps) {
  const overlayVariants: Variants = useMemo(() => ({
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } }
  }), []);

  return (
    <AnimatePresence>
      {loading && users && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-md dark:white/60"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="relative flex flex-col items-center gap-3 rounded-2xl border border-blue-200/50 bg-gradient-to-br from-white to-blue-50/80 p-6 shadow-2xl dark:border-[color:var(--theme-border)] dark:from-[#0F1C3F] dark:to-[#162A56]"
          >
            <motion.div
              className="relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <RefreshCw className="h-8 w-8 text-[#2E5AA6] dark:text-[#9BC2FF]" />
              <motion.div
                className="absolute inset-0 rounded-full bg-[#4F83D1]/30 blur-lg"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
            
            <div className="text-center">
              <p className="bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] bg-clip-text text-sm font-bold text-transparent">
                Chargement en cours...
              </p>
              
              <motion.div
                className="flex gap-1 justify-center mt-2"
                initial="hidden"
                animate="visible"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-[#4F83D1] dark:bg-[#9BC2FF]"
                    animate={{ y: [0, -8, 0], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export const UsersPageContent = memo(function UsersPageContent() {
  const {
    handleStatusChange, handleToggleFilters, handlePageChange, handleRoleChange,
    handleSearch, handleClearSearch, handleResetFilters, handleRefresh,
    stats, searchQuery, showFilters, isRefreshing, loading, error,
    hasActiveFilters, statusFilter, roleFilter, users, containerVariants,
    cardVariants, currentPage, totalPages, hasUsers, hasFilters,
  } = useUsersPageController();

  if (error) {
    return <UsersPageError error={error} handleRefresh={handleRefresh} isRefreshing={isRefreshing} />;
  }

  if (loading) {
    return <UsersPageLoading />;
  }

  return (
    <div className="w-full relative overflow-hidden  dark:from-[#070B1A] dark:via-[#0F1C3F] dark:to-[#070B1A]">

      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 py-4 space-y-4">
       
      
        <SearchSection
          searchQuery={searchQuery}
          loading={loading}
          handleSearch={handleSearch}
          handleClearSearch={handleClearSearch}
          showFilters={showFilters}
          hasActiveFilters={hasActiveFilters}
          handleToggleFilters={handleToggleFilters}
          statusFilter={statusFilter}
          roleFilter={roleFilter}
          handleStatusChange={handleStatusChange}
          handleRoleChange={handleRoleChange}
          handleResetFilters={handleResetFilters}
        />
<PageHeader isRefreshing={isRefreshing} loading={loading} onRefresh={handleRefresh} />

        <StatsSection stats={stats} />
 <div className="flex justify-center">
          <RefreshBanner loading={loading} isRefreshing={isRefreshing} hasUsers={hasUsers} />
        </div>
        <div className="relative">
          <LoadingOverlay loading={loading} users={users} />

          <UsersGrid
            hasUsers={hasUsers}
            users={users}
            containerVariants={containerVariants}
            cardVariants={cardVariants}
            currentPage={currentPage}
            totalPages={totalPages}
            loading={loading}
            handlePageChange={handlePageChange}
            hasFilters={hasFilters}
            handleResetFilters={handleResetFilters}
          />
        </div>
      </div>
    </div>
  );
});