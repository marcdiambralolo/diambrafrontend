import { getCategory } from '@/lib/api/services/categories.service';
import type { CategorieAdmin, Rubrique } from '@/lib/interfaces';
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react'; 

export function useCategorySelectionid(id?: string) {
  const listVariants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
  } as const;

  const gradients = [
    {
      border: "from-[#163A74]/70 via-[#2E5AA6]/65 to-[#4F83D1]/70",
      bg: "from-[#EEF4FF] to-[#DDE7FA] dark:from-[#0F1C3F]/90 dark:to-[#162A56]/80",
      accent: "from-[#163A74] to-[#2E5AA6]",
      glow: "bg-[#2E5AA6]/20 dark:bg-[#2E5AA6]/12"
    },
    {
      border: "from-[#163A74]/70 via-[#2E5AA6]/65 to-[#4F83D1]/70",
      bg: "from-[#EEF4FF] to-[#DDE7FA] dark:from-[#0F1C3F]/90 dark:to-[#162A56]/80",
      accent: "from-[#163A74] to-[#2E5AA6]",
      glow: "bg-[#2E5AA6]/20 dark:bg-[#2E5AA6]/12"
    },
    {
      border: "from-[#163A74]/70 via-[#2E5AA6]/65 to-[#4F83D1]/70",
      bg: "from-[#EEF4FF] to-[#DDE7FA] dark:from-[#0F1C3F]/90 dark:to-[#162A56]/80",
      accent: "from-[#163A74] to-[#2E5AA6]",
      glow: "bg-[#2E5AA6]/20 dark:bg-[#2E5AA6]/12"
    },
    {
      border: "from-[#163A74]/70 via-[#2E5AA6]/65 to-[#4F83D1]/70",
      bg: "from-[#EEF4FF] to-[#DDE7FA] dark:from-[#0F1C3F]/90 dark:to-[#162A56]/80",
      accent: "from-[#163A74] to-[#2E5AA6]",
      glow: "bg-[#2E5AA6]/20 dark:bg-[#2E5AA6]/12"
    },
    {
      border: "from-[#163A74]/70 via-[#2E5AA6]/65 to-[#4F83D1]/70",
      bg: "from-[#EEF4FF] to-[#DDE7FA] dark:from-[#0F1C3F]/90 dark:to-[#162A56]/80",
      accent: "from-[#163A74] to-[#2E5AA6]",
      glow: "bg-[#2E5AA6]/20 dark:bg-[#2E5AA6]/12"
    },
    {
      border: "from-[#163A74]/70 via-[#2E5AA6]/65 to-[#4F83D1]/70",
      bg: "from-[#EEF4FF] to-[#DDE7FA] dark:from-[#0F1C3F]/90 dark:to-[#162A56]/80",
      accent: "from-[#163A74] to-[#2E5AA6]",
      glow: "bg-[#2E5AA6]/20 dark:bg-[#2E5AA6]/12"
    },
    {
      border: "from-[#163A74]/70 via-[#2E5AA6]/65 to-[#4F83D1]/70",
      bg: "from-[#EEF4FF] to-[#DDE7FA] dark:from-[#0F1C3F]/90 dark:to-[#162A56]/80",
      accent: "from-[#163A74] to-[#2E5AA6]",
      glow: "bg-[#2E5AA6]/20 dark:bg-[#2E5AA6]/12"
    },
  ];

  const router = useRouter();

  const setCategoryInStore = useMonEtoileStore((s) => s.setCategory);

  const { data: category, isLoading, isError } = useQuery<CategorieAdmin | null>({
    queryKey: ['category', id],
    queryFn: () => (id ? getCategory(id) : Promise.resolve(null)),
    enabled: !!id,
  });

  useEffect(() => {
    if (category) setCategoryInStore(category);
  }, [category, setCategoryInStore]);

  const title = useMemo(() => category?.nom?.trim() || "Catégorie", [category]);
  const description = useMemo(() => category?.description?.trim() || "", [category]);
  const rubriquesList = useMemo(() => category?.rubriques || [], [category]);

  const handleOpenRubriqueById = useCallback((rub: Rubrique) => {
    router.push(`/star/category/${id}/choixconsultation?rubriqueId=${rub._id}`);
  }, [router, id]);

  return { handleOpenRubriqueById, category, title, description, rubriquesList, gradients, listVariants, isLoading, isError };
}