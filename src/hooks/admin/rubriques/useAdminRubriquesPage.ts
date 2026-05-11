import type { ToastState } from '@/hooks/admin/consultations/useAdminConsultationAnalysis';
import { api } from "@/lib/api/client";
import type { Offering, Rubrique } from '@/lib/interfaces';
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