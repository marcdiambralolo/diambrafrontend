import type { ToastState } from '@/hooks/admin/consultations/useAdminConsultationAnalysis';
import { useAdminGrades } from '@/hooks/admin/grades/useAdminGrades';
import { api } from "@/lib/api/client";
import { offeringsService } from '@/lib/api/services/offerings.service';
import type { Offering, Rubrique } from '@/lib/interfaces';
import { useMonEtoileStore } from '@/lib/store/monetoile.store';
import type { GradeConfig } from '@/lib/types/grade-config.types';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from "react";


export function useAdminRubriquesPage() {
  const router = useRouter();

  const [rubriques, setRubriques] = useState<Rubrique[]>([]);
  const [selectedRubrique, setSelectedRubrique] = useState<Rubrique | null>(null);
  const [editingRubrique, setEditingRubrique] = useState<Rubrique | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [offeringsLoading, setOfferingsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'gestion' | 'overview'>('gestion');
  const [gestionView, setGestionView] = useState<'list' | 'edit' | 'addChoice'>('list');

  const { grades } = useAdminGrades();
  const setGrades = useMonEtoileStore((s) => s.setGrades);

  useEffect(() => {
    if (grades && grades.length > 0) {
      setGrades(grades as GradeConfig[]);
    }
  }, [grades, setGrades]);

  const handleSelectRubrique = (rub: Rubrique) => {
    router.push(`/admin/rubriques/${rub._id}/list`);
  };

  const handleAddChoice = (rub: Rubrique) => {
    router.push(`/admin/rubriques/${rub._id}/create`);
  };

  const handleCreateRubrique = (handleCreate: () => void) => {
    handleCreate();
    setGestionView('edit');
  };

  const handleBackToList = () => {
    setEditingRubrique(null);
    setSelectedRubrique(null);
    setGestionView('list');
  };

   

  const fetchRubriques = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<Rubrique[]>("/rubriques");
      setRubriques(response.data);
    } catch {
      setToast({ type: "error", message: "Erreur de chargement" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRubriques();
  }, [fetchRubriques]);

  const handleCreate = useCallback(() => {
    router.push('/admin/rubriques/new');
  }, [router]);



  return {
    loading, toast, rubriques, offerings, offeringsLoading, activeTab,
    editingRubrique, gestionView, selectedRubrique, setEditingRubrique,
    setActiveTab, handleSelectRubrique, handleCreateRubrique, handleBackToList,
    handleCreate, setToast, handleAddChoice,
  };
}