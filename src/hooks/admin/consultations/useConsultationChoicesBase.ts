import { api } from '@/lib/api/client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getErrorMessage } from '@/lib/utils/errorHelpers';
import { useConsultationChoicesFilter } from './useConsultationChoicesFilter';
import { ConsultationChoice } from '@/lib/interfaces';

export type ViewMode = 'list' | 'edit';

export type ChoiceWithRubriqueTitle = ConsultationChoice & { rubriqueTitle?: string };

export interface ConsultationChoiceWithPrompt {
  _id: string;
  title: string;
  rubriqueTitle?: string;
  prompt?: string;
  // Ajoute ici explicitement les propriétés attendues, ou utilise Partial<ConsultationChoice> si besoin
}

export function useConsultationChoicesBase<T extends ChoiceWithRubriqueTitle>(endpoint: string) {
  const [choices, setChoices] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<ViewMode>('list');
  const [editingChoice, setEditingChoice] = useState<T | null>(null);

  const fetchChoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<T[]>(endpoint);
      setChoices(response.data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Erreur lors du chargement'));
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchChoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const filteredChoices = useConsultationChoicesFilter(choices, search);
  const searchProps = useMemo(() => ({ search, setSearch }), [search, setSearch]);

  const handleEditPrompt = useCallback((choice: T) => {
    setEditingChoice(choice);
    setView('edit');
  }, []);

  const handleBackToList = useCallback(() => {
    setEditingChoice(null);
    setView('list');
  }, []);

  const handleSaveDone = useCallback(() => {
    fetchChoices();
    setEditingChoice(null);
    setView('list');
  }, [fetchChoices]);

  return {
    choices,
    loading,
    error,
    searchProps,
    filteredChoices,
    view,
    editingChoice,
    handleEditPrompt,
    handleBackToList,
    handleSaveDone,
    refetch: fetchChoices,
  };
}