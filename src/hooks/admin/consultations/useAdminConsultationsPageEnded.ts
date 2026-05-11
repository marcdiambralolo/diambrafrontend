import { api } from '@/lib/api/client';
import { Consultation } from '@/lib/interfaces';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ==================== CONSTANTES ====================
const CONSTANTS = {
  ITEMS_PER_PAGE: 10,
  BATCH_SIZE: 10,
  POLL_INTERVAL_MS: 20000,
  PENDING_POLL_MS: 28000,
  TOAST_DURATION_MS: 5000,
  REFRESH_DELAY_MS: 450,
} as const;

type ConsultationType = 'all' | 'SPIRITUALITE' | 'TAROT' | 'ASTROLOGIE' | 'NUMEROLOGIE';
type StatusKey = 'PENDING' | 'COMPLETED';
type JobStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | null;

// ==================== TYPES ====================
interface AnalysisJobState {
  consultationId: string;
  jobId: string;
  status: JobStatus;
  attempts: number;
  errorMessage: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  dateGeneration: string | null;
  hasResult: boolean;
}

interface BatchResult {
  id: string;
  title: string;
  success: boolean;
  error?: string;
  notified?: boolean;
  status?: JobStatus;
}

export interface BatchProgress {
  current: number;
  total: number;
  currentBatch: number;
  totalBatches: number;
  results: BatchResult[];
}

interface SliceState {
  consultations: Consultation[];
  total: number;
  loading: boolean;
  error: string | null;
  totalPages: number;
}

// ==================== HELPERS PURS ====================
const getNiceError = (err: unknown): string => {
  if (typeof err !== 'object' || err === null) return 'Erreur inconnue';

  const error = err as any;

  if (error.code === 'ECONNABORTED') {
    return 'Délai dépassé : la requête a pris trop de temps. Veuillez réessayer.';
  }

  if (error.code === 'ERR_CANCELED' || error.name === 'CanceledError') {
    return 'Requête annulée.';
  }

  if (error.response) {
    return error.response.data?.message || `Erreur ${error.response.status}`;
  }

  if (error.request) return 'Erreur de connexion au serveur';
  if (error.message === 'Network Error') return 'Erreur réseau : vérifiez votre connexion internet';

  return error.message || 'Erreur inconnue';
};

const isAbortError = (err: unknown): boolean => {
  return (
    typeof err === 'object' &&
    err !== null &&
    ((err as any).code === 'ERR_CANCELED' || (err as any).name === 'CanceledError')
  );
};

const isBatchResultResolved = (result: BatchResult): boolean => {
  return result.status === 'COMPLETED' || result.status === 'FAILED' || (!result.success && !result.status);
};

const uniq = <T,>(arr: T[]): T[] => Array.from(new Set(arr));

const makeSliceState = (): SliceState => ({
  consultations: [],
  total: 0,
  loading: true,
  error: null,
  totalPages: 1,
});

const buildParams = (opts: {
  search: string;
  status: StatusKey;
  type: ConsultationType;
  page: number;
  limit: number;
}): string => {
  const params = new URLSearchParams({
    search: opts.search || '',
    status: opts.status,
    type: opts.type || 'all',
    page: String(opts.page || 1),
    limit: String(opts.limit || CONSTANTS.ITEMS_PER_PAGE),
  });
  return params.toString();
};

// ==================== HOOK PRINCIPAL ====================
export function useAdminConsultationsPageEnded() {
  const router = useRouter();

  // États
  const [searchQuery] = useState('');
  const [typeFilter] = useState<ConsultationType>('all');
  const [pendingPage, setPendingPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
  const [pending, setPending] = useState<SliceState>(makeSliceState);
  const [notifyingIds, setNotifyingIds] = useState<Set<string>>(new Set());
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<BatchProgress | null>(null);
  const [jobStatuses, setJobStatuses] = useState<Record<string, AnalysisJobState>>({});

  // Refs
  const progressRef = useRef<BatchProgress | null>(null);
  const listAbortRef = useRef<AbortController | null>(null);
  const batchStatusAbortRef = useRef<AbortController | null>(null);
  const abortBatchRef = useRef(false);
  const batchPollTimerRef = useRef<number | null>(null);
  const pendingPollTimerRef = useRef<number | null>(null);
  const trackedIdsRef = useRef<string[]>([]);

  // ==================== CALLBACKS MEMOIZÉS ====================
  const setProgressSafe = useCallback((value: BatchProgress | null | ((prev: BatchProgress | null) => BatchProgress | null)) => {
    setProgress((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      progressRef.current = next;
      return next;
    });
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToastMessage(message);
    setToastType(type);
  }, []);

  const stopBatchPolling = useCallback(() => {
    if (batchPollTimerRef.current) {
      clearTimeout(batchPollTimerRef.current);
      batchPollTimerRef.current = null;
    }
    batchStatusAbortRef.current?.abort();
  }, []);

  const fetchSlice = useCallback(async (
    status: StatusKey,
    page: number,
    signal?: AbortSignal
  ): Promise<{ consultations: Consultation[]; total: number }> => {
    const query = buildParams({
      search: searchQuery,
      status,
      type: typeFilter,
      page,
      limit: CONSTANTS.ITEMS_PER_PAGE,
    });

    const res = await api.get<{ consultations?: Consultation[]; total?: number }>(
      `/admin/consultations?${query}`,
      {
        headers: { 'Cache-Control': 'no-cache' },
        timeout: status === 'PENDING' ? 600000 : 300000,
        signal,
      }
    );

    return {
      consultations: res.data?.consultations || [],
      total: Number(res.data?.total || 0),
    };
  }, [searchQuery, typeFilter]);

  const fetchAll = useCallback(async () => {
    listAbortRef.current?.abort();
    const controller = new AbortController();
    listAbortRef.current = controller;

    setPending(prev => ({ ...prev, loading: true, error: null }));

    const [pendingRes] = await Promise.allSettled([
      fetchSlice('PENDING', pendingPage, controller.signal),
    ]);

    if (pendingRes.status === 'fulfilled') {
      setPending({
        consultations: pendingRes.value.consultations,
        total: pendingRes.value.total,
        loading: false,
        error: null,
        totalPages: Math.max(1, Math.ceil(pendingRes.value.total / CONSTANTS.ITEMS_PER_PAGE)),
      });
    } else if (!isAbortError(pendingRes.reason)) {
      setPending(prev => ({
        ...prev,
        loading: false,
        error: getNiceError(pendingRes.reason),
      }));
    }
  }, [fetchSlice, pendingPage]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchAll();
    } finally {
      setTimeout(() => setIsRefreshing(false), CONSTANTS.REFRESH_DELAY_MS);
    }
  }, [fetchAll]);

  const pollStatuses = useCallback(async () => {
    const ids = trackedIdsRef.current;

    if (!ids.length || abortBatchRef.current) {
      stopBatchPolling();
      return;
    }

    batchStatusAbortRef.current?.abort();
    const controller = new AbortController();
    batchStatusAbortRef.current = controller;

    try {
      const response = await api.post<{ items?: AnalysisJobState[] }>(
        '/admin/consultations/analysis-jobs/statuses',
        { consultationIds: ids },
        { signal: controller.signal, timeout: 120000 }
      );

      const items = response.data?.items || [];
      const nextStatuses = Object.fromEntries(items.map(item => [item.consultationId, item]));

      setJobStatuses(prev => ({ ...prev, ...nextStatuses }));

      const nextPendingIds: string[] = [];
      let anyCompleted = false;

      setProgressSafe(prev => {
        if (!prev) return prev;

        const nextResults = prev.results.map(result => {
          const state = nextStatuses[result.id];
          if (!state) return result;

          if (state.status === 'COMPLETED') {
            anyCompleted = true;
            return { ...result, success: true, status: 'COMPLETED' as const, error: undefined };
          }

          if (state.status === 'FAILED') {
            return { ...result, success: false, status: 'FAILED' as const, error: state.errorMessage || 'Erreur inconnue' };
          }

          if (state.status === 'QUEUED' || state.status === 'PROCESSING') {
            nextPendingIds.push(state.consultationId);
            return { ...result, status: state.status };
          }

          return result;
        });

        const allDoneAfterUpdate = nextResults.length > 0 && nextResults.every(isBatchResultResolved);

        if (allDoneAfterUpdate && !nextPendingIds.length) {
          setIsRunning(false);
          showToast('La génération asynchrone est terminée.', 'success');
        }

        return {
          ...prev,
          current: nextResults.filter(isBatchResultResolved).length,
          results: nextResults,
        };
      });

      trackedIdsRef.current = uniq(nextPendingIds);

      if (anyCompleted) await handleRefresh();

      if (!trackedIdsRef.current.length) {
        stopBatchPolling();
        return;
      }
    } catch (err) {
      if (abortBatchRef.current || isAbortError(err)) {
        stopBatchPolling();
        return;
      }
    }

    stopBatchPolling();
    batchPollTimerRef.current = window.setTimeout(() => void pollStatuses(), CONSTANTS.POLL_INTERVAL_MS);
  }, [handleRefresh, setProgressSafe, showToast, stopBatchPolling]);

  const startBatchGeneration = useCallback(async () => {
    const pendingBatch = pending.consultations || [];

    if (pendingBatch.length === 0) {
      showToast('Aucune consultation en attente à traiter.', 'info');
      return;
    }

    abortBatchRef.current = false;
    trackedIdsRef.current = [];
    stopBatchPolling();
    setIsRunning(true);
    setJobStatuses({});

    const totalBatches = Math.ceil(pendingBatch.length / CONSTANTS.BATCH_SIZE);
    const allResults: BatchResult[] = [];
    const trackedIds = new Set<string>();

    setProgressSafe({
      current: 0,
      total: pendingBatch.length,
      currentBatch: 0,
      totalBatches,
      results: [],
    });

    let anyJobStarted = false;

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      if (abortBatchRef.current) break;

      const batchStart = batchIndex * CONSTANTS.BATCH_SIZE;
      const batch = pendingBatch.slice(batchStart, batchStart + CONSTANTS.BATCH_SIZE);

      setProgressSafe(prev => prev ? { ...prev, currentBatch: batchIndex + 1 } : prev);

      try {
        const response = await api.post<{ items?: Array<{ consultationId: string; success?: boolean; status?: JobStatus; error?: string; jobId?: string }> }>(
          '/admin/consultations/analysis-jobs',
          { consultationIds: batch.map(c => c._id) }
        );

        const items = response.data?.items || [];
        if (items.length > 0) anyJobStarted = true;

        for (const item of items) {
          const consultation = batch.find(entry => String(entry._id) === String(item.consultationId));
          const title = consultation?.title || `Consultation #${String(item.consultationId).slice(-6)}`;
          const status = item.status || null;

          allResults.push({
            id: String(item.consultationId),
            title,
            success: Boolean(item.success),
            status,
            error: item.error,
          });

          if (item.success && (status === 'QUEUED' || status === 'PROCESSING')) {
            trackedIds.add(String(item.consultationId));
          }
        }

        const returnedIds = new Set(items.map(item => String(item.consultationId)));
        const missingItems = batch.filter(c => !returnedIds.has(String(c._id)));

        for (const consultation of missingItems) {
          allResults.push({
            id: String(consultation._id),
            title: consultation.title || `Consultation #${String(consultation._id).slice(-6)}`,
            success: false,
            status: null,
            error: 'Aucune réponse de job retournée par le serveur.',
          });
        }
      } catch (err) {
        const message = getNiceError(err);
        for (const consultation of batch) {
          allResults.push({
            id: String(consultation._id),
            title: consultation.title || `Consultation #${String(consultation._id).slice(-6)}`,
            success: false,
            status: null,
            error: message,
          });
        }
      }

      setProgressSafe(prev => prev ? {
        ...prev,
        current: allResults.filter(isBatchResultResolved).length,
        results: [...allResults],
      } : prev);
    }

    trackedIdsRef.current = Array.from(trackedIds);

    if (trackedIdsRef.current.length) {
      void pollStatuses();
      if (!anyJobStarted) {
        showToast('Aucune analyse n’a pu être lancée (voir console pour détails).', 'error');
      }
      return;
    }

    setIsRunning(false);
    if (!anyJobStarted) showToast('Aucune analyse n’a pu être lancée (voir console pour détails).', 'error');
    await handleRefresh();
  }, [pending.consultations, handleRefresh, pollStatuses, setProgressSafe, showToast, stopBatchPolling]);

  // ==================== COMPUTED VALUES ====================
  const pendingCount = useMemo(() =>
    (pending.consultations || []).filter(c => c.status === 'PENDING').length,
    [pending.consultations]
  );

  const hasBatchFailures = useMemo(() =>
    !!progress?.results.some(r => r.status === 'FAILED' || (!!r.error && r.status !== 'QUEUED' && r.status !== 'PROCESSING')),
    [progress]
  );

  // ==================== EFFETS ====================
  useEffect(() => {
    void fetchAll();
    return () => listAbortRef.current?.abort();
  }, [fetchAll]);

  useEffect(() => {
    if (pendingPage > pending.totalPages) {
      setPendingPage(Math.max(1, pending.totalPages));
    }
  }, [pendingPage, pending.totalPages]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), CONSTANTS.TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    let disposed = false;

    const poll = async () => {
      if (disposed) return;
      if (document?.hidden) {
        pendingPollTimerRef.current = window.setTimeout(poll, CONSTANTS.PENDING_POLL_MS);
        return;
      }

      listAbortRef.current?.abort();
      const controller = new AbortController();
      listAbortRef.current = controller;

      try {
        await fetchAll();
      } catch (err) {
        console.error('Erreur lors du polling des consultations :', err);
      }

      if (!disposed) {
        pendingPollTimerRef.current = window.setTimeout(poll, CONSTANTS.PENDING_POLL_MS);
      }
    };

    void poll();

    return () => {
      disposed = true;
      if (pendingPollTimerRef.current) clearTimeout(pendingPollTimerRef.current);
      listAbortRef.current?.abort();
    };
  }, [fetchAll]);

  useEffect(() => {
    return () => {
      stopBatchPolling();
      if (pendingPollTimerRef.current) clearTimeout(pendingPollTimerRef.current);
      listAbortRef.current?.abort();
      abortBatchRef.current = true;
    };
  }, [stopBatchPolling]);

  useEffect(() => {
    if (isRunning && pending.consultations.length === 0) {
      setIsRunning(false);
      setProgressSafe(null);
    }
  }, [isRunning, pending.consultations.length, setProgressSafe]);

  useEffect(() => {
    if (isRunning && progress && progress.results.length > 0 &&
      progress.results.every(r => r.status === 'COMPLETED' || r.status === 'FAILED')) {
      setIsRunning(false);
    }
  }, [isRunning, progress]);

  // ==================== RETOUR ====================
  const handlePageChange = useCallback((page: number) => {
    const nextPage = Math.max(1, page);
    setPendingPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleGenerateAnalysis = useCallback((id: string) => {
    router.push(`/admin/consultations/${id}`);
  }, [router]);

  const handleNotifyUser = useCallback(async (consultationId: string) => {
    setNotifyingIds(prev => new Set(prev).add(consultationId));

    try {
      await api.post(`/consultations/${consultationId}/notify-user`);
      showToast('Utilisateur notifié avec succès.', 'success');
      await handleRefresh();
    } catch (err) {
      showToast(getNiceError(err), 'error');
    } finally {
      setNotifyingIds(prev => {
        const next = new Set(prev);
        next.delete(consultationId);
        return next;
      });
    }
  }, [handleRefresh, showToast]);

  const handleRetryAnalysis = useCallback(async (id: string) => {
    try {
      const response = await api.post<{ items?: Array<{ jobId?: string; status?: JobStatus; error?: string; success?: boolean }> }>(
        '/admin/consultations/analysis-jobs',
        { consultationIds: [id] }
      );

      const items = response.data?.items || [];
      const item = items[0];

      if (!items.length) {
        showToast("Aucune tâche n'a été acceptée par le backend.", 'error');
        return;
      }

      const status = item.status || null;

      setJobStatuses(prev => ({
        ...prev,
        [id]: {
          consultationId: id,
          jobId: item.jobId || prev[id]?.jobId || id,
          status,
          attempts: (prev[id]?.attempts || 0) + 1,
          errorMessage: item.error || null,
          startedAt: prev[id]?.startedAt || null,
          finishedAt: null,
          dateGeneration: prev[id]?.dateGeneration || null,
          hasResult: false,
        },
      }));

      if (status === 'QUEUED' || status === 'PROCESSING') {
        trackedIdsRef.current = uniq([...trackedIdsRef.current, id]);
        abortBatchRef.current = false;
        setIsRunning(true);
        showToast('La relance a été ajoutée à la file de traitement.', 'info');
        stopBatchPolling();
        void pollStatuses();
      } else if (status === 'COMPLETED') {
        showToast('Analyse relancée avec succès.', 'success');
        await handleRefresh();
      }
    } catch (err) {
      showToast(getNiceError(err), 'error');
    }
  }, [handleRefresh, pollStatuses, showToast, stopBatchPolling]);

  const stopBatchGeneration = useCallback(() => {
    abortBatchRef.current = true;
    trackedIdsRef.current = [];
    stopBatchPolling();
    setIsRunning(false);
    showToast('Le traitement batch a été arrêté.', 'info');
  }, [showToast, stopBatchPolling]);

  const clearProgress = useCallback(() => {
    setProgressSafe(null);
    setJobStatuses({});
  }, [setProgressSafe]);

  const handleToastClose = useCallback(() => setToastMessage(null), []);

  // Retour complet pour le composant frontend
  return {
    // État des consultations
    consultationsenattente: pending.consultations,
    pendingTotal: pending.total,
    totalPages: pending.totalPages,
    currentPage: pendingPage,
    error: pending.error,
    loading: pending.loading,
    isRefreshing,
    
    // Batch generation
    isRunning,
    progress,
    pendingCount,
    jobStatuses,
    notifyingIds,
    hasBatchFailures,
    
    // Toast
    toastMessage,
    toastType,
    
    // Actions
    startBatchGeneration,
    stopBatchGeneration,
    clearProgress,
    handleRefresh,
    handleNotifyUser,
    handlePageChange,
    handleGenerateAnalysis,
    handleRetryAnalysis,
    handleToastClose,
  };
}