"use client";
import { rubriqueLabel } from "@/lib/functions";
import { CategorieAdmin, Rubrique } from "@/lib/interfaces";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Copy, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useCallback, useMemo, useState } from "react";
import { MiniPill } from "./MiniPill";

function getCategoryId(cat: CategorieAdmin): string {
  return String(cat?._id ?? "");
}

export const ReadCategoryCardPro = memo(function ReadCategoryCardPro({ cat, }: {
  cat: CategorieAdmin;
}) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const catId = useMemo(() => getCategoryId(cat), [cat]);
  const rubriquesMeta = useMemo(() => {
    const list = (cat?.rubriques ?? []).filter(Boolean);
    const names = list.map(rubriqueLabel).filter(Boolean);
    const max = 8;
    const visible = list.slice(0, max);
    const remaining = Math.max(0, list.length - max);
    return { list, names, visible, remaining, count: list.length };
  }, [cat?.rubriques]);

  const handleEdit = useCallback(() => {
    if (!catId) return;
    router.push(`/admin/categories/${catId}/edit`);
  }, [catId, router]);

  const handleCopyId = useCallback(async () => {
    if (!catId) return;
    try {
      await navigator.clipboard.writeText(catId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // no-op: clipboard permissions
    }
  }, [catId]);

  return (
    <div className="relative"    >
    
      <div className="pt-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-extrabold text-slate-900 dark:text-white">
                    {cat.nom || "—"}
                  </h3>

                  {/* Counter badge */}
                  <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
                    {rubriquesMeta.count}
                  </span>
                </div>

                {/* ID + Copy */}
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
                    ID: <span className="ml-1 font-mono text-[10px] opacity-80">{catId || "—"}</span>
                  </span>

                  {catId && (
                    <button
                      type="button"
                      onClick={handleCopyId}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-800/60"
                      aria-label="Copier l'identifiant"
                    >
                      <AnimatePresence initial={false} mode="wait">
                        {copied ? (
                          <motion.span
                            key="copied"
                            initial={{ opacity: 0, y: 2 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -2 }}
                            className="inline-flex items-center gap-1"
                          >
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            Copié
                          </motion.span>
                        ) : (
                          <motion.span
                            key="copy"
                            initial={{ opacity: 0, y: 2 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -2 }}
                            className="inline-flex items-center gap-1"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            Copier
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  )}
                </div>

                {/* Description */}
                <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-slate-600 dark:text-zinc-300">
                  {cat.description || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <motion.button
              type="button"
              whileTap={reducedMotion ? undefined : { scale: 0.98 }}
              onClick={handleEdit}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-[color:var(--theme-border)] dark:bg-[#0F1C3F] dark:text-white dark:hover:bg-[#13274C] dark:focus:ring-[#2E5AA6]/40"
              aria-label={`Modifier la catégorie ${cat.nom}`}
            >
              <Pencil className="h-4 w-4" />
              Modifier
            </motion.button>
          </div>
        </div>

        <div className="mt-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-900 dark:text-white">
              Rubriques associées
            </span>
            <span className="text-[11px] font-semibold text-slate-600 dark:text-zinc-300">
              {rubriquesMeta.count}
            </span>
          </div>

          {rubriquesMeta.count === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
              Aucune rubrique associée.
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {rubriquesMeta.visible.map((r: Rubrique, idx: number) => {
                const rid = String(r?._id ?? idx);
                const label = rubriqueLabel(r) || "—";
                return <MiniPill key={`${rid}-${idx}`}>{label}</MiniPill>;
              })}

              {rubriquesMeta.remaining > 0 && (
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
                  +{rubriquesMeta.remaining}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});