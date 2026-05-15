"use client";
import { useMonProfil } from "@/hooks/carteduciel/useMonProfil";
import { motion, Variants } from "framer-motion";
import {
  AlertCircle,
  Award,
  CalendarDays,
  MapPin,
  UserRound
} from "lucide-react";
import { memo, type ReactNode } from "react";
import ConsultationsListMain from "../consultations/main/ConsultationsListMain";

const ErrorState = memo(() => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex items-center justify-center p-4 bg-gradient-to-br from-[#070B1A] via-[#0F1C3F] to-[#162A56]"
  >
    <div className="max-w-md rounded-2xl border border-[#4F83D1]/25 bg-[#13274C]/70 p-8 text-center backdrop-blur-xl">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <AlertCircle className="mx-auto mb-4 h-16 w-16 text-[#9BC2FF]" />
      </motion.div>

      <h3 className="text-xl font-bold text-white mb-2">Accès refusé</h3>
      <p className="text-[#DDE7FA]">Aucun utilisateur connecté. Veuillez vous connecter.</p>
    </div>
  </motion.div>
));


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
// ==================== IDENTITY OVERVIEW PREMIUM ====================
export const IdentityOverview = memo(function IdentityOverview({
  fullName,
  dateNaissanceLabel,
  heureNaissance,
  lieuNaissance,
}: {
  fullName: string;
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
        <div className="flex flex-col gap-3">
          <IdentityPill
            icon={<UserRound className="h-4 w-4" />}
            label="Nom complet"
            value={fullName}
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
    </motion.div>
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
              Gérez votre profil, suivez vos Jeux et développez votre activité
            </p>
          </motion.div>
          <IdentityOverview
            fullName={fullName}
            dateNaissanceLabel={dateNaissanceLabel}
            heureNaissance={heureNaissance}
            lieuNaissance={lieuNaissance}
          />

        </motion.div>
      </div>
    </div>
  );
});

function MonProfilPageClientImpl() {

  return (
    <main className="relative mx-auto w-full max-w-5xl px-4 py-8 text-slate-900 sm:px-6 sm:py-10">
      <div className="w-full mx-auto flex flex-col items-center justify-center gap-4">
        <UserHub />
        <ConsultationsListMain />
      </div>
    </main>
  );
}

const MonProfilPageClient = memo(MonProfilPageClientImpl);

export default MonProfilPageClient;