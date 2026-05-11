"use client";
import { GENDER_OPTIONS } from "@/components/categorie/formgroupe/FormFieldsGroupe";
import InputField from "@/components/commons/InputField";
import RegisterSelectField from "@/components/commons/RegisterSelectField";
import { useSlide4SectionDoors } from "@/hooks/cinqetoiles/useSlide4SectionDoors";
import { cx } from "@/lib/functions";
import { AlertCircle, Info, Sparkles, X } from "lucide-react";
import { memo } from "react";

const SectionTitle = memo(function SectionTitle({ title, }: { title: string; }) {

  return (
    <div className="w-full flex flex-col items-center justify-center text-center gap-1">
      <div className="inline-flex items-center justify-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-slate-700 dark:text-slate-200">
        <Sparkles className="h-4 w-4" />
        <span>{title}</span>
      </div>
    </div>
  );
});

const HintCard = memo(function HintCard() {

  return (
    <div className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-slate-950/55 px-4 py-3">
      <div className="flex items-start justify-center text-center gap-2">
        <span className="mt-0.5 h-8 w-8 rounded-xl grid place-items-center bg-black/5 dark:bg-white/10">
          <Info className="h-4 w-4 text-slate-700 dark:text-slate-200" />
        </span>
        <p className="text-[12px] leading-snug text-slate-700 dark:text-slate-200">
          <span className="font-semibold">Important :</span> Veuillez renseigner ce formulaire avec des informations justes et exactes {" "}
          <span className="font-semibold">afin de garantir une analyse plus précise.</span>
        </p>
      </div>
    </div>
  );
});

const ApiErrorCard = memo(function ApiErrorCard({ apiError, }: { apiError: string; }) {

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


export default function ProfilPageClientDoors() {
  const { handleChange, handleSubmit, apiError, errors, form, handleReset, countryOptions, submitClass, cancelClass } = useSlide4SectionDoors();

  return (
    <main className="w-full mx-auto mt-8 flex flex-col items-center justify-center text-center">
      <section
        className={cx(
          "w-full max-w-2xl dark:bg-slate-950/55 dark:shadow-[0_18px_60px_rgba(0,0,0,0.35)]",
          "px-4 py-5 sm:px-6 sm:py-6"
        )}
      >
        <SectionTitle title="Informations requises" />
        <div className="mt-4 flex flex-col items-center justify-center gap-3">
          <HintCard />
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center justify-center gap-4">
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

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField
                label="Date de naissance"
                name="dateNaissance"
                type="date"
                value={form.dateNaissance}
                onChange={handleChange}
                error={errors.dateNaissance}
              />

              <InputField
                label="Heure de naissance"
                name="heureNaissance"
                type="time"
                value={form.heureNaissance}
                onChange={handleChange}
                error={errors.heureNaissance}
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

              <RegisterSelectField
                label="Pays de naissance"
                name="country"
                value={form.country ?? ''}
                onChange={handleChange}
                error={errors.country}
                options={countryOptions}
              />
            </div>

            <div className="w-full">
              <InputField
                label="Ville de naissance"
                name="villeNaissance"
                value={form.villeNaissance}
                onChange={handleChange}
                error={errors.villeNaissance}
                placeholder="Ex: Abidjan, Paris…"
              />
            </div>

            <div>
              {apiError ? <ApiErrorCard apiError={apiError} /> : null}
            </div>

            <div className="w-full flex flex-col items-center justify-center gap-2 pt-1">
              <button
                type="submit"
                className={submitClass}
              >
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
      </section>
    </main>
  );
}