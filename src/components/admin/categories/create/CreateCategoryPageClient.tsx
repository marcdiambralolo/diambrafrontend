"use client";
import { useCreateCategoryPage } from "@/hooks/admin/categories/useCreateCategoryPage";
import { ArrowLeft, Layers, Tags } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import CreateCategoryViewSwitcher from "@/components/admin/categories/create/CreateCategoryViewSwitcher";
import { cx } from "@/lib/functions";
import { AlertTriangle } from "lucide-react";
type CreateCategoryBannerProps = React.ComponentProps<typeof Banner>['banner'];
type CreateCategorySwitcherProps = React.ComponentProps<typeof CreateCategoryViewSwitcher>;

export type BannerType = "success" | "error" | "info";
export type Banner = { type: BannerType; message: string } | null;


interface InvalidRubriquesAlertProps {
  count: number;
}

const InvalidRubriquesAlert: React.FC<InvalidRubriquesAlertProps> = ({ count }) => (
  <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-100">
    <div className="flex items-center gap-2">
      <AlertTriangle className="h-4 w-4" />

      <span>
        {count} rubrique(s) n’ont pas d’identifiant valide et ne seront pas sélectionnables.
      </span>
    </div>
  </div>
);

export function Banner({ banner }: { banner: Banner }) {
  if (!banner) return null;

  return (
    <div
      className={cx(
        "mb-4 rounded-2xl border px-3 py-2 text-xs font-semibold",
        banner.type === "success" &&
        "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-100",
        banner.type === "error" &&
        "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-100",
        banner.type === "info" &&
        "border-indigo-200 bg-indigo-50 text-indigo-900 dark:border-indigo-900/40 dark:bg-indigo-900/20 dark:text-indigo-100"
      )}
      role="status"
      aria-live="polite"
    >
      {banner.message}
    </div>
  );
}

interface CreateCategoryMainContentProps {
  invalidRubriquesCount: number;
  banner: CreateCategoryBannerProps;
  view: string;
  formProps: CreateCategorySwitcherProps['formProps'];
  previewProps: CreateCategorySwitcherProps['previewProps'];
  successProps: CreateCategorySwitcherProps['successProps'];
}

const CreateCategoryMainContent: React.FC<CreateCategoryMainContentProps> = ({
  invalidRubriquesCount,
  banner,
  view,
  formProps,
  previewProps,
  successProps,
}) => (
  <>
    {invalidRubriquesCount > 0 && <InvalidRubriquesAlert count={invalidRubriquesCount} />}
    <Banner banner={banner} />

    <CreateCategoryViewSwitcher
      view={view}
      formProps={formProps}
      previewProps={previewProps}
      successProps={successProps}
    />
  </>
);

interface ViewSwitcherProps {
  view: string;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ view }) => (
  <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-700 dark:border-[color:var(--theme-border)] dark:bg-[#0F1C3F] dark:text-zinc-200">

    <Layers className="h-4 w-4 text-[#2E5AA6] dark:text-[#9BC2FF]" />
    Vue :{" "}
    <span className="font-extrabold">
      {view === "create" ? "Création" : view === "preview" ? "Aperçu" : "Succès"}
    </span>

  </div>
);


interface CreateCategoryHeaderProps {
  view: string;
}

const CreateCategoryHeader: React.FC<CreateCategoryHeaderProps> = ({ view }) => {
  const router = useRouter();

  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <button
        onClick={() => router.replace('/admin/categories')}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800/60"
        aria-label="Retour à la liste"
      >
        <ArrowLeft className="h-4 w-4" /> Retour
      </button>

      <ViewSwitcher view={view} />
    </div>
  );
};

const CreateCategoryTitle: React.FC = () => (
  <div className="mb-4 flex items-center gap-2">
    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] text-white shadow-sm">
      <Tags className="h-6 w-6" />
    </div>

    <div className="min-w-0">
      <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
        Nouvelle catégorie
      </h1>
    </div>
  </div>
);

export default function CreateCategoryPageClient() {
  const router = useRouter();
  const {
    rubriques, rubriquesLoading, view, nom, rubriqueIds, selectedSet, busy, banner,
    description, selectedRubriques, invalidRubriquesCount, selectionSummary,
    setRubriqueIds, showBanner, goPreview, goCreate, setView, setDescription,
    handleCreate, clearSelection, toggleRubrique, setNom,
  } = useCreateCategoryPage();

  return (
    <div className="w-full mx-auto  max-w-4xl px-3 py-6 sm:px-4 sm:py-10 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950">
      <CreateCategoryHeader view={view} />

      <CreateCategoryTitle />

      <CreateCategoryMainContent
        invalidRubriquesCount={invalidRubriquesCount}
        banner={banner}
        view={view}
        formProps={{
          nom,
          setNom,
          description,
          setDescription,
          rubriques,
          rubriqueIds,
          selectedSet,
          rubriquesLoading,
          toggleRubrique,
          clearSelection,
          selectionSummary,
          goPreview,
        }}
        previewProps={{
          nom,
          description,
          selectedRubriques,
          onBack: goCreate,
          onConfirm: handleCreate,
          busy,
        }}
        successProps={{
          nom: nom.trim(),
          reducedMotion: false,
          onGoList: () => {
            router.replace('/admin/categories');
            router.refresh();
          },
          onCreateAnother: () => {
            setNom("");
            setDescription("");
            setRubriqueIds([]);
            setView("create");
            showBanner({ type: "info", message: "Prêt pour une nouvelle catégorie." });
          },
        }}
      />
    </div>
  );
}