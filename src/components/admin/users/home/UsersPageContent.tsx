'use client';
import { SearchSection } from '@/components/admin/users/home/SearchSection';
import UserCard from '@/components/admin/users/home/UserCard';
import CacheLink from '@/components/commons/CacheLink';
import { useUsersPageController } from '@/hooks/admin/users/useUsersPageController';
import { User } from '@/lib/interfaces';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { CheckCircle, ChevronLeft, ChevronRight, Clock, Plus, RefreshCw, Shield, Users } from 'lucide-react';
import { memo, useMemo } from 'react';
import { UsersPageError, UsersPageLoading } from './UsersPageStates';

const bannerVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } }
};

interface RefreshBannerProps {
  loading: boolean;
  isRefreshing: boolean;
  hasUsers: boolean;
}

const RefreshBanner = memo<RefreshBannerProps>(({ loading, isRefreshing, hasUsers }) => {
  if ((!loading && !isRefreshing) || !hasUsers) return null;

  return (
    <motion.div
      variants={bannerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="mb-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-3 flex items-center justify-center gap-2 shadow-lg"
    >
      <RefreshCw className="w-4 h-4 animate-spin" />
      <span className="text-sm font-medium">Mise à jour des données en cours...</span>
    </motion.div>
  );
});

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

type UsersStatsProps = {
  stats: {
    total: number;
    active: number;
    inactive: number;
    admins: number;
    verified: number;
  };
};

const statStyles = {
  blue: {
    card: 'border-blue-100 bg-blue-50/80 dark:border-[color:var(--theme-border)] dark:bg-[#13274C]/85',
    icon: 'bg-blue-100 text-[#2E5AA6] dark:bg-[#1D3C70] dark:text-[#9BC2FF]',
  },
  green: {
    card: 'border-emerald-100 bg-emerald-50/80 dark:border-emerald-500/20 dark:bg-emerald-500/10',
    icon: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300',
  },
  gray: {
    card: 'border-slate-200 bg-slate-50/85 dark:border-[color:var(--theme-border)] dark:bg-[#0F1C3F]/85',
    icon: 'bg-slate-100 text-slate-600 dark:bg-[#162A56] dark:text-[#DDE7FA]',
  },
  ocean: {
    card: 'border-blue-200 bg-blue-50/85 dark:border-[color:var(--theme-border)] dark:bg-[#162A56]/88',
    icon: 'bg-blue-100 text-[#2E5AA6] dark:bg-[#21457F] dark:text-[#9BC2FF]',
  },
} as const;

const statsConfig: Array<{
  icon: LucideIcon;
  label: string;
  key: keyof UsersStatsProps['stats'];
  color: keyof typeof statStyles;
  span?: string;
}> = [
    { icon: Users, label: 'Total', key: 'total', color: 'blue' },
    { icon: CheckCircle, label: 'Actifs', key: 'active', color: 'green' },
    { icon: Clock, label: 'Inactifs', key: 'inactive', color: 'gray' },
    { icon: Shield, label: 'Admins', key: 'admins', color: 'ocean' },
  ];

export default function UsersStats({ stats }: UsersStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4"
    >
      {statsConfig.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.02 }}
          className={`rounded-lg border bg-white p-2.5 transition-all hover:shadow-md dark:text-white ${statStyles[stat.color].card} ${stat.span || ''}`}
        >
          <div className="flex items-center gap-2">
            <div className={`rounded p-1 ${statStyles[stat.color].icon}`}>
              <stat.icon className="h-3.5 w-3.5" />
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-[#AFC0DE]">{stat.label}</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stats[stat.key]}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

const emptyStateVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 20 }
  }
};

interface EmptyStateProps {
  hasFilters: boolean;
  onReset: () => void;
}

const EmptyState = memo<EmptyStateProps>(({ hasFilters, onReset }) => (
  <motion.div
    variants={emptyStateVariants}
    initial="hidden"
    animate="visible"
    className="bg-white rounded-lg border border-gray-200 p-8 sm:p-12 text-center shadow-sm"
  >
    <div className="mb-4">
      <Users className="w-16 h-16 text-gray-300 mx-auto" />
    </div>
    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
      Aucun utilisateur trouvé
    </h3>
    <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
      {hasFilters
        ? 'Aucun résultat ne correspond à vos critères de recherche'
        : 'Commencez par ajouter votre premier utilisateur'}
    </p>

    {hasFilters && (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onReset}
        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg font-medium hover:shadow-md hover:from-blue-600 hover:to-blue-700 transition-all"
      >
        Réinitialiser les filtres
      </motion.button>
    )}
  </motion.div>
));

interface UsersGridProps {
  hasUsers: boolean;
  users: User[];
  containerVariants: Variants;
  cardVariants: Variants;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  handlePageChange: (page: number) => void;
  hasFilters: boolean;
  handleResetFilters: () => void;
}

export const UsersGrid = memo(function UsersGrid({
  hasUsers,
  users,
  containerVariants,
  cardVariants,
  currentPage,
  totalPages,
  loading,
  handlePageChange,
  hasFilters,
  handleResetFilters,
}: UsersGridProps) {
  if (!hasUsers) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="flex justify-center"
      >
        <EmptyState hasFilters={hasFilters} onReset={handleResetFilters} />
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 justify-items-center"
        role="region"
        aria-label="Liste des utilisateurs"
      >
        {users.map((user: User, idx: number) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, type: 'spring', stiffness: 200 }}
            className="w-full max-w-sm min-h-[340px] flex"
            style={{ minHeight: 340, height: '100%' }}
          >
            <div className="flex-1 flex flex-col h-full">
              <UserCard
                user={user}
                cardVariants={cardVariants}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center"
      >
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          loading={loading}
          onPageChange={handlePageChange}
        />
      </motion.div>
    </div>
  );
});

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