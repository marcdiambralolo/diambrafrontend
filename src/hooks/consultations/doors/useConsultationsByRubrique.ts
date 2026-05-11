import { getDoorsConsultations } from '@/lib/api/services/rubriques.service';
import { Consultation } from '@/lib/interfaces';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

const ORDER = [
  "VOTRE SIGNE SOLAIRE",
  "VOTRE ASCENDANT",
  "VOTRE DESCENDANT",
  "VOTRE SIGNE LUNAIRE",
  "VOTRE MILIEU DU CIEL",
] as const;

const ORDER_INDEX = new Map<string, number>(ORDER.map((t, i) => [t, i]));

function normalizeTitle(v: unknown) {
  return String(v ?? "").trim().toUpperCase();
}

export function useConsultationsByRubrique() {
  const router = useRouter();

  const {
    data: consultations = [],
    isLoading: loading,
    error,
  } = useQuery<Consultation[], Error>({
    queryKey: ['doors-consultations'],
    queryFn: () => getDoorsConsultations(),
    enabled: Boolean("694acf59bd12675f59e7a7f2"),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  const sortedConsultations = useMemo(() => {
    if (!consultations.length) return [];
    const seen = new Set<string>();
    const arr = consultations.filter((c) => {
      const t = normalizeTitle(c?.title);
      if (!ORDER_INDEX.has(t) || seen.has(t)) return false;
      seen.add(t);
      return true;
    });
    arr.sort((a, b) => {
      const ta = normalizeTitle(a?.title);
      const tb = normalizeTitle(b?.title);
      const ia = ORDER_INDEX.get(ta) ?? Number.POSITIVE_INFINITY;
      const ib = ORDER_INDEX.get(tb) ?? Number.POSITIVE_INFINITY;
      if (ia === Number.POSITIVE_INFINITY && ib === Number.POSITIVE_INFINITY) {
        return ta.localeCompare(tb, 'fr');
      }
      return ia - ib;
    });
    return arr;
  }, [consultations]);

  const onView = useCallback((consultation: Consultation) => {
    const consultationId = consultation.consultationId || consultation.id || consultation._id;
    if (!consultationId) return;
    router.push(`/star/consultations/${consultationId}?retour=cinqportes`);
  }, [router]);

  return {
    consultations: sortedConsultations,
    loading,
    error: error?.message || null,
    onView,
  };
}