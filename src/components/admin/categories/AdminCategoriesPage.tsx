"use client";
import CategoriesList from "@/components/admin/categories/CategoriesList";
import { BannerState, useAdminCategoriesPage } from "@/hooks/admin/categories/useAdminCategoriesPage";
import { cx } from "@/lib/functions";
import { RefreshCw } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import React from "react";
import { Sparkles } from "lucide-react";
import { Plus } from "lucide-react";

export function CreateCategoryButton() {

  return (
    <div className="mb-4 flex justify-end">
      <a
        href={`/admin/categories/create?r=${Date.now()}`}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] px-4 py-2 text-xs font-bold text-white shadow-sm hover:from-[#254A8B] hover:to-[#3F73BE]"
      >
        <Plus className="h-4 w-4" />        Nouvelle catégorie
      </a>
    </div>
  );
}

export function TopBar({ counts }: { counts: { catCount: number; rubCount: number } }) {
  return (
    <div className="sticky top-0 z-20 -mx-3 mb-3 border-b border-slate-200/70 bg-white/80 px-3 py-3 backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/70 sm:-mx-4 sm:px-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] text-white shadow-sm">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>

            <div className="min-w-0">
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                Catégories
              </h1>

              <p className="mt-0.5 text-[11px] text-slate-600 dark:text-[#AFC0DE]">
                <span className="font-semibold">{counts.catCount}</span> catégorie(s) •{" "}
                <span className="font-semibold">{counts.rubCount}</span> rubrique(s)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CategoriesErrorAlertProps {
  message: string;
}

const CategoriesErrorAlert: React.FC<CategoriesErrorAlertProps> = ({ message }) => (
  <div className="mb-3 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-900 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-100">
    <div className="flex items-center gap-2">
      <AlertTriangle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  </div>
);

export function ReloadButtons({
  fetchCategories,
  fetchRubriques,
  categoriesLoading,
  rubriquesLoading,
}: {
  fetchCategories: () => void;
  fetchRubriques: () => void;
  categoriesLoading: boolean;
  rubriquesLoading: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">

      <button
        onClick={fetchCategories}
        aria-label="Recharger les catégories"
        className={[
          "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold",
          "border-slate-200 bg-white text-slate-900 shadow-sm hover:bg-slate-50",
          "dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800/60",
          categoriesLoading && "opacity-60 cursor-not-allowed",
        ].join(" ")}
        disabled={categoriesLoading}
      >
        <RefreshCw className={categoriesLoading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
        Catégories
      </button>

      <button
        onClick={fetchRubriques}
        aria-label="Recharger les rubriques"
        className={[
          "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold",
          "border-slate-200 bg-white text-slate-900 shadow-sm hover:bg-slate-50",
          "dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800/60",
          rubriquesLoading && "opacity-60 cursor-not-allowed",
        ].join(" ")}
        disabled={rubriquesLoading}
      >
        <RefreshCw className={rubriquesLoading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
        Rubriques
      </button>

    </div>
  );
}

export const Banner = ({ banner }: { banner: BannerState }) => {
  if (!banner) return null;

  const style =
    banner.type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-100"
      : banner.type === "error"
        ? "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-100"
        : "border-indigo-200 bg-indigo-50 text-indigo-900 dark:border-indigo-900/40 dark:bg-indigo-900/20 dark:text-indigo-100";

  return (
    <div
      className={cx("mb-3 rounded-2xl border px-3 py-2 text-xs font-semibold", style)}
      role="status"
      aria-live="polite"
      tabIndex={-1}
    >
      {banner.message}
    </div>
  );
};

export default function AdminCategoriesPage() {
  const {
    rubriques, categories, categoriesLoading, categoriesError, editingId,
    rubriquesLoading, rubriquesError, counts, banner,
    stopEdit, saveEdit, fetchCategories, fetchRubriques,
  } = useAdminCategoriesPage();

  return (
    <main
      className="w-full mx-auto max-w-4xl px-4 py-4"
      aria-labelledby="admin-categories-title"
    >
      <h1 id="admin-categories-title" className="sr-only">
        Gestion des catégories
      </h1>
      <TopBar counts={counts} />
      <ReloadButtons
        fetchCategories={fetchCategories}
        fetchRubriques={fetchRubriques}
        categoriesLoading={categoriesLoading}
        rubriquesLoading={rubriquesLoading}
      />

      <Banner banner={banner} />

      {categoriesError && <CategoriesErrorAlert message={categoriesError} />}
      {rubriquesError && <CategoriesErrorAlert message={rubriquesError} />}

      <CreateCategoryButton />

      <CategoriesList
        categories={categories}
        rubriques={rubriques}
        categoriesLoading={categoriesLoading}
        rubriquesLoading={rubriquesLoading}
        editingId={editingId}
        stopEdit={stopEdit}
        saveEdit={saveEdit}
      />
    </main>
  );
}