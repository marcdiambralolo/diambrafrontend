import { consultationsService } from '@/lib/api/services';
import { QUERY_KEYS } from '@/lib/cache/queryClient';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

export function useConsultationsListPage() {
  const [activeTab, setActiveTab] = useState<'history' | 'games'>('games');

  const { 
    data: myConsultationsData, 
    isLoading: isLoadingMy,
    error: myError,
  } = useQuery({
    queryKey: QUERY_KEYS.CONSULTATIONS_MY,
    queryFn: () => consultationsService.getMine(),
    staleTime: 5 * 60 * 1000,
  });
 
  const myConsultations = useMemo(
    () => myConsultationsData?.consultations ?? [],
    [myConsultationsData]
  );

  return {
    consultations: myConsultations,
    loading: isLoadingMy,
    gamesCount: myConsultations.length,
    activeTab,
    setActiveTab,
    error: myError ? (myError as Error).message : null,
  };
}