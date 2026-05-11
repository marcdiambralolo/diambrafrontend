import { useState, useCallback, useMemo } from 'react';
import { useAdminPayments } from '@/hooks/admin/payments/useAdminPayments';

type PaymentStatus = 'all' | 'pending' | 'completed' | 'failed' | 'cancelled';
type PaymentMethod = 'all' | 'orange_money' | 'mtn_money' | 'moov_money' | 'wave';

export function useAdminPaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus>('all');
  const [methodFilter, setMethodFilter] = useState<PaymentMethod>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { payments, total, loading, error, refetch } = useAdminPayments({
    search: searchQuery,
    status: statusFilter,
    method: methodFilter,
    page: currentPage,
    limit: 18,
  });

  const stats = useMemo(() => {
    if (!payments) return null;
    const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const completedAmount = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0);

    return {
      total: payments.length,
      pending: payments.filter(p => p.status === 'pending').length,
      completed: payments.filter(p => p.status === 'completed').length,
      failed: payments.filter(p => p.status === 'failed').length,
      cancelled: payments.filter(p => p.status === 'cancelled').length,
      totalAmount,
      completedAmount,
    };
  }, [payments]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  }, [refetch]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setMethodFilter('all');
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(total / 18);

  return {
    payments, total, showFilters, loading, totalPages, error, stats, methodFilter,
    currentPage, isRefreshing, searchQuery, statusFilter,
    handleRefresh, setStatusFilter, setSearchQuery, setMethodFilter,
    setCurrentPage, setShowFilters, handleResetFilters,
  };
}