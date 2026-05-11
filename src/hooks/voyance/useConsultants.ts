import { useQuery } from '@tanstack/react-query';
import { usersService } from '@/lib/api/services';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/interfaces';

const PAGE_SIZE = 3;

export function useConsultants() {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['consultants', page, PAGE_SIZE],
    queryFn: () => usersService.getConsultants({ page, limit: PAGE_SIZE }),
    placeholderData: (prev) => prev,
    // 🔥 CORRECTION : Gérer les erreurs silencieusement
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const onConsultClick = (p: User) => {
    if (p?._id) {
      router.push(`/star/voyance/messages/${p._id}`);
    }
  };

  const onPrev = () => setPage((p: number) => Math.max(1, p - 1));
  const onNext = () => setPage((p: number) => {
    const maxPage = data?.totalPages || 1;
    return Math.min(maxPage, p + 1);
  });
  const onPage = (p: number) => setPage(p);

  // 🔥 CORRECTION : Extraire les données avec des valeurs par défaut
  const consultants = useMemo(() => {
    let arr: any[] = [];
    if (Array.isArray(data?.consultants)) arr = data.consultants;
    else if (Array.isArray(data)) arr = data;
    // Mappe les consultants pour éviter les erreurs et donner 'MEDIUM' si nom vide/null
    return arr.map((c) => ({
      ...c,
      name: c?.name && typeof c.name === 'string' && c.name.trim() ? c.name : 'MEDIUM',
    }));
  }, [data]);

  const totalPages = useMemo(() => {
    return data?.totalPages || 1;
  }, [data]);

  const consultantsList = Array.isArray(consultants) ? consultants : [];
  const hasConsultants = consultantsList.length > 0;

  return {
    onConsultClick,
    onPrev,
    onNext,
    onPage,
    refetch,
    consultants,
    totalPages,
    isLoading,
    isError,
    error: isError ? error : null,
    page,
    hasConsultants,
    consultantsList,
  };
}