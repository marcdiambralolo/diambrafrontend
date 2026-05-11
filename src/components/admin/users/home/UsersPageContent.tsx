'use client';
import { LoadingOverlay } from '@/components/admin/users/home/LoadingOverlay';
import PageHeader from '@/components/admin/users/home/PageHeader';
import RefreshBanner from '@/components/admin/users/home/RefreshBanner';
import { SearchSection } from '@/components/admin/users/home/SearchSection';
import { StatsSection } from '@/components/admin/users/home/StatsSection';
import { UsersGrid } from '@/components/admin/users/home/UsersGrid';
import { useUsersPageController } from '@/hooks/admin/users/useUsersPageController';
import { memo } from 'react';
import { UsersPageError, UsersPageLoading } from './UsersPageStates';

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
      <PageHeader isRefreshing={isRefreshing} loading={loading} onRefresh={handleRefresh} />

      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 py-4 space-y-4">
        <div className="flex justify-center">
          <RefreshBanner loading={loading} isRefreshing={isRefreshing} hasUsers={hasUsers} />
        </div>

        <StatsSection stats={stats} />

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