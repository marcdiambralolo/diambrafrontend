import { api } from '@/lib/api/client';
import { Consultation } from '@/lib/interfaces';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type ConsultationType = 'all' | 'SPIRITUALITE' | 'TAROT' | 'ASTROLOGIE' | 'NUMEROLOGIE';
type StatusKey = 'PENDING' | 'COMPLETED';
type JobStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | null;

type AnalysisJobResponse = {
  items?: Array<{
    consultationId?: string;
    jobId?: string;
    status?: JobStatus;
    error?: string;
    success?: boolean;
  }>;
};

export interface BatchResult {
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

type AnalysisJobState = {
  consultationId: string;
  jobId: string;
  status: JobStatus;
  attempts: number;
  errorMessage: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  dateGeneration: string | null;
  hasResult: boolean;
};

type ConsultationListResponse = {
  consultations?: Consultation[];
  total?: number;
};

type AnalysisJobsStatusesResponse = {
  items?: AnalysisJobState[];
};

type SliceState = {
  consultations: Consultation[];
  total: number;
  loading: boolean;
  error: string | null;
  totalPages: number;
};

const ITEMS_PER_PAGE = 10;
const BATCH_SIZE = 10;
const POLL_INTERVAL_MS = 100000;
const PENDING_POLL_MS = 100000;
const TOAST_DURATION_MS = 4500;

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

function isBatchResultResolved(result: BatchResult): boolean {
  return (
    result.status === 'COMPLETED' ||
    result.status === 'FAILED' ||
    (!result.success && !result.status)
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

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export function useAdminConsultationsPageNotnotified() {
  const router = useRouter();

  const [searchQuery] = useState('');
  const [typeFilter] = useState<ConsultationType>('all');
  const [pendingPage, setPendingPage] = useState(1);
  const [endedPage, setEndedPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
  const [pending, setPending] = useState<SliceState>(() => makeSliceState());
  const [ended, setEnded] = useState<SliceState>(() => makeSliceState());
  const [notifyingIds, setNotifyingIds] = useState<Set<string>>(new Set());
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<BatchProgress | null>(null);
  const progressRef = useRef<BatchProgress | null>(null);
  const [jobStatuses, setJobStatuses] = useState<Record<string, AnalysisJobState>>({});
  const [isNotifyRunning, setIsNotifyRunning] = useState(false);
  const [notifyProgress, setNotifyProgress] = useState<BatchProgress | null>(null);

  const listAbortRef = useRef<AbortController | null>(null);
  const pendingPollAbortRef = useRef<AbortController | null>(null);
  const batchStatusAbortRef = useRef<AbortController | null>(null);
  const notifyAbortCtrlRef = useRef<AbortController | null>(null);
  const abortBatchRef = useRef(false);
  const abortNotifyFlagRef = useRef(false);
  const batchPollTimerRef = useRef<number | null>(null);
  const pendingPollTimerRef = useRef<number | null>(null);
  const trackedIdsRef = useRef<string[]>([]);

  const setProgressSafe = useCallback(
    (value: BatchProgress | null | ((prev: BatchProgress | null) => BatchProgress | null)) => {
      setProgress((prev) => {
        const next = typeof value === 'function' ? value(prev) : value;
        progressRef.current = next;
        return next;
      });
    },
    [],
  );

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToastMessage(message);
    setToastType(type);
  }, []);

  const stopBatchPolling = useCallback(() => {
    if (batchPollTimerRef.current) {
      window.clearTimeout(batchPollTimerRef.current);
      batchPollTimerRef.current = null;
    }
    batchStatusAbortRef.current?.abort();
  }, []);

  const stopPendingPolling = useCallback(() => {
    if (pendingPollTimerRef.current) {
      window.clearTimeout(pendingPollTimerRef.current);
      pendingPollTimerRef.current = null;
    }
    pendingPollAbortRef.current?.abort();
  }, []);

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
        timeout: status === 'PENDING' ? 600000 : 300000,
        signal,
      });

      return {
        consultations: res.data?.consultations || [],
        total: Number(res.data?.total || 0),
      };
    },
    [searchQuery, typeFilter],
  );

  const fetchAll = useCallback(async () => {
    listAbortRef.current?.abort();
    const controller = new AbortController();
    listAbortRef.current = controller;

    setPending((s) => ({ ...s, loading: true, error: null }));
    setEnded((s) => ({ ...s, loading: true, error: null }));

    const [pendingRes, endedRes] = await Promise.allSettled([
      fetchSlice('PENDING', pendingPage, controller.signal),
      fetchSlice('COMPLETED', endedPage, controller.signal),
    ]);

    if (pendingRes.status === 'fulfilled') {
      setPending({
        consultations: pendingRes.value.consultations,
        total: pendingRes.value.total,
        loading: false,
        error: null,
        totalPages: Math.max(1, Math.ceil(pendingRes.value.total / ITEMS_PER_PAGE)),
      });
    } else if (!isAbortError(pendingRes.reason)) {
      setPending((s) => ({
        ...s,
        loading: false,
        error: getNiceError(pendingRes.reason),
      }));
    }

    if (endedRes.status === 'fulfilled') {
      setEnded({
        consultations: endedRes.value.consultations,
        total: endedRes.value.total,
        loading: false,
        error: null,
        totalPages: Math.max(1, Math.ceil(endedRes.value.total / ITEMS_PER_PAGE)),
      });
    } else if (!isAbortError(endedRes.reason)) {
      setEnded((s) => ({
        ...s,
        loading: false,
        error: getNiceError(endedRes.reason),
      }));
    }
  }, [endedPage, fetchSlice, pendingPage]);

  useEffect(() => {
    void fetchAll();
    return () => {
      listAbortRef.current?.abort();
    };
  }, [fetchAll]);

  useEffect(() => {
    if (pendingPage > pending.totalPages) {
      setPendingPage(Math.max(1, pending.totalPages));
    }
  }, [pendingPage, pending.totalPages]);

  useEffect(() => {
    if (endedPage > ended.totalPages) {
      setEndedPage(Math.max(1, ended.totalPages));
    }
  }, [endedPage, ended.totalPages]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => {
      setToastMessage(null);
    }, TOAST_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  // Polling global pour tous les onglets (pending, ended, notnotified)
  useEffect(() => {
    let disposed = false;

    const poll = async () => {
      if (disposed) return;
      if (typeof document !== 'undefined' && document.hidden) {
        pendingPollTimerRef.current = window.setTimeout(poll, PENDING_POLL_MS);
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
        pendingPollTimerRef.current = window.setTimeout(poll, PENDING_POLL_MS);
      }
    };

    void poll();

    return () => {
      disposed = true;
      if (pendingPollTimerRef.current) {
        window.clearTimeout(pendingPollTimerRef.current);
        pendingPollTimerRef.current = null;
      }
      listAbortRef.current?.abort();
    };
  }, [fetchAll]);

  const consultationsNotNotified = useMemo(() => {
    return (ended.consultations || []).filter((c) => {
      const isCompleted = c.status === 'COMPLETED';
      const isNotified = Boolean(c.analysisNotified);
      return isCompleted && !isNotified;
    });
  }, [ended.consultations]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchAll();
    } finally {
      window.setTimeout(() => setIsRefreshing(false), 450);
    }
  }, [fetchAll]);

  const handleGenerateAnalysis = useCallback(
    (id: string) => {
      router.push(`/admin/consultations/${id}`);
    },
    [router],
  );

  const handleNotifyUser = useCallback(
    async (consultationId: string) => {
      setNotifyingIds((prev) => {
        const next = new Set(prev);
        next.add(consultationId);
        return next;
      });

      try {
        await api.post(`/consultations/${consultationId}/notify-user`);
        showToast('Utilisateur notifié avec succès.', 'success');
        await handleRefresh();
      } catch (err: unknown) {
        showToast(getNiceError(err), 'error');
      } finally {
        setNotifyingIds((prev) => {
          const next = new Set(prev);
          next.delete(consultationId);
          return next;
        });
      }
    },
    [handleRefresh, showToast],
  );

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
      const response = await api.post<AnalysisJobsStatusesResponse>(
        '/admin/consultations/analysis-jobs/statuses',
        { consultationIds: ids },
        { signal: controller.signal, timeout: 120000 },
      );

      const items = (response.data?.items || []) as AnalysisJobState[];
      const nextStatuses = Object.fromEntries(items.map((item) => [item.consultationId, item]));

      setJobStatuses((prev) => ({ ...prev, ...nextStatuses }));

      const nextPendingIds: string[] = [];
      let allDoneAfterUpdate = false;
      let anyCompleted = false;

      setProgressSafe((prev) => {
        if (!prev) return prev;

        const nextResults = prev.results.map((result) => {
          const state = nextStatuses[result.id];

          if (!state) return result;

          if (state.status === 'COMPLETED') {
            anyCompleted = true;
            return {
              ...result,
              success: true,
              status: 'COMPLETED' as const,
              error: undefined,
            };
          }

          if (state.status === 'FAILED') {
            return {
              ...result,
              success: false,
              status: 'FAILED' as const,
              error: state.errorMessage || 'Erreur inconnue',
            };
          }

          if (state.status === 'QUEUED' || state.status === 'PROCESSING') {
            nextPendingIds.push(state.consultationId);
            return {
              ...result,
              status: state.status,
            };
          }

          return result;
        });

        allDoneAfterUpdate =
          nextResults.length > 0 && nextResults.every((r) => isBatchResultResolved(r));

        return {
          ...prev,
          current: nextResults.filter(isBatchResultResolved).length,
          results: nextResults,
        };
      });

      trackedIdsRef.current = uniq(nextPendingIds);

      // Rafraîchir la liste dès qu’un job passe à COMPLETED
      if (anyCompleted) {
        await handleRefresh();
      }

      if (!trackedIdsRef.current.length && allDoneAfterUpdate) {
        stopBatchPolling();
        setIsRunning(false);
        showToast('La génération asynchrone est terminée.', 'success');
        if (!anyCompleted) {
          await handleRefresh();
        }
        return;
      }
    } catch (err) {
      if (abortBatchRef.current || isAbortError(err)) {
        stopBatchPolling();
        return;
      }
    }

    stopBatchPolling();
    batchPollTimerRef.current = window.setTimeout(() => {
      void pollStatuses();
    }, POLL_INTERVAL_MS);
  }, [handleRefresh, setProgressSafe, showToast, stopBatchPolling]);

  const handleRetryAnalysis = useCallback(
    async (id: string) => {
      try {
        const response = await api.post<AnalysisJobResponse>('/admin/consultations/analysis-jobs', {
          consultationIds: [id],
        });

        // Correction : gestion explicite des cas où le backend ne traite pas le job
        const items = response.data?.items || [];
        const item = items[0];
        const status = (item?.status || null) as JobStatus;

        // Si aucun job accepté ou item vide, afficher une erreur explicite
        if (!items.length || (typeof response.data === 'object' && 'accepted' in response.data && (response.data as any).accepted === 0)) {
          showToast("Aucune tâche n'a été acceptée par le backend. Vérifiez que le worker est bien lancé sur le serveur.", 'error');
          throw new Error("Aucune tâche n'a été acceptée par le backend.");
        }

        setJobStatuses((prev) => ({
          ...prev,
          [id]: {
            consultationId: id,
            jobId: item?.jobId || prev[id]?.jobId || id,
            status,
            attempts: (prev[id]?.attempts || 0) + 1,
            errorMessage: item?.error || null,
            startedAt: prev[id]?.startedAt || null,
            finishedAt: null,
            dateGeneration: prev[id]?.dateGeneration || null,
            hasResult: false,
          },
        }));

        setProgressSafe((prev) => {
          if (!prev) return prev;

          const exists = prev.results.some((r) => r.id === id);
          const nextResult: BatchResult = {
            id,
            title:
              prev.results.find((r) => r.id === id)?.title ||
              `Consultation #${String(id).slice(-6)}`,
            success: Boolean(item?.success),
            status,
            error: item?.error,
          };

          const nextResults = exists
            ? prev.results.map((r) => (r.id === id ? nextResult : r))
            : [...prev.results, nextResult];

          return {
            ...prev,
            total: Math.max(prev.total, nextResults.length),
            results: nextResults,
            current: nextResults.filter(isBatchResultResolved).length,
          };
        });

        if (!item?.success) {
          throw new Error(item?.error || 'Erreur inconnue');
        }

        if (status === 'QUEUED' || status === 'PROCESSING') {
          trackedIdsRef.current = uniq([...trackedIdsRef.current, id]);
          abortBatchRef.current = false;
          setIsRunning(true);
          showToast('La relance a été ajoutée à la file de traitement.', 'info');
          stopBatchPolling();
          void pollStatuses();
          return;
        }

        if (status === 'COMPLETED') {
          showToast('Analyse relancée avec succès.', 'success');
          await handleRefresh();
        }
      } catch (err: unknown) {
        const message = getNiceError(err);

        setJobStatuses((prev) => ({
          ...prev,
          [id]: {
            consultationId: id,
            jobId: prev[id]?.jobId || id,
            status: 'FAILED',
            attempts: prev[id]?.attempts || 1,
            errorMessage: message,
            startedAt: prev[id]?.startedAt || null,
            finishedAt: prev[id]?.finishedAt || null,
            dateGeneration: prev[id]?.dateGeneration || null,
            hasResult: false,
          },
        }));

        setProgressSafe((prev) => {
          if (!prev) return prev;

          const exists = prev.results.some((r) => r.id === id);
          const failedResult: BatchResult = {
            id,
            title:
              prev.results.find((r) => r.id === id)?.title ||
              `Consultation #${String(id).slice(-6)}`,
            success: false,
            status: 'FAILED',
            error: message,
          };

          const nextResults = exists
            ? prev.results.map((r) => (r.id === id ? failedResult : r))
            : [...prev.results, failedResult];

          return {
            ...prev,
            results: nextResults,
            current: nextResults.filter(isBatchResultResolved).length,
          };
        });

        showToast(message, 'error');
        throw err;
      }
    },
    [handleRefresh, pollStatuses, setProgressSafe, showToast, stopBatchPolling],
  );

  const handleToastClose = useCallback(() => {
    setToastMessage(null);
  }, []);

  const startBatchNotify = useCallback(async () => {
    const list = consultationsNotNotified || [];
    if (list.length === 0) {
      showToast('Aucune consultation à notifier.', 'info');
      return;
    }

    abortNotifyFlagRef.current = false;
    notifyAbortCtrlRef.current?.abort();
    notifyAbortCtrlRef.current = new AbortController();

    setIsNotifyRunning(true);

    const total = list.length;
    const totalBatches = Math.ceil(total / BATCH_SIZE);
    const results: BatchResult[] = [];

    setNotifyProgress({
      current: 0,
      total,
      currentBatch: 0,
      totalBatches,
      results: [],
    });

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      if (abortNotifyFlagRef.current) break;

      const batchStart = batchIndex * BATCH_SIZE;
      const batch = list.slice(batchStart, batchStart + BATCH_SIZE);

      setNotifyProgress((prev) =>
        prev
          ? {
            ...prev,
            currentBatch: batchIndex + 1,
          }
          : prev,
      );

      for (let i = 0; i < batch.length; i++) {
        if (abortNotifyFlagRef.current) break;

        const c = batch[i];
        const globalIndex = batchStart + i + 1;

        setNotifyProgress((prev) =>
          prev
            ? {
              ...prev,
              current: globalIndex,
            }
            : prev,
        );

        setNotifyingIds((prev) => {
          const next = new Set(prev);
          next.add(c._id);
          return next;
        });

        try {
          await api.post(
            `/consultations/${c._id}/notify-user`,
            {},
            {
              timeout: 180000,
              signal: notifyAbortCtrlRef.current?.signal,
            },
          );

          results.push({
            id: c._id,
            title: c.title || `Consultation #${String(c._id).slice(-6)}`,
            success: true,
            notified: true,
          });
        } catch (err: unknown) {
          if (isAbortError(err)) {
            abortNotifyFlagRef.current = true;
            break;
          }

          results.push({
            id: c._id,
            title: c.title || `Consultation #${String(c._id).slice(-6)}`,
            success: false,
            error: getNiceError(err),
          });
        } finally {
          setNotifyingIds((prev) => {
            const next = new Set(prev);
            next.delete(c._id);
            return next;
          });

          setNotifyProgress((prev) =>
            prev
              ? {
                ...prev,
                results: [...results],
              }
              : prev,
          );
        }
      }

      if (!abortNotifyFlagRef.current) {
        await handleRefresh();
      }
    }

    setIsNotifyRunning(false);

    if (abortNotifyFlagRef.current) {
      showToast('La notification batch a été arrêtée.', 'info');
    } else {
      showToast('La notification batch est terminée.', 'success');
    }
  }, [consultationsNotNotified, handleRefresh, showToast]);

  const stopBatchNotify = useCallback(() => {
    abortNotifyFlagRef.current = true;
    notifyAbortCtrlRef.current?.abort();
    showToast('Arrêt de la notification batch en cours…', 'info');
  }, [showToast]);

  const clearNotifyProgress = useCallback(() => {
    setNotifyProgress(null);
  }, []);

  useEffect(() => {
    return () => {
      stopBatchPolling();
      stopPendingPolling();
      listAbortRef.current?.abort();
      notifyAbortCtrlRef.current?.abort();
      abortBatchRef.current = true;
      abortNotifyFlagRef.current = true;
    };
  }, [stopBatchPolling, stopPendingPolling]);

  // Arrêt auto du batch si la liste en attente devient vide
  useEffect(() => {
    if (isRunning && pending.consultations.length === 0) {
      setIsRunning(false);
      setProgressSafe(null);
    }
  }, [isRunning, pending.consultations.length, setProgressSafe]);

  // Filet de sécurité : forcer l'arrêt si tous les jobs sont terminés mais isRunning reste true
  useEffect(() => {
    if (
      isRunning &&
      progress &&
      progress.results.length > 0 &&
      progress.results.every((r) => r.status === 'COMPLETED' || r.status === 'FAILED')
    ) {
      setIsRunning(false);
    }
  }, [isRunning, progress]);


  const loading = pending.loading || ended.loading;
  const error = pending.error || ended.error;

  return {
    isNotifyRunning, notifyProgress, consultationsNotNotified, error,
    loading, isRefreshing, jobStatuses, toastMessage, toastType, notifyingIds,
    handleToastClose, handleRefresh, handleNotifyUser, startBatchNotify,
    stopBatchNotify, clearNotifyProgress, handleGenerateAnalysis, handleRetryAnalysis,
  };
}