import { getCategoryErrorMessage, getCreatedConsultationDestination } from "@/hooks/categorie/categoryConsultation.shared";
import type { ConsultationChoice } from "@/lib/interfaces";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useConsultationForm } from "../vie-personnelle/useConsultationForm";

type UiState = {
    loading: boolean;
    apiError: string | null;
    showErrorToast: boolean;
};

const initialUi: UiState = {
    loading: false,
    apiError: null,
    showErrorToast: false,
};

const emptyForm = {
    nom: "",
    prenoms: "",
    gender: "",
    dateNaissance: "",
    heureNaissance: "",
    villeNaissance: "",
    paysNaissance: "",
    question: "",
};

type TierceForm = typeof emptyForm;

function normalizeTierce(form: TierceForm): TierceForm {
    return {
        ...form,
        nom: form.nom.trim(),
        prenoms: form.prenoms.trim(),
        villeNaissance: form.villeNaissance.trim(),
        paysNaissance: form.paysNaissance.trim(),
        question: form.question.trim(),
    };
}

function validateTierce(form: TierceForm) {
    const value = normalizeTierce(form);
    const nextErrors: Record<string, string> = {};

    if (!value.nom) nextErrors.nom = "Le nom est requis";
    if (!value.prenoms) nextErrors.prenoms = "Le prénom est requis";
    if (!value.gender) nextErrors.gender = "Le genre est requis";
    if (!value.dateNaissance) nextErrors.dateNaissance = "La date de naissance est requise";
    if (!value.heureNaissance) nextErrors.heureNaissance = "L'heure de naissance est requise";
    if (!value.villeNaissance) nextErrors.villeNaissance = "La ville de naissance est requise";
    if (!value.paysNaissance) nextErrors.paysNaissance = "Le pays de naissance est requis";

    return { ok: Object.keys(nextErrors).length === 0, errors: nextErrors, value };
}

export function useCategoryFormClient() {
    const router = useRouter();

    const category = useMonEtoileStore((s) => s.category);
    const rubriqueEnCours = useMonEtoileStore((s) => s.rubriqueEnCours);
    const choixConsultationEnCours = useMonEtoileStore((s) => s.choixConsultationEnCours);

    const setChoixConsultationEnCours = useMonEtoileStore((s) => s.setChoixConsultationEnCours);

    const [ui, setUi] = useState<UiState>(initialUi);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [form, setForm] = useState<TierceForm>({ ...emptyForm });

    const title = useMemo(() => category?.nom?.trim() || "Catégorie", [category?.nom]);
    const choice = useMemo(() => (choixConsultationEnCours as any)?.choice as ConsultationChoice | undefined, [
        choixConsultationEnCours,
    ]);

    const contextInfo = useMemo(
        () => ({ rubrique: rubriqueEnCours, choix: choice }),
        [rubriqueEnCours, choice]
    );

    const didAutoCreateRef = useRef(false);
    useEffect(() => {
        didAutoCreateRef.current = false;
    }, [choixConsultationEnCours?._id]);

    const createConsultationAndGo = useCallback(
        async (params: { choice: ConsultationChoice; tierce?: TierceForm }) => {
            if (!category?._id || !rubriqueEnCours?._id || !choixConsultationEnCours?._id) {
                throw new Error("Données manquantes pour la création de la consultation");
            }

            const tierce = params.tierce ? normalizeTierce(params.tierce) : undefined;

            if (tierce) {
                const next = {
                    ...choixConsultationEnCours,
                    extraPayload: {
                        ...(choixConsultationEnCours.extraPayload || {}),
                        tierce,
                    },
                };
                setChoixConsultationEnCours(next as any);
            }

            const c = params.choice;
            const choiceId = (c as any)?._id || (c as any)?.choiceId || "";

            router.push(
                getCreatedConsultationDestination({
                    categoryId: category._id,
                    consultationId: choixConsultationEnCours._id,
                    rubriqueId: rubriqueEnCours._id,
                    choiceId,
                    consultationType: category.typeconsultation
                })
            );
        },
        [category?._id, category?.typeconsultation, rubriqueEnCours?._id, choixConsultationEnCours, router, setChoixConsultationEnCours]
    );

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const { name, value } = e.target;

            setForm((prev) => (prev[name as keyof typeof prev] === value ? prev : { ...prev, [name]: value }));

            setErrors((prev) => {
                if (!prev[name]) return prev;
                const next = { ...prev };
                delete next[name];
                return next;
            });
        },
        []
    );

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();

            if (!rubriqueEnCours?._id) return;

            if (!choice) {
                setUi((s) => ({ ...s, apiError: "Choix de consultation introuvable", showErrorToast: true, loading: false }));
                return;
            }

            const { ok, errors: nextErrors, value } = validateTierce(form);
            if (!ok) {
                setErrors(nextErrors);
                setUi((s) => ({
                    ...s,
                    loading: false,
                    apiError: "Veuillez remplir tous les champs requis",
                    showErrorToast: true,
                }));
                return;
            }

            setUi((s) => ({ ...s, loading: true, apiError: null }));

            try {
                await createConsultationAndGo({ choice, tierce: value });
            } catch (err: unknown) {
                setUi((s) => ({
                    ...s,
                    loading: false,
                    apiError: getCategoryErrorMessage(err, "Erreur lors de la création de la consultation"),
                    showErrorToast: true,
                }));
            } finally {
                setUi((s) => ({ ...s, loading: false }));
            }
        },
        [rubriqueEnCours?._id, choice, form, createConsultationAndGo]
    );

    const handleReset = useCallback(() => {
        const cid = category?._id;
        if (!cid) {
            router.replace("/star/category");
            return;
        }
        router.push(`/star/category/${cid}/selection?r=${Date.now()}`);
    }, [category?._id, router]);

    const handleCloseError = useCallback(() => {
        setUi((s) => (s.showErrorToast ? { ...s, showErrorToast: false } : s));
    }, []);

    const { countryOptions, cityApiUrl, cityApiKey, onChangeField, handleCitySelect } = useConsultationForm(form, handleChange);

    return {
        apiError: ui.apiError, title, contextInfo, form, errors, countryOptions, cityApiUrl,
        cityApiKey, showErrorToast: ui.showErrorToast,
        handleChange, handleSubmit, handleReset, handleCloseError, handleCitySelect, onChangeField,
    };
}