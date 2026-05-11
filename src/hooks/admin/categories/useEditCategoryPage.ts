import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { getCategory, updateCategory } from "@/lib/api/services/categories.service";
import { useAdminRubriquesPage } from "@/hooks/admin/rubriques/useAdminRubriquesPage";
import { CategorieAdmin, Rubrique } from "@/lib/interfaces";
import { getRubriqueId, rubriqueLabel } from "@/lib/functions";

type RouteParams = Record<string, string | string[] | undefined>;

export type Banner = { type: "success" | "error" | "info"; message: string } | null;
export type ViewMode = "edit" | "preview" | "success";

export function useEditCategoryPage() {
  const params = useParams();
  const categoryId = useMemo(() => {
    const raw = (params as RouteParams | null)?.id;
    const value = Array.isArray(raw) ? raw[0] : raw;
    return String(value ?? "");
  }, [params]);

  const { rubriques, loading: rubriquesLoading } = useAdminRubriquesPage();

  const [view, setView] = useState<ViewMode>("edit");
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [rubriqueIds, setRubriqueIds] = useState<string[]>([]);
  
  const selectedSet = useMemo(() => new Set(rubriqueIds), [rubriqueIds]);

  const [pageLoading, setPageLoading] = useState(true);

  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState<Banner>(null);
  const bannerTimer = useRef<number | null>(null);

  const showBanner = useCallback((b: Banner) => {
    if (bannerTimer.current) window.clearTimeout(bannerTimer.current);
    setBanner(b);
    if (b) bannerTimer.current = window.setTimeout(() => setBanner(null), 2400);
  }, []);

  const hydrateFromBackend = useCallback((cat: CategorieAdmin) => {
    setNom(String(cat?.nom ?? ""));
    setDescription(String(cat?.description ?? ""));

    const categoryRecord = cat as unknown as { rubriqueIds?: unknown[] };

    const idsFromRubriques =
      Array.isArray(cat?.rubriques) && cat.rubriques.length > 0
        ? cat.rubriques.map(getRubriqueId).filter((id): id is string => Boolean(id))
        : [];

    const idsFromRubriqueIds =
      Array.isArray(categoryRecord.rubriqueIds) && categoryRecord.rubriqueIds.length > 0
        ? categoryRecord.rubriqueIds.map(String)
        : [];

    const ids = idsFromRubriques.length > 0 ? idsFromRubriques : idsFromRubriqueIds;

    setRubriqueIds(Array.from(new Set(ids)));
  }, []);

  useEffect(() => {
    let alive = true;

    async function fetchCategory() {
      if (!categoryId) return;
      setPageLoading(true);
      try {
        const cat = await getCategory(categoryId);
        if (!alive) return;
        hydrateFromBackend(cat);
        showBanner({ type: "info", message: "Catégorie chargée." });
      } catch {
        if (!alive) return;
        showBanner({ type: "error", message: "Erreur lors du chargement." });
      } finally {
        if (alive) setPageLoading(false);
      }
    }

    fetchCategory();
    return () => {
      alive = false;
    };
  }, [categoryId, hydrateFromBackend, showBanner]);

  const rubriquesById = useMemo(() => {
    const m = new Map<string, Rubrique>();
    (rubriques ?? []).forEach((r) => {
      const id = getRubriqueId(r);
      if (id) m.set(id, r);
    });
    return m;
  }, [rubriques]);

  const selectedRubriques = useMemo(() => {
    const out: Rubrique[] = [];
    for (const id of rubriqueIds) {
      const r = rubriquesById.get(id);
      if (r) out.push(r);
    }
    return out;
  }, [rubriqueIds, rubriquesById]);

  const selectionSummary = useMemo(() => {
    if (selectedRubriques.length === 0) return "Aucune rubrique sélectionnée.";
    const names = selectedRubriques.map(rubriqueLabel);
    return names.slice(0, 5).join(" • ") + (names.length > 5 ? " • …" : "");
  }, [selectedRubriques]);

  const canEdit = useMemo(() => nom.trim().length > 0 && !busy, [nom, busy]);

  const toggleRubrique = useCallback((id: string) => {
    setRubriqueIds((prev) => {
      const s = new Set(prev);
      if (s.has(id)) {
        s.delete(id);
      } else {
        s.add(id);
      }
      return Array.from(s);
    });
  }, []);

  const clearSelection = useCallback(() => setRubriqueIds([]), []);

  const goPreview = useCallback(() => {
    if (!nom.trim()) {
      showBanner({ type: "error", message: "Le nom est requis." });
      return;
    }
    setView("preview");
  }, [nom, showBanner]);

  const goEdit = useCallback(() => setView("edit"), []);
  const goSuccess = useCallback(() => setView("success"), []);

  const handleEdit = useCallback(async () => {
    if (!canEdit || !categoryId) return;

    setBusy(true);
    setBanner(null);

    try {
      await updateCategory(categoryId, {
        nom: nom.trim(),
        description: description.trim(),
        rubriques: rubriqueIds,
      });

      showBanner({ type: "success", message: "Catégorie modifiée avec succès." });
      goSuccess();
    } catch {
      showBanner({ type: "error", message: "Erreur lors de la modification." });
      setView("edit");
    } finally {
      setBusy(false);
    }
  }, [canEdit, categoryId, nom, description, rubriqueIds, goSuccess, showBanner]);

  return {
    rubriques, rubriquesLoading, description, pageLoading, view, selectedRubriques,
    banner, nom, selectionSummary, rubriqueIds, selectedSet, busy, goPreview,
    setNom, setDescription, toggleRubrique, goEdit, clearSelection, handleEdit,
  };
}