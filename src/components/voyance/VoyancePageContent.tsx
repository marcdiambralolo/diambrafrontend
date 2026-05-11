'use client';
import Loader from "@/app/loading";
import { useConsultants } from "@/hooks/voyance/useConsultants";
import { cx, toMediaUrl } from "@/lib/functions";
import { User } from "@/lib/interfaces";
import { AnimatePresence, motion,Variants  } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Eye, Moon, Sparkles, Verified } from "lucide-react";
import Image from "next/image";
import React, { memo, useMemo, useState } from "react";

const UI_PAGE_COUNT = 5;

function safeStr(value: unknown, fallback = "—") {
  const normalized =
    typeof value === "string"
      ? value.trim()
      : value == null
        ? ""
        : String(value).trim();

  return normalized || fallback;
}
const ElegantPagination = memo(({
  page,
  totalPages,
  onPrev,
  onNext,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onPage: (page: number) => void;
}) => {
  const visiblePages = useMemo(() => {
    const maxVisible = Math.min(UI_PAGE_COUNT, totalPages);
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = startPage + maxVisible - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }, [page, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="mt-16 flex items-center justify-center gap-3">
      <motion.button
        whileHover={{ scale: 1.05, x: -2 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={onPrev}
        disabled={page <= 1}
        className={cx(
          "inline-flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300",
          page <= 1
            ? "cursor-not-allowed bg-gray-100 text-gray-400"
            : "bg-white text-gray-700 shadow-md hover:shadow-lg hover:bg-gray-50 border border-gray-200"
        )}
      >
        <ChevronLeft className="h-5 w-5" />
      </motion.button>

      <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-md border border-gray-200">
        {visiblePages.map((currentPage, idx) => {
          const isActive = currentPage === page;
          return (
            <React.Fragment key={currentPage}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => onPage(currentPage)}
                className={cx(
                  "relative h-9 min-w-[2.25rem] rounded-full text-sm font-semibold transition-all duration-300",
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {currentPage}
                {isActive && (
                  <motion.div
                    layoutId="activePageLight"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
              {idx < visiblePages.length - 1 && (
                <span className="select-none text-gray-300 text-xs">•</span>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <motion.button
        whileHover={{ scale: 1.05, x: 2 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={onNext}
        disabled={page >= totalPages}
        className={cx(
          "inline-flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300",
          page >= totalPages
            ? "cursor-not-allowed bg-gray-100 text-gray-400"
            : "bg-white text-gray-700 shadow-md hover:shadow-lg hover:bg-gray-50 border border-gray-200"
        )}
      >
        <ChevronRight className="h-5 w-5" />
      </motion.button>
    </div>
  );
});

const ConsultantCard = memo(({
  practitioner,
  onConsultClick,
  index,
}: {
  practitioner: User;
  onConsultClick: (p: User) => void;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const initial = practitioner?.nom ? practitioner.nom.slice(0, 1).toUpperCase() : "✨";
  const displayName = practitioner?.nomconsultant || practitioner?.username || practitioner?.nom || "Guide Spirituel";
  const presentation = practitioner?.presentation || "Expert en voyance et guidance spirituelle";

  const specialties = useMemo(() => {
    if (!Array.isArray(practitioner?.specialties)) return [];
    return practitioner.specialties
      .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
      .slice(0, 4);
  }, [practitioner?.specialties]);

  const photoUrl = useMemo(() => {
    const photo = safeStr(practitioner?.photo, "");
    const profilePicture = safeStr(practitioner?.profilePicture, "");
    const avatar = safeStr(practitioner?.avatar, "");
    return toMediaUrl(photo || profilePicture || avatar || null);
  }, [practitioner?.avatar, practitioner?.photo, practitioner?.profilePicture]);

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 120,
        delay: index * 0.08
      }
    },
    hover: {
      y: -8,
      transition: { type: "spring", stiffness: 400, damping: 25 }
    }
  };

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group w-full overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 rounded-3xl" />
      </div>
      <div className="absolute top-4 right-4 z-20">
        <motion.div
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-md"
        >
          <Verified className="w-4 h-4 text-indigo-500" />
        </motion.div>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative aspect-[4/4]">
          {photoUrl && !imageError ? (
            <>
              <Image
                src={photoUrl}
                alt={displayName}
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover transition-all duration-700 group-hover:scale-110"
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
            </>
          ) : (
            <div className="grid h-full w-full place-items-center bg-gradient-to-br from-indigo-100 to-purple-100">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl font-black text-indigo-400"
              >
                {initial}
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <div className="p-5 text-left">
        <div className="flex items-start justify-between mb-2">
          <div>
            <motion.h3
              className="text-xl font-bold text-gray-900"
              animate={{ color: isHovered ? "#4F46E5" : "#111827" }}
              transition={{ duration: 0.3 }}
            >
              {displayName}
            </motion.h3>
          </div>
        </div>

        {specialties.length > 0 && (
          <motion.div
            className="mt-3 flex flex-wrap gap-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {specialties.map((specialty, idx) => (
              <motion.span
                key={specialty}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15 + idx * 0.05 }}
                className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600"
              >
                {specialty}
              </motion.span>
            ))}
          </motion.div>
        )}

        <motion.p
          className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {presentation}
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => onConsultClick(practitioner)}
          className="relative mt-4 w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 group/btn shadow-md hover:shadow-lg transition-all"
        >
          <span className="relative z-10 flex items-center justify-center gap-2 text-sm font-semibold text-white">
            Consulter
            <Calendar className="w-4 h-4" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
        </motion.button>
      </div>
    </motion.article>
  );
});

const HeroSection = memo(() => (
  <motion.header
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="text-center mb-16"
  >
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-6 shadow-sm"
    >
      <Sparkles className="w-4 h-4 text-indigo-500" />
      <span className="text-xs font-semibold text-indigo-600 tracking-wide">MON ETOILE PREMIUM</span>
      <Moon className="w-3.5 h-3.5 text-indigo-400" />
    </motion.div>

    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-4">
      <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
        GUIDANCE
      </span>
    </h1>

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mt-4"
    >
      Connectez-vous avec des voyants et médiums d'exception, sélectionnés pour leur authenticité et leur bienveillance.
    </motion.p>

    {/* Séparateur décoratif */}
    <div className="flex items-center justify-center gap-2 mt-8">
      <div className="w-12 h-px bg-gradient-to-r from-transparent to-indigo-300" />
      <Eye className="w-4 h-4 text-indigo-400" />
      <div className="w-12 h-px bg-gradient-to-l from-transparent to-indigo-300" />
    </div>
  </motion.header>
));

const EmptyState = memo(() => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100"
  >
    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-50 mb-6">
      <Moon className="w-10 h-10 text-indigo-400" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun consultant disponible</h3>
    <p className="text-gray-500 max-w-sm mx-auto">
      Revenez bientôt pour découvrir nos guides spirituels.
    </p>
  </motion.div>
));

export default function VoyancePageContent() {
  const {
    onConsultClick, onPrev, onNext, onPage, refetch, hasConsultants,
    consultantsList, totalPages, isLoading, isError, error, page,
  } = useConsultants();

  if (isError) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    return (
      <main className="min-h-screen bg-white px-4 py-20">
        <div className="mx-auto w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center"
          >
            <p className="text-red-600 font-medium">{errorMessage}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-white font-semibold transition hover:scale-105 shadow-md"
            >
              Réessayer
            </button>
          </motion.div>
        </div>
      </main>
    );
  }

  if (isLoading) return <Loader />;

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-16">
        <HeroSection />

        <AnimatePresence mode="wait">
          {hasConsultants ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {consultantsList.map((p, idx) => (
                <ConsultantCard
                  key={p._id || p.id || idx}
                  practitioner={p}
                  onConsultClick={onConsultClick}
                  index={idx}
                />
              ))}
            </motion.div>
          ) : (
            <EmptyState />
          )}
        </AnimatePresence>

        {totalPages > 1 && hasConsultants && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ElegantPagination
              page={page}
              totalPages={totalPages}
              onPrev={onPrev}
              onNext={onNext}
              onPage={onPage}
            />
          </motion.div>
        )}
      </div>
    </main>
  );
}