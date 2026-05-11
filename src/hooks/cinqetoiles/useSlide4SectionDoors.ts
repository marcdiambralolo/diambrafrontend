"use client";
import { FormData, FormErrors, StepType } from "@/lib/interfaces";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useDoorsFormStore } from "./doorsFormStore";
import { birthCountries } from "@/lib/birthCountries";
import { cx } from "@/lib/functions";

export type ExtendedStepType = StepType | "gold" | "traitement";

export type ProgressStage = "idle" | "update_user" | "sky_chart" | "finalizing" | "done" | "error";

export type ProgressState = {
  updatedAt: number;
  error: string;
  stage: ProgressStage;
  message: string;
  total: number;
  done: number;
  percent: number;
  startedAt: number;
  lastUpdatedAt: number;
  logs: string[];
};

const RUBRIQUE_COUNTRY_OPTIONS = birthCountries.map((country) => ({ label: country, value: country }));

const initialForm: FormData = {
  nom: "",
  prenoms: "",
  dateNaissance: "",
  paysNaissance: "",
  villeNaissance: "",
  heureNaissance: "",
  country: "",
  phone: "",
  gender: "",
};

const validateForm = (form: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (!form.nom.trim()) errors.nom = "Nom requis";
  if (!form.prenoms.trim()) errors.prenoms = "Prénoms requis";
  if (!form.dateNaissance) errors.dateNaissance = "Date de naissance requise";
  if (!form.villeNaissance.trim()) errors.villeNaissance = "Ville de naissance requise";
  if (!form.heureNaissance) errors.heureNaissance = "Heure de naissance requise";

  return errors;
};

export function useSlide4SectionDoors() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initialForm);
  const setDoorsForm = useDoorsFormStore((s) => s.setForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

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

  const handleSubmit = useCallback((e: { preventDefault: () => void }) => {
    e.preventDefault();
    const validationErrors = validateForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setApiError("Veuillez corriger le formulaire");
      return;
    }

    setDoorsForm(form);
    router.push("/star/profil/go");
  }, [form, setDoorsForm, router]);

   

  const handleReset = useCallback(() => {
    router.back();
  }, [router]);

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

  return { handleChange, handleSubmit, apiError, errors, form, handleReset, countryOptions, submitClass, cancelClass };
}