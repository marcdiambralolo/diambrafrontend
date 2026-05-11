import { api } from "@/lib/api/client";
import { QUERY_KEYS } from "@/lib/cache/queryClient";
import { User } from "@/lib/interfaces";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useMemo } from "react";

type RouteParams = Record<string, string | string[] | undefined>;

export function useUserDetailsPage() {
  const params = useParams();

  const id = useMemo(() => {
    const raw = (params as RouteParams | null)?.id;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const query = useQuery<User | null>({
    queryKey: QUERY_KEYS.ADMIN_USER_DETAIL(id || ''),
    enabled: Boolean(id),
    queryFn: async () => {
      const response = await api.get<User>(`/users/${id}`);
      return response.data ?? null;
    },
    staleTime: 1000 * 60,
  });

  const errorMessage = query.error
    ? ((query.error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message
      || (query.error as { message?: string }).message
      || 'Erreur inconnue')
    : null;

  return { user: query.data ?? null, loading: query.isLoading, error: errorMessage };
}