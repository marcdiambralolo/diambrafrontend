import { useChoiceEditorNewNavigation } from "@/hooks/admin/rubriques/useChoiceEditorNewNavigation";
import { api } from "@/lib/api/client";
import { offeringsService } from '@/lib/api/services/offerings.service';
import type { Offering, OfferingAlternative, Rubrique } from '@/lib/interfaces';
import { ConsultationChoice } from "@/lib/interfaces";
import { useParams, useRouter } from 'next/navigation';
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

export function useAdminRubriquesAddPage() {
  const router = useRouter();
  const params = useParams();
  const rubriqueId = params?.id as string;
  // États
  const [rubriques, setRubriques] = useState<Rubrique[]>([]);
  const [editingRubrique, setEditingRubrique] = useState<Rubrique | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [offeringsLoading, setOfferingsLoading] = useState<boolean>(false);
  const [expandedSection, setExpandedSection] = useState<SectionType>('details');

  // Navigation
  const { view } = useChoiceEditorNewNavigation();
  const { toast, showToast, setToast } = useToast();

  // Refs pour éviter les appels multiples
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  // État du choix
  const [choice, setChoice] = useState<ConsultationChoice>({
    title: "",
    description: "",
    offering: { alternative: {  offeringId: "", quantity: 1 } },
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
          console.error('Erreur chargement:', error);
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

  // Chargement de la rubrique spécifique
  useEffect(() => {
    if (rubriqueId && rubriques.length > 0 && isMountedRef.current) {
      const found = rubriques.find(r => r._id === rubriqueId);
      setEditingRubrique(found || null);
    }
  }, [rubriqueId, rubriques]);

  // Actions sur le choix
  const handleUpdateChoice = useCallback((updated: ConsultationChoice) => {
    setChoice(updated);
  }, []);

  const handleAlternativeChange = useCallback((_idx: number, updated: OfferingAlternative) => {
    setChoice(prev => {

      return { ...prev, offering: { alternative: updated } };
    });
  }, []);



  // Validation du formulaire
  const validateChoice = useCallback((choiceToValidate: ConsultationChoice): string | null => {
    if (!choiceToValidate.title?.trim()) {
      return 'Veuillez saisir un titre.';
    }
    if (!choiceToValidate.description?.trim()) {
      return 'Veuillez saisir une description.';
    }


    const alternatives = choiceToValidate.offering?.alternative;
    if (!alternatives) {
      return 'Une alternative (banque) est requise.';
    }


    return null;
  }, []);

  // Sauvegarde
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
  
      const offering = {
        alternatives: choice.offering.alternative
      };



      const payload = {
        title: choice.title.trim(),
        description: choice.description.trim(),
        offering,
      };

      await api.post(`/rubriques/${editingRubrique._id}/consultation-choices`, payload);
      showToast('success', 'Choix enregistré avec succès.');

      setTimeout(() => {
        handleBackToList();
      }, 1200);
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      showToast('error', "Erreur de sauvegarde du choix.");
    } finally {
      setSaving(false);
    }
  }, [editingRubrique, choice, validateChoice, showToast, handleBackToList]);

  // Calculs mémoisés
  const totalCost = useMemo(() => {
    return choice.offering.alternative.quantity * (offerings.find(o => o._id === choice.offering.alternative.offeringId)?.price || 0);
  }, [choice.offering.alternative, offerings]);

  const isFormValid = useMemo(() => {
    return choice.title.trim() &&
      choice.description.trim() &&
      choice.offering.alternative  &&
      choice.offering.alternative.   quantity > 0;
  }, [choice.title, choice.description, choice.offering.alternative]);

  // Toggle section
  const toggleSection = useCallback((section: SectionType) => {
    setExpandedSection(prev => prev === section ? 'details' : section);
  }, []);

  return {
    handleSave, handleBackToList, handleUpdateChoice, setToast, toggleSection,
    handleAlternativeChange, expandedSection, totalCost, isFormValid,
    loading, saving, offerings, offeringsLoading, choice, view, editingRubrique, toast,
  };
}