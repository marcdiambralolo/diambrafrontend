import { useAdminUsers } from '@/hooks/admin/users/useAdminUsers';
import api from '@/lib/api/client';
import { User } from '@/lib/interfaces';
import { getErrorMessage } from '@/lib/utils/errorHelpers';
import { Variants } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';



export type UserStatus = 'all' | 'active' | 'inactive';
export type UserRole = 'all' | 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export function useUsersPageController() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus>('all');
  const [roleFilter, setRoleFilter] = useState<UserRole>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { users: apiUsers, total, loading, error, refetch } = useAdminUsers({
    search: searchQuery,
    status: statusFilter,
    role: roleFilter,
    page: currentPage,
    limit: 6,
  });

  const mapUserToUserData = (user: Partial<User>): User => ({
    _id: user._id,
    username: user.username ?? '',
    prenoms: user.prenoms ?? '',
    nom: user.nom ?? '',
    phone: user.phone ?? '',
    status: user.status ?? 'active',
    isActive: user.isActive,
    createdAt: user.createdAt ?? new Date().toISOString(),
    lastLogin: user.lastLogin ?? undefined,
    consultationsCount: user.consultationsCount ?? 0,
    totalConsultations: user.totalConsultations ?? user.consultationsCount ?? 0,
    rating: user.rating ?? 0,
    credits: user.credits ?? 0,
    country: user.country ?? '',
    gender: user.gender ?? 'male',
    role: user.role,
    avatar: user.avatar ?? '',
    customPermissions: user.customPermissions ?? [],
    updatedAt: user.updatedAt ?? new Date(),
    presentation: user.presentation ?? '',
  });

  const users: User[] = useMemo(() => (apiUsers ? apiUsers.map(mapUserToUserData) : []), [apiUsers]);

  // Nouvelle logique : stats globales (non paginées)
  const [globalStats, setGlobalStats] = useState<{
    total: number;
    active: number;
    inactive: number;
    admins: number;
    verified: number;
  } | null>(null);

  const fetchGlobalStats = useCallback(async () => {
    try {
      const res = await api.get('/admin/stats');
      // On suppose que res.data.users contient les stats globales
      setGlobalStats({
        total: res.data.users.total,
        active: res.data.users.active,
        inactive: res.data.users.inactive,
        admins: res.data.users.admins ?? res.data.users.admin ?? 0,
        verified: res.data.users.verified ?? 0,
      });
    } catch (err: unknown) {
      console.error('Erreur stats globales', getErrorMessage(err, 'Erreur stats globales'));
    }
  }, []);

  // Chargement au montage et lors du refresh
  useEffect(() => {
    fetchGlobalStats();
  }, [fetchGlobalStats]);

  const stats = globalStats;

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  }, [refetch]);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('all');
    setRoleFilter('all');
    setCurrentPage(1);
  }, []);

  const totalPages = Math.ceil(total / 6);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.03 } }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
  };

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } }
  };

  const handleSearch = useCallback(
    (value: string) => {
      setSearchQuery(value);
      setCurrentPage(1);
    },
    [setSearchQuery, setCurrentPage]
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, [setSearchQuery]);

  const handleToggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, [setShowFilters]);

  const handleStatusChange = useCallback(
    (status: 'all' | 'active' | 'inactive') => {
      setStatusFilter(status);
      setCurrentPage(1);
    },
    [setStatusFilter, setCurrentPage]
  );

  const handleRoleChange = useCallback(
    (role: 'all' | 'USER' | 'ADMIN' | 'SUPER_ADMIN') => {
      setRoleFilter(role);
      setCurrentPage(1);
    },
    [setRoleFilter, setCurrentPage]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
    },
    [setCurrentPage]
  );

  const hasActiveFilters = useMemo(
    () => statusFilter !== 'all' || roleFilter !== 'all',
    [statusFilter, roleFilter]
  );

  const hasFilters = useMemo(
    () => searchQuery.trim().length > 0 || hasActiveFilters,
    [searchQuery, hasActiveFilters]
  );

  const hasUsers = useMemo(() => users && users.length > 0, [users]);

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,
    currentPage,
    setCurrentPage,
    showFilters,
    setShowFilters,
    isRefreshing,
    users,
    stats,
    total,
    loading,
    error,
    handleRefresh,
    handleResetFilters,
    totalPages,
    containerVariants,
    cardVariants,
    modalVariants,
    handleSearch,
    handleClearSearch,
    handleToggleFilters,
    handleStatusChange,
    handleRoleChange,
    handlePageChange,
    hasActiveFilters,
    hasFilters,
    hasUsers,
  };
}
