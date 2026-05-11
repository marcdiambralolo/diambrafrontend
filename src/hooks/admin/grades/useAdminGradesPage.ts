import { gradeConfigService } from '@/lib/api/services/grade-config.service';
import { GradeConfig, UpdateGradeConfigDto } from '@/lib/types/grade-config.types';
import { getErrorMessage } from '@/lib/utils/errorHelpers';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type BannerType = 'success' | 'error' | 'info';
export type BannerState = { type: BannerType; message: string } | null;

export function useAdminGradesPage() {
  const [gradeConfigs, setGradeConfigs] = useState<GradeConfig[]>([]);
  const [gradesLoading, setGradesLoading] = useState(true);
  const [gradesError, setGradesError] = useState<string | null>(null);
  const [banner, setBanner] = useState<BannerState>(null);
  const bannerTimer = useRef<number | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const showBanner = useCallback((b: BannerState) => {
    if (bannerTimer.current) window.clearTimeout(bannerTimer.current);
    setBanner(b);
    if (b) {
      bannerTimer.current = window.setTimeout(() => setBanner(null), 3500);
    }
  }, []);

  const fetchGrades = useCallback(async () => {
    setGradesLoading(true);
    setGradesError(null);
    try {
      const data = await gradeConfigService.getAllGradeConfigs();
      const sorted = data.sort((a, b) => a.level - b.level);
      setGradeConfigs(sorted);
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err, 'Impossible de charger les grades.');
      setGradesError(errorMsg);
      showBanner({ type: 'error', message: `Erreur: ${errorMsg}` });
    } finally {
      setGradesLoading(false);
    }
  }, [showBanner]);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  const gradesById = useMemo(() => {
    const map = new Map<string, GradeConfig>();
    gradeConfigs.forEach((g) => map.set(g._id, g));
    
    return map;
  }, [gradeConfigs]);

  const updateGrade = useCallback(
    async (id: string, data: UpdateGradeConfigDto) => {
      try {
        const currentGrade = gradesById.get(id);

        if (!currentGrade) {
          showBanner({ type: 'error', message: 'Grade introuvable.' });
          return;
        }

        await gradeConfigService.updateGradeConfig(id, data);
        setEditingId(null);
        showBanner({ type: 'success', message: 'Grade mis à jour avec succès.' });
        await fetchGrades();
      } catch (err: unknown) {
        const errorMsg = getErrorMessage(err, 'Erreur lors de la mise à jour.');
        showBanner({ type: 'error', message: errorMsg });
      }
    },
    [gradesById, fetchGrades, showBanner]
  );

  const startEdit = useCallback((id: string) => {
    setEditingId(id);
  }, []);

  const stopEdit = useCallback(() => {
    setEditingId(null);
  }, []);

  return {
    gradeConfigs, gradesLoading, gradesError, banner, gradesById, editingId,
    fetchGrades, updateGrade, startEdit, stopEdit,
  };
}