import { useCallback, useState } from "react";
import type { FormData, FormErrors } from "@/lib/interfaces";

export function useConsultationForm(initialForm: FormData) {
    const [form, setForm] = useState<FormData>(initialForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [apiError, setApiError] = useState<string | null>(null);
    const [step, setStep] = useState<string>("form");

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setForm((prev) => ({ ...prev, [name]: value }));
            setErrors((prev) => {
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
            setStep("traitement");
            setApiError(null);
            // TODO: validation & API call
            // setErrors({ ... }) on error
            // setApiError('...') on API error
            // setStep('form') on error, 'success' on success
        },
        []
    );

    return {
        form,
        setForm,
        errors,
        setErrors,
        apiError,
        setApiError,
        step,
        setStep,
        handleChange,
        handleSubmit,
    };
}
