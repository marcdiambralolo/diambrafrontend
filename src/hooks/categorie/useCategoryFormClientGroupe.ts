"use client";
import { getCategoryErrorMessage, getCreatedConsultationDestination } from "@/hooks/categorie/categoryConsultation.shared";
import type { ConsultationChoice } from "@/lib/interfaces";
import type { TierceForm as ViePersonnelleTierceForm } from "@/components/categorie/formgroupe/FormFieldsGroupe";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useConsultationFormGroupe } from "../vie-personnelle/useConsultationFormGroupe";

type UiState = {
  loading: boolean;
  apiError: string | null;
  showErrorToast: boolean;
};

const initialUi: UiState = {
  loading: true,
  apiError: null,
  showErrorToast: false,
};

type TierceForm = ViePersonnelleTierceForm;

type TiercePayload = Omit<TierceForm, "id">;

const EMPTY_TIERCE: Omit<TierceForm, "id"> = {
  nom: "",
  prenoms: "",
  gender: "",
  dateNaissance: "",
  heureNaissance: "",
  villeNaissance: "",
  paysNaissance: "",
  question: "",
};

function newTierce(): TierceForm {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `t_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  return { id, ...EMPTY_TIERCE };
}

function normalizeTierce(t: TierceForm): TierceForm {
  return {
    ...t,
    nom: t.nom.trim(),
    prenoms: t.prenoms.trim(),
    villeNaissance: t.villeNaissance.trim(),
    paysNaissance: t.paysNaissance.trim(),
    question: t.question.trim(),
  };
}

function tierceKey(t: TierceForm) {
  return `${t.prenoms.trim().toLowerCase()}|${t.nom.trim().toLowerCase()}|${t.dateNaissance}|${t.heureNaissance}|${t.villeNaissance
    .trim()
    .toLowerCase()}`;
}

function validateTierceAll(t: TierceForm) {
  const f = normalizeTierce(t);
  const errors: Record<string, string> = {};

  if (!f.nom) errors.nom = "Le nom est requis";
  if (!f.prenoms) errors.prenoms = "Le prénom est requis";
  if (!f.gender) errors.gender = "Le genre est requis";
  if (!f.dateNaissance) errors.dateNaissance = "La date de naissance est requise";
  if (!f.heureNaissance) errors.heureNaissance = "L'heure de naissance est requise";
  if (!f.villeNaissance) errors.villeNaissance = "La ville de naissance est requise";
  if (!f.paysNaissance) errors.paysNaissance = "Le pays de naissance est requis";

  return { ok: Object.keys(errors).length === 0, errors, value: f };
}

/**
 * Hook avancé pour la gestion du formulaire de consultation groupe (tierces).
 * - Gestion du local/sessionStorage
 * - Validation, erreurs, succès, reset, dirty, etc.
 */
export function useCategoryFormClientGroupe() {
  const router = useRouter();

  const category = useMonEtoileStore((s) => s.category);
  const choixConsultationEnCours = useMonEtoileStore((s) => s.choixConsultationEnCours);
  const rubriqueEnCours = useMonEtoileStore((s) => s.rubriqueEnCours);
  const setChoixConsultationEnCours = useMonEtoileStore((s) => s.setChoixConsultationEnCours);

  const [ui, setUi] = useState<UiState>(initialUi);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<TierceForm>(() => newTierce());
  const [tiercesList, setTiercesList] = useState<TierceForm[]>([]);
  const [showAddMore, setShowAddMore] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Pour savoir si le formulaire a été modifié
  const [initialForm, setInitialForm] = useState<TierceForm>(form);

  const submitLockRef = useRef(false);
  const successTimerRef = useRef<number | null>(null);

  const title = useMemo(() => category?.nom?.trim() || "Catégorie", [category?.nom]);

  const choice = useMemo(() => (choixConsultationEnCours as any)?.choice as ConsultationChoice | undefined, [
    choixConsultationEnCours,
  ]);

  const consultationId = choixConsultationEnCours?._id || null;

  // StorageKey stable (évite tierces_undefined)
  const storageKey = useMemo(() => {
    return consultationId ? `tierces_${consultationId}` : null;
  }, [consultationId]);

  // Charger la liste quand consultationId arrive / change
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!storageKey) {
      setTiercesList([]);
      return;
    }
    const stored = sessionStorage.getItem(storageKey);
    if (!stored) {
      setTiercesList([]);
      return;
    }
    try {
      const parsed = JSON.parse(stored) as TierceForm[];
      setTiercesList(Array.isArray(parsed) ? parsed : []);
    } catch {
      setTiercesList([]);
    }
  }, [storageKey]);

  // Persister la liste
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!storageKey) return;

    if (tiercesList.length > 0) {
      sessionStorage.setItem(storageKey, JSON.stringify(tiercesList));
    } else {
      sessionStorage.removeItem(storageKey);
    }
  }, [tiercesList, storageKey]);

  const contextInfo = useMemo(
    () => ({ rubrique: rubriqueEnCours, choix: choice }),
    [rubriqueEnCours, choice]
  );

  // Handler de changement de champ
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((prev) => {
        const k = name as keyof TierceForm;
        return prev[k] === value ? prev : { ...prev, [k]: value };
      });
      setErrors((prev) => {
        if (!prev[name]) return prev;
        const next = { ...prev };
        delete next[name];
        return next;
      });
    },
    []
  );

  // Ajout direct d'une tierce (API publique)
  const addTierce = useCallback((tierce: TierceForm) => {
    const { ok, errors: newErrors, value } = validateTierceAll(tierce);
    if (!ok) {
      setErrors(newErrors);
      setUi((s) => ({ ...s, apiError: "Veuillez remplir tous les champs requis", showErrorToast: true }));
      return false;
    }
    const key = tierceKey(value);
    if (tiercesList.some((x) => tierceKey(x) === key)) {
      setUi((s) => ({ ...s, apiError: "Cette personne est déjà ajoutée.", showErrorToast: true }));
      return false;
    }
    setTiercesList((prev) => [...prev, value]);
    setForm(newTierce());
    setShowAddMore(false);
    setUi((s) => ({ ...s, apiError: null }));
    setSuccessMessage(`${value.prenoms} ${value.nom} a été ajouté(e) avec succès`);
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    successTimerRef.current = window.setTimeout(() => setSuccessMessage(null), 3000);
    return true;
  }, [tiercesList]);

  // Reset du formulaire
  const resetForm = useCallback(() => {
    setForm(newTierce());
    setErrors({});
    setUi((s) => ({ ...s, apiError: null, showErrorToast: false }));
    setShowAddMore(false);
    setInitialForm(newTierce());
  }, []);

  // Pour savoir si le formulaire est modifié
  const isDirty = useMemo(() => {
    return JSON.stringify(form) !== JSON.stringify(initialForm);
  }, [form, initialForm]);

  // Pour vider toutes les tierces
  const clearTierces = useCallback(() => {
    setTiercesList([]);
  }, []);

  // Helper pour valider le formulaire courant
  const validateForm = useCallback(() => {
    return validateTierceAll(form);
  }, [form]);

  const handleRemoveTierce = useCallback((id: string) => {
    setTiercesList((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleAddTierce = useCallback((): boolean => {
    const { ok, errors: newErrors, value } = validateTierceAll(form);
    if (!ok) {
      setErrors(newErrors);
      setUi((s) => ({ ...s, apiError: "Veuillez remplir tous les champs requis", showErrorToast: true }));
      return false;
    }

    const key = tierceKey(value);
    // Vérifier le doublon AVANT d'ajouter
    if (tiercesList.some((x) => tierceKey(x) === key)) {
      setUi((s) => ({ ...s, apiError: "Cette personne est déjà ajoutée.", showErrorToast: true }));
      return false;
    }

    setTiercesList((prev) => [...prev, value]);
    setForm(newTierce());
    setShowAddMore(false);
    setUi((s) => ({ ...s, apiError: null }));

    setSuccessMessage(`${value.prenoms} ${value.nom} a été ajouté(e) avec succès`);
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    successTimerRef.current = window.setTimeout(() => setSuccessMessage(null), 3000);

    return true;
  }, [form, tiercesList]);

  const createConsultation = useCallback(
    async (params: { choice: ConsultationChoice; tierces: TierceForm[] }) => {
      if (!choixConsultationEnCours?._id) {
        throw new Error("Consultation introuvable : aucune consultation en cours.");
      }

      const tiercesPayload: TiercePayload[] = params.tierces.map((t) => {
        const x = normalizeTierce(t);
        return {
          nom: x.nom,
          prenoms: x.prenoms,
          gender: x.gender,
          dateNaissance: x.dateNaissance,
          heureNaissance: x.heureNaissance,
          villeNaissance: x.villeNaissance,
          paysNaissance: x.paysNaissance,
          question: x.question,
        };
      });

      // IMPORTANT : pas de mutation in-place
      const next = {
        ...choixConsultationEnCours,
        extraPayload: {
          ...(choixConsultationEnCours.extraPayload || {}),
          tierces: tiercesPayload,
        },
      };

      setChoixConsultationEnCours(next as any);

      // Si tu dois aussi sync backend ici (recommandé), dis-moi l’endpoint :
      // await api.patch(`/consultations/${choixConsultationEnCours._id}`, { extraPayload: next.extraPayload })
    },
    [choixConsultationEnCours, setChoixConsultationEnCours]
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!rubriqueEnCours?._id) return;

      if (!choice) {
        setUi((s) => ({ ...s, apiError: "Choix de consultation introuvable", showErrorToast: true }));
        return;
      }

      if (submitLockRef.current) return;
      submitLockRef.current = true;

      try {
        // Au moins 1 tierce : sinon on tente d’ajouter la tierce courante
        let finalTierces = tiercesList;

        if (finalTierces.length === 0) {
          const { ok, errors: newErrors, value } = validateTierceAll(form);
          if (!ok) {
            setErrors(newErrors);
            setUi((s) => ({
              ...s,
              apiError: "Ajoutez au moins une personne tierce (ou complétez le formulaire).",
              showErrorToast: true,
            }));
            return;
          }
          finalTierces = [value];
        }

        setUi((s) => ({ ...s, loading: true, apiError: null }));

        await createConsultation({ choice, tierces: finalTierces });

        // Navigation (paiement / suite)
        router.push(
          getCreatedConsultationDestination({
            categoryId: category?._id || "",
            consultationId: choixConsultationEnCours?._id || "",
            rubriqueId: rubriqueEnCours?._id || "",
            choiceId: (choice as any)?._id || (choice as any)?.choiceId,
            consultationType: category?.typeconsultation,
            refreshToken: Date.now(),
          })
        );
      } catch (err: unknown) {
        setUi((s) => ({
          ...s,
          loading: false,
          apiError: getCategoryErrorMessage(err, "Erreur lors de la création de la consultation"),
          showErrorToast: true,
        }));
      } finally {
        submitLockRef.current = false;
        setUi((s) => ({ ...s, loading: false }));
      }
    },
    [rubriqueEnCours?._id, choice, tiercesList, form, createConsultation, router, category?._id, category?.typeconsultation, choixConsultationEnCours?._id]
  );

  const handleReset = useCallback(() => {
    const cid = category?._id;
    if (!cid) return router.replace("/star/category");
    router.push(`/star/category/${cid}/selection?r=${Date.now()}`);
  }, [category?._id, router]);

  const handleCloseError = useCallback(() => {
    setUi((s) => (s.showErrorToast ? { ...s, showErrorToast: false } : s));
  }, []);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  const maxTierces = 10;
  const tiercesCount = tiercesList.length;

  const showForm = Boolean(choice && ((choice as any)?._id || (choice as any)?.choiceId));

  // Form validity (utile pour CTA disabled)
  const isFormValid = useMemo(() => {
    const f = normalizeTierce(form);
    return Boolean(
      f.nom &&
        f.prenoms &&
        f.gender &&
        f.dateNaissance &&
        f.heureNaissance &&
        f.villeNaissance &&
        f.paysNaissance
    );
  }, [form]);

  // Hook “form groupe”
  const {
    handleCitySelect,
    handleAddTierceWrapper,
    onClickAddMore,
    onClickCancelAddMore,
    onRemove,
    onChangeField,
    cityApiUrl,
    cityApiKey,
    countryOptions,
    tiercesCountLabel,
    hasTierces,
    canAddMore,
    showTierceForm,
  } = useConsultationFormGroupe({
    form,
    handleChange,
    tiercesList,
    maxTierces,
    showAddMore,
    setShowAddMore,
    handleAddTierce,
    handleRemoveTierce,
  });

  return {
    // ui
    loading: ui.loading,
    apiError: ui.apiError,
    showErrorToast: ui.showErrorToast,
    error: null, // (tu avais ui.error mais jamais alimenté)

    // data
    title,
    contextInfo,
    form,
    errors,
    tiercesList,
    tiercesCount,
    tiercesCountLabel,
    maxTierces,
    showForm,
    showAddMore,
    successMessage,
    countryOptions,
    cityApiUrl,
    cityApiKey,

    // computed
    isFormValid,
    hasTierces,
    canAddMore,
    showTierceForm,

    // handlers
    handleChange,
    handleCitySelect,
    onChangeField,
    handleSubmit,
    handleAddTierceClick: handleAddTierce,
    handleAddTierceWrapper,
    handleOpenAddMore: onClickAddMore,
    handleCancelAddMore: onClickCancelAddMore,
    handleRemove: onRemove,
    resetSelection: handleReset,
    handleCloseError,

    // helpers avancés
    addTierce,
    resetForm,
    isDirty,
    clearTierces,
    validateForm,
  };
}
