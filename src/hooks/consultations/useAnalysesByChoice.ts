"use client";
import { useQuery } from "@tanstack/react-query";
import { analysesService, type AnalysisByChoiceResponse } from "@/lib/api/services/analyses.service";
import { QUERY_KEYS } from "@/lib/cache/queryClient";
import type { Analysis, Consultation } from "@/lib/interfaces";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { getErrorMessage } from '@/lib/utils/errorHelpers';

function extractAnalysisText(consultation: Consultation): string {
  if (typeof consultation.result === 'string' && consultation.result.trim()) {
    return consultation.result.trim();
  }

  if (typeof consultation.result === 'object' && consultation.result !== null) {
    const resultRecord = consultation.result as Record<string, unknown>;
    const textValue = resultRecord.texte ?? resultRecord.text ?? resultRecord.analysis;
 
    if (typeof textValue === 'string' && textValue.trim()) {
      return textValue.trim();
    }
  }

  return consultation.description?.trim() || '';
}

export function useAnalysesByChoice() {
  const params = useParams();
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const choiceId = useMemo(() => {
    const value = typeof rawId === 'string' ? rawId : String(rawId ?? '');
    return value.trim() ? value : null;
  }, [rawId]);
  const query = useQuery<AnalysisByChoiceResponse>({
    queryKey: choiceId ? QUERY_KEYS.ANALYSES_BY_CHOICE(choiceId) : ['analyses', 'by-choice', 'missing'],
    queryFn: () => analysesService.getByChoice(choiceId as string),
    enabled: Boolean(choiceId),
  });

  const error = useMemo(() => {
    if (!choiceId) {
      return 'choiceId manquant';
    }

    if (!query.error) {
      return null;
    }

    return getErrorMessage(query.error, 'Impossible de récupérer les analyses');
  }, [choiceId, query.error]);

  const analyses = useMemo<Analysis[]>(() => {
    return (query.data?.consultations ?? []).map((consultation) => ({
      _id: consultation._id,
      id: typeof consultation.id === 'string' ? consultation.id : undefined,
      consultationId: consultation._id,
      createdAt: consultation.createdAt,
      updatedAt: consultation.updatedAt,
      dateGeneration: consultation.completedAt,
      texte: extractAnalysisText(consultation),
      title: consultation.title,
      description: consultation.description,
      normalizedStatus: consultation.normalizedStatus,
      ui: consultation.ui,
    }));
  }, [query.data?.consultations]);

  return {
    loading: query.isLoading, error, data: query.data ?? null,
    total: query.data?.total ?? 0, analyses,
  };
}