'use client';
import { blogService } from '@/lib/api/services/blog.service';
import { QUERY_KEYS } from '@/lib/cache/queryClient';
import { getPageNumbers } from '@/lib/functions';
import { GRADE_LEVEL, User } from '@/lib/interfaces';
import { useAuthStore } from '@/lib/store/auth.store';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

export function formatDateFR(iso: string | Date) {
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });
  } catch {
    return '—';
  }
}

function resolveUserGrade(user: User | null | undefined): string | null {
  if (!user?.grade) return null;
  if (typeof user.grade === "object" && user.grade !== null && "grade" in user.grade) {
    return user.grade.grade ?? null;
  }
  if (typeof user.grade === "string") {
    return user.grade;
  }
  return null;
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const ONE_WEEK_MS = 1000 * 60 * 60 * 24 * 7;
const PAGE_SIZE = 6;

export function useBlogList() {
  const user = useAuthStore((s) => s.user);

  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: [...QUERY_KEYS.BLOG_POSTS, page],
    queryFn: () => blogService.getAll(page, PAGE_SIZE),
    staleTime: ONE_WEEK_MS,
    gcTime: ONE_WEEK_MS,
  });

  const posts = data?.data || [];
  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;
  const currentPage = data?.page || page;

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const onPrev = () => setPage((prevPage) => Math.max(1, prevPage - 1));

  const onNext = () => setPage((prevPage) => Math.min(totalPages, prevPage + 1));

  const onPage = (nextPage: number) => setPage(nextPage);

  const pages = getPageNumbers(currentPage, totalPages);

  const resolvedGrade = useMemo(() => resolveUserGrade(user) ?? 'NEOPHYTE', [user]);
  const userLevel = GRADE_LEVEL[resolvedGrade as keyof typeof GRADE_LEVEL] ?? 0;
  const hasAccess = userLevel >= 2;

  return {
    onNext, onPage, onPrev, refetch,
    paginatedPosts: posts, totalPages, isLoading, currentPage, error,
    pages, isError, isSuccess, hasAccess, userLevel,
  };
}