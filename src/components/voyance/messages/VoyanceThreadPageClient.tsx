'use client';
import Loader from "@/app/loading";
import { formatDateFR, usePractitionerReviews } from "@/hooks/voyance/message/usePractitionerReviews";
import { cx } from "@/lib/functions";
import type { User } from "@/lib/interfaces";
import { PractitionerReview } from "@/lib/interfaces";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award, BookOpen, ChevronDown, Clock, Heart, Maximize2, MessageCircle,
  PlayCircle, Send, Share2, Sparkles, Star, Verified, X, Zap
} from "lucide-react";
import Image from "next/image";
import { type FormEvent, type KeyboardEvent, memo, type MutableRefObject, useMemo, useState } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const ConsultantPanel = memo(function ConsultantPanel({ user }: { user: User }) {
  const photoUrl = useMemo(() => {
    if (!user?.photo) return null;
    return user?.photo;
  }, [user?.photo]);

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
      className="w-full max-w-5xl mx-auto mb-8 px-4 sm:px-6$"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="overflow-hidden "
      >
        <div className="p-6">

          {/* Section photo et identité consultant */}
          <div className="relative bg-gradient-to-r from-indigo-50 via-white to-purple-50 rounded-xl p-6 mb-6">

            <div className="flex flex-col md:flex-row gap-6">
              {/* Photo */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative shrink-0 flex flex-col items-center"
              >
                <div className="relative h-64 w-64 overflow-hidden rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br from-indigo-100 to-purple-100">
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt={`Affiche de présentation de ${fullName}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 800px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
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

          {/* Présentation */}
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
          {/* Statistiques clés */}
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

          {/* Badges spécialités, méthodes, domaines */}
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
        </div>
      </motion.div>
    </motion.div>
  );
});

// ==================== MODAL POUR L'AFFICHE ====================
type PosterModalProps = {
  isOpen: boolean;
  posterUrl: string | null;
  mediumName: string;
  onClose: () => void;
  reduceMotion: boolean | null;
};

export function PosterModal({
  isOpen,
  posterUrl,
  mediumName,
  onClose,
  reduceMotion,
}: PosterModalProps) {
  return (
    <AnimatePresence>
      {isOpen && posterUrl && (
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0 }}
          animate={reduceMotion ? undefined : { opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
            animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
            className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative flex items-center justify-center max-h-[80vh] max-w-[80vw]">
              <Image
                src={posterUrl}
                alt={`Affiche de présentation de ${mediumName}`}
                width={1200}
                height={1600}
                className="object-contain max-h-[80vh] max-w-[80vw] w-auto h-auto"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ==================== MODAL VIDÉO ====================
type VoyanceVideoModalProps = {
  isOpen: boolean;
  mediumName: string;
  onClose: () => void;
  reduceMotion: boolean | null;
  videoEmbedUrl: string | null;
};

export function VoyanceVideoModal({
  isOpen,
  mediumName,
  onClose,
  reduceMotion,
  videoEmbedUrl,
}: VoyanceVideoModalProps) {
  return (
    <AnimatePresence>
      {isOpen && videoEmbedUrl ? (
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0 }}
          animate={reduceMotion ? undefined : { opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 18, scale: 0.98 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h3 className="font-semibold text-gray-900">Vidéo de présentation</h3>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition hover:bg-gray-200"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                src={videoEmbedUrl}
                title={`Vidéo de présentation de ${mediumName}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

// ==================== STAR RATING ====================
const StarRating = ({
  rating,
  onRatingChange,
  readonly = false,
  size = "md"
}: {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const sizes = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          whileHover={!readonly ? { scale: 1.2 } : {}}
          whileTap={!readonly ? { scale: 0.9 } : {}}
          onClick={() => !readonly && onRatingChange?.(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          className={cx(
            "transition-all duration-200",
            readonly ? "cursor-default" : "cursor-pointer"
          )}
        >
          <Star
            className={cx(
              sizes[size],
              (hoverRating >= star || rating >= star)
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200"
            )}
          />
        </motion.button>
      ))}
    </div>
  );
};

// ==================== SECTION AVIS PREMIUM ====================
function VoyanceReviewsSection({
  canSubmitReview,
  reviewComment,
  reviewRating,
  reviews,
  submitReview,
  updateReviewComment,
  updateReviewRating,
}: {
  canSubmitReview: boolean;
  reviewComment: string;
  reviewRating: number;
  reviews: PractitionerReview[];
  submitReview: (event: FormEvent<HTMLFormElement>) => void;
  updateReviewComment: (value: string) => void;
  updateReviewRating: (value: number) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length
    : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-amber-50">
            <MessageCircle className="h-5 w-5 text-amber-600" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-gray-900">Avis & témoignages</h3>
            {reviews.length > 0 && (
              <div className="flex items-center gap-2 mt-0.5">
                <StarRating rating={averageRating} readonly size="sm" />
                <span className="text-xs text-gray-500">({reviews.length} avis)</span>
              </div>
            )}
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden border-t border-gray-100 p-5"
          >
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence>
                {reviews.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-8 text-center"
                  >
                    <Sparkles className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                    <p className="text-sm font-medium text-gray-500">
                      Aucun avis pour le moment
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Soyez le premier à partager votre expérience
                    </p>
                  </motion.div>
                ) : (
                  reviews.map((review, idx) => (
                    <motion.article
                      key={review.id || `${review.author}-${review.createdAt}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="rounded-2xl bg-gray-50 p-4 transition-all hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                              <span className="text-xs font-bold text-white">
                                {review.author?.slice(0, 2).toUpperCase() || "A"}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm">
                                {review.author}
                              </h4>
                              {review.rating && (
                                <StarRating rating={review.rating} readonly size="sm" />
                              )}
                            </div>
                          </div>
                        </div>
                        <time className="text-xs text-gray-400">
                          {formatDateFR(review.createdAt)}
                        </time>
                      </div>
                      <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                        {review.comment}
                      </p>
                    </motion.article>
                  ))
                )}
              </AnimatePresence>
            </div>

            <form onSubmit={submitReview} className="rounded-2xl mt-6 bg-gray-50 p-4">
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Partager mon expérience
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Votre note
                  </label>
                  <StarRating
                    rating={reviewRating}
                    onRatingChange={updateReviewRating}
                    size="lg"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Votre avis
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => updateReviewComment(e.target.value)}
                    rows={4}
                    placeholder=""
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!canSubmitReview}
                  className={cx(
                    "w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2",
                    canSubmitReview
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md hover:shadow-lg hover:scale-[1.02]"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  )}
                >
                  <Send className="h-4 w-4" />
                  Publier mon avis
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}



// ==================== PANEL DE CONVERSATION ====================
function VoyanceConversationPanel({
  canSend,
  composerRef,
  draft,
  error,
  mediumName,
  onDraftChange,
  onKeyDown,
  onRetry,
  onSend,
  reviewsSection,
  reviewFeedback,
  reviewFeedbackTone,
}: {
  canSend: boolean;
  composerRef: MutableRefObject<HTMLTextAreaElement | null>;
  draft: string;
  error: string | null;
  mediumName: string;
  onDraftChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onRetry: () => void;
  onSend: () => void;
  reviewsSection: React.ReactNode;
  reviewFeedback: string | null;
  reviewFeedbackTone: "success" | "error" | null;
}) {
  return (
    <div className="flex flex-col gap-6">
      {reviewsSection}

      <AnimatePresence>
        {reviewFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={cx(
              "rounded-xl px-4 py-3 text-sm font-medium text-center",
              reviewFeedbackTone === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "bg-amber-50 text-amber-700 border border-amber-100"
            )}
          >
            {reviewFeedback}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-center"
        >
          <p className="text-sm font-medium text-red-600">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700"
          >
            Réessayer
          </button>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm"
      >
        <div className="border-b border-gray-100 bg-gray-50 px-5 py-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-bold text-gray-700">
              Envoyer un message à {mediumName}
            </span>
          </div>
        </div>

        <div className="p-4">
          <form
            className="flex items-end gap-3"
            onSubmit={(e) => { e.preventDefault(); if (canSend) onSend(); }}
          >
            <textarea
              ref={composerRef}
              value={draft}
              onChange={(e) => onDraftChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder=""
              className="min-h-[52px] max-h-32 flex-1 resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-amber-300 focus:bg-white focus:ring-2 focus:ring-amber-100"
              rows={1}
            />
            <motion.button
              type="submit"
              disabled={!canSend}
              whileHover={canSend ? { scale: 1.05 } : {}}
              whileTap={canSend ? { scale: 0.95 } : {}}
              className={cx(
                "inline-flex h-11 w-11 items-center justify-center rounded-xl transition-all",
                canSend
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md hover:shadow-lg"
                  : "cursor-not-allowed bg-gray-200 text-gray-400"
              )}
            >
              <Send className="h-4 w-4" />
            </motion.button>
          </form>
          <p className="mt-2 text-[11px] text-gray-400">
            Appuyez sur Entrée pour envoyer, Maj+Entrée pour passer à la ligne
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function VoyanceThreadPageClient({ mediumId }: { mediumId: string }) {
  const {
    onKeyDown, refetch, send, setDraft, updateReviewComment,
    updateReviewRating, setIsVideoOpen, submitReview, openVideoExperience,
    handleShareConsultant, canSend, canSubmitReview, composerRef, consultant,
    photoUrl, mediumName, draft, error, isVideoOpen, reduceMotion,
    videoEmbedUrl, videoLink, videoThumbnailUrl, reviews,
    reviewComment, reviewFeedback, reviewFeedbackTone, reviewRating, loading, posterUrl,
  } = usePractitionerReviews(mediumId);

  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);

  if (loading) return <Loader />;

  // Ajout du bouton retour
  const handleBack = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/star/voyance';
    }
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10 bg-white min-h-screen">
      <button
        type="button"
        onClick={handleBack}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Retour à la liste des consultants
      </button>
      <ConsultantPanel user={consultant!} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex justify-center mb-6"
      >
        <button
          type="button"
          onClick={() => void handleShareConsultant()}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm"
        >
          <Share2 className="h-3.5 w-3.5" />
          Partager
        </button>
      </motion.div>

      {/* Vidéo - JUSTE APRÈS L'AFFICHE */}
      {videoLink && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <button
            type="button"
            onClick={openVideoExperience}
            className="group relative block w-full overflow-hidden rounded-2xl shadow-sm"
          >
            <div className="relative aspect-video bg-gray-900">
              {videoThumbnailUrl ? (
                <Image
                  src={videoThumbnailUrl}
                  alt={`Vidéo de présentation de ${mediumName}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              ) : photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={mediumName}
                  fill
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover opacity-70 transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                  <PlayCircle className="h-16 w-16 text-white/80" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition group-hover:bg-black/30">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur transition group-hover:scale-110 group-hover:bg-white/30">
                  <PlayCircle className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </button>
        </motion.div>
      )}

      {posterUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="mb-6"
        >
          <button
            type="button"
            onClick={() => setIsPosterModalOpen(true)}
            className="group relative block w-full overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
              <Image
                src={posterUrl}
                alt={`Affiche de présentation de ${mediumName}`}
                fill
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Overlay avec icône d'agrandissement */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/30">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 opacity-0 transition-all duration-300 group-hover:opacity-100 shadow-lg">
                  <Maximize2 className="h-5 w-5 text-gray-700" />
                </div>
              </div>
            </div>
            <p className="mt-2 text-center text-xs text-gray-400">
              Cliquez pour agrandir l'affiche
            </p>
          </button>
        </motion.div>
      )}

      <VoyanceConversationPanel
        canSend={canSend}
        composerRef={composerRef}
        draft={draft}
        error={error}
        mediumName={consultant?.nomconsultant || consultant?.username || "consultant"}
        onDraftChange={setDraft}
        onKeyDown={onKeyDown}
        onRetry={() => void refetch()}
        onSend={send}
        reviewFeedback={reviewFeedback}
        reviewFeedbackTone={reviewFeedbackTone}
        reviewsSection={
          <VoyanceReviewsSection
            canSubmitReview={canSubmitReview}
            reviewComment={reviewComment}
            reviewRating={reviewRating}
            reviews={reviews}
            submitReview={submitReview}
            updateReviewComment={updateReviewComment}
            updateReviewRating={updateReviewRating}
          />
        }
      />

      <VoyanceVideoModal
        isOpen={isVideoOpen}
        mediumName={mediumName}
        onClose={() => setIsVideoOpen(false)}
        reduceMotion={reduceMotion}
        videoEmbedUrl={videoEmbedUrl}
      />

      <PosterModal
        isOpen={isPosterModalOpen}
        posterUrl={posterUrl}
        mediumName={mediumName}
        onClose={() => setIsPosterModalOpen(false)}
        reduceMotion={reduceMotion}
      />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #fbbf24;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #f59e0b;
        }
      `}</style>
        <button
        type="button"
        onClick={handleBack}
        className="mb-6 inline-flex mt-8 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Retour à la liste des consultants
      </button>
    </main>
  );
}