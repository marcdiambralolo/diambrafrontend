import { DateLike, User } from "./interfaces";

export const formatDate = (date: string | Date | undefined | null) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!d || isNaN((d as Date).getTime?.() ?? NaN)) return '';
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export function mapFormDataToBackend(form: User | null): Record<string, unknown> {
  if (!form) {
    return {};
  }

  const result = {
    firstName: form.prenoms || '',
    lastName: form.nom || '',
    ...form
  };
  return result;
}

export function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

export function processUserData(userData: User | null): User | null {
  if (!userData) return null;

  return {
    _id: userData._id,
    dateNaissance: userData.dateNaissance,
    villeNaissance: userData.villeNaissance
      ? `${userData.villeNaissance}, ${userData.paysNaissance}`
      : userData.country || "-",
    heureNaissance: userData.heureNaissance || "-",
    role: userData.role,
    credits: userData.credits ?? 0,
    totalConsultations: userData.totalConsultations ?? 0,
    ...userData
  };
}

export function cleanText(s: unknown) {
  return String(s ?? "").replace(/\s+/g, " ").trim();
}

export function getId(x: { _id?: unknown; id?: unknown } | null | undefined): string {
  return String(x?._id ?? x?.id ?? "");
}

export function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function clampText(s: string, max = 120) {
  return clamp(s, max);
}

export const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export function safeText(v: unknown) {
  return safeTrim(v);
}

export function formatDateFR(dateStr?: string | null) {
  const s = safeText(dateStr);
  if (!s) return "";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(d);
}

export function formatDateFRNew(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";

  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function safeTrim(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export function wordCount(text: string): number {
  const t = text.trim();
  if (!t) return 0;
  return t.split(/\s+/).filter(Boolean).length;
}

export function buildUrl(pathname: string, params: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).length > 0) sp.set(k, String(v));
  });

  sp.set('r', String(Date.now()));
  const qs = sp.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function formatDateFRTiret(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  } catch {
    return "—";
  }
}

export function stripMarkdown(md: string) {
  return (md || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/[#>*_~\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function estimateReadingTime(md: string) {
  const txt = stripMarkdown(md);
  const words = txt ? txt.split(" ").length : 0;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min`;
}

export function slugify(input: string) {
  return (input || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export type TocItem = { id: string; text: string; level: 2 | 3 };

export function fmtDuration(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m <= 0) return `${r}s`;
  return `${m}m ${String(r).padStart(2, '0')}s`;
}

export function createReviewId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function normalizeReviewRating(value: number) {
  return Math.max(1, Math.min(5, Math.round(value)));
}

export function getPageNumbers(page: number, total: number) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set<number>();
  set.add(1);
  set.add(total);
  [page - 1, page, page + 1].forEach((p) => {
    if (p >= 1 && p <= total) set.add(p);
  });

  const arr = Array.from(set).sort((a, b) => a - b);

  const out: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    const cur = arr[i];
    const prev = arr[i - 1];
    if (i > 0 && prev && cur - prev > 1) out.push(0);
    out.push(cur);
  }
  return out;
}

export function clamp(s: string, max = 140) {
  const t = cleanText(s);
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
}

export function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

export function toSafeDate(value: DateLike, fallback?: Date): Date {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(value);
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return fallback ? new Date(fallback) : new Date();
}

export function formatDateFRJeu(value: DateLike): string {
  const date = toSafeDate(value, new Date());
  if (!isValidDate(date)) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year}` + " à " + `${hour}:${minute}:${second}`;
}

export const getRelativeTime = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return `il y a ${diffInSeconds} seconde${diffInSeconds > 1 ? 's' : ''}`;
  if (diffInSeconds < 3600) return `il y a ${Math.floor(diffInSeconds / 60)} minute${Math.floor(diffInSeconds / 60) > 1 ? 's' : ''}`;
  if (diffInSeconds < 86400) return `il y a ${Math.floor(diffInSeconds / 3600)} heure${Math.floor(diffInSeconds / 3600) > 1 ? 's' : ''}`;
  return `le ${past.toLocaleDateString('fr-FR')}`;
};

export const formatEditionDate = (date: Date | null): string => {
  if (!date) return '';
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} à ${hours}:${minutes}`;
};

export const formatDateTime = (date: Date) =>
  date.toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });