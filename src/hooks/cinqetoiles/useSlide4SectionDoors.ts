"use client";
import { api } from "@/lib/api/client";
import { birthCountries } from "@/lib/birthCountries";
import { cx } from "@/lib/functions";
import { FormData, FormErrors, User } from "@/lib/interfaces";
import { useAuthStore } from "@/lib/store/auth.store";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

const RUBRIQUE_COUNTRY_OPTIONS = birthCountries.map((country) => ({ label: country, value: country }));

const initialForm: FormData = {
  nom: "",
  prenoms: "",
  dateNaissance: "",
  country: "Côte d'Ivoire",
  phone: "",
  gender: "",
  secretCode: "",
};


const validateForm = (form: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (!form.secretCode || form.secretCode.length !== 4) {
    errors.secretCode = "Code secret invalide. Veuillez entrer exactement 4 caractères";
  }

  const phoneRegex = /^[a-zA-Z0-9+\-.\s]{1,100}$/;
  if (!form.phone || !phoneRegex.test(form.phone)) {
    errors.phone = "Numéro de téléphone invalide (max 100 caractères)";
  }

  if (!form.nom.trim()) errors.nom = "Nom requis";
  if (!form.prenoms.trim()) errors.prenoms = "Prénoms requis";
  if (!form.country) errors.country = "Pays requis";
  if (!form.gender) errors.gender = "Genre requis";
  if (!form.dateNaissance) errors.dateNaissance = "Date de naissance requise";

  return errors;
};

export function useSlide4SectionDoors() {
  const searchParams = useSearchParams();
  const monjeu = searchParams?.get("monjeu");
  const countryOptions = useMemo(() => RUBRIQUE_COUNTRY_OPTIONS, []);

  const submitClass = useMemo(
    () =>
      cx(
        "w-full rounded-2xl px-4 py-3.5",
        "text-[13px] sm:text-[14px] font-semibold",
        "text-white",
        "bg-gradient-to-r from-[#163A74] via-[#2E5AA6] to-[#4F83D1]",
        "shadow-lg shadow-[#2E5AA6]/20",
        "transition",
        "hover:opacity-[0.97] active:scale-[0.99]"
      ),
    []
  );

  const cancelClass = useMemo(
    () =>
      cx(
        "w-full rounded-2xl px-4 py-3 text-[13px] font-semibold",
        "border border-black/10 dark:border-white/10",
        "bg-white/70 dark:bg-white/5",
        "text-slate-800 dark:text-slate-200",
        "hover:bg-white dark:hover:bg-white/10 transition"
      ),
    []
  );

  const router = useRouter();
  const updateUser = useAuthStore((state) => state.updateUser);

  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e: { target: HTMLInputElement | HTMLSelectElement }) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const key = name as keyof FormData;
      return prev[key] === value ? prev : { ...prev, [key]: value };
    });

    setErrors((prev) => {
      if (!prev[name]) return prev;
      const rest = { ...prev };
      delete rest[name];
      return rest;
    });

    if (apiError !== null) setApiError(null);
  }, [apiError]);

  const handleSubmit = useCallback(async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (isSubmitting) return;

    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setApiError("Veuillez corriger le formulaire");
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      const response = await api.patch<{ success: boolean; error?: string; user?: User }>(
        "/users/me",
        {
          nom: form.nom,
          prenoms: form.prenoms,
          dateNaissance: form.dateNaissance,
          country: form.country,
          phone: form.phone,
          gender: form.gender,
          secretCode: form.secretCode,
        }
      );

      if (response.data.success && response.data.user) {
        updateUser(response.data.user);
        if (monjeu) {
          router.push(`/star/choix/${monjeu}`);
        } else {
          router.push(`/star/profil`);
        }
      } else {
        setApiError(response.data.error || "Une erreur est survenue");
      }
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour:", error);
      setApiError(error?.response?.data?.message || "Erreur lors de la mise à jour du profil");
    } finally {
      setIsSubmitting(false);
    }
  }, [form, router, updateUser, isSubmitting, monjeu]);

  const handleReset = useCallback(() => {
    router.back();
  }, [router]);

  return {
    handleChange,
    handleReset,
    handleSubmit,
    apiError,
    errors,
    form,
    setForm, // ✅ Ajout de setForm
    countryOptions,
    submitClass,
    cancelClass,
    isSubmitting
  };
}