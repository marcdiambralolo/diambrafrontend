'use client';
import ErrorState from "@/components/monprofil/ErrorState";
import { useMonProfil } from "@/hooks/carteduciel/useMonProfil";
import { cx } from "@/lib/functions";
import { motion, useReducedMotion,Variants  } from "framer-motion";
import {
  Award,
  CalendarDays,
  MapPin,
  UserRound
} from "lucide-react";
import { memo, type ReactNode } from "react";

// ==================== CONSTANTES D'ANIMATION ====================
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

export const ConsultantCta = memo(function ConsultantCta() {
  return (
    <motion.div
      variants={fadeInUp}
      className="text-center relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8 shadow-sm border border-indigo-100"
    >
      <h2 className="text-xl sm:text-2xl font-black text-gray-900">
        DEVENEZ CONSULTANT SUR MON ÉTOILE
      </h2>
      <p className="mt-4 text-base text-gray-700 max-w-2xl mx-auto font-medium">
        Vous êtes Maître, Guide Spirituel, Coach, TradiPraticien, Guérisseur de l'âme, Prêtre ou Prêtresse...
      </p>
      <ul className="mt-6 space-y-2 max-w-xl mx-auto text-left text-gray-600 text-base font-normal list-disc list-inside">
        <li>Publiez votre présentation.</li>
        <li>Recevez des consultations.</li>
        <li>Faites évoluer votre activité dans un environnement professionnel et crédible.</li>
      </ul>
      <a
        href="/star/medium/inscription"
        className="mt-8 inline-block rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 text-base font-bold text-white shadow-md transition-all hover:shadow-lg"
      >
        S'INSCRIRE
      </a>
    </motion.div>
  );
});

// ==================== IDENTITY OVERVIEW PREMIUM ====================
export const IdentityOverview = memo(function IdentityOverview({
  fullName,
  grade,
  dateNaissanceLabel,
  heureNaissance,
  lieuNaissance,
}: {
  fullName: string;
  grade: string;
  dateNaissanceLabel: string;
  heureNaissance: string;
  lieuNaissance: string;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm"
    >
      {/* Effet de brillance */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-purple-50/30" />

      <div className="relative p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
          {/* Affichage vertical des IdentityPill */}
          <div className="flex flex-col gap-3">
            <IdentityPill
              icon={<UserRound className="h-4 w-4" />}
              label="Nom complet"
              value={fullName}
            />
            <IdentityPill
              icon={<Award className="h-4 w-4" />}
              label="Grade"
              value={grade}
            />
            <IdentityPill
              icon={<CalendarDays className="h-4 w-4" />}
              label="Date & heure"
              value={`${dateNaissanceLabel} à ${heureNaissance}`}
            />
            <IdentityPill
              icon={<MapPin className="h-4 w-4" />}
              label="Lieu de naissance"
              value={lieuNaissance}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// ==================== PREMIUM SHELL ====================
export function PremiumShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      className={cx(
        "relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

// ==================== HUB SECTION ====================
export function HubSection({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <PremiumShell className={cx("p-6", className)}>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {children}
    </PremiumShell>
  );
}

// ==================== TAB BUTTON ====================
export const HubTabButton = memo(function HubTabButton({
  active,
  icon,
  onClick,
  children,
}: {
  active: boolean;
  icon: ReactNode;
  onClick: () => void;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      className={cx(
        "relative inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300",
        active
          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
          : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50"
      )}
    >
      {icon}
      <span>{children}</span>
    </motion.button>
  );
});

export const IdentityPill = memo(function IdentityPill({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <motion.div
      whileHover={{ x: 2 }}
      className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 transition-all hover:shadow-sm"
    >
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
        {icon}
        {label}
      </div>
      <div className="mt-1.5 text-sm font-semibold text-gray-800">
        {value || "—"}
      </div>
    </motion.div>
  );
});

const UserHub = memo(function UserHub() {
  const {
    processedData,
    fullName,
    grade,
    dateNaissanceLabel,
    heureNaissance,
    lieuNaissance,
  } = useMonProfil();

  if (!processedData) return <ErrorState />;

  return (
    <div className="relative min-h-screen ">
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-8"
        >
          {/* Section Hero */}
          <motion.div variants={fadeInUp} className="text-center">

            <h1 className="text-3xl font-black text-gray-900 sm:text-4xl">
              Mon Profil
            </h1>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              Gérez votre profil, suivez vos consultations et développez votre activité
            </p>
          </motion.div>

          {/* Grille principale */}
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* Colonne gauche - Identité */}
            <IdentityOverview
              fullName={fullName}
              grade={grade}
              dateNaissanceLabel={dateNaissanceLabel}
              heureNaissance={heureNaissance}
              lieuNaissance={lieuNaissance}
            />

            {/* Colonne droite - CTA */}
            <ConsultantCta />
          </div>
        </motion.div>
      </div>
    </div>
  );
});

export default UserHub;