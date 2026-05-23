"use client";
import InputField from "@/components/commons/InputField";
import RegisterSelectField from "@/components/commons/RegisterSelectField";
import { useSlide4SectionDoors } from "@/hooks/cinqetoiles/useSlide4SectionDoors";
import { cx } from "@/lib/functions";
import { AlertCircle, KeyRound, Phone, Shield, X, Info } from "lucide-react";
import { memo, useState } from "react";

export const GENDER_OPTIONS = [
  { value: "", label: "Sélectionner" },
  { value: "male", label: "Homme" },
  { value: "female", label: "Femme" },
] as const;

const ApiErrorCard = memo(function ApiErrorCard({ apiError }: { apiError: string }) {
  return (
    <div
      className="w-full rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-3"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start justify-center text-center gap-2">
        <span className="mt-0.5 h-8 w-8 rounded-xl grid place-items-center bg-rose-500/15 text-rose-700 dark:text-rose-300">
          <AlertCircle className="h-4 w-4" />
        </span>
        <div className="text-[12px] font-semibold text-rose-700 dark:text-rose-300">
          {apiError}
        </div>
      </div>
    </div>
  );
});

const SecretCodeInput = memo(function SecretCodeInput({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (code: string) => void;
  error?: string;
}) {
  const [localCode, setLocalCode] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.slice(0, 4);
    setLocalCode(val);
    onChange(val);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        <span className="flex items-center gap-2">
          <KeyRound className="w-4 h-4" />
          Code secret (4 caractères)
        </span>
      </label>
      <input
        type="text"
        maxLength={4}
        value={localCode}
        onChange={handleChange}
        placeholder=""
        className={cx(
          "w-full px-4 py-3 rounded-xl border-2 transition-all text-center text-2xl tracking-[0.5em] font-mono",
          error
            ? "border-red-500 bg-red-50 dark:bg-red-950/20"
            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-purple-500"
        )}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
        <Info className="w-3 h-3" />
        Code pour récupérer vos gains (4 caractères)
      </p>
    </div>
  );
});

const PhoneInput = memo(function PhoneInput({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (phone: string) => void;
  error?: string;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.slice(0, 20);
    onChange(val);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        <span className="flex items-center gap-2">
          <Phone className="w-4 h-4" />
          Numéro de téléphone
        </span>
      </label>
      <input
        type="text"
        inputMode="text"
        value={value}
        onChange={handleChange}
        placeholder=""
        className={cx(
          "w-full px-4 py-3 rounded-xl border-2 transition-all",
          error
            ? "border-red-500 bg-red-50 dark:bg-red-950/20"
            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-purple-500"
        )}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
});

export default function ProfilPageClientDoors() {
  const { handleChange, handleSubmit, apiError, errors, form, handleReset, countryOptions, submitClass, cancelClass } = useSlide4SectionDoors();

  return (
    <main className="w-full mx-auto flex flex-col items-center justify-center text-center">
      <section
        className={cx(
          "w-full max-w-2xl dark:bg-slate-950/55 dark:shadow-[0_18px_60px_rgba(0,0,0,0.35)]",
          "px-3 py-4 sm:px-6 sm:py-6"
        )}
      >
        <div className="flex flex-col items-center justify-center gap-3">
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center justify-center gap-4">
            <div className="w-full bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-2xl p-4 mb-1">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-bold text-purple-700 dark:text-purple-400">Sécurité des gains</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <SecretCodeInput
                  value={form.secretCode || ""}
                  onChange={(code) => handleChange({ target: { name: "secretCode", value: code } } as any)}
                  error={errors.secretCode}
                />
                <PhoneInput
                  value={form.phone || ""}
                  onChange={(phone) => handleChange({ target: { name: "phone", value: phone } } as any)}
                  error={errors.phone}
                />
              </div>
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField
                label="Nom"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                error={errors.nom}
                placeholder="Votre nom de famille"
              />

              <InputField
                label="Prénoms"
                name="prenoms"
                value={form.prenoms}
                onChange={handleChange}
                error={errors.prenoms}
                placeholder="Tous vos prénoms"
              />
            </div>

            <div className="w-full grid grid-cols-1 gap-3">
              <InputField
                label="Date de naissance"
                name="dateNaissance"
                type="date"
                value={form.dateNaissance}
                onChange={handleChange}
                error={errors.dateNaissance}
              />
            </div>

            <div className="w-full grid grid-cols-1 gap-3">
              <RegisterSelectField
                label="Pays"
                name="country"
                value={form.country}
                onChange={handleChange}
                error={errors.country}
                options={countryOptions}
              />
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
              <RegisterSelectField
                label="Genre"
                name="gender"
                value={form.gender ?? ''}
                onChange={handleChange}
                error={errors.gender}
                options={GENDER_OPTIONS}
              /> 
            </div>

            {apiError && <ApiErrorCard apiError={apiError} />}

            <div className="w-full flex flex-col items-center justify-center gap-2 pt-1">
              <button type="submit" className={submitClass}>
                Valider et continuer
              </button>
              <button type="button" onClick={handleReset} className={cancelClass}>
                <span className="inline-flex items-center justify-center gap-2">
                  <X className="h-4 w-4" />
                  Annuler
                </span>
              </button>
            </div>
          </form>
        </div>

        <div className="w-full text-center mt-4">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" />
            Ces informations sont nécessaires pour sécuriser vos gains
          </p>
        </div>
      </section>
    </main>
  );
}