import { api } from '@/lib/api/client';
import { Consultation } from '@/lib/interfaces';
import { useCallback, useEffect, useRef, useState } from 'react';

export type ConsultationType = 'all' | 'SPIRITUALITE' | 'TAROT' | 'ASTROLOGIE' | 'NUMEROLOGIE';
type StatusKey = 'COMPLETED';

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
const PENDING_POLL_MS = 100000;

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

    if (error.code === 'ERR_CANCELED' || error.name === 'CanceledError') {
      return 'Requête annulée.';
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

function isAbortError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    ((err as { code?: string }).code === 'ERR_CANCELED' ||
      (err as { name?: string }).name === 'CanceledError')
  );
}

function buildParams(opts: {
  search: string;
  status: StatusKey;
  type: ConsultationType;
  page: number;
  limit: number;
}) {
  const params = new URLSearchParams({
    search: opts.search || '',
    status: opts.status,
    type: opts.type || 'all',
    page: String(opts.page || 1),
    limit: String(opts.limit || ITEMS_PER_PAGE),
  });

  return params.toString();
}

export function useAdminConsultationsPageFinished() {
  const [searchQuery] = useState('');
  const [typeFilter] = useState<ConsultationType>('all');
  const [endedPage, setEndedPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [ended, setEnded] = useState<SliceState>(() => makeSliceState());
  const [allConsultations, setAllConsultations] = useState<Consultation[]>([]);

  const listAbortRef = useRef<AbortController | null>(null);
  const pendingPollTimerRef = useRef<number | null>(null);

  const fetchSlice = useCallback(
    async (
      status: StatusKey,
      page: number,
      signal?: AbortSignal,
    ): Promise<{ consultations: Consultation[]; total: number }> => {
      const query = buildParams({
        search: searchQuery,
        status,
        type: typeFilter,
        page,
        limit: ITEMS_PER_PAGE,
      });

      const res = await api.get<ConsultationListResponse>(`/admin/consultations?${query}`, {
        headers: { 'Cache-Control': 'no-cache' },
        timeout: 300000,
        signal,
      });

      return {
        consultations: res.data?.consultations || [],
        total: Number(res.data?.total || 0),
      };
    },
    [searchQuery, typeFilter],
  );

  const fetchAllConsultations = useCallback(async () => {
    const first = await fetchSlice('COMPLETED', 1);
    const totalPages = Math.max(1, Math.ceil(first.total / ITEMS_PER_PAGE));
    if (totalPages === 1) {
      setAllConsultations(first.consultations);
      return;
    }
    const promises = [];
    for (let page = 2; page <= totalPages; page++) {
      promises.push(fetchSlice('COMPLETED', page));
    }
    const results = await Promise.all(promises);
    const all = [first.consultations, ...results.map(r => r.consultations)].flat();
    setAllConsultations(all);
  }, [fetchSlice]);

  const fetchAll = useCallback(async () => {
    listAbortRef.current?.abort();
    const controller = new AbortController();
    listAbortRef.current = controller;
    setEnded((s) => ({ ...s, loading: true, error: null }));
    try {
      const { consultations, total } = await fetchSlice('COMPLETED', endedPage, controller.signal);
      setEnded({
        consultations,
        total,
        loading: false,
        error: null,
        totalPages: Math.max(1, Math.ceil(total / ITEMS_PER_PAGE)),
      });
      // Récupère toutes les consultations en parallèle (hors pagination)
      fetchAllConsultations();
    } catch (err) {
      if (!isAbortError(err)) {
        setEnded((s) => ({ ...s, loading: false, error: getNiceError(err) }));
      }
    }
  }, [endedPage, fetchSlice, fetchAllConsultations]);

  useEffect(() => {
    fetchAll();
    return () => {
      listAbortRef.current?.abort();
    };
  }, [fetchAll]);


  useEffect(() => {
    if (endedPage > ended.totalPages) {
      setEndedPage(Math.max(1, ended.totalPages));
    }
  }, [endedPage, ended.totalPages]);

  useEffect(() => {
    let disposed = false;
    function poll() {
      if (disposed) return;
      if (typeof document !== 'undefined' && document.hidden) {
        pendingPollTimerRef.current = window.setTimeout(poll, PENDING_POLL_MS);
        return;
      }
      fetchAll().finally(() => {
        if (!disposed) {
          pendingPollTimerRef.current = window.setTimeout(poll, PENDING_POLL_MS);
        }
      });
    }
    poll();
    return () => {
      disposed = true;
      if (pendingPollTimerRef.current) {
        window.clearTimeout(pendingPollTimerRef.current);
        pendingPollTimerRef.current = null;
      }
      listAbortRef.current?.abort();
    };
  }, [fetchAll]);


  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchAll();
    } finally {
      window.setTimeout(() => setIsRefreshing(false), 450);
    }
  }, [fetchAll]);

  const handlePageChange = useCallback(
    (page: number) => {
      const nextPage = Math.max(1, page);
      setEndedPage(nextPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [],
  );

  return {
    consultations: allConsultations, // toutes les consultations (toutes pages)
    paginatedConsultations: ended.consultations, // consultations paginées (page courante)
    total: ended.total, tab: 'ended',
    totalPages: ended.totalPages, currentPage: endedPage,
    error: ended.error, loading: ended.loading, isRefreshing,
    handleRefresh, handlePageChange,
  };
}