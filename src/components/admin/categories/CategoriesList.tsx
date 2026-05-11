'use client';
 import { ReadCategoryCardPro } from "@/components/admin/categories/ReadCategoryCardPro";
import { SkeletonList } from "@/components/admin/categories/SkeletonList";
import { CategorieAdmin, Rubrique } from "@/lib/interfaces";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Save, X } from "lucide-react";
import React, { memo, useCallback, useMemo, useState } from "react";
 
import { rubriqueLabel } from "@/lib/functions";
import { Check, Search } from "lucide-react";

export const RubriquesPickerPro = memo(function RubriquesPickerPro({
  title,
  rubriques,
  selectedIds,
  onToggle,
  loading,
}: {
  title: string;
  rubriques: Rubrique[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  loading: boolean;
}) {
  const [q, setQ] = useState("");
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return rubriques;
    return rubriques.filter((r) => rubriqueLabel(r).toLowerCase().includes(query));
  }, [q, rubriques]);

  const toggleAllFiltered = useCallback(() => {
    const ids = filtered.map((r) => r._id!).filter(Boolean);
    const allSelected = ids.every((id) => selectedSet.has(id));
    
    ids.forEach((id) => {
      const shouldSelect = !allSelected;
      const isSelected = selectedSet.has(id);
      if (shouldSelect && !isSelected) onToggle(id);
      if (!shouldSelect && isSelected) onToggle(id);
    });
  }, [filtered, onToggle, selectedSet]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
        Chargement des rubriques…
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="text-[11px] font-bold text-slate-900 dark:text-white">{title}</div>
        <button
          type="button"
          onClick={toggleAllFiltered}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800/60"
          aria-label="Sélectionner/désélectionner toutes les rubriques filtrées"
        >
          <Check className="h-3 w-3" />
          Tout
        </button>
      </div>

      <div className="mb-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1 dark:border-zinc-800 dark:bg-zinc-900">
        <Search className="h-4 w-4 text-slate-500 dark:text-zinc-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher une rubrique…"
          aria-label="Rechercher une rubrique"
          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-zinc-500"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-3 text-[11px] text-slate-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          Aucun résultat.
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {filtered.map((r) => {
            const id = r._id!;
            const active = selectedSet.has(id);
            const label = rubriqueLabel(r);

            return (
              <button
                key={id}
                type="button"
                onClick={() => onToggle(id)}
                aria-label={`Rubrique ${label} ${active ? "sélectionnée" : "non sélectionnée"}`}
                className={[
                  "inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-semibold transition-all",
                  active
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-100"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800/60",
                ].join(" ")}
              >
                {active ? <Check className="h-3 w-3" /> : <span className="h-3 w-3 rounded-full border border-slate-300 dark:border-zinc-700" />}
                <span className="max-w-[190px] truncate">{label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
});

export const EditCategoryCardPro = memo(function EditCategoryCardPro({
  cat,
  rubriques,
  loadingRubriques,
  onCancel,
  onSave,
}: {
  cat: CategorieAdmin;
  rubriques: Rubrique[];
  loadingRubriques: boolean;
  onCancel: () => void;
  onSave: (id: string, patch: Partial<CategorieAdmin>) => void;
}) {
  const [nom, setNom] = useState(cat.nom || cat.titre || '');
  const [description, setDescription] = useState(cat.description);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    () => (cat.rubriques || [])
      .map((r) => r._id)
      .filter((id): id is string => !!id)
  );
  const [busy, setBusy] = useState(false);

  const rubriquesById = useMemo(() => {
    const m = new Map<string, Rubrique>();
    for (const r of rubriques) {
      if (r._id) m.set(r._id, r);
    }
    return m;
  }, [rubriques]);

  const selectedRubriques = useMemo(() => {
    return selectedIds.map((id) => rubriquesById.get(id)).filter(Boolean) as Rubrique[];
  }, [selectedIds, rubriquesById]);

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const canSave = useMemo(() => nom.trim().length > 0 && !busy, [nom, busy]);

  const handleSave = useCallback(async () => {
    if (!canSave) return;
    setBusy(true);
    try {
      await onSave(cat._id, {
        nom: nom.trim(),
        description: description.trim(),
        rubriques: selectedRubriques,
      });
    } finally {
      setBusy(false);
    }
  }, [canSave, cat._id, description, nom, onSave, selectedRubriques]);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] text-white shadow-sm">
            <Pencil className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Edition</h3>
            <p className="text-[11px] text-slate-600 dark:text-zinc-300">
              Modifiez puis sauvegardez la catégorie
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-800/60"
            aria-label="Annuler l'édition"
          >
            <X className="h-4 w-4" />
            Annuler
          </button>

          <button
            onClick={handleSave}
            disabled={!canSave}
            className={[
              "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-white shadow-sm",
              "bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-700 hover:to-lime-700",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            ].join(" ")}
            aria-label="Sauvegarder la catégorie"
          >
            <Save className="h-4 w-4" />
            {busy ? "Sauvegarde..." : "Sauver"}
          </button>
        </div>
      </div>

      <div className="grid gap-2">
        <input
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-emerald-700 dark:focus:ring-emerald-900/40"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          aria-label="Nom de la catégorie"
        />

        <textarea
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-emerald-700 dark:focus:ring-emerald-900/40"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-label="Description de la catégorie"
        />

        <RubriquesPickerPro
          title="Rubriques associées"
          rubriques={rubriques}
          selectedIds={selectedIds}
          onToggle={toggle}
          loading={loadingRubriques}
        />

        <div className="text-[11px] text-slate-600 dark:text-zinc-300">
          Sélectionnées : <span className="font-semibold">{selectedRubriques.length}</span>
        </div>
      </div>
    </div>
  );
});

interface CategoriesListProps {
    categories: CategorieAdmin[];
    rubriques: Rubrique[];
    categoriesLoading: boolean;
    rubriquesLoading: boolean;
    editingId: string | null;
    stopEdit: () => void;
    saveEdit: (id: string, patch: Partial<CategorieAdmin>) => void;
}

const CATEGORY_ICONS = ['📚', '🎯', '⚡', '🌟', '💼', '🎨', '🔮', '🌈', '💎', '🎭', '🏆', '🎪', '🎸', '🎬', '📱', '💡', '🚀', '🌸', '🎁', '⭐'];

const CategoriesList: React.FC<CategoriesListProps> = ({
    categories,
    rubriques,
    categoriesLoading,
    rubriquesLoading,
    editingId,
    stopEdit,
    saveEdit,
}) => {
    const [page, setPage] = useState(1);
    const perPage = 5;
    const totalPages = Math.ceil(categories.length / perPage);

    const paginatedCategories = useMemo(() => {
        const start = (page - 1) * perPage;
        return categories.slice(start, start + perPage);
    }, [categories, page]);

    const getCategoryIcon = (index: number) => {
        return CATEGORY_ICONS[index % CATEGORY_ICONS.length];
    };

    if (categoriesLoading) return <SkeletonList />;
    if (categories.length === 0)
        return (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                Aucune catégorie pour le moment. Créez-en une au-dessus.
            </div>
        );
    return (
        <div className="space-y-4 sm:space-y-6">
            <AnimatePresence initial={false}>
                {paginatedCategories.map((cat, index) => {
                    const actualIndex = (page - 1) * perPage + index;
                    return (
                        <motion.div
                            key={cat._id}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            layout
                            className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 relative"
                        >
                            <div className="absolute top-3 left-3 text-3xl opacity-80 select-none">
                                {getCategoryIcon(actualIndex)}
                            </div>
                            <div className="pl-12">
                                {editingId === cat._id ? (
                                    <EditCategoryCardPro
                                        cat={cat}
                                        rubriques={rubriques ?? []}
                                        loadingRubriques={rubriquesLoading}
                                        onCancel={stopEdit}
                                        onSave={saveEdit}
                                    />
                                ) : (
                                    <ReadCategoryCardPro
                                        cat={cat}
                                    />
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        ← Précédent
                    </button>

                    <span className="px-3 py-1 text-sm font-medium text-slate-700 dark:text-zinc-200">
                        {page} / {totalPages}
                    </span>

                    <button
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        Suivant →
                    </button>
                </div>
            )}
        </div>
    );
};

export default CategoriesList;