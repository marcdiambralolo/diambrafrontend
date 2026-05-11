import { config } from "@/lib/config";
import { CarteDuCielData, CinqPortes, PractitionerReview, Rubrique, User } from "./interfaces";

export function isUrl(s: string) {
  return s.startsWith('http') || s.startsWith('/');
}

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

  const dateOfBirth = form.dateNaissance
    ? new Date(form.dateNaissance).toISOString()
    : (form.dateOfBirth ? new Date(form.dateOfBirth).toISOString() : '');
  const result = {
    firstName: form.prenoms || '',
    lastName: form.nom || '',
    dateOfBirth: typeof dateOfBirth === 'string' ? dateOfBirth : '',
    timeOfBirth: form.heureNaissance || '',
    countryOfBirth: form.paysNaissance || '',
    cityOfBirth: form.villeNaissance || '',
    ...form
  };
  return result;
}

export function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

export function rubriqueLabel(r: { titre?: unknown; nom?: unknown } | null | undefined): string {
  return String(r?.titre ?? r?.nom ?? "Rubrique");
}

export function getRubriqueId(r: Rubrique): string | null {
  return r?._id || null;
}

const SIGNES_OPPOSES: Record<string, string> = {
  'Bélier': 'Balance',
  'Taureau': 'Scorpion',
  'Gémeaux': 'Sagittaire',
  'Cancer': 'Capricorne',
  'Lion': 'Verseau',
  'Vierge': 'Poissons',
  'Balance': 'Bélier',
  'Scorpion': 'Taureau',
  'Sagittaire': 'Gémeaux',
  'Capricorne': 'Cancer',
  'Verseau': 'Lion',
  'Poissons': 'Vierge'
};

export function extractCinqPortes(carteDuCiel: CarteDuCielData | null): CinqPortes | null {
  if (!carteDuCiel?.positions || carteDuCiel.positions.length === 0) {
    return null;
  }

  const { positions } = carteDuCiel;

  // 1. Signe Solaire - Position du Soleil
  const soleil = positions.find(p => typeof p.planete === 'string' && p.planete.toLowerCase() === 'soleil');
  const signeSolaire = soleil?.signe || 'Non défini';

  // 2. Ascendant - Signe à la Maison 1
  const maison1 = positions.find(p => p.maison === 1);
  const ascendant = maison1?.signe || 'Non défini';

  // 3. Signe Lunaire - Position de la Lune
  const lune = positions.find(p => typeof p.planete === 'string' && p.planete.toLowerCase() === 'lune');
  const signeLunaire = lune?.signe || 'Non défini';

  // 4. Milieu du Ciel - Signe à la Maison 10
  const maison10 = positions.find(p => p.maison === 10);
  const milieuDuCiel = maison10?.signe || 'Non défini';

  // 5. Descendant - Opposé à l'Ascendant (ou Maison 7)
  const maison7 = positions.find(p => p.maison === 7);
  const descendant = maison7?.signe || SIGNES_OPPOSES[ascendant] || 'Non défini';

  return {
    signesolaire: {
      label: 'Signe Solaire',
      valeur: signeSolaire,
      description: 'Votre essence profonde et votre identité fondamentale',
      icon: '☀️',
      gradient: 'from-yellow-400 via-orange-500 to-red-500'
    },
    ascendant: {
      label: 'Ascendant',
      valeur: ascendant,
      description: 'Votre masque social et votre apparence extérieure',
      icon: '🌅',
      gradient: 'from-[#4F83D1] via-[#2E5AA6] to-[#163A74]'
    },
    signeLunaire: {
      label: 'Signe Lunaire',
      valeur: signeLunaire,
      description: 'Votre monde émotionnel et vos besoins profonds',
      icon: '🌙',
      gradient: 'from-[#7BA9F1] via-[#4F83D1] to-[#2E5AA6]'
    },
    milieuDuCiel: {
      label: 'Milieu du Ciel',
      valeur: milieuDuCiel,
      description: 'Votre vocation et votre direction de vie professionnelle',
      icon: '⭐',
      gradient: 'from-cyan-400 via-teal-500 to-emerald-500'
    },
    descendant: {
      label: 'Descendant',
      valeur: descendant,
      description: 'Votre relation à l\'autre et vos partenariats',
      icon: '💫',
      gradient: 'from-[#9BC2FF] via-[#4F83D1] to-[#163A74]'
    }
  };
}



export function processUserData(userData: User | null): User | null {
  if (!userData) return null;

  return {
    _id: userData._id,
    dateNaissance: userData.dateNaissance,
    villeNaissance: userData.villeNaissance
      ? `${userData.villeNaissance}, ${userData.paysNaissance || userData.country}`
      : userData.country || "-",
    heureNaissance: userData.heureNaissance || "-",
    role: userData.role,
    premium: !!userData.premium,
    credits: userData.credits ?? 0,
    totalConsultations: userData.totalConsultations ?? 0,
    rating: userData.rating ?? 0,
    nomconsultant: userData.nomconsultant||userData.username,
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

export function getStableRubriqueId(r: Rubrique): string {
  const raw = String(r?._id ?? "");
  if (raw) return raw;

  const t = String(r?.titre ?? "");
  const d = String(r?.description ?? "");
  const h = hashString(`${t}|${d}`);
  return `rub_${h.toString(16)}`; // stable
}


export const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};


/** @deprecated Use safeTrim instead */
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

  // anti-cache / force refresh soft
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

export function buildTocFromMarkdown(md: string): TocItem[] {
  const lines = (md || "").split("\n");
  const items: TocItem[] = [];
  const used = new Map<string, number>();

  for (const line of lines) {
    const m2 = line.match(/^##\s+(.+)$/);
    const m3 = line.match(/^###\s+(.+)$/);
    const text = (m2?.[1] || m3?.[1] || "").trim();
    const level = m2 ? 2 : m3 ? 3 : null;
    if (!level || !text) continue;

    let id = slugify(text);
    const count = used.get(id) ?? 0;
    used.set(id, count + 1);
    if (count > 0) id = `${id}-${count + 1}`;

    items.push({ id, text, level });
  }

  return items.slice(0, 18);
}


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

export function readStoredReviews(storageKey: string): PractitionerReview[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((entry) => ({
        id: typeof entry?.id === "string" ? entry.id : createReviewId(),
        author:
          typeof entry?.author === "string" && entry.author.trim()
            ? entry.author.trim()
            : "Membre Mon Etoile",
        rating: normalizeReviewRating(Number(entry?.rating ?? 5)),
        comment: typeof entry?.comment === "string" ? entry.comment.trim() : "",
        createdAt: Number(entry?.createdAt ?? Date.now()),
      }))
      .filter((entry) => entry.comment.length > 0);
  } catch {
    return [];
  }
}



export function toMediaUrl(pathLike?: string | null) {
  if (!pathLike) return null;
  if (/^https?:\/\//i.test(pathLike)) return pathLike;
  const normalized = pathLike.replaceAll("\\", "/").replace(/^\/+/, "");
  const baseUrl = config.api.baseURL.replace(/\/+$/, "");
  return `${baseUrl}/${normalized}`;
}

export function toYouTubeEmbedUrl(rawUrl?: string | null) {
  if (!rawUrl) return null;

  try {
    const url = new URL(rawUrl);
    const host = url.hostname.toLowerCase();

    if (host.includes("youtu.be")) {
      const id = url.pathname.replace(/^\//, "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host.includes("youtube.com")) {
      const id = url.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
  } catch {
    return null;
  }

  return null;
}

export function extractYouTubeId(rawUrl?: string | null) {
  if (!rawUrl) return null;

  try {
    const url = new URL(rawUrl);
    const host = url.hostname.toLowerCase();

    if (host.includes("youtu.be")) {
      return url.pathname.replace(/^\//, "") || null;
    }

    if (host.includes("youtube.com")) {
      return url.searchParams.get("v");
    }
  } catch {
    return null;
  }

  return null;
}

export function toYouTubeThumbnailUrl(rawUrl?: string | null) {
  const id = extractYouTubeId(rawUrl);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
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

 

export function makeExcerpt(content: string, max = 160) {
  return content.length <= max ? content : content.slice(0, max).trimEnd() + '…';
}

 

export function clamp(s: string, max = 140) {
  const t = cleanText(s);
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
}

export function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}
