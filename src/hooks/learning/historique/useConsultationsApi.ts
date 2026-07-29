import { api } from "@/lib/api/client";
import { Consultation } from "@/lib/interfaces";
import { Edition, GameStats } from "@/lib/learning/interface";
import { useCallback, useEffect, useRef, useState } from "react";

interface ApiResponse {
    latestEdition?: Edition;
    stats?: GameStats;
    consultations?: Consultation[];
}

export function useConsultationsApi() {
    const [data, setData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isMountedRef = useRef(true);
    const abortControllerRef = useRef<AbortController | null>(null);
    const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const fetchConsultations = useCallback(async () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        if (fetchTimeoutRef.current) {
            clearTimeout(fetchTimeoutRef.current);
            fetchTimeoutRef.current = null;
        }

        abortControllerRef.current = new AbortController();
        setLoading(true);
        setError(null);

        try {
            const response = await api.get("/admin/last-ended-learning/stats", {
                signal: abortControllerRef.current.signal,
            });

            if (isMountedRef.current) {
                setData(response.data as ApiResponse);
            }
        } catch (err: any) {
            if (err?.name === "AbortError" || err?.code === "ERR_CANCELED") return;

            console.error("❌ Erreur fetchConsultations:", err);
            if (isMountedRef.current) {
                setError(err?.message || "Erreur lors du chargement des données");
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
            abortControllerRef.current = null;
        }
    }, []);

    const refetch = useCallback(async () => {
        if (fetchTimeoutRef.current) {
            clearTimeout(fetchTimeoutRef.current);
        }

        return new Promise<void>((resolve) => {
            fetchTimeoutRef.current = setTimeout(async () => {
                await fetchConsultations();
                resolve();
                fetchTimeoutRef.current = null;
            }, 300);
        });
    }, [fetchConsultations]);

    useEffect(() => {
        isMountedRef.current = true;
        fetchConsultations();

        return () => {
            isMountedRef.current = false;
            if (abortControllerRef.current) abortControllerRef.current.abort();
            if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
        };
    }, [fetchConsultations]);

    return { data, loading, error, refetch };
}