import { useToast } from "@/hooks/categorie/useToast";
import { messagingService, usersService } from "@/lib/api/services";
import { practitionerReviewsService } from "@/lib/api/services/practitioner-reviews.service";
import { useAuth } from '@/lib/auth/AuthContext';
import { QUERY_KEYS } from "@/lib/cache/queryClient";
import {
  normalizeReviewRating,
  toMediaUrl,
  toYouTubeEmbedUrl,
  toYouTubeThumbnailUrl,
} from "@/lib/functions";
import type { PractitionerReview, ReviewFeedbackTone, User } from "@/lib/interfaces";
import { getErrorMessage } from '@/lib/utils/errorHelpers';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useReducedMotion } from "framer-motion";
import { useCallback, useMemo, useRef, useState } from "react";

function safeStr(value: unknown, fallback = "—") {
  const normalized =
    typeof value === "string"
      ? value.trim()
      : value == null
        ? ""
        : String(value).trim();

  return normalized || fallback;
}



export function formatDateFR(value?: string | number | Date | null) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function usePractitionerReviews(mediumId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const reduceMotion = useReducedMotion();
  const toast = useToast();

  const [manualError, setManualError] = useState<string | null>(null);
  const {
    data: reviews = [],
    refetch: refetchReviews,
    isLoading: isLoadingReviews,
    error: reviewsError,
  } = useQuery<PractitionerReview[]>(
    {
      queryKey: ['practitioner-reviews', mediumId],
      queryFn: () => practitionerReviewsService.getByConsultation(mediumId),
      enabled: Boolean(mediumId),
    }
  );

  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  const [draft, setDraft] = useState("");
  const [reviewFeedback, setReviewFeedback] = useState<string | null>(null);
  const [reviewFeedbackTone, setReviewFeedbackTone] =
    useState<ReviewFeedbackTone>("success");
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const composerRef = useRef<HTMLTextAreaElement | null>(null);

  const consultantQuery = useQuery<User>({
    queryKey: ['users', 'by-id', mediumId],
    queryFn: () => usersService.getById(mediumId),
    enabled: Boolean(mediumId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const threadQuery = useQuery({
    queryKey: QUERY_KEYS.MESSAGING_CLIENT_THREAD(mediumId),
    queryFn: () => messagingService.getClientThread(mediumId),
    enabled: Boolean(mediumId),
    refetchInterval: mediumId ? 10000 : false,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const consultant = consultantQuery.data ?? null;

  const mediumName = useMemo(() => {
    const fullName = [
      safeStr(consultant?.prenoms, ""),
      safeStr(consultant?.nom, "")
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    let name = safeStr(
      consultant?.spiritualName,
      fullName || safeStr(consultant?.username, mediumId)
    );
    if (!name || typeof name !== 'string' || name === '—') {
      // Log pour debug
      if (typeof window !== 'undefined') {
        // eslint-disable-next-line no-console
        console.warn('[Voyance] mediumName fallback to "?"', { consultant, mediumId });
      }
      name = '?';
    }
    return name;
  }, [consultant, mediumId]);

  const photoUrl = useMemo(() => {
    const photo = safeStr(consultant?.photo, "");
    const profilePicture = safeStr(consultant?.profilePicture, "");
    const avatar = safeStr(consultant?.avatar, "");
    return toMediaUrl(photo || profilePicture || avatar || null);
  }, [consultant?.avatar, consultant?.photo, consultant?.profilePicture]);
  const posterUrl = useMemo(() => {
    const photo = safeStr(consultant?.poster, "");
    const profilePicture = safeStr(consultant?.profilePicture, "");
    const avatar = safeStr(consultant?.avatar, "");
    return toMediaUrl(photo || profilePicture || avatar || null);
  }, [consultant?.avatar, consultant?.poster, consultant?.profilePicture]);
  const videoLink = safeStr(consultant?.videoLink, "");
  const videoEmbedUrl = useMemo(() => toYouTubeEmbedUrl(videoLink), [videoLink]);
  const videoThumbnailUrl = useMemo(() => toYouTubeThumbnailUrl(videoLink), [videoLink]);

  const canSubmitReview = reviewComment.trim().length >= 6;



  const queryError = consultantQuery.error ?? threadQuery.error ?? null;

  const error = useMemo(() => {
    if (manualError) return manualError;
    if (!queryError) return null;
    return getErrorMessage(queryError, "Impossible de charger ce consultant");
  }, [manualError, queryError]);

  const clearFeedback = useCallback(() => {
    if (reviewFeedback) {
      setReviewFeedback(null);
      setReviewFeedbackTone("success");
    }
  }, [reviewFeedback]);

  const updateReviewAuthor = useCallback((value: string) => {
    setReviewAuthor(value);
  }, []);

  const updateReviewRating = useCallback((value: number) => {
    setReviewRating(value);
  }, []);

  const updateReviewComment = useCallback(
    (value: string) => {
      setReviewComment(value);
      clearFeedback();
    },
    [clearFeedback]
  );

  const submitReview = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!canSubmitReview) {
        setReviewFeedbackTone("error");
        setReviewFeedback("Le commentaire doit contenir au moins 6 caractères.");
        return;
      }

      try {
        await practitionerReviewsService.createReview({
          consultationId: mediumId,
          comment: reviewComment.trim(),
          rating: normalizeReviewRating(reviewRating),
        });
        setReviewComment("");
        setReviewRating(5);
        setManualError(null);
        setReviewFeedbackTone("success");
        setReviewFeedback("Votre avis a bien été ajouté.");
        await refetchReviews();
      } catch (err) {
        setReviewFeedbackTone("error");
        setReviewFeedback(getErrorMessage(err, "Erreur lors de l'enregistrement de l'avis"));
      }
    },
    [canSubmitReview, reviewComment, reviewRating, mediumId, refetchReviews]
  );

  const sendMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!user?._id) {
        throw new Error("Utilisateur non authentifié");
      }

      return messagingService.sendSimpleMessage({
        toConsultantId: mediumId,
        text,
        fromUserId: user._id,
      });
    },
    onSuccess: async () => {
      setDraft("");
      setManualError(null);
      setReviewFeedback("Votre message a bien été envoyé au médium.");
      setReviewFeedbackTone("success");

      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MESSAGING_CLIENT_THREAD(mediumId),
      });

      toast("Message envoyé !");
    },
    onError: (err: unknown) => {
      setManualError(getErrorMessage(err, "Impossible d'envoyer le message"));
      setReviewFeedback("Erreur lors de l'envoi du message.");
      setReviewFeedbackTone("error");
      toast("Erreur lors de l'envoi du message");
    },
  });

  const canSend =
    draft.trim().length > 0 &&
    Boolean(mediumId) &&
    Boolean(user?._id) &&
    !consultantQuery.isLoading &&
    !threadQuery.isLoading &&
    !sendMutation.isPending;

  const send = useCallback(async () => {
    if (!canSend) return;
    await sendMutation.mutateAsync(draft.trim());
  }, [canSend, draft, sendMutation]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        void send();
      }
    },
    [send]
  );

  const openVideoExperience = useCallback(() => {
    if (videoEmbedUrl) {
      setIsVideoOpen(true);
      return;
    }

    if (videoLink && typeof window !== "undefined") {
      window.open(videoLink, "_blank", "noopener,noreferrer");
    }
  }, [videoEmbedUrl, videoLink]);

  const mediumInitial = useMemo(
    () => (typeof mediumName === 'string' && mediumName.length > 0 ? mediumName.slice(0, 1).toUpperCase() : "?"),
    [mediumName]
  );

  const refetch = useCallback(async () => {
    setManualError(null);

    await Promise.allSettled([
      consultantQuery.refetch(),
      threadQuery.refetch(),
    ]);
  }, [consultantQuery, threadQuery]);

  const handleShareConsultant = useCallback(async () => {
    if (typeof window === "undefined") return;

    const shareUrl = window.location.href;
    const shareTitle = `Consultez ${mediumName} sur Mon Etoile`;
    const shareText = `Découvrez ${mediumName}, consultant spirituel sur Mon Etoile.`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        toast("Lien copié !");
        return;
      }

      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        "_blank",
        "noopener,noreferrer"
      );
    } catch {
      // silence volontaire
    }
  }, [mediumName, toast]);

  return {
    onKeyDown,
    refetch,
    send,
    setDraft,
    updateReviewAuthor,
    updateReviewComment,
    updateReviewRating,
    setIsVideoOpen,
    submitReview,
    openVideoExperience,
    handleShareConsultant,
posterUrl,
    canSend,
    canSubmitReview,

    composerRef,
    consultant,
    photoUrl,
    mediumName,
    draft,
    error,
    isVideoOpen,
    reduceMotion,
    reviewAuthor,
    mediumInitial,
    videoEmbedUrl,
    videoLink,
    videoThumbnailUrl,
    reviews,
    isLoadingReviews,
    reviewsError,
    reviewComment,
    reviewFeedback,
    reviewFeedbackTone,
    reviewRating,
    loading: consultantQuery.isLoading || threadQuery.isLoading || sendMutation.isPending,
    isSending: sendMutation.isPending,
  };
}

export default usePractitionerReviews;
