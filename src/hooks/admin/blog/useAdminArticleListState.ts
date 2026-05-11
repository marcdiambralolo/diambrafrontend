import { useState, useMemo } from 'react';
import type { Article } from '@/lib/interfaces';

export function useAdminArticleListState(articles: Article[], loading: boolean) {
  const [expandedById, setExpandedById] = useState<Record<string, boolean>>({});

  const emptyState = useMemo(() => {
    if (loading) return 'Chargement des articles…';

    if (articles.length === 0) return 'Aucun article pour ce filtre.';

    return null;
  }, [articles.length, loading]);

  const toggleExpand = (id: string) => {
    setExpandedById(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return { expandedById, toggleExpand, emptyState };
}