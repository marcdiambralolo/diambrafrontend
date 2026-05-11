"use client";
import { formatDateFR } from "@/components/admin/consultations/DisplayConsultationCard/helpers";
import { api } from "@/lib/api/client";
import { safeTrim, wordCount } from "@/lib/functions";
import type { Analysis } from "@/lib/interfaces";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getErrorMessage } from '@/lib/utils/errorHelpers';

type RouteParams = Record<string, string | string[] | undefined>;

export interface ToastState {
  message: string;
  type: "success" | "error" | "info";
}

type AdminAnalysisState = {
  loading: boolean;
  error: string | null;
  toast: ToastState | null;
};

const initialState: AdminAnalysisState = {
  loading: true,
  error: null,
  toast: null,
};

function getConsultationIdFromParams(params: unknown): string | null {
  const raw = (params as RouteParams | null)?.id;
  if (!raw) return null;
  const v = Array.isArray(raw) ? raw[0] : raw;
  const s = typeof v === "string" ? v : String(v ?? "");
  return s.trim() ? s : null;
}


function isAbortError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;
  const maybeError = error as { name?: string; code?: string };
  return maybeError.name === 'CanceledError' || maybeError.name === 'AbortError' || maybeError.code === 'ERR_CANCELED';
}

function shallowEqualState(a: AdminAnalysisState, b: AdminAnalysisState) {
  return a.loading === b.loading && a.error === b.error && a.toast === b.toast;
}

export function useAdminConsultationAnalysis() {
  const router = useRouter();
  const params = useParams();

  const reqSeqRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const [state, setState] = useState<AdminAnalysisState>(initialState);
  const [analyse, setAnalyse] = useState<Analysis | null>(null);

  const consultationId = useMemo(() => getConsultationIdFromParams(params), [params]);

  const clearToastTimer = useCallback(() => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
  }, []);

  const setToast = useCallback(
    (toast: ToastState | null) => {
      clearToastTimer();

      setState((s) => {
        const next = s.toast === toast ? s : { ...s, toast };
        return shallowEqualState(s, next) ? s : next;
      });

      if (toast) {
        toastTimerRef.current = window.setTimeout(() => {
          setState((s) => (s.toast ? { ...s, toast: null } : s));
          toastTimerRef.current = null;
        }, 2500);
      }
    },
    [clearToastTimer],
  );

  const showToast = useCallback(
    (message: string, type: ToastState["type"] = "info") => setToast({ message, type }),
    [setToast],
  );

  const derived = useMemo(() => {
    const dateGenRaw = analyse?.dateGeneration ?? null;
    const dateGenLabel = formatDateFR(dateGenRaw);
    const isNotified = Boolean(analyse?.analysisNotified);

    return { dateGenLabel, isNotified };
  }, [analyse?.dateGeneration, analyse?.analysisNotified]);

  const loadAnalysis = useCallback(async () => {
    if (!consultationId) {
      setState((s) => {
        if (!s.loading && s.error === "ID de consultation manquant") return s;
        const next: AdminAnalysisState = {
          ...s,
          loading: false,
          error: "ID de consultation manquant",
        };
        return shallowEqualState(s, next) ? s : next;
      });
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const mySeq = ++reqSeqRef.current;

    setState((s) => (s.loading && s.error === null ? s : { ...s, loading: true, error: null }));

    try {
      const res = await api.get<{ analysis?: Analysis | null }>(`/analyses/by-consultation/${consultationId}`, {
        signal: controller.signal,
      });

      const data = res?.data?.analysis ?? null;
      if (reqSeqRef.current !== mySeq) return;
      setAnalyse(data);
      setState((s) => {
        const next: AdminAnalysisState = { ...s, loading: false, error: null };
        return shallowEqualState(s, next) ? s : next;
      });
    } catch (err: unknown) {
      if (isAbortError(err)) return;
      if (reqSeqRef.current !== mySeq) return;

      setState((s) => {
        const next: AdminAnalysisState = {
          ...s,
          loading: false,
          error: getErrorMessage(err, "Impossible de récupérer l'analyse"),
        };
        return shallowEqualState(s, next) ? s : next;
      });
    }
  }, [consultationId]);


  const hardNavigate = useCallback((url: string, mode: "replace" | "assign" = "assign") => {
    if (mode === "replace") {
      router.replace(url);
      router.refresh();
      return;
    }

    router.push(url);
  }, [router]);

  const handleBack = useCallback(() => {
    hardNavigate("/admin/consultations/", "assign");
  }, [hardNavigate]);

  const handleModifyAnalysis = useCallback(
    (id: string) => {
      hardNavigate(`/admin/genereanalyse?id=${encodeURIComponent(id)}`, "assign");
    },
    [hardNavigate],
  );

  const handleNotifyUser = useCallback(async () => {
    if (!consultationId) {
      showToast("❌ ID de consultation manquant", "error");
      return;
    }

    try {
      const res = await api.post(`/consultations/${consultationId}/notify-user`);
      if (res.status === 200 || res.status === 201) {
        showToast("📧 Notification envoyée avec succès !", "success");
        setAnalyse((prev) => (prev ? { ...prev, analysisNotified: true } : prev));
      } else {
        showToast("❌ Erreur lors de l'envoi", "error");
      }
    } catch {
      showToast("❌ Erreur lors de l'envoi", "error");
    }
  }, [consultationId, showToast]);

  const handleNotify = useCallback(() => {
    if (!consultationId || derived.isNotified) return;
    void handleNotifyUser();
  }, [consultationId, derived.isNotified, handleNotifyUser]);


  const handleRefresh = useCallback(() => {
    if (!consultationId) return;
    handleModifyAnalysis(consultationId);
  }, [consultationId, handleModifyAnalysis]);

  useEffect(() => {
    void loadAnalysis();
    return () => {
      abortRef.current?.abort();
      clearToastTimer();
    };
  }, [loadAnalysis, clearToastTimer]);

  const mdTexte = useMemo(() => safeTrim(analyse?.texte), [analyse?.texte]);
  const mdPrompt = useMemo(() => safeTrim(analyse?.prompt), [analyse?.prompt]);
  const mdTitle = useMemo(() => safeTrim(analyse?.title), [analyse?.title]);

  const metrics = useMemo(() => {

    return {
      wc: wordCount(mdTexte),
      pc: wordCount(mdPrompt),
    };
  }, [mdTexte, mdPrompt]);

  return {
    loading: state.loading, error: state.error, toast: state.toast,
    derived, mdTexte, mdPrompt, mdTitle, metrics,
    setToast, handleBack, handleRefresh, handleNotify,
  };
}