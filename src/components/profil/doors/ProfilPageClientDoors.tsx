"use client";
import InputField from "@/components/commons/InputField";
import RegisterSelectField from "@/components/commons/RegisterSelectField";
import { useSlide4SectionDoors } from "@/hooks/cinqetoiles/useSlide4SectionDoors";
import { cx } from "@/lib/functions";
import {
  AlertCircle,
  KeyRound,
  Phone,
  Shield,
  X,
  Info,
  Calendar,
} from "lucide-react";
import { memo, useState, useCallback, useEffect } from "react";

export const GENDER_OPTIONS = [
  { value: "", label: "Sélectionner" },
  { value: "male", label: "Homme" },
  { value: "female", label: "Femme" },
] as const;

const DAYS = Array.from({ length: 31 }, (_, i) => {
  const value = String(i + 1);
  return { value, label: value };
});

const MONTHS = [
  { value: "1", label: "Janvier" },
  { value: "2", label: "Février" },
  { value: "3", label: "Mars" },
  { value: "4", label: "Avril" },
  { value: "5", label: "Mai" },
  { value: "6", label: "Juin" },
  { value: "7", label: "Juillet" },
  { value: "8", label: "Août" },
  { value: "9", label: "Septembre" },
  { value: "10", label: "Octobre" },
  { value: "11", label: "Novembre" },
  { value: "12", label: "Décembre" },
];

const YEARS = Array.from({ length: 100 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return { value: String(year), label: String(year) };
});

interface BirthDateInputProps {
  day: string;
  month: string;
  year: string;
  onDayChange: (value: string) => void;
  onMonthChange: (value: string) => void;
  onYearChange: (value: string) => void;
  error?: string;
}

const BirthDateInput = memo(function BirthDateInput({
  day,
  month,
  year,
  onDayChange,
  onMonthChange,
  onYearChange,
  error,
}: BirthDateInputProps) {
  return (
    <div className="w-full">
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        <span className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Date de naissance
        </span>
      </label>

      <div className="grid grid-cols-3 gap-2">
        <select
          value={day}
          onChange={(e) => onDayChange(e.target.value)}
          className={cx(
            "rounded-xl border-2 bg-white px-3 py-3 transition-all dark:bg-gray-800",
            error
              ? "border-red-500 bg-red-50 dark:bg-red-950/20"
              : "border-gray-200 focus:border-purple-500 dark:border-gray-700"
          )}
        >
          <option value="">Jour</option>
          {DAYS.map((dayOption) => (
            <option key={dayOption.value} value={dayOption.value}>
              {dayOption.label}
            </option>
          ))}
        </select>

        <select
          value={month}
          onChange={(e) => onMonthChange(e.target.value)}
          className={cx(
            "rounded-xl border-2 bg-white px-3 py-3 transition-all dark:bg-gray-800",
            error
              ? "border-red-500 bg-red-50 dark:bg-red-950/20"
              : "border-gray-200 focus:border-purple-500 dark:border-gray-700"
          )}
        >
          <option value="">Mois</option>
          {MONTHS.map((monthOption) => (
            <option key={monthOption.value} value={monthOption.value}>
              {monthOption.label}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
          className={cx(
            "rounded-xl border-2 bg-white px-3 py-3 transition-all dark:bg-gray-800",
            error
              ? "border-red-500 bg-red-50 dark:bg-red-950/20"
              : "border-gray-200 focus:border-purple-500 dark:border-gray-700"
          )}
        >
          <option value="">Année</option>
          {YEARS.map((yearOption) => (
            <option key={yearOption.value} value={yearOption.value}>
              {yearOption.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

const ApiErrorCard = memo(function ApiErrorCard({ apiError }: { apiError: string }) {
  return (
    <div
      className="w-full rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-3"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start justify-center gap-2 text-center">
        <span className="mt-0.5 grid h-8 w-8 place-items-center rounded-xl bg-rose-500/15 text-rose-700 dark:text-rose-300">
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

  useEffect(() => {
    setLocalCode(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.slice(0, 4);
    setLocalCode(val);
    onChange(val);
  };

  return (
    <div className="w-full">
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        <span className="flex items-center gap-2">
          <KeyRound className="h-4 w-4" />
          Code secret (À retenir)
        </span>
      </label>
      <input
        type="text"
        maxLength={4}
        value={localCode}
        onChange={handleChange}
        className={cx(
          "w-full rounded-xl border-2 px-4 py-3 text-center font-mono text-2xl tracking-[0.5em] transition-all",
          error
            ? "border-red-500 bg-red-50 dark:bg-red-950/20"
            : "border-gray-200 bg-white focus:border-purple-500 dark:border-gray-700 dark:bg-gray-800"
        )}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
        <Info className="h-3 w-3" />
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
    onChange(e.target.value.slice(0, 20));
  };

  return (
    <div className="w-full">
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        <span className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          Numéro de téléphone
        </span>
      </label>
      <input
        type="text"
        inputMode="text"
        value={value}
        onChange={handleChange}
        className={cx(
          "w-full rounded-xl border-2 px-4 py-3 transition-all",
          error
            ? "border-red-500 bg-red-50 dark:bg-red-950/20"
            : "border-gray-200 bg-white focus:border-purple-500 dark:border-gray-700 dark:bg-gray-800"
        )}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

function parseDateParts(date: string) {
  if (!date) return { day: "", month: "", year: "" };

  const parts = date.split("-");
  if (parts.length !== 3) return { day: "", month: "", year: "" };

  const [year, month, day] = parts;

  return {
    year,
    month: String(Number(month)),
    day: String(Number(day)),
  };
}

function buildIsoDate(day: string, month: string, year: string) {
  if (!day || !month || !year) return "";

  const normalized = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  const testDate = new Date(`${normalized}T00:00:00`);

  const isValid =
    !Number.isNaN(testDate.getTime()) &&
    testDate.getFullYear() === Number(year) &&
    testDate.getMonth() + 1 === Number(month) &&
    testDate.getDate() === Number(day);

  return isValid ? normalized : "";
}

export default function ProfilPageClientDoors() {
  const {
    handleChange,
    handleSubmit,
    apiError,
    errors,
    form,
    handleReset,
    countryOptions,
    submitClass,
    cancelClass,
  } = useSlide4SectionDoors();

  const initialParts = parseDateParts(form.dateNaissance);

  const [birthDay, setBirthDay] = useState(initialParts.day);
  const [birthMonth, setBirthMonth] = useState(initialParts.month);
  const [birthYear, setBirthYear] = useState(initialParts.year);

  useEffect(() => {
    const parts = parseDateParts(form.dateNaissance);
    setBirthDay(parts.day);
    setBirthMonth(parts.month);
    setBirthYear(parts.year);
  }, [form.dateNaissance]);

  useEffect(() => {
    const isoDate = buildIsoDate(birthDay, birthMonth, birthYear);

    handleChange({
      target: {
        name: "dateNaissance",
        value: isoDate,
      },
    } as any);
  }, [birthDay, birthMonth, birthYear, handleChange]);

  const handleDayChange = useCallback((day: string) => {
    setBirthDay(day);
  }, []);

  const handleMonthChange = useCallback((month: string) => {
    setBirthMonth(month);
  }, []);

  const handleYearChange = useCallback((year: string) => {
    setBirthYear(year);
  }, []);

  return (
    <main className="mx-auto flex w-full flex-col items-center justify-center text-center">
      <section
        className={cx(
          "w-full max-w-2xl px-3 py-4 sm:px-6 sm:py-6",
          "dark:bg-slate-950/55 dark:shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
        )}
      >
        <div className="flex flex-col items-center justify-center gap-3">
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col items-center justify-center gap-4"
          >
            <div className="mb-1 w-full rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 p-4 dark:from-purple-950/30 dark:to-indigo-950/30">
              <div className="mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-bold text-purple-700 dark:text-purple-400">
                  Sécurité des gains
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <SecretCodeInput
                  value={form.secretCode || ""}
                  onChange={(code) =>
                    handleChange({
                      target: { name: "secretCode", value: code },
                    } as any)
                  }
                  error={errors.secretCode}
                />

                <PhoneInput
                  value={form.phone || ""}
                  onChange={(phone) =>
                    handleChange({
                      target: { name: "phone", value: phone },
                    } as any)
                  }
                  error={errors.phone}
                />
              </div>
            </div>

            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
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

            <BirthDateInput
              day={birthDay}
              month={birthMonth}
              year={birthYear}
              onDayChange={handleDayChange}
              onMonthChange={handleMonthChange}
              onYearChange={handleYearChange}
              error={errors.dateNaissance}
            />

            <div className="grid w-full grid-cols-1 gap-3">
              <RegisterSelectField
                label="Pays"
                name="country"
                value={form.country}
                onChange={handleChange}
                error={errors.country}
                options={countryOptions}
              />
            </div>

            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
              <RegisterSelectField
                label="Genre"
                name="gender"
                value={form.gender ?? ""}
                onChange={handleChange}
                error={errors.gender}
                options={GENDER_OPTIONS}
              />
            </div>

            {apiError && <ApiErrorCard apiError={apiError} />}

            <div className="flex w-full flex-col items-center justify-center gap-2 pt-1">
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

        <div className="mt-4 w-full text-center">
          <p className="flex items-center justify-center gap-1 text-xs text-gray-400">
            <Shield className="h-3 w-3" />
            Ces informations sont nécessaires pour sécuriser vos gains
          </p>
        </div>
      </section>
    </main>
  );
}
