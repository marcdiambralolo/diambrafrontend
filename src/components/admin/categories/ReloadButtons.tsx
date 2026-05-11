"use client";
import React from "react";
import { RefreshCw } from "lucide-react";

export default function ReloadButtons({
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