import { getCategory } from "@/lib/api/services/categories.service";
import { CategorieAdmin, Rubrique } from "@/lib/interfaces";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { useQuery } from '@tanstack/react-query';
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";

function sortRubriquesList(rubriques: Rubrique[] = []): Rubrique[] {
  return [...rubriques].sort((a, b) => {
    if (!a.titre) return 1;
    if (!b.titre) return -1;
    return a.titre.localeCompare(b.titre, "fr", { sensitivity: "base" });
  });
}

export function useCategoryClientViewWrapper(categoryId: string) {
  const router = useRouter();
  const setCategoryInStore = useMonEtoileStore((s) => s.setCategory);
  const lastCategoryIdRef = useRef<string | null>(null);
  const setRubriqueEnCours = useMonEtoileStore((s) => s.setRubriqueEnCours);

  const { data: category, isLoading: loading, isError, error, refetch, isSuccess, } = useQuery<CategorieAdmin>({
    queryKey: ['category', categoryId],
    queryFn: () => getCategory(categoryId),
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  useEffect(() => {
    if (category && category._id && lastCategoryIdRef.current !== category._id) {
      setCategoryInStore(category);
      lastCategoryIdRef.current = category._id;
    }
  }, [category, setCategoryInStore]);

  const title = category?.nom?.trim() || "Catégorie";
  const description = category?.description?.trim() || "";
  const rubriquesList = useMemo(() => sortRubriquesList(category?.rubriques), [category?.rubriques]);

  const handleOpenRubriqueById = useCallback(
    (rub: Rubrique) => {
      setRubriqueEnCours(rub);
      router.push(`/star/category/${encodeURIComponent(rub.categorieId || "")}/choixconsultation`);
    },
    [router, setRubriqueEnCours]
  );

  return { handleOpenRubriqueById, refetch, title, description, loading, rubriquesList, isError, error, isSuccess };
}