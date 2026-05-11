import { api } from "@/lib/api/client";
import { getCategories, updateCategory } from "@/lib/api/services/categories.service";
import type { Rubrique } from '@/lib/interfaces';
import { CategorieAdmin } from "@/lib/interfaces";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type BannerType = "success" | "error" | "info";
export type BannerState = { type: BannerType; message: string } | null;

export function useAdminCategoriesPage() {
  const [rubriques, setRubriques] = useState<Rubrique[]>([]);
  const [categories, setCategories] = useState<CategorieAdmin[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [rubriquesLoading, setRubriquesLoading] = useState(false);
  const [rubriquesError, setRubriquesError] = useState<string | null>(null);
  const [banner, setBanner] = useState<BannerState>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const bannerTimer = useRef<number | null>(null);

  const showBanner = useCallback((b: BannerState) => {
    if (bannerTimer.current) window.clearTimeout(bannerTimer.current);
    setBanner(b);
    if (b) {
      bannerTimer.current = window.setTimeout(() => setBanner(null), 2200);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    setCategoriesError(null);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      setCategoriesError("Impossible de charger les catégories.");
      showBanner({ type: "error", message: "Erreur: chargement des catégories." });
    } finally {
      setCategoriesLoading(false);
    }
  }, [showBanner]);

  const fetchRubriques = useCallback(async () => {
    setRubriquesLoading(true);
    setRubriquesError(null);
    try {
      const response = await api.get<Rubrique[]>("/rubriques");
      setRubriques(response.data);
      showBanner({ type: "success", message: "Rubriques à jour." });
    } catch {
      setRubriquesError("Impossible de recharger les rubriques.");
      showBanner({ type: "error", message: "Erreur: chargement des rubriques." });
    } finally {
      setRubriquesLoading(false);
    }
  }, [showBanner]);

  useEffect(() => {
    fetchRubriques();
    fetchCategories();
  }, [fetchRubriques, fetchCategories]);

  const stopEdit = useCallback(() => setEditingId(null), []);

  const saveEdit = useCallback(
    async (id: string, patch: Partial<CategorieAdmin>) => {
      try {
        await updateCategory(id, {
          nom: patch.nom ?? "",
          description: patch.description ?? "",
          rubriques: patch.rubriques?.map((r) => r._id!) ?? [],
        });
        setEditingId(null);
        showBanner({ type: "success", message: "Catégorie mise à jour." });
        await fetchCategories();
      } catch {
        showBanner({ type: "error", message: "Erreur lors de la mise à jour." });
      }
    },
    [fetchCategories, showBanner]
  );

  const counts = useMemo(() => {
    const rubCount = rubriques?.length ?? 0;
    const catCount = categories?.length ?? 0;

    return { rubCount, catCount };
  }, [rubriques, categories]);

  return {
    rubriques, categories, categoriesLoading, categoriesError, editingId,
    rubriquesLoading, rubriquesError, counts, banner, stopEdit,
    saveEdit, fetchCategories, fetchRubriques,
  };
}