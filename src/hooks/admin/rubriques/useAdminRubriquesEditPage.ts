import { useChoiceEditorNewNavigation } from "@/hooks/admin/rubriques/useChoiceEditorNewNavigation";
import { api } from "@/lib/api/client";
import { offeringsService } from '@/lib/api/services/offerings.service';
import type { Offering, OfferingAlternative, Rubrique } from '@/lib/interfaces';
import { ConsultationChoice } from "@/lib/interfaces";
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";


export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5, ease: "easeOut" }
  },
  slideIn: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.4, ease: "easeInOut" }
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.3 }
  }
};

// Constantes
const DEFAULT_ALTERNATIVES = [
  { category: "banque" as const, offeringId: "", quantity: 1 },
];

const REQUIRED_CATEGORIES = ['banque'] as const;

// Types
type SectionType = 'offering' | 'details' | 'ai';

// Hook personnalisé pour la gestion du toast
function useToast() {
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  return { toast, showToast, hideToast, setToast };
}

export function useAdminRubriquesEditPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  // Extraction des paramètres
  const rubriqueId = params?.id as string;
  const choiceId = searchParams?.get('idchoice') || searchParams?.get('id') || '';

 

  // États
  const [rubriques, setRubriques] = useState<Rubrique[]>([]);
  const [editingRubrique, setEditingRubrique] = useState<Rubrique | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [offeringsLoading, setOfferingsLoading] = useState<boolean>(false);
  const [expandedSection, setExpandedSection] = useState<SectionType>('details');
  const [originalChoice, setOriginalChoice] = useState<ConsultationChoice | null>(null);


  // Navigation
  const { view } = useChoiceEditorNewNavigation();
  const { toast, showToast, setToast } = useToast();
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  // État du choix
  const [choice, setChoice] = useState<ConsultationChoice>({
    title: "",
    description: "",
    offering: { alternatives: DEFAULT_ALTERNATIVES },
    choiceId: "",
    choiceTitle: "",
    consultationId: null,
  });

  // Cleanup au démontage
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
 

  // Navigation retour
  const handleBackToList = useCallback(() => {
    router.push("/admin/rubriques");
  }, [router]);

  // Annulation de l'édition
  const handleCancelEdit = useCallback(() => {
    if (originalChoice) {
      setChoice(originalChoice);
    }
    router.push(`/admin/rubriques/${rubriqueId}`);
  }, [originalChoice, router, rubriqueId]);

  // Suppression d'un choix
  const handleDeleteChoice = useCallback(async () => {
    if (!editingRubrique || !choiceId) return;

    if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement ce choix ?')) return;

    setSaving(true);
    try {
      await api.delete(`/rubriques/${editingRubrique._id}/consultation-choices/${choiceId}`);
      showToast('success', 'Choix supprimé avec succès.');
      setTimeout(() => {
        router.push(`/admin/rubriques/${rubriqueId}/list`);
      }, 1200);
    } catch (error) {
      console.error('Erreur suppression:', error);
      showToast('error', 'Erreur lors de la suppression du choix.');
    } finally {
      setSaving(false);
    }
  }, [editingRubrique, choiceId, router, rubriqueId, showToast]);

  // Chargement des offrandes
  useEffect(() => {
    const fetchOfferings = async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setOfferingsLoading(true);
      try {
        const data = await offeringsService.list();
        if (isMountedRef.current) {
          setOfferings(data);
        }
      } catch (error) {
        if ((error as Error)?.name !== 'AbortError') {
          console.error('Erreur chargement offrandes:', error);
        }
      } finally {
        if (isMountedRef.current) {
          setOfferingsLoading(false);
        }
      }
    };

    fetchOfferings();
  }, []);

  // Chargement des rubriques
  const fetchRubriques = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    try {
      const response = await api.get<Rubrique[]>("/rubriques");
      if (isMountedRef.current) {
        setRubriques(response.data);
      }
    } catch (error) {
      if ((error as Error)?.name !== 'AbortError') {
        console.error('Erreur chargement rubriques:', error);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchRubriques();
  }, [fetchRubriques]);

  // Chargement de la rubrique spécifique et du choix à éditer
  useEffect(() => {
    if (rubriqueId && rubriques.length > 0 && isMountedRef.current) {
      const found = rubriques.find(r => r._id === rubriqueId);
      setEditingRubrique(found || null);

      // Si on est en mode édition (avec choiceId)
      if (choiceId && found?.consultationChoices) {
        const foundChoice = found.consultationChoices.find(c => c._id === choiceId);
        if (foundChoice) {
          setOriginalChoice(foundChoice);
          setChoice({
            ...foundChoice,
            offering: foundChoice.offering || { alternatives: DEFAULT_ALTERNATIVES },
          });
        } else {
          showToast('error', 'Choix non trouvé');
        }
      }
    }
  }, [rubriqueId, rubriques, choiceId, showToast]);

  // Actions sur le choix
  const handleUpdateChoice = useCallback((updated: ConsultationChoice) => {
    setChoice(updated);
  }, []);

  const handleAlternativeChange = useCallback((idx: number, updated: OfferingAlternative) => {
    setChoice(prev => {
      const newAlternatives = [...prev.offering.alternatives];
      newAlternatives[idx] = updated;
      return { ...prev, offering: { alternatives: newAlternatives } };
    });
  }, []);

  
  const validateChoice = useCallback((choiceToValidate: ConsultationChoice): string | null => {
    if (!choiceToValidate.title?.trim()) {
      return 'Veuillez saisir un titre.';
    }
    if (!choiceToValidate.description?.trim()) {
      return 'Veuillez saisir une description.';
    }
   

    const alternatives = choiceToValidate.offering?.alternatives;
    if (!alternatives || alternatives.length !== 1) {
      return '1 alternative  banque est requise.';
    }

    const categories = alternatives.map(a => a.category);
    const hasAllCategories = REQUIRED_CATEGORIES.every(cat => categories.includes(cat));
    if (!hasAllCategories) {
      return 'Chaque catégorie  de la banque doit être présente.';
    }

    const hasEmptyOffering = alternatives.some(alt => !alt.offeringId || alt.quantity <= 0);
    if (hasEmptyOffering) {
      return 'Veuillez sélectionner une offrande valide pour chaque catégorie.';
    }

    return null;
  }, []);

  // Sauvegarde (création ou mise à jour)
  const handleSave = useCallback(async () => {
    if (!editingRubrique || !choice) return;

    // Validation
    const validationError = validateChoice(choice);
    if (validationError) {
      showToast('error', validationError);
      return;
    }

    setSaving(true);

    try {
      // Préparation des offrandes
      const offering = {
        alternatives: choice.offering.alternatives.map((alt) => ({
          category: alt.category,
          offeringId: alt.offeringId,
          quantity: alt.quantity ?? 1,
        }))
      }; 
      const payload = {
        title: choice.title.trim(),
        description: choice.description.trim(),
        offering,
      };
      // Mise à jour
      await api.patch(`/rubriques/${editingRubrique._id}/consultation-choices/${choiceId}`, payload);
      showToast('success', 'Choix mis à jour avec succès.');
      setTimeout(() => {
        router.push(`/admin/rubriques/${rubriqueId}/list`);
      }, 1200);
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      showToast('error', "Erreur de mise à jour du choix.");
    } finally {
      setSaving(false);
    }
  }, [editingRubrique, choice, validateChoice, showToast,   choiceId, originalChoice, router, rubriqueId]);

  // Calculs mémoisés
  const totalCost = useMemo(() => {
    return choice.offering.alternatives.reduce((sum, alt) => {
      const offering = offerings.find(o => o._id === alt.offeringId);
      return sum + (offering ? offering.price * alt.quantity : 0);
    }, 0);
  }, [choice.offering.alternatives, offerings]);

  const isFormValid = useMemo(() => {
    return choice.title.trim() &&
      choice.description.trim() &&
      choice.offering.alternatives.length === 3 &&
      choice.offering.alternatives.every(alt => alt.offeringId && alt.quantity > 0);
  }, [choice.title, choice.description, choice.offering.alternatives]);

  // Toggle section
  const toggleSection = useCallback((section: SectionType) => {
    setExpandedSection(prev => prev === section ? 'details' : section);
  }, []);

  return {
    handleSave, handleBackToList, handleUpdateChoice, setToast, toggleSection,
    handleAlternativeChange, handleCancelEdit, handleDeleteChoice,  
    expandedSection, totalCost, isFormValid, loading, saving, offerings,
    offeringsLoading, choice, view, editingRubrique, toast, originalChoice,
  };
}