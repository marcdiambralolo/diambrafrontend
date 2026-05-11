import { api } from "@/lib/api/client";
import { getRubriqueCinqEtoiles } from '@/lib/api/services/rubriques.service';
import { QUERY_KEYS } from '@/lib/cache/queryClient';
import type { User } from '@/lib/interfaces';
import { useAuthStore } from "@/lib/store/auth.store";
import { GradeConfig } from "@/lib/types/grade-config.types";
import { getGradeName, Grade } from "@/lib/types/grade.types";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Compass, LucideIcon, Stars } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useStatsDataWithCache } from "../cache/useStatsDataWithCache";
import { useProfilCategories } from "./useProfilCategories";

const GRADE_LABELS: Record<Grade | "NEOPHYTE", string> = {
  NEOPHYTE: "Néophyte",
  ASPIRANT: "Aspirant",
  CONTEMPLATEUR: "Contemplateur",
  CONSCIENT: "Conscient",
  INTEGRATEUR: "Intégrateur",
  TRANSMUTANT: "Transmutant",
  ALIGNE: "Aligné",
  EVEILLE: "Éveillé",
  SAGE: "Sage",
  MAITRE_DE_SOI: "Maître de Soi",
} as const;

const GRADE_STARS: Record<Grade | "NEOPHYTE", number> = {
  NEOPHYTE: 0,
  ASPIRANT: 1,
  CONTEMPLATEUR: 2,
  CONSCIENT: 3,
  INTEGRATEUR: 4,
  TRANSMUTANT: 5,
  ALIGNE: 6,
  EVEILLE: 7,
  SAGE: 8,
  MAITRE_DE_SOI: 9,
} as const;

const ORDER = [
  "VOTRE SIGNE SOLAIRE",
  "VOTRE ASCENDANT",
  "VOTRE DESCENDANT",
  "VOTRE SIGNE LUNAIRE",
  "VOTRE MILIEU DU CIEL",
] as const;

const CONFIG = {
  STALE_TIME_MS: 1000 * 60 * 5, // 5 minutes
  GC_TIME_MS: 1000 * 60 * 30,   // 30 minutes
  GRADE_CONFIG_STALE_MS: 1000 * 60 * 10, // 10 minutes
  USER_REFRESH_MS: 1000 * 60 * 1, // 1 minute
} as const;

// ==================== TYPES ====================
export interface HighlightCardType {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  link: string;
  badge?: string;
}

export type ConsultationCardChoice = {
  _id?: string;
  title: string;
  description: string;
};

export interface CategoryType {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  badge: string;
  badgeColor: string;
  description: string;
  link: string;
  stats: string;
  minGradeLevel?: number;
  lockedToastMessage?: string;
}

// ==================== UTILITIES ====================
const normalizeTitle = (value: unknown): string => {
  return String(value ?? "").trim().toUpperCase();
};

const createOrderIndex = (): Map<string, number> => {
  const index = new Map<string, number>();
  ORDER.forEach((title, i) => {
    index.set(normalizeTitle(title), i);
  });
  return index;
};

const ORDER_INDEX = createOrderIndex();

export const useProfilHighlightCards = (): HighlightCardType[] => [
  {
    id: "carte-du-ciel",
    title: "MA CARTE DU CIEL",
    subtitle: "Positions Planétaires",
    icon: Compass,
    color: "from-blue-500 to-indigo-500",
    gradient: "from-blue-100/80 to-indigo-100/80 dark:from-blue-900/40 dark:to-indigo-900/40",
    link: "/star/carteduciel",
    badge: "Exclusif"
  },
  {
    id: "cinq-portes",
    title: "LES 5 PORTES DE MON ÉTOILE",
    subtitle: "Forces de Mon Étoile",
    icon: Stars,
    color: "from-red-600 to-red-600",
    gradient: "from-red-100/80 to-red-100/80 dark:from-red-900/40 dark:to-red-900/40",
    link: "/star/cinqportes",
    badge: "Premium"
  }
];

const useGradeInfo = (user: User | null) => {
  const resolvedGrade = useMemo(() => {
    if (typeof user?.grade === 'object' && user?.grade !== null) {
      return user.grade.grade;
    }
    return user?.grade || "NEOPHYTE";
  }, [user?.grade]);

  const gradeKey = (resolvedGrade ?? "NEOPHYTE") as Grade | "NEOPHYTE";

  const label = useMemo(() =>
    GRADE_LABELS[gradeKey] || getGradeName(gradeKey as Grade) || "Néophyte",
    [gradeKey]
  );

  const stars = useMemo(() =>
    GRADE_STARS[gradeKey] || 0,
    [gradeKey]
  );

  return { resolvedGrade, gradeKey, label, stars };
};

const useGradeConfig = (resolvedGrade: string | null) => {
  return useQuery<GradeConfig | null, Error>({
    queryKey: ['grade-config', resolvedGrade],
    queryFn: async () => {
      if (!resolvedGrade) return null;
      const { data } = await api.get(`/admin/grades/by-name/${resolvedGrade}`);
      return data as GradeConfig;
    },
    enabled: !!resolvedGrade,
    staleTime: CONFIG.GRADE_CONFIG_STALE_MS,
    retry: 1,
  });
};

const useConsultations = () => {
  const { data: consultations = [], isLoading, error } = useQuery<ConsultationCardChoice[], Error>({
    queryKey: QUERY_KEYS.RUBRIQUE_CINQ_ETOILES,
    queryFn: getRubriqueCinqEtoiles,
    staleTime: CONFIG.STALE_TIME_MS,
    gcTime: CONFIG.GC_TIME_MS,
    retry: 2,
  });

  const choices = useMemo(() => {
    if (!Array.isArray(consultations) || consultations.length === 0) return [];

    const orderSet = new Set(ORDER.map(normalizeTitle));

    return consultations
      .map((consultation) => ({
        consultation,
        normalizedTitle: normalizeTitle(consultation?.title)
      }))
      .filter(({ normalizedTitle }) => orderSet.has(normalizedTitle))
      .sort((a, b) => {
        const indexA = ORDER_INDEX.get(a.normalizedTitle) ?? 99;
        const indexB = ORDER_INDEX.get(b.normalizedTitle) ?? 99;
        return indexA - indexB;
      })
      .map(({ consultation }) => consultation);
  }, [consultations]);

  return { consultations, choices, isLoading, error };
};

const usePrefetch = (isAuthenticated: boolean, queryClient: ReturnType<typeof useQueryClient>) => {
  useEffect(() => {
    const prefetchItems = [
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.RUBRIQUE_CINQ_ETOILES,
        queryFn: getRubriqueCinqEtoiles,
      }),
    ];

    if (isAuthenticated) {
      prefetchItems.push(
        queryClient.prefetchQuery({
          queryKey: QUERY_KEYS.NOTIFICATIONS,
          queryFn: async () => (await api.get('/notifications')).data,
        })
      );
    }

    void Promise.allSettled(prefetchItems);
  }, [isAuthenticated, queryClient]);
};

export function useProfilUser() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const categories = useProfilCategories();
  const highlightCards = useProfilHighlightCards();
  const { stats, isLoading: statsLoading, error: statsError, refetch: fetchStats } = useStatsDataWithCache();

  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const isAuthenticated = Boolean(user);
  const [loading, setLoading] = useState(true);

  const handleSelect = useCallback(() => {
    router.push('/star/profil/doors');
  }, [router]);

  const { resolvedGrade, label, stars } = useGradeInfo(user);

  const { data: currentGradeConfig, isLoading: gradeConfigLoading, error: gradeConfigError } = useGradeConfig(resolvedGrade);

  const { choices, isLoading: consultationsLoading } = useConsultations();

  usePrefetch(isAuthenticated, queryClient);

  useEffect(() => {
    let isMounted = true;

    if (!isAuthenticated) {
      setLoading(false);
      return () => { isMounted = false; };
    }

    const fetchUser = async () => {
      try {
        const response = await api.get<User | null>(`/users/me`);
        if (isMounted && response.data) {
          updateUser(response.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    setLoading(true);
    void fetchUser();

    return () => { isMounted = false; };
  }, [isAuthenticated, updateUser]);

  const required = useMemo(() =>
    currentGradeConfig?.requirements?.consultations ?? 0,
    [currentGradeConfig?.requirements?.consultations]
  );

  const isLoading = loading || gradeConfigLoading || consultationsLoading || statsLoading;
  const error = statsError || gradeConfigError;

  return {
    fetchStats, handleSelect, loading: isLoading, isPremium: !!user?.premium,
    categories, label, stars, highlightCards, choices, required, stats, error,
  } as const;
}