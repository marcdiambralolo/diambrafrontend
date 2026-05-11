import { useCallback, useMemo, useRef, useState } from "react";
import { useAdminRubriquesPage } from "@/hooks/admin/rubriques/useAdminRubriquesPage";
import { createCategory } from "@/lib/api/services/categories.service";
import { Rubrique } from "@/lib/interfaces";
import { getRubriqueId, rubriqueLabel } from "@/lib/functions";

export type ViewMode = "create" | "preview" | "success";
export type Banner = { type: "success" | "error" | "info"; message: string } | null;

export function useCreateCategoryPage() {
  const { rubriques, loading: rubriquesLoading } = useAdminRubriquesPage();
  const [view, setView] = useState<ViewMode>("create");
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [rubriqueIds, setRubriqueIds] = useState<string[]>([]);
  const selectedSet = useMemo(() => new Set(rubriqueIds), [rubriqueIds]);
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState<Banner>(null);
  const bannerTimer = useRef<number | null>(null);

  const showBanner = useCallback((b: Banner) => {
    if (bannerTimer.current) window.clearTimeout(bannerTimer.current);
    setBanner(b);
    if (b) bannerTimer.current = window.setTimeout(() => setBanner(null), 2400);
  }, []);

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

  const invalidRubriquesCount = useMemo(() => {
    const all = rubriques ?? [];
    const valid = all.filter((r) => !!getRubriqueId(r)).length;
    return all.length - valid;
  }, [rubriques]);

  const canCreate = useMemo(() => nom.trim().length > 0 && !busy, [nom, busy]);

  const toggleRubrique = useCallback((id: string) => {
    setRubriqueIds((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return Array.from(s);
    });
  }, []);

  const clearSelection = useCallback(() => setRubriqueIds([]), []);

  const goPreview = useCallback(() => {
    if (!nom.trim()) {
      showBanner({ type: "error", message: "Le nom de la catégorie est requis." });
      return;
    }
    setView("preview");
  }, [nom, showBanner]);

  const goCreate = useCallback(() => setView("create"), []);
  const goSuccess = useCallback(() => setView("success"), []);

  const selectionSummary = useMemo(() => {
    if (selectedRubriques.length === 0) return "Aucune rubrique sélectionnée.";
    const names = selectedRubriques.map(rubriqueLabel);
    return names.slice(0, 3).join(" • ") + (names.length > 3 ? " • …" : "");
  }, [selectedRubriques]);

  const handleCreate = useCallback(async () => {
    if (!canCreate) return;
    setBusy(true);
    setBanner(null);
    try {
      await createCategory({
        nom: nom.trim(),
        description: description.trim(),
        rubriques: rubriqueIds,
      });
      showBanner({ type: "success", message: "Catégorie créée avec succès." });
      goSuccess();
    } catch {
      showBanner({ type: "error", message: "Erreur lors de la création." });
      setView("create");
    } finally {
      setBusy(false);
    }
  }, [canCreate, nom, description, rubriqueIds, goSuccess, showBanner]);

  return {
    rubriques, rubriquesLoading, view, nom, rubriqueIds, selectedSet, busy, banner,
    description, selectedRubriques, invalidRubriquesCount, selectionSummary,
    setRubriqueIds, showBanner, goPreview, goCreate, setView, setDescription,
    handleCreate, clearSelection, toggleRubrique, setNom,
  };
}