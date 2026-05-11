"use client";
import { useEditCategoryPage } from "@/hooks/admin/categories/useEditCategoryPage";
import { ArrowLeft, Layers, Tags } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";



type EditCategoryBannerProps = React.ComponentProps<typeof Banner>['banner'];
type EditCategorySwitcherProps = React.ComponentProps<typeof CategoryViewSwitcher>;


import { AnimatePresence, motion, Variants } from "framer-motion";

export type BannerType = { type: "success" | "error" | "info"; message: string } | null;


import CategoryForm from "./CategoryForm";
 
 

type EditCategoryFormProps = React.ComponentProps<typeof CategoryForm>;
type EditCategoryPreviewProps = React.ComponentProps<typeof PreviewCard>;
type EditCategorySuccessProps = React.ComponentProps<typeof SuccessCard>;


 
import { cx, rubriqueLabel } from "@/lib/functions";
import { Rubrique } from "@/lib/interfaces";
import { ArrowRight, Eye, Sparkles } from "lucide-react";
import { useMemo } from "react";
 
import { Check } from "lucide-react";

const SuccessCard = React.memo(function SuccessCard({
  nom,
  onGoList,
  onEditAnother,
  reducedMotion,
}: {
  nom: string;
  onGoList: () => void;
  onEditAnother: () => void;
  reducedMotion: boolean;
}) {
  return (
    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-900/20">
      <div className="mb-3 flex items-center gap-2">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-emerald-600 to-lime-600 text-white shadow-sm">
          <Check className={cx("h-5 w-5", !reducedMotion && "animate-bounce")} />
        </div>
        <div>
          <h2 className="text-sm font-extrabold text-emerald-900 dark:text-emerald-100">Catégorie modifiée</h2>
          <p className="text-[11px] text-emerald-800 dark:text-emerald-200">
            “{nom || "Catégorie"}” a été mise à jour.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onEditAnother}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-zinc-950 dark:text-emerald-100 dark:hover:bg-emerald-900/30"
          aria-label="Retour à la liste"
        >
          <ArrowLeft className="h-4 w-4" /> Retour à la liste
        </button>
        
        <button
          onClick={onGoList}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] px-4 py-2 text-xs font-extrabold text-white shadow-sm hover:from-[#254A8B] hover:to-[#3F73BE]"
          aria-label="Voir la liste des catégories"
        >
          Voir la liste <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
});

 

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
          <p className="text-[11px] text-slate-600 dark:text-zinc-300">Vérifiez avant de modifier</p>
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
            aria-label="Retour à l'édition"
          >
            <ArrowLeft className="h-4 w-4" /> Modifier
          </button>

          <button
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] px-4 py-2 text-xs font-extrabold text-white shadow-sm hover:from-[#254A8B] hover:to-[#3F73BE] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Confirmer la modification"
          >
            <Sparkles className={cx("h-4 w-4", busy && "animate-spin")} />
            {busy ? "Modification..." : "Enregistrer"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
});

 

interface CategoryViewSwitcherProps {
  view: string;
  pageLoading: boolean;
  formProps: EditCategoryFormProps;
  previewProps: EditCategoryPreviewProps;
  successProps: EditCategorySuccessProps;
}

const CategoryViewSwitcher: React.FC<CategoryViewSwitcherProps> = ({
  view, pageLoading, formProps, previewProps, successProps
}) => {
  if (pageLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-zinc-800" />
        <div className="mt-3 h-24 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-zinc-800" />
        <div className="mt-3 h-56 w-full animate-pulse rounded-3xl bg-slate-200 dark:bg-zinc-800" />
      </div>
    );
  }
  return (
    <AnimatePresence mode="wait" initial={false}>
      {view === "edit" && (
        <motion.div key="edit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
          <CategoryForm {...formProps} />
        </motion.div>
      )}

      {view === "preview" && (
        <PreviewCard {...previewProps} />
      )}

      {view === "success" && (
        <SuccessCard {...successProps} />
      )}
    </AnimatePresence>
  );
};




const viewVariants: Variants = {
  initial: { opacity: 0, y: 10, filter: "blur(2px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.22 } },
  exit: { opacity: 0, y: -8, filter: "blur(2px)", transition: { duration: 0.16 } },
};

export function Banner({ banner }: { banner: BannerType }) {

  if (!banner) return null;

  return (
    <AnimatePresence>
      <motion.div
        variants={viewVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={
          [
            "mb-4 rounded-2xl border px-3 py-2 text-xs font-semibold",
            banner.type === "success" &&
            "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-100",
            banner.type === "error" &&
            "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-100",
            banner.type === "info" &&
            "border-indigo-200 bg-indigo-50 text-indigo-900 dark:border-indigo-900/40 dark:bg-indigo-900/20 dark:text-indigo-100",
          ]
            .filter(Boolean)
            .join(" ")
        }
        role="status"
        aria-live="polite"
      >
        {banner.message}
      </motion.div>
    </AnimatePresence>
  );
}




interface EditCategoryMainContentProps {
  banner: EditCategoryBannerProps;
  view: string;
  pageLoading: boolean;
  formProps: EditCategorySwitcherProps['formProps'];
  previewProps: EditCategorySwitcherProps['previewProps'];
  successProps: EditCategorySwitcherProps['successProps'];
}

const EditCategoryMainContent: React.FC<EditCategoryMainContentProps> = ({
  banner,
  view,
  pageLoading,
  formProps,
  previewProps,
  successProps,
}) => (
  <>
    <Banner banner={banner} />

    <CategoryViewSwitcher
      view={view}
      pageLoading={pageLoading}
      formProps={formProps}
      previewProps={previewProps}
      successProps={successProps}
    />
  </>
);


interface EditCategoryTitleProps {
  selectionSummary: string;
}

const EditCategoryTitle: React.FC<EditCategoryTitleProps> = ({ selectionSummary }) => (
  <div className="mb-4 flex items-center gap-2">
    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] text-white shadow-sm">
      <Tags className="h-6 w-6" />
    </div>

    <div className="min-w-0">
      <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
        Modifier la catégorie
      </h1>
      <p className="text-[11px] text-slate-600 dark:text-[#AFC0DE]">
        {selectionSummary}
      </p>
    </div>
  </div>
);

interface EditCategoryHeaderProps {
  view: string;
  onBack: () => void;
}

const EditCategoryHeader: React.FC<EditCategoryHeaderProps> = ({ view, onBack }) => (
  <div className="mb-5 flex items-center justify-between gap-3">
    <button
      onClick={onBack}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800/60"
      aria-label="Retour à la liste"
    >
      <ArrowLeft className="h-4 w-4" /> Retour
    </button>

    <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
      <Layers className="h-4 w-4 text-[#2E5AA6] dark:text-[#9BC2FF]" />
      Vue :{" "}
      <span className="font-extrabold">
        {view === "edit" ? "Édition" : view === "preview" ? "Aperçu" : "Succès"}
      </span>
    </div>
  </div>
);


export default function EditCategoryPageClient() {
  const router = useRouter();
  const {
    rubriques, rubriquesLoading, description, pageLoading, view, selectedRubriques,
    banner, nom, selectionSummary, rubriqueIds, selectedSet, busy, goPreview,
    setNom, setDescription, toggleRubrique, goEdit, clearSelection, handleEdit,
  } = useEditCategoryPage();

  return (
    <div className="w-full mx-auto  px-3 py-6 sm:px-4 sm:py-10 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950">

      <EditCategoryHeader
        view={view}
        onBack={() => {
          router.replace('/admin/categories');
          router.refresh();
        }}
      />
      <EditCategoryTitle selectionSummary={selectionSummary} />

      <EditCategoryMainContent
        banner={banner}
        view={view}
        pageLoading={pageLoading}
        formProps={{
          nom,
          setNom,
          description,
          setDescription,
          rubriques: rubriques ?? [],
          rubriqueIds,
          selectedSet,
          rubriquesLoading,
          toggleRubrique,
          clearSelection,
          goPreview,
          selectionSummary,
        }}
        previewProps={{
          nom,
          description,
          selectedRubriques,
          busy,
          onBack: goEdit,
          onConfirm: handleEdit,
        }}
        successProps={{
          nom,
          onGoList: () => {
            router.replace('/admin/categories');
            router.refresh();
          },
          onEditAnother: goEdit,
          reducedMotion: false,
        }}
      />
    </div>
  );
}