import { useChoiceEditorNewNavigation } from "@/hooks/admin/rubriques/useChoiceEditorNewNavigation";
import { api } from "@/lib/api/client";
import { offeringsService } from '@/lib/api/services/offerings.service';
import type { Offering, OfferingAlternative, Rubrique } from '@/lib/interfaces';
import { ConsultationChoice } from "@/lib/interfaces";
import { useMonEtoileStore } from '@/lib/store/monetoile.store';
import type { GradeConfig } from '@/lib/types/grade-config.types';
import { Variants } from "framer-motion";
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState, useRef } from "react";

type UploadPdfResponse = { url: string; fileUrl?: string; path?: string };

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
  { category: "animal" as const, offeringId: "", quantity: 1 },
  { category: "vegetal" as const, offeringId: "", quantity: 1 },
  { category: "beverage" as const, offeringId: "", quantity: 1 },
];

const REQUIRED_CATEGORIES = ['animal', 'vegetal', 'beverage'] as const;

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
    frequence: undefined,
    participants: undefined,
    offering: { alternatives: DEFAULT_ALTERNATIVES },
    order: 0,
    choiceId: "",
    choiceTitle: "",
    buttonStatus: 'CONSULTER',
    consultButtonStatus: 'CONSULTER',
    hasActiveConsultation: false,
    consultationId: null,
    consultationCount: 0,
    gradeId: "",
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

  const handleAlternativeChange = useCallback((idx: number, updated: OfferingAlternative) => {
    setChoice(prev => {
      const newAlternatives = [...prev.offering.alternatives];
      newAlternatives[idx] = updated;
      return { ...prev, offering: { alternatives: newAlternatives } };
    });
  }, []);

  // Upload PDF
  const uploadPdf = useCallback(async (file: File): Promise<string | null> => {
    try {
      const fd = new FormData();
      fd.append('pdfFile', file);
      const res = await api.post<UploadPdfResponse>('/upload/pdf', fd);
      return res.data.url || res.data.fileUrl || res.data.path || null;
    } catch (error) {
      console.error('Erreur upload PDF:', error);
      return null;
    }
  }, []);

  // Validation du formulaire
  const validateChoice = useCallback((choiceToValidate: ConsultationChoice): string | null => {
    if (!choiceToValidate.title?.trim()) {
      return 'Veuillez saisir un titre.';
    }
    if (!choiceToValidate.description?.trim()) {
      return 'Veuillez saisir une description.';
    }
    if (!choiceToValidate.gradeId) {
      return 'Veuillez sélectionner un grade.';
    }
    if (!choiceToValidate.frequence) {
      return 'Veuillez sélectionner une fréquence.';
    }
    if (!choiceToValidate.participants) {
      return 'Veuillez sélectionner le type de participants.';
    }

    const alternatives = choiceToValidate.offering?.alternatives;
    if (!alternatives || alternatives.length !== 3) {
      return '3 alternatives (animal, vegetal, beverage) sont requises.';
    }

    const categories = alternatives.map(a => a.category);
    const hasAllCategories = REQUIRED_CATEGORIES.every(cat => categories.includes(cat));
    if (!hasAllCategories) {
      return 'Chaque catégorie (animal, vegetal, beverage) doit être présente.';
    }

    const hasEmptyOffering = alternatives.some(alt => !alt.offeringId || alt.quantity <= 0);
    if (hasEmptyOffering) {
      return 'Veuillez sélectionner une offrande valide pour chaque catégorie.';
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
      // Préparation des offrandes
      const offering = {
        alternatives: choice.offering.alternatives.map((alt) => ({
          category: alt.category,
          offeringId: alt.offeringId,
          quantity: alt.quantity ?? 1,
        }))
      };

      // Upload PDF si nécessaire
      let pdfFileUrl: string | null = null;
      if (choice.pdfFile) {
        if (typeof choice.pdfFile !== 'string') {
          pdfFileUrl = await uploadPdf(choice.pdfFile);
          if (!pdfFileUrl) {
            showToast('error', 'Erreur lors de l’upload du PDF.');
            setSaving(false);
            return;
          }
        } else {
          pdfFileUrl = choice.pdfFile;
        }
      }

      // Préparation du payload
      const gradeIdValue = typeof choice.gradeId === 'string'
        ? (choice.gradeId.trim() || undefined)
        : (choice.gradeId && typeof choice.gradeId === 'object' && 'id' in choice.gradeId
          ? (choice.gradeId.id as string)
          : undefined);

      const payload = {
        title: choice.title.trim(),
        description: choice.description.trim(),
        frequence: choice.frequence,
        participants: choice.participants,
        order: editingRubrique.consultationChoices?.length || 0,
        offering,
        pdfFile: pdfFileUrl,
        prompt: choice.prompt?.trim() || undefined,
        gradeId: gradeIdValue,
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
  }, [editingRubrique, choice, validateChoice, showToast, uploadPdf, handleBackToList]);

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
      choice.gradeId &&
      choice.frequence &&
      choice.participants &&
      choice.offering.alternatives.length === 3 &&
      choice.offering.alternatives.every(alt => alt.offeringId && alt.quantity > 0);
  }, [choice.title, choice.description, choice.gradeId, choice.frequence, choice.participants, choice.offering.alternatives]);

  // Toggle section
  const toggleSection = useCallback((section: SectionType) => {
    setExpandedSection(prev => prev === section ? 'details' : section);
  }, []);

  return {
    handleSave, handleBackToList, handleUpdateChoice, setToast, toggleSection,
    handleAlternativeChange,   expandedSection, totalCost, isFormValid,
    loading, saving, offerings, offeringsLoading, choice, view, editingRubrique, toast,
  };
}