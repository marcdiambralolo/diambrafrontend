import { api } from '@/lib/api/client';
import { Consultation } from '@/lib/interfaces';
import { useInfiniteQuery } from '@tanstack/react-query';

const ITEMS_PER_PAGE = 10;

type ConsultationListResponse = {
  consultations: Consultation[];
  total: number;
};

const fetchConsultationsPage = async ({ pageParam = 1 }): Promise<ConsultationListResponse> => {
  const params = new URLSearchParams({
    page: String(pageParam),
    limit: String(ITEMS_PER_PAGE),
  });

  const { data } = await api.get<{ consultations?: Consultation[]; total?: number }>(
    `/admin/consultations?${params}`,
    {
      headers: { 'Cache-Control': 'no-cache' },
      timeout: 30000,
    }
  );

  return {
    consultations: data?.consultations || [],
    total: Number(data?.total || 0),
  };
};

export function useConsultationsListPage() {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['consultations', 'admin'],
    queryFn: fetchConsultationsPage,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.length * ITEMS_PER_PAGE;
      return totalFetched < lastPage.total ? allPages.length + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const allConsultations = data?.pages.flatMap(page => page.consultations) || [];
  
  // Auto-fetch des pages suivantes
  if (hasNextPage && !isFetchingNextPage && allConsultations.length < (data?.pages[0]?.total || 0)) {
    fetchNextPage();
  }

  return {
    loading: isLoading,
    consultationsglobaux: allConsultations,
    historyCount: allConsultations.length,
    total: data?.pages[0]?.total || 0,
  };
}