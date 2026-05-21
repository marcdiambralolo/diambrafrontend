import { api } from '@/lib/api/client';
import { Consultation } from '@/lib/interfaces';
import { useCallback, useEffect, useRef, useState } from 'react';

type ConsultationListResponse = {
  consultations?: Consultation[];
  total?: number;
};

type SliceState = {
  consultations: Consultation[];
  total: number;
  loading: boolean;
  error: string | null;
  totalPages: number;
};

const ITEMS_PER_PAGE = 10;

function makeSliceState(): SliceState {
  return {
    consultations: [],
    total: 0,
    loading: true,
    error: null,
    totalPages: 1,
  };
}

function getNiceError(err: unknown): string {
  if (typeof err === 'object' && err !== null) {
    const error = err as {
      code?: string;
      response?: { status?: number; data?: { message?: string } };
      request?: unknown;
      message?: string;
      name?: string;
    };

    if (error.code === 'ECONNABORTED') {
      return 'Délai dépassé : la requête a pris trop de temps. Veuillez réessayer.';
    }

    if (error.response) {
      return error.response.data?.message || `Erreur ${error.response.status}`;
    }

    if (error.request) {
      return 'Erreur de connexion au serveur';
    }

    if (error.message === 'Network Error') {
      return 'Erreur réseau : vérifiez votre connexion internet';
    }

    return error.message || 'Erreur inconnue';
  }

  return 'Erreur inconnue';
}

function buildParams(opts: {
  search: string;
  page: number;
  limit: number;
}) {
  const params = new URLSearchParams({
    search: opts.search || '',
    page: String(opts.page || 1),
    limit: String(opts.limit || ITEMS_PER_PAGE),
  });

  return params.toString();
}

export function useAdminConsultationsPageFinished() {
  const [searchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [state, setState] = useState<SliceState>(() => makeSliceState());
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  const isMountedRef = useRef(true);
  const isFetchingRef = useRef(false);

  const fetchSlice = useCallback(
    async (page: number): Promise<{ consultations: Consultation[]; total: number }> => {
      const query = buildParams({
        search: searchQuery,
        page,
        limit: ITEMS_PER_PAGE,
      });

      const res = await api.get<ConsultationListResponse>(
        `/admin/consultations?${query}`,
        {
          headers: { 'Cache-Control': 'no-cache' },
          timeout: 30000,
        },
      );

      return {
        consultations: res.data?.consultations || [],
        total: Number(res.data?.total || 0),
      };
    },
    [searchQuery],
  );

  const fetchData = useCallback(
    async (page: number = currentPage) => {
      // Éviter les appels multiples simultanés
      if (isFetchingRef.current) return;
      
      isFetchingRef.current = true;
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const { consultations, total } = await fetchSlice(page);
        
        if (isMountedRef.current) {
          const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
          setState({
            consultations,
            total,
            loading: false,
            error: null,
            totalPages,
          });
        }
      } catch (err) {
        if (isMountedRef.current) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: getNiceError(err),
          }));
        }
      } finally {
        if (isMountedRef.current) {
          isFetchingRef.current = false;
          setIsInitialLoad(false);
        }
      }
    },
    [currentPage, fetchSlice],
  );

  useEffect(() => {
    isMountedRef.current = true;
    fetchData(currentPage);

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchData, currentPage]);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);

    try {
      await fetchData(currentPage);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  }, [fetchData, currentPage, isRefreshing]);

  const handlePageChange = useCallback(
    (page: number) => {
      const nextPage = Math.max(1, Math.min(page, state.totalPages));
      if (nextPage === currentPage) return;

      setCurrentPage(nextPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [currentPage, state.totalPages],
  );

  return {
    consultations: state.consultations,
    total: state.total,
    totalPages: state.totalPages,
    error: state.error,
    currentPage,
    loading: state.loading && isInitialLoad,
    isRefreshing,
    handleRefresh,
    handlePageChange,
  };
}