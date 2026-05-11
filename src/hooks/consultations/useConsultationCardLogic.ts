import { useMemo, useCallback, useRef } from "react";
import type { Consultation } from "@/lib/interfaces";
import { useRouter } from "next/navigation";

type ConsultationCardState = "ready" | "queued" | "processing" | "failed" | "awaiting_payment";
type ConsultationCardTone = "amber" | "emerald" | "rose" | "sky";

export type SpotlightStyle = React.CSSProperties & {
  '--sx': string;
  '--sy': string;
};

export const DEFAULT_SPOTLIGHT_STYLE: SpotlightStyle = {
  '--sx': '50%',
  '--sy': '35%',
};

export function useConsultationCardLogic(
  consultation: Consultation,
  onPrefetch: (consultation: Consultation) => void,
  retour?: string,
) {
  const router = useRouter();

  const formatDate = useCallback((date: string | number | Date | null | undefined) => {
    if (!date) return '—';
    try {
      return new Date(date).toLocaleDateString('fr-FR');
    } catch {
      return String(date);
    }
  }, []);

  const normalizedDateGeneration = useMemo(() => {
    const rawDate = consultation.dateGeneration;
    return typeof rawDate === 'string' || typeof rawDate === 'number' || rawDate instanceof Date ? rawDate : null;
  }, [consultation.dateGeneration]);

  const derived = useMemo(() => {
    const backendUi = consultation.ui;

    if (backendUi?.state) {
      return {
        canDownload: typeof backendUi.canDownload === "boolean" ? backendUi.canDownload : Boolean(consultation.pdfFile),
        canView: typeof backendUi.canView === "boolean" ? backendUi.canView : backendUi.state !== "awaiting_payment",
        dateGeneration: normalizedDateGeneration ? formatDate(normalizedDateGeneration) : null,
        helperText: backendUi.helperText || "",
        isPaid: typeof backendUi.effectiveIsPaid === "boolean" ? backendUi.effectiveIsPaid : Boolean(consultation.isPaid),
        state: backendUi.state,
        statusLabel: backendUi.statusLabel || "",
        statusTone: backendUi.statusTone || "amber",
        viewLabel: backendUi.viewLabel || "Voir l'analyse",
      };
    }

    const normalizedStatus = String(consultation.status ?? '').toUpperCase();
    const isFreeCinqPortes = consultation.type === "CINQ_ETOILES";
    const isPaid = isFreeCinqPortes || consultation.isPaid === true || Boolean(consultation.paymentId);
    const hasAnalysisArtifacts = Boolean(
      consultation.dateGeneration
      || consultation.completedAt
      || consultation.completedDate
      || consultation.analysisNotified
      || consultation.pdfFile
      || consultation.result
    );
    const normalizedStatusForDisplay = isFreeCinqPortes && normalizedStatus === 'AWAITING_PAYMENT'
      ? 'PENDING'
      : normalizedStatus;

    let state: ConsultationCardState = "awaiting_payment";
    let statusLabel = "Paiement requis";
    let statusTone: ConsultationCardTone = "amber";
    let helperText = "Cette consultation n'est pas encore prête a etre ouverte.";

    if (hasAnalysisArtifacts || normalizedStatusForDisplay === 'COMPLETED') {
      state = "ready";
      statusLabel = "Analyse prete";
      statusTone = "emerald";
      helperText = "Ouvre l'analyse ou telecharge le PDF si disponible.";
    } else if (normalizedStatusForDisplay === 'PROCESSING' || normalizedStatusForDisplay === 'GENERATING') {
      state = "processing";
      statusLabel = "Generation en cours";
      statusTone = "sky";
      helperText = "Le worker traite encore cette analyse.";
    } else if (normalizedStatusForDisplay === 'FAILED' || normalizedStatusForDisplay === 'ERROR') {
      state = "failed";
      statusLabel = "Generation echouee";
      statusTone = "rose";
      helperText = "Ouvre la consultation pour voir l'etat ou relancer le traitement.";
    } else if (normalizedStatusForDisplay === 'PENDING' && isPaid) {
      state = "queued";
      statusLabel = "En file d'attente";
      statusTone = "amber";
      helperText = "Le job est en attente de prise en charge par le worker.";
    }

    return {
      canDownload: Boolean(consultation.pdfFile),
      canView: state !== "awaiting_payment",
      dateGeneration: normalizedDateGeneration ? formatDate(normalizedDateGeneration) : null,
      helperText,
      isPaid,
      state,
      statusLabel,
      statusTone,
      viewLabel: state === "ready"
        ? "Voir l'analyse"
        : state === "awaiting_payment"
          ? "Paiement requis"
          : "Afficher",
    };
  }, [
    consultation.analysisNotified,
    consultation.completedAt,
    consultation.completedDate,
    consultation.dateGeneration,
    consultation.isPaid,
    consultation.paymentId,
    consultation.pdfFile,
    consultation.result,
    consultation.status,
    consultation.type,
    consultation.ui,
    formatDate,
    normalizedDateGeneration,
  ]);

  const cardRef = useRef<HTMLElement | null>(null);

  const handleView = useCallback(() => {
    const consultationId = consultation.consultationId || consultation.id || consultation._id;
    if (!consultationId) return;
    router.push(`/star/consultations/${consultationId}?retour=${encodeURIComponent(retour || "/star/consultations")}`);
  }, [consultation, router, retour]);

  const handleMouseEnter = useCallback(() => {
    onPrefetch(consultation);
  }, [consultation, onPrefetch]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--sx", `${x}px`);
    el.style.setProperty("--sy", `${y}px`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--sx", `50%`);
    el.style.setProperty("--sy", `35%`);
  }, []);

  return {
    cardRef, derived, handleView, handleMouseMove, handleMouseLeave, handleMouseEnter,
  };
}