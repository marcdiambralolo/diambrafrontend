import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getRubriqueById } from '@/lib/api/services/rubriques.service';
import { QUERY_KEYS } from '@/lib/cache/queryClient';
import type { Rubrique } from '@/lib/interfaces';

export function useRubriqueByIdWithCache(rubriqueId: string | null | undefined) {
  const queryClient = useQueryClient();
  const cachedRubriques = queryClient.getQueryData<Rubrique[]>(QUERY_KEYS.RUBRIQUES);
  const cachedRubrique = cachedRubriques?.find(
    (rubrique) => rubrique._id === rubriqueId || rubrique.id === rubriqueId
  );

  const {
    data: rubrique = null,
    isLoading,
    isError,
    isSuccess,
    error,
    refetch,
  } = useQuery<Rubrique | null, Error>({
    queryKey: QUERY_KEYS.RUBRIQUE_DETAIL(rubriqueId || ''),
    queryFn: async () => {
      if (!rubriqueId) return null;
      return getRubriqueById(rubriqueId);
    },
    initialData: cachedRubrique ?? null,
    enabled: Boolean(rubriqueId),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });

  return {
    rubrique,
    isLoading,
    isError,
    isSuccess,
    error,
    refetch,
  };
}