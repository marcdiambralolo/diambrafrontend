import { consultationsService } from '@/lib/api/services';
import { QUERY_KEYS } from '@/lib/cache/queryClient';
import { Consultation } from '@/lib/interfaces';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

function getStatusCode(error: unknown): number | null {
  if (typeof error !== 'object' || error === null) return null;
  return (error as { response?: { status?: number } }).response?.status ?? null;
}

export function useConsultationsListPage() { 
  const query = useQuery({
    queryKey: QUERY_KEYS.CONSULTATIONS_MY,
    queryFn: () => consultationsService.getMine(),
  });

  const consultations = useMemo<Consultation[]>(() => query.data?.consultations ?? [], [query.data]);
console.log(consultations);
  const error = useMemo(() => {
    if (!query.error) {
      return null;
    }

    const statusCode = getStatusCode(query.error);
    
    if (statusCode === 401 || statusCode === 403) {
      return 'Session expirée. Veuillez vous reconnecter.';
    }

    return 'Erreur lors du chargement des Jeux';
  }, [query.error]);

  return { consultations, loading: query.isLoading, count:consultations.length, error, };
}