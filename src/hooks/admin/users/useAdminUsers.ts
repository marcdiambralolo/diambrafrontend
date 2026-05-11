import { api } from '@/lib/api/client';
import { useCallback, useEffect, useState } from 'react';
import { User } from '@/lib/interfaces';
import { getErrorMessage } from '@/lib/utils/errorHelpers';

interface UseAdminUsersOptions {
  search?: string;
  status?: string;
  role?: string;
  page?: number;
  limit?: number;
}

type AdminUsersResponse = {
  users?: User[];
  total?: number;
};

export function useAdminUsers(options: UseAdminUsersOptions = {}) {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        search: options.search || '',
        status: options.status || 'all',
        role: options.role || 'all',
        page: String(options.page || 1),
        limit: String(options.limit || 10),
      });

      const response = await api.get<AdminUsersResponse>(`/admin/users?${params}`, {
        timeout: 10000,
      });

      setUsers(response.data.users || []);
      setTotal(response.data.total || 0);
    } catch (err: unknown) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
      setError(getErrorMessage(err, 'Erreur inconnue'));
    } finally {
      setLoading(false);
    }
  }, [options.search, options.status, options.role, options.page, options.limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, total, loading, error, refetch: fetchUsers };
}