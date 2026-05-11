"use client";
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api/client';
import { ConsultationChoice, Rubrique } from '@/lib/interfaces';
import { useMonEtoileStore } from '@/lib/store/monetoile.store';
import type { GradeConfig } from '@/lib/types/grade-config.types';

export function useAdminRubriquesEditPage(rubriqueId: string, choiceId: string) {
  const router = useRouter();
  const grades = useMonEtoileStore(s => s.grades) as GradeConfig[];
  const setGrades = useMonEtoileStore((s) => s.setGrades);

  const [editingRubrique, setEditingRubrique] = useState<Rubrique | null>(null);
  const [choice, setChoice] = useState<ConsultationChoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Charge la rubrique et le choix à éditer
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const rubrique = await api.get(`/rubriques/${rubriqueId}`);
        // setEditingRubrique(rubrique.data);
        // const found = rubrique.data.consultationChoices.find((c: ConsultationChoice) => c._id === choiceId);
        // setChoice(found || null);
      } catch (e) {
        setEditingRubrique(null);
        setChoice(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [rubriqueId, choiceId]);

  useEffect(() => {
    if (grades && grades.length > 0) setGrades(grades as GradeConfig[]);
  }, [grades, setGrades]);

  const handleBackToList = useCallback(() => {
    router.push('/admin/rubriques');
  }, [router]);

  const handleUpdateChoice = useCallback((updated: ConsultationChoice) => {
    setChoice(updated);
  }, []);

  // PATCH la modification
  const handleUpdate = useCallback(async () => {
    if (!editingRubrique || !choice) return;
    setSaving(true);
    try {
      await api.patch(`/rubriques/${editingRubrique._id}/consultation-choices/${choice._id}`, choice);
      setToast({ type: 'success', message: 'Choix mis à jour avec succès.' });
      setTimeout(() => {
        setToast(null);
        handleBackToList();
      }, 1200);
    } catch {
      setToast({ type: 'error', message: 'Erreur lors de la mise à jour.' });
    } finally {
      setSaving(false);
    }
  }, [editingRubrique, choice, handleBackToList]);

  return {
    handleUpdate, handleBackToList, handleUpdateChoice, setToast,
    grades, loading, saving, editingRubrique, choice, toast,
  };
}
