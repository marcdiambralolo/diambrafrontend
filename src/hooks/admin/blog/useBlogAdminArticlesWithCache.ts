import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { QUERY_KEYS } from '@/lib/cache/queryClient';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { buildUrl } from '@/lib/functions';
import type { Article } from '@/lib/interfaces';
import { useAdminArticleListState } from './useAdminArticleListState';
import { CONSTANTS } from '@/components/admin/blog/BlogAdmin';

type Filter = 'all' | 'published' | 'draft';
type View = 'list' | 'create' | 'edit';

export type ArticleHelpers = {
  asDate: (iso?: string) => string;
};

export type ArticleMutationInput = {
  title: string;
  content: string;
  published: boolean;
  illustration?: File | null;
};

function asDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function makeReturnTo(params: URLSearchParams) {
  const sp = new URLSearchParams(params);
  sp.delete('view');
  sp.delete('id');
  sp.delete('returnTo');
  sp.set('view', 'list');
  return sp.toString();
}

function normalizeFilter(x: string | null): Filter {
  return x === 'published' || x === 'draft' ? x : 'all';
}

export function isLongContent(content: string) {
  const normalized = (content ?? '').replace(/\r\n/g, '\n');
  const lines = normalized.split('\n').length;
  return normalized.length > 500 || lines > 10;
}

export function useBlogAdminArticlesWithCache() {
  const router = useRouter();
  const pathname = usePathname();
  const resolvedPathname = pathname || '/admin/blog';
  const searchParams = useSearchParams();
  const resolvedSearchParams = useMemo(
    () => new URLSearchParams(searchParams?.toString() || ''),
    [searchParams]
  );
  const queryClient = useQueryClient();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>();

  const {
    data: articlesRaw,
    isLoading: loading,
    error: queryError,
    refetch: refresh,
  } = useQuery<{ data: Article[] }>({
    queryKey: QUERY_KEYS.ADMIN_BLOG_ARTICLES,
    queryFn: async () => {
      const res = await api.get<{ data: Article[] }>('/blog');
      if (res && res.data && Array.isArray(res.data.data)) {
        return res.data;
      }
      return { data: [] };
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  const articles = useMemo<Article[]>(() => {
    return Array.isArray(articlesRaw?.data) ? articlesRaw.data : [];
  }, [articlesRaw]);

  const [filter, setFilterState] = useState<Filter>(() => normalizeFilter(resolvedSearchParams.get('filter')));
  const [q, setQState] = useState(() => resolvedSearchParams.get('q') || '');

  const updateQuery = useCallback(
    (patch: Record<string, string | undefined>) => {
      const sp = new URLSearchParams(resolvedSearchParams.toString());
      Object.entries(patch).forEach(([k, v]) => {
        if (v === undefined || v === null || String(v).length === 0) sp.delete(k);
        else sp.set(k, String(v));
      });
      router.replace(`${resolvedPathname}?${sp.toString()}`, { scroll: false });
    },
    [resolvedPathname, resolvedSearchParams, router]
  );

  const setFilter = useCallback(
    (f: Filter) => {
      setFilterState(f);
      updateQuery({ filter: f === 'all' ? undefined : f });
    },
    [updateQuery]
  );

  const setQ = useCallback(
    (qq: string) => {
      setQState(qq);
      updateQuery({ q: qq || undefined });
    },
    [updateQuery]
  );

  const urlView = (resolvedSearchParams.get('view') as View) || 'list';
  const urlId = resolvedSearchParams.get('id');
  const urlReturnTo = resolvedSearchParams.get('returnTo');

  const goList = useCallback(() => {
    setError(null);
    if (urlReturnTo) {
      router.push(`${resolvedPathname}?${urlReturnTo}`, { scroll: false });
      return;
    }
    router.push(buildUrl(resolvedPathname, { view: 'list', filter, q }), { scroll: false });
  }, [filter, q, resolvedPathname, router, setError, urlReturnTo]);

  const goCreate = useCallback(() => {
    setError(null);
    const returnTo = makeReturnTo(new URLSearchParams(resolvedSearchParams.toString()));
    router.push(buildUrl(resolvedPathname, { view: 'create', filter, q, returnTo }), { scroll: false });
  }, [filter, q, resolvedPathname, resolvedSearchParams, router, setError]);

  const goEdit = useCallback((a: Article) => {
    setError(null);
    const returnTo = makeReturnTo(new URLSearchParams(resolvedSearchParams.toString()));
    router.push(buildUrl(resolvedPathname, { view: 'edit', id: a._id, filter, q, returnTo }), { scroll: false });
  }, [filter, q, resolvedPathname, resolvedSearchParams, router, setError]);

  const createArticle = useCallback(async (input: ArticleMutationInput): Promise<Article | undefined> => {
    setSaving(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('title', input.title);
      fd.append('content', input.content);
      fd.append('published', String(input.published));
      if (input.illustration) fd.append('illustration', input.illustration);
      const res = await api.post('/blog', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_BLOG_ARTICLES });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BLOG_POSTS });
      return res.data as Article | undefined;
    } finally {
      setSaving(false);
    }
  }, [queryClient]);

  const updateArticle = useCallback(async (id: string, input: ArticleMutationInput): Promise<Article | undefined> => {
    setSaving(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('title', input.title);
      fd.append('content', input.content);
      fd.append('published', String(input.published));
      if (input.illustration) fd.append('illustration', input.illustration);
      const res = await api.put(`/blog/${id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_BLOG_ARTICLES });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BLOG_POSTS });
      return res.data as Article | undefined;
    } finally {
      setSaving(false);
    }
  }, [queryClient]);

  const deleteArticle = useCallback(async (id: string) => {
    setSaving(true);
    setError(null);
    try {
      await api.delete(`/blog/${id}`);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_BLOG_ARTICLES });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BLOG_POSTS });
    } finally {
      setSaving(false);
    }
  }, [queryClient]);

  const [editingHydrated, setEditingHydrated] = useState<Article | null>(null);
  const editingFromList = useMemo(() => {
    if (urlView !== 'edit' || !urlId) return null;
    return articles.find((a: Article) => a._id === urlId) || null;
  }, [articles, urlId, urlView]);

  const editing = editingFromList ?? editingHydrated;

  const handleDelete = useCallback(async (a: Article) => {
    const ok = confirm(`Supprimer l'article “${a.title}” ?`);
    if (!ok) return;
    await deleteArticle(a._id);
    if (urlView === 'edit' && urlId === a._id) {
      setEditingHydrated(null);
      goList();
    }
  }, [deleteArticle, goList, urlId, urlView]);

  const stats = useMemo(() => {
    const published = articles.filter((a: Article) => a.published).length;
    const draft = articles.length - published;
    return { total: articles.length, published, draft };
  }, [articles]);

  const helpers: ArticleHelpers = useMemo(() => ({ asDate }), []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return articles
      .filter((a: Article) => (filter === 'all' ? true : filter === 'published' ? a.published : !a.published))
      .filter((a: Article) => (!query ? true : (a.title || '').toLowerCase().includes(query)));
  }, [articles, filter, q]);

  const isEditorView = urlView !== 'list';

  const { expandedById, toggleExpand, emptyState } = useAdminArticleListState(filtered, loading);

  const handleSearch = useCallback((value: string) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => {
      setQ(value);
      updateQuery({ q: value });
    }, CONSTANTS.DEBOUNCE_DELAY_MS));
  }, [setQ, updateQuery, searchTimeout]);

  const handleDeleteWithLoading = useCallback(async (article: Article) => {
    if (!confirm(`Supprimer l'article "${article.title}" ?`)) return;
    setDeletingId(article._id);
    try {
      await handleDelete(article);
    } finally {
      setDeletingId(null);
    }
  }, [handleDelete]);

  return {
    goList, goCreate, goEdit, setError, refresh, handleSearch, setFilter,
    handleDeleteWithLoading, toggleExpand, createArticle, updateArticle,
    error: error || queryError, urlView, urlId, q, stats, loading, saving,
    deletingId, isEditorView, editing, filtered, expandedById, emptyState, helpers,
  };
}