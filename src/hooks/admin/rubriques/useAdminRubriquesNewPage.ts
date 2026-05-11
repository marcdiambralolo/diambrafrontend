import type { ToastState } from '@/hooks/admin/consultations/useAdminConsultationAnalysis';
import { api } from '@/lib/api/client';
import type { Rubrique } from '@/lib/interfaces';
import { ConsultationType } from '@/lib/interfaces';
import { getErrorMessage } from '@/lib/utils/errorHelpers';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

export function useAdminRubriquesNewPage() {
  const router = useRouter();
  const [editingRubrique, setEditingRubrique] = useState<Rubrique>({
    titre: '',
    description: '',
    categorie: 'GENERAL',
    consultationChoices: [],
    typeconsultation: ConsultationType.SPIRITUALITE,
    type: ConsultationType.SPIRITUALITE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const [saving, setSaving] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const handleBackToList = useCallback(() => {
    router.push('/admin/rubriques');
  }, [router]);

  const handleSave = useCallback(async () => {
    // Validation
    if (!editingRubrique.titre?.trim()) {
      setToast({ type: 'error', message: 'Le titre est requis' });
      return;
    }

    if (!editingRubrique.typeconsultation) {
      setToast({ type: 'error', message: 'Le type de consultation est requis' });
      return;
    }

    setSaving(true);

    const newRubrique = {
      titre: editingRubrique.titre.trim(),
      description: editingRubrique.description?.trim() || '',
      categorie: 'GENERAL',
      consultationChoices: [],
      type: editingRubrique.typeconsultation,
      typeconsultation: editingRubrique.typeconsultation,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await api.post('/rubriques', newRubrique);
      setToast({ type: 'success', message: 'Rubrique créée avec succès' });



      // Redirection après 1.5 secondes
      setTimeout(() => router.push('/admin/rubriques'), 1500);
    } catch (error: unknown) {
      setToast({
        type: 'error',
        message: getErrorMessage(error, 'Erreur lors de la création'),
      });
    } finally {
      setSaving(false);
    }
  }, [editingRubrique, router]);

  return {
    saving,
    toast,
    editingRubrique,
    setEditingRubrique,
    handleSave,
    handleBackToList,
    setToast,
  };
}