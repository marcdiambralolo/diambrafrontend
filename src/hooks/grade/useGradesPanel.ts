import { gradeConfigService } from '@/lib/api/services/grade-config.service';
import { QUERY_KEYS } from '@/lib/cache/queryClient';
import { GRADE_LEVEL, LEVEL_TO_KEY,STAGES  } from '@/lib/interfaces';
import type { GradeConfig } from '@/lib/types/grade-config.types';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRequireGrade } from '../auth/useRequireGrade';

// ==================== CONSTANTES ====================
type GradeKey = keyof typeof GRADE_LEVEL;

const CONSTANTS = {
  OPEN_DEFAULT_MASK: (1 << 0) | (1 << 1),
  ALL_OPEN_MASK: (1 << 10) - 1,
  AUTO_FOCUS_DELAY_MS: 120,
  GRADES_STALE_TIME_MS: 10 * 60 * 1000, // 10 minutes
  GRADES_GC_TIME_MS: 30 * 60 * 1000,    // 30 minutes
} as const;

// ==================== HELPERS PURS ====================
const normalizeGradeKey = (input?: string | null): GradeKey | null => {
  if (!input) return null;

  const s = String(input).trim().toUpperCase();

  // Cas spéciaux
  if (s === 'MAITRE_DE_SOI' || s === 'MAITRE-DE-SOI') return 'MAITRE_DE_SOI';
  if (s === 'EVEILLE' || s === 'ÉVEILLÉ' || s === 'EVEILLÉ') return 'EVEILLE';
  if (s === 'ALIGNE' || s === 'ALIGNÉ' || s === 'ALIGNÉ') return 'ALIGNE';

  // Vérification générique
  return s in GRADE_LEVEL ? s as GradeKey : null;
};

const getGradeElementId = (level: number): string => `grade-${LEVEL_TO_KEY[level]}`;

const scrollToGradeElement = (level: number): void => {
  const elementId = getGradeElementId(level);
  const element = document.getElementById(elementId);

  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

export function useOpenMask(initialMask = CONSTANTS.OPEN_DEFAULT_MASK) {
  const [mask, setMask] = useState<number>(initialMask);

  const isOpen = useCallback((level: number) => (mask & (1 << level)) !== 0, [mask]);

  const toggle = useCallback((level: number) => {
    setMask(prevMask => prevMask ^ (1 << level));
  }, []);

  const openOne = useCallback((level: number) => {
    setMask(prevMask => prevMask | (1 << level));
  }, []);

  const expandAll = useCallback(() => setMask(CONSTANTS.ALL_OPEN_MASK), []);
  const collapseAll = useCallback(() => setMask(0), []);

  return {
    mask,
    isOpen,
    toggle,
    openOne,
    expandAll,
    collapseAll,
    setMask,
  };
}

/**
 * Hook principal pour le panel des grades
 */
export function useGradesPanel(autoFocusCurrent = true) {
  const { userLevel: currentLevel, grade: currentGrade } = useRequireGrade(0);
  const { isOpen, toggle, openOne, expandAll, collapseAll } = useOpenMask();

  // Refs pour éviter les re-renders inutiles
  const didAutoFocusRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mémorisation du grade actuel
  const currentKey = useMemo(() => normalizeGradeKey(currentGrade), [currentGrade]);

  // Query optimisée avec refetchOnWindowFocus désactivé
  const {
    data: grades = [],
    isLoading: gradesLoading,
    error
  } = useQuery<GradeConfig[], Error>({
    queryKey: QUERY_KEYS.GRADES,
    queryFn: gradeConfigService.getAllGradeConfigs,
    staleTime: CONSTANTS.GRADES_STALE_TIME_MS,
    gcTime: CONSTANTS.GRADES_GC_TIME_MS,
    refetchOnWindowFocus: false, // Optimisation : éviter les refetch inutiles
    retry: 1, // Une seule tentative en cas d'erreur
  });

  // Auto-focus sur le grade actuel
  useEffect(() => {
    if (!autoFocusCurrent || didAutoFocusRef.current) return;

    didAutoFocusRef.current = true;
    openOne(currentLevel);

    // Nettoyage du timeout précédent
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      scrollToGradeElement(currentLevel);
    }, CONSTANTS.AUTO_FOCUS_DELAY_MS);

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [autoFocusCurrent, currentLevel, openOne]);

  // Mémorisation des flags des grades (calcul intensif optimisé)
  const gradeFlags = useMemo(() => {
    // Pré-calcul des valeurs pour éviter les recalculs
    const isCurrentLevel = (level: number) => level === currentLevel;
    const isUnlocked = (level: number) => level <= currentLevel;

    return grades.map(grade => ({
      level: grade.level,
      opened: isOpen(grade.level),
      unlocked: isUnlocked(grade.level),
      isCurrent: isCurrentLevel(grade.level),
    }));
  }, [grades, currentLevel, isOpen]);

  // Mémorisation des points du stage 0 (valeur constante)
  const stage0Points = useMemo(() => STAGES?.[0]?.points ?? [], []);

  // Mémorisation de la description du grade actuel
  const currentGradeDescription = useMemo(() => {
    if (!grades.length) return '';

    const currentGradeConfig = grades.find(grade => grade.level === currentLevel);
    return currentGradeConfig?.description || '';
  }, [grades, currentLevel]);

  // Gestion d'erreur simplifiée
  const gradesError = error?.message || null;

  return {
    toggle, expandAll, collapseAll, currentKey, currentLevel, grades,
    gradesLoading, gradesError, gradeFlags, stage0Points, currentGradeDescription,
  } as const;
}