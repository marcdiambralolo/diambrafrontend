"use client";
 import CategoriesErrorAlert from "@/components/admin/categories/CategoriesErrorAlert";
import CategoriesList from "@/components/admin/categories/CategoriesList";
import CreateCategoryButton from "@/components/admin/categories/CreateCategoryButton";
import ReloadButtons from "@/components/admin/categories/ReloadButtons";
import TopBar from "@/components/admin/categories/TopBar";
import { BannerState, useAdminCategoriesPage } from "@/hooks/admin/categories/useAdminCategoriesPage";
import { cx } from "@/lib/functions";

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