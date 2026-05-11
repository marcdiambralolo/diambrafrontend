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

export const useProfilHighlightCards = () => [
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
] as HighlightCardType[];

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




export function useProfilUser() {

  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    let isActive = true;

    setLoading(true);
    api.get<User | null>(`/users/me`)
      .then((res) => {
        if (isActive) {
          // eslint-disable-next-line no-console
          if (JSON.stringify(res.data) !== JSON.stringify(user)) {
            updateUser(res.data ?? null);
          }
        }
      })
      .finally(() => { if (isActive) setLoading(false); });
    return () => { isActive = false; };
  }, [updateUser, user]);

  return { loading: loading, user, };
}