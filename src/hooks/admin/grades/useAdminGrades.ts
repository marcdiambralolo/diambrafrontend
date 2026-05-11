import { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';
import type { GradeConfig } from '@/lib/types/grade-config.types';
import { Grade } from '@/lib/types/grade.types';
import { getErrorMessage } from '@/lib/utils/errorHelpers';

type RawGradeConfig = Partial<GradeConfig> & {
  id?: string;
  label?: string;
};

function normalizeGrade(val: string | undefined | null): string {
  return (val ?? '').toString().trim().toUpperCase();
}

export function useAdminGrades() {
  const [grades, setGrades] = useState<GradeConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.get<RawGradeConfig[]>("/admin/grades")
      .then(res => {
        // Si l'API ne retourne pas déjà des GradeConfig, on mappe ici
        const mapped: GradeConfig[] = res.data.map((g) => ({
          _id: g._id || g.id || '',
          grade: normalizeGrade(g.grade || g.label) as Grade,
          level: g.level ?? 0,
          name: g.name || g.label || '',
          requirements: g.requirements || { consultations: 0, rituels: 0, livres: 0 },
          nextGradeId: g.nextGradeId ?? null,
          description: g.description,
          createdAt: g.createdAt,
          updatedAt: g.updatedAt,
        }));
        setGrades(mapped);
      })
      .catch(err => setError(getErrorMessage(err, "Erreur lors du chargement des grades")))
      .finally(() => setLoading(false));
  }, []);
  return { grades, loading, error };
}