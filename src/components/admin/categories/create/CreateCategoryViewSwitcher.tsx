'use client';
import { cx } from "@/lib/functions";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Plus } from "lucide-react";
import React from "react";
import CreateCategoryForm from "./CreateCategoryForm";


import { rubriqueLabel } from "@/lib/functions";
import { Rubrique } from "@/lib/interfaces";
import { ArrowLeft, Eye, Sparkles } from "lucide-react";
import { useMemo } from "react";

type CreateCategoryFormProps = React.ComponentProps<typeof CreateCategoryForm>;
type CreateCategoryPreviewProps = React.ComponentProps<typeof PreviewCard>;
type CreateCategorySuccessProps = React.ComponentProps<typeof SuccessCard>;

const PreviewCard = React.memo(function PreviewCard({
  nom,
  description,
  selectedRubriques,
  busy,
  onBack,
  onConfirm,
}: {
  nom: string;
  description: string;
  selectedRubriques: Rubrique[];
  busy: boolean;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const items = useMemo(
    () => selectedRubriques.map(rubriqueLabel).filter(Boolean).sort((a, b) => a.localeCompare(b)),
    [selectedRubriques]
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 flex items-center gap-2">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-emerald-600 to-lime-600 text-white shadow-sm">
          <Eye className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Aperçu</h2>
          <p className="text-[11px] text-slate-600 dark:text-zinc-300">Vérifiez avant de créer</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-[11px] font-bold text-slate-700 dark:text-zinc-200">Nom</div>
          <div className="text-sm font-extrabold text-slate-900 dark:text-white">{nom.trim() || "—"}</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-[11px] font-bold text-slate-700 dark:text-zinc-200">Description</div>
          <div className="text-[12px] text-slate-700 dark:text-zinc-200">{description.trim() || "—"}</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-2 text-[11px] font-bold text-slate-700 dark:text-zinc-200">
            Rubriques ({items.length})
          </div>
          {items.length === 0 ? (
            <div className="text-[11px] text-slate-600 dark:text-zinc-300">Aucune rubrique.</div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {items.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                >
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-800/60"
            aria-label="Retour à la création"
          >
            <ArrowLeft className="h-4 w-4" /> Modifier
          </button>

          <button
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] px-4 py-2 text-xs font-extrabold text-white shadow-sm hover:from-[#254A8B] hover:to-[#3F73BE] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Confirmer la création"
          >
            <Sparkles className={cx("h-4 w-4", busy && "animate-spin")} />
            {busy ? "Création..." : "Créer maintenant"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
});




const SuccessCard = React.memo(function SuccessCard({
  nom,
  onGoList,
  onCreateAnother,
  reducedMotion,
}: {
  nom: string;
  onGoList: () => void;
  onCreateAnother: () => void;
  reducedMotion: boolean;
}) {
  return (
    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-900/20">
      <div className="mb-3 flex items-center gap-2">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-emerald-600 to-lime-600 text-white shadow-sm">
          <Check className={cx("h-5 w-5", !reducedMotion && "animate-bounce")} />
        </div>

        <div>
          <h2 className="text-sm font-extrabold text-emerald-900 dark:text-emerald-100">Catégorie créée</h2>
          <p className="text-[11px] text-emerald-800 dark:text-emerald-200">
            “{nom || "Nouvelle catégorie"}” est maintenant disponible.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onCreateAnother}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-zinc-950 dark:text-emerald-100 dark:hover:bg-emerald-900/30"
          aria-label="Créer une autre catégorie"
        >
          <Plus className="h-4 w-4" /> En créer une autre
        </button>
        <button
          onClick={onGoList}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] px-4 py-2 text-xs font-extrabold text-white shadow-sm hover:from-[#254A8B] hover:to-[#3F73BE]"
          aria-label="Retour à la liste des catégories"
        >
          Voir la liste <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
});



const viewVariants = {
  initial: { opacity: 0, y: 10, filter: "blur(2px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.22 } },
  exit: { opacity: 0, y: -8, filter: "blur(2px)", transition: { duration: 0.16 } },
};

interface CreateCategoryViewSwitcherProps {
  view: string;
  formProps: CreateCategoryFormProps;
  previewProps: CreateCategoryPreviewProps;
  successProps: CreateCategorySuccessProps;
}

const CreateCategoryViewSwitcher: React.FC<CreateCategoryViewSwitcherProps> = ({
  view, formProps, previewProps, successProps
}) => (
  <AnimatePresence mode="wait" initial={false}>
    {view === "create" && (
      <motion.div key="create" variants={viewVariants} initial="initial" animate="animate" exit="exit">
        <CreateCategoryForm {...formProps} />
      </motion.div>
    )}

    {view === "preview" && (
      <motion.div key="preview" variants={viewVariants} initial="initial" animate="animate" exit="exit">
        <PreviewCard {...previewProps} />
      </motion.div>
    )}

    {view === "success" && (
      <motion.div key="success" variants={viewVariants} initial="initial" animate="animate" exit="exit">
        <SuccessCard {...successProps} />
      </motion.div>
    )}
  </AnimatePresence>
);

export default CreateCategoryViewSwitcher;