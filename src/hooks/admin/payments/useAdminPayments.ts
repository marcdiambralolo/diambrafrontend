import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api/client';
import { Payment } from '@/lib/interfaces';
import { getErrorMessage } from '@/lib/utils/errorHelpers';

interface UseAdminPaymentsOptions {
  search?: string;
  status?: string;
  method?: string;
  page?: number;
  limit?: number;
}

type AdminPaymentsResponse = {
  payments?: Payment[];
  total?: number;
};

export function useAdminPayments(options: UseAdminPaymentsOptions = {}) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        search: options.search || '',
        status: options.status || 'all',
        method: options.method || 'all',
        page: String(options.page || 1),
        limit: String(options.limit || 18),
      });

      const response = await api.get<AdminPaymentsResponse>(`/admin/payments?${params}`, {
        timeout: 10000,
      });

      setPayments(response.data.payments || []);
      
      setTotal(response.data.total || 0);
    } catch (err: unknown) {
      console.error('Erreur lors du chargement des paiements:', err);
      setError(getErrorMessage(err, 'Erreur inconnue'));
    } finally {
      setLoading(false);
    }
  }, [options.search, options.status, options.method, options.page, options.limit]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return { payments, total, loading, error, refetch: fetchPayments };
}