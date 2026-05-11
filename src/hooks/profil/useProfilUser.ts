import { api } from "@/lib/api/client";
import type { User } from '@/lib/interfaces';
import { useAuthStore } from "@/lib/store/auth.store";
import { useEffect, useState } from "react";
import { useStatsDataWithCache } from "../cache/useStatsDataWithCache";

export function useProfilUser() {
  const { stats, isLoading: statsLoading, error: statsError, refetch: fetchStats } = useStatsDataWithCache();

  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const isAuthenticated = Boolean(user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (!isAuthenticated) {
      setLoading(false);
      return () => { isMounted = false; };
    }

    const fetchUser = async () => {
      try {
        const response = await api.get<User | null>(`/users/me`);
        if (isMounted && response.data) {
          updateUser(response.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    setLoading(true);
    void fetchUser();

    return () => { isMounted = false; };
  }, [isAuthenticated, updateUser]);

  const isLoading = loading || statsLoading;
  const error = statsError;

  return { fetchStats, loading: isLoading, stats, error, } as const;
}