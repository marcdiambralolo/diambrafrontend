import { api } from '@/lib/api/client';
import { type Analysis } from '@/lib/interfaces';
import { getErrorMessage } from '@/lib/utils/errorHelpers';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export function extractMarkdown(c: Analysis): string | null {
  const v = c?.texte ?? null;
  const s = typeof v === "string" ? v.trim() : "";
  return s ? s : null;
}

function getParamId(id: string | string[] | undefined): string | null {
  if (Array.isArray(id)) return id[0] || null;
  if (typeof id === 'string') return id;
  return null;
}

const CONSTANTS = {
  ERROR: {
    MISSING_ID: 'ID de consultation manquant',
    ANALYSIS_NOT_FOUND: "Impossible de récupérer l'analyse",
    CONSULTATION_NOT_FOUND: "Cette consultation n'existe plus ou a été recréée. Retourne à la liste pour charger la version la plus récente.",
  },
  POLL_INTERVAL_MS: 5000,
};

type ResultState = {
  loading: boolean;
  error: string | null;
  analyse: Analysis | null;
  jobStatus: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | null;
};

const INITIAL_STATE: ResultState = {
  loading: true,
  error: null,
  analyse: null,
  jobStatus: null,
};

export function useConsultationResult() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const consultationId = useMemo(() => getParamId(params?.id), [params]);
  const retour = useMemo(() => searchParams?.get('retour') || '', [searchParams]);

  const [state, setState] = useState<ResultState>(INITIAL_STATE);

  const jobCreatedRef = useRef(false);

  const fetchAnalysis = useCallback(async () => {
    if (!consultationId) {
      setState({ ...INITIAL_STATE, loading: false, error: CONSTANTS.ERROR.MISSING_ID });
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const response = await api.get(`/analyses/by-consultation/${consultationId}`);
      const data = response.data as unknown;
      if (
        data && typeof data === 'object' && 'analysis' in data && data.analysis
      ) {
        setState({ loading: false, error: null, analyse: data.analysis as Analysis, jobStatus: 'COMPLETED' });
      } else {
        setState((s) => ({ ...s, error: CONSTANTS.ERROR.ANALYSIS_NOT_FOUND, loading: false }));
      }
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setState((s) => ({ ...s, analyse: null, jobStatus: 'QUEUED', loading: false }));
      } else {
        setState((s) => ({ ...s, error: getErrorMessage(err, CONSTANTS.ERROR.ANALYSIS_NOT_FOUND), loading: false }));
      }
    }
  }, [consultationId]);


  // Initial fetch uniquement
  useEffect(() => {
    jobCreatedRef.current = false;
    fetchAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consultationId]);

  useEffect(() => {
    const shouldPoll = consultationId &&
      (!state.analyse || !state.analyse.texte || state.analyse.status !== 'COMPLETED') &&
      !state.error;

    if (!shouldPoll) return;

    const timer = setTimeout(() => {
      fetchAnalysis();
    }, CONSTANTS.POLL_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [consultationId, state.analyse, state.error, fetchAnalysis]);

  const handleBack = useCallback(() => {
    if (retour === 'cinqportes') {
      router.replace('/star/cinqportes');
    } else {
      router.replace(retour ? retour : '/star/consultations');
    }
  }, [retour, router]);

  const markdown = useMemo(() =>
    state.analyse ? extractMarkdown(state.analyse) : null,
    [state.analyse]
  );

  return { markdown, loading: state.loading, error: state.error, handleBack, };
}