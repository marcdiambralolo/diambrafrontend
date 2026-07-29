import { Consultation } from "@/lib/interfaces";
import { extractSecondsFromTimeSpent } from "@/lib/learning/functions";
import { DuplicateInfo } from "@/lib/learning/interface";
import { useMemo } from "react";

export const timeCache = new Map<string, number>();

export const getCachedTime = (timeSpent: string | undefined): number => {
  if (!timeSpent) return 0;

  if (timeCache.has(timeSpent)) {
    return timeCache.get(timeSpent)!;
  }

  const seconds = extractSecondsFromTimeSpent(timeSpent);
  timeCache.set(timeSpent, seconds);
  return seconds;
};

export function useConsultationDuplicates(rawConsultations: Consultation[] = []) {
  return useMemo(() => {
    if (rawConsultations.length === 0) {
      return {
        sortedConsultations: [],
        duplicateMap: new Map<string, DuplicateInfo>(),
      };
    }

    const sortedConsultations = [...rawConsultations].sort((a, b) => {
      return getCachedTime(b.timeSpent) - getCachedTime(a.timeSpent);
    });

    const combinaisonMap = new Map<string, { count: number; totalTimeSpent: number }>();

    for (const consultation of sortedConsultations) {
      const comb = consultation.timeSpent || "0";
      const seconds = getCachedTime(consultation.timeSpent);

      const existing = combinaisonMap.get(comb);
      if (existing) {
        existing.count += 1;
        existing.totalTimeSpent += seconds;
      } else {
        combinaisonMap.set(comb, { count: 1, totalTimeSpent: seconds });
      }
    }

    const duplicateMap = new Map<string, DuplicateInfo>();

    for (const [comb, { count, totalTimeSpent }] of combinaisonMap) {
      duplicateMap.set(comb, {
        count,
        isDuplicate: count >= 2,
        totalTimeSpent,
      });
    }

    return { sortedConsultations, duplicateMap };
  }, [rawConsultations]);
}