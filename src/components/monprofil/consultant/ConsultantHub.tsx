'use client';
import ErrorState from "@/components/monprofil/ErrorState";
import { useMonProfil } from "@/hooks/carteduciel/useMonProfil";
import { cx } from "@/lib/functions";
import type { User } from "@/lib/interfaces";
import { motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Clock,
  Edit3,
  Heart,
  MapPin,
  Phone,
  Sparkles,
  User as UserIcon,
  Verified,
  Video,
  Zap
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { memo, ReactNode } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

const SectionTitle = memo(function SectionTitle({
  title,
  subtitle
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      <div className="h-0.5 w-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-2" />
    </div>
  );
});

const InfoRow = memo(function InfoRow({
  icon,
  label,
  value,
  delay = 0,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      transition={{ delay }}
      whileHover={{ scale: 1.01, x: 2 }}
      className={cx(
        "flex items-start gap-3 rounded-xl border p-4 transition-all duration-300",
        "border-gray-100 bg-white hover:shadow-md",
      )}
    >
      <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-500">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          {label}
        </div>
        <div className="mt-1 break-words text-sm font-semibold text-gray-800">
          {value}
        </div>
      </div>
    </motion.div>
  );
});

const ConsultantPanel = memo(function ConsultantPanel({ user }: { user: User }) {
  const router = useRouter();

  const fullName = `${user?.nom || ''} ${user?.prenoms || ''}`.trim() || user?.username || "Consultant";
  const nomConsultant = user?.nomconsultant || user.username;
  const specialties = Array.isArray(user?.specialties) ? user.specialties : [];
  const methods = Array.isArray(user?.methods) ? user.methods : [];
  const domains = Array.isArray(user?.domains) ? user.domains : [];
  const expYears = user?.experienceYears || 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-5xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center mb-6"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => router.push("/star/medium/update")}
          className="inline-flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm"
        >
          <Edit3 className="h-4 w-4" />
          Modifier mon profil
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm mb-8"
      >
        <div className="p-6">
          <SectionTitle
            title="Informations personnelles"
            subtitle="Identité et coordonnées"
          />

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid gap-4 md:grid-cols-2"
          >
            <InfoRow icon={<UserIcon className="h-4 w-4" />} label="Nom complet" value={fullName} delay={0} />
            <InfoRow icon={<Phone className="h-4 w-4" />} label="Téléphone" value={user?.phone || "Non renseigné"} delay={0.05} />
            <InfoRow icon={<MapPin className="h-4 w-4" />} label="Pays" value={user?.country || "Côte d'Ivoire"} delay={0.1} />
            <InfoRow icon={<Calendar className="h-4 w-4" />} label="Date de naissance" value={user?.dateNaissance ? new Date(user.dateNaissance).toLocaleDateString("fr-FR") : "Non renseignée"} delay={0.15} />
            <InfoRow icon={<Clock className="h-4 w-4" />} label="Heure de naissance" value={user?.heureNaissance || "Non renseignée"} delay={0.2} />
            <InfoRow icon={<MapPin className="h-4 w-4" />} label="Lieu de naissance" value={`${user?.villeNaissance || ""} ${user?.paysNaissance ? `(${user.paysNaissance})` : ""}`.trim() || "Non renseigné"} delay={0.25} />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm"
      >
        <div className="p-6">
          <SectionTitle
            title="A propos du consultant"
            subtitle="Parcours, spécialités et présentation"
          />

          <div className="relative bg-gradient-to-r from-indigo-50 via-white to-purple-50 rounded-xl p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative shrink-0 flex flex-col items-center"
              >
                <div className="relative h-32 w-32 overflow-hidden rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br from-indigo-100 to-purple-100">
                  {user?.photo ? (
                    <Image
                      src={user.photo}
                      alt={fullName}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-3xl font-bold text-indigo-400">
                        {fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  {nomConsultant && (
                    <>
                      <div className="mb-1 flex justify-center">
                        <span className="inline-flex items-center gap-1">
                          <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-blue-800 to-blue-600 border-2 border-white shadow w-7 h-7">
                            <Verified className="h-4 w-4 text-white" />
                          </span>
                        </span>
                      </div>
                      <div className="text-base font-bold text-indigo-700 text-center max-w-[140px] truncate">
                        {nomConsultant}
                      </div>
                    </>
                  )}
                </div>

              </motion.div>
            </div>
          </div>

          {(user?.presentation || user?.message) ? (
            <motion.div
              variants={fadeInUp}
              className="p-5 rounded-xl bg-gray-50 border border-gray-100 mb-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 text-indigo-500" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">À propos de moi</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {String(user?.presentation || user?.message)}
              </p>
            </motion.div>
          ) : null}

          <div className="flex-1 mb-8">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-indigo-500" />
                <span className="font-semibold text-gray-700">{String(expYears)}</span>
                <span className="text-gray-500">ans d'expérience</span>
              </div>
            </div>

            {user?.spiritualQuote ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-3 text-sm italic text-gray-600 border-l-3 border-indigo-300 pl-3"
              >
                {`“${user.spiritualQuote}”`}
              </motion.p>
            ) : null}
          </div>

          <div className="flex flex-col gap-8 mb-6">
            {specialties.length > 0 && (
              <motion.div variants={fadeInUp}>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Spécialités</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {specialties.map((s, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700"
                    >
                      {s}
                    </motion.span>
                  ))}
                  {user?.specialtyOther ? (
                    <span className="rounded-full bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700">
                      {String(user.specialtyOther)}
                    </span>
                  ) : null}
                </div>
              </motion.div>
            )}

            {methods.length > 0 && (
              <motion.div variants={fadeInUp}>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Méthodes</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {methods.map((m, i) => (
                    <span key={i} className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700">
                      {m}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {domains.length > 0 && (
              <motion.div variants={fadeInUp}>
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-4 w-4 text-rose-500" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Domaines</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {domains.map((d, i) => (
                    <span key={i} className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700">
                      {d}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {user?.videoLink ? (
            <motion.div
              variants={fadeInUp}
              className="p-5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-indigo-600" />
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Vidéo de présentation</span>
                </div>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  href={String(user.videoLink)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-indigo-700"
                >
                  <Video className="h-3.5 w-3.5" />
                  Regarder
                </motion.a>
              </div>
            </motion.div>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
});

const ConsultantHub = memo(function ConsultantHub() {
  const { processedData } = useMonProfil();

  if (!processedData) return <ErrorState />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <ConsultantPanel user={processedData} />
      </div>
    </div>
  );
});

export default ConsultantHub;