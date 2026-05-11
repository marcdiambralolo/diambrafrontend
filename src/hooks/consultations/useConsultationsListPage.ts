import { useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { consultationsService } from '@/lib/api/services';
import { prefetchConsultationFrontData } from '@/lib/cache/route-prefetch';
import { QUERY_KEYS } from '@/lib/cache/queryClient';
import { Consultation } from '@/lib/interfaces';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

function getStatusCode(error: unknown): number | null {
  if (typeof error !== 'object' || error === null) return null;
  return (error as { response?: { status?: number } }).response?.status ?? null;
}

export function useConsultationsListPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: QUERY_KEYS.CONSULTATIONS_MY,
    queryFn: () => consultationsService.getMine(),
  });

  const consultations = useMemo<Consultation[]>(() => query.data?.consultations ?? [], [query.data]);

  const error = useMemo(() => {
    if (!query.error) {
      return null;
    }

    const statusCode = getStatusCode(query.error);
    if (statusCode === 401 || statusCode === 403) {
      return 'Session expirée. Veuillez vous reconnecter.';
    }

    return 'Erreur lors du chargement des consultations';
  }, [query.error]);

  const prefetchConsultation = useCallback((consultation: Consultation) => {
    const consultationId = consultation.consultationId || consultation.id || consultation._id;
    if (typeof consultationId !== 'string' || !consultationId.trim()) return;
    void router.prefetch(`/star/consultations/${consultationId}`);
    void prefetchConsultationFrontData(queryClient, consultationId);
  }, [queryClient, router]);

  const count = useMemo(() => consultations.length, [consultations]);

  return { consultations, loading: query.isLoading, count, error, prefetchConsultation };
}