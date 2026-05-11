import { useAuth } from '@/lib/auth/AuthContext';
import { GRADE_LEVEL } from '@/lib/interfaces';
import { useMemo } from 'react';

export function useRequireGrade(minLevel: number) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const userLevel = useMemo(() => {
    if (!user?.grade || !user.grade.key) return 0;
    return GRADE_LEVEL[user.grade.key] ?? 0;
  }, [user]);

  const hasAccess = isAuthenticated && userLevel >= minLevel;
  return { hasAccess, isLoading, userLevel, grade: user?.grade?.name ?? null };
}
