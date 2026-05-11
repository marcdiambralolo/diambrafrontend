import { api } from "@/lib/api/client";
import { offeringsService } from '@/lib/api/services/offerings.service';
import type { Offering, Rubrique } from '@/lib/interfaces';
import { useMonEtoileStore } from '@/lib/store/monetoile.store';
import type { GradeConfig } from '@/lib/types/grade-config.types';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function useToast() {
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  return { toast, showToast, hideToast, setToast };
}

export function useAdminRubriquesListPage() {
  const router = useRouter();
  const params = useParams();
  const rubriqueId = params?.id as string;

  const grades = useMonEtoileStore(s => s.grades) as GradeConfig[];
  const setGrades = useMonEtoileStore((s) => s.setGrades);
  const [rubriques, setRubriques] = useState<Rubrique[]>([]);
  const [editingRubrique, setEditingRubrique] = useState<Rubrique | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [offeringsLoading, setOfferingsLoading] = useState<boolean>(false);
  const { toast, setToast } = useToast();
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (grades && grades.length > 0) {
      setGrades(grades);
    }
  }, [grades, setGrades]);

  const handleBackToList = useCallback(() => {
    router.push("/admin/rubriques");
  }, [router]);

  useEffect(() => {
    const fetchOfferings = async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setOfferingsLoading(true);
      try {
        const data = await offeringsService.list();
        if (isMountedRef.current) {
          setOfferings(data);
        }
      } catch (error) {
        if ((error as Error)?.name !== 'AbortError') {
          console.error('Erreur chargement offrandes:', error);
        }
      } finally {
        if (isMountedRef.current) {
          setOfferingsLoading(false);
        }
      }
    };

    fetchOfferings();
  }, []);

  const fetchRubriques = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    try {
      const response = await api.get<Rubrique[]>("/rubriques");
       if (isMountedRef.current) {
        setRubriques(response.data);
      }
    } catch (error) {
      if ((error as Error)?.name !== 'AbortError') {
        console.error('Erreur chargement rubriques:', error);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchRubriques();
  }, [fetchRubriques]);

  useEffect(() => {
    if (rubriqueId && rubriques.length > 0 && isMountedRef.current) {
      const found = rubriques.find(r => r._id === rubriqueId);
      setEditingRubrique(found || null);
    }
  }, [rubriqueId, rubriques]);

  const [expandedChoice, setExpandedChoice] = useState<string | null>(null);
  const [hoveredChoice, setHoveredChoice] = useState<string | null>(null);

  const choices = useMemo(() => {
    return editingRubrique?.consultationChoices || [];
  }, [editingRubrique]);

  return {
    handleBackToList, setExpandedChoice, setHoveredChoice, setToast,
    offerings, loading, offeringsLoading, editingRubrique,
    toast, choices, expandedChoice, hoveredChoice,
  };
}