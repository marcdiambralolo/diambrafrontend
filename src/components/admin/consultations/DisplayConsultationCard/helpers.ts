type ConsultationLike = {
  _id?: string;
  id?: string;
  consultationId?: string;
  analysis?: {
    texte?: string;
    text?: string;
  } | string | null;
};

export function getConsultationId(c: ConsultationLike) {
  return String(c?._id ?? c?.id ?? c?.consultationId ?? "");
}

export function extractMarkdown(c: ConsultationLike): string | null {
  const analysis = c?.analysis;
  const v = typeof analysis === "string"
    ? analysis
    : analysis?.texte ?? analysis?.text ?? null;

  const s = typeof v === "string" ? v.trim() : "";
  return s ? s : null;
}

export function formatDateFR(v?: string | number | Date | null) {
  if (!v) return "";
  try {
    return new Date(v).toLocaleString("fr-FR");
  } catch {
    return "";
  }
}
