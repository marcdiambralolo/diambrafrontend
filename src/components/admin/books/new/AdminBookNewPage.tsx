"use client";
import StatusBanner from "@/components/admin/books/commons/StatusBanner";
import type { BookFormState } from "@/hooks/admin/books/useAdminBookNewPage";
import { useAdminBookNewPage } from "@/hooks/admin/books/useAdminBookNewPage";
import { useAdminBookNewPageMeta } from "@/hooks/admin/books/useAdminBookNewPageMeta";
import { useBookFormNew } from "@/hooks/admin/books/useBookFormNew";
import { cx } from "@/lib/functions";
import { Offering, OfferingAlternative } from "@/lib/interfaces";
import { AnimatePresence, motion,Variants  } from 'framer-motion';
import { ArrowLeft, BookPlus, CheckSquare, Loader2, Save, Sparkles, Square, ChevronRight } from "lucide-react";
import React, { memo, useCallback, useMemo } from "react";
import { OfferingSelector } from "../../rubriques/OfferingSelector";
import BookCoverUpload from "../commons/BookCoverUpload";
import BookPreview from "../commons/BookPreview";
import { OfferingCategory } from "../commons/BookOfferingAlternatives";
import BookPdfUpload from "../commons/BookPdfUpload";
import FieldError from "../commons/FieldError";
import FieldLabel from "../commons/FieldLabel";

// ==================== CONSTANTES D'ANIMATION ====================
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

// ==================== SECTION SHELL PREMIUM ====================
const SectionShell = memo(function SectionShell({
  title,
  subtitle,
  children,
  sticky,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  sticky?: boolean;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      className={cx(
        "rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden",
        sticky ? "lg:sticky lg:top-6" : ""
      )}
    >
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
        <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  );
});

// ==================== BOOK FORM ====================
interface BookFormProps {
  form: BookFormState;
  onChange: (field: keyof BookFormState | string, value: unknown) => void;
  onSubmit: () => void;
  loading?: boolean;
  error?: string | null;
  formErrors?: Partial<Record<keyof BookFormState | string, string>>;
  onCoverImageSelect?: (file: File | null) => void;
  onPdfSelect?: (file: File | null) => void;
  submitLabel?: string;
  offerings: Offering[]
}

const inputClass = "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200";

const BookFormNew = memo(function BookFormNew({
  form,
  onChange,
  onSubmit,
  loading = false,
  error,
  formErrors,
  onCoverImageSelect,
  onPdfSelect,
  submitLabel = "Créer le livre",
  offerings,
}: BookFormProps) {
  const {
    pdfName, coverPreview, descLen, handlePdfSelect, handleCoverSelect,
  } = useBookFormNew(form, onChange, onCoverImageSelect, onPdfSelect);

  const onFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit();
    },
    [onSubmit]
  );

  const defaultAlternatives: OfferingAlternative[] = useMemo(() => [
    { category: "animal" as OfferingCategory, offeringId: "", quantity: 1 },
    { category: "vegetal" as OfferingCategory, offeringId: "", quantity: 1 },
    { category: "beverage" as OfferingCategory, offeringId: "", quantity: 1 },
  ], []);

  const offeringAlternatives = Array.isArray(form.offeringAlternatives) && form.offeringAlternatives.length === 3
    ? form.offeringAlternatives
    : defaultAlternatives;

  return (
    <form onSubmit={onFormSubmit} className="space-y-5" autoComplete="off" noValidate>
      {/* Uploads */}
      <div className="grid grid-cols-2 gap-4">
        <BookCoverUpload
          previewUrl={coverPreview}
          onFileSelect={handleCoverSelect}
          disabled={loading}
        />
        <BookPdfUpload
          previewName={pdfName}
          onFileSelect={handlePdfSelect}
          disabled={loading}
        />
      </div>

      {/* Offrandes associées */}
      <div>
        <FieldLabel htmlFor="offeringAlternatives">
          Offrandes associées
        </FieldLabel>
        <p className="mb-2 text-xs text-gray-500">
          Associez jusqu'à 3 alternatives (1 par catégorie)
        </p>
        <div className="space-y-2">
          {offeringAlternatives.map((alt, idx) => (
            <OfferingSelector
              key={alt.category}
              alternative={alt}
              offerings={offerings}
              onChange={(updated) => {
                const updatedAlts = offeringAlternatives.map((a, i) => i === idx ? updated : a);
                onChange("offeringAlternatives", updatedAlts);
              }}
            />
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Titre et sous-titre */}
      <div className="space-y-4">
        <div>
          <FieldLabel htmlFor="title" required>Titre du livre</FieldLabel>
          <input
            id="title"
            type="text"
            value={form.title}
            onChange={(e) => onChange("title", e.target.value)}
            className={inputClass}
            placeholder="Ex: Guide Complet du Développement Web"
            disabled={loading}
          />
          <FieldError msg={formErrors?.title} />
        </div>

        <div>
          <FieldLabel htmlFor="subtitle">Sous-titre</FieldLabel>
          <input
            id="subtitle"
            type="text"
            value={form.subtitle}
            onChange={(e) => onChange("subtitle", e.target.value)}
            className={inputClass}
            placeholder="Ex: De débutant à expert en 30 jours"
            disabled={loading}
          />
          <FieldError msg={formErrors?.subtitle} />
        </div>
      </div>

      {/* Description */}
      <div>
        <FieldLabel htmlFor="description" required hint="min. 50 caractères">
          Description
        </FieldLabel>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => onChange("description", e.target.value)}
          rows={3}
          className={cx(inputClass, "resize-none")}
          placeholder="Décrivez le contenu du livre, les sujets abordés…"
          disabled={loading}
        />
        <div className="mt-1 flex items-center justify-between">
          <FieldError msg={formErrors?.description} />
          <span className={cx(
            "text-[10px] font-medium",
            descLen >= 50 ? "text-emerald-600" : "text-gray-400"
          )}>
            {descLen}/50 {descLen >= 50 && "✓"}
          </span>
        </div>
      </div>

      {/* Auteur et catégorie */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel htmlFor="author" required>Auteur</FieldLabel>
          <input
            id="author"
            type="text"
            value={form.author}
            onChange={(e) => onChange("author", e.target.value)}
            className={inputClass}
            placeholder="Ex: Jean Dupont"
            disabled={loading}
          />
          <FieldError msg={formErrors?.author} />
        </div>
        <div>
          <FieldLabel htmlFor="category" required>Catégorie</FieldLabel>
          <input
            id="category"
            type="text"
            value={form.category}
            onChange={(e) => onChange("category", e.target.value)}
            className={inputClass}
            placeholder="Ex: Développement personnel"
            disabled={loading}
          />
          <FieldError msg={formErrors?.category} />
        </div>
      </div>

      {/* Pages */}
      <div>
        <FieldLabel htmlFor="pages">Nombre de pages</FieldLabel>
        <input
          id="pages"
          type="number"
          value={form.pages}
          onChange={(e) => onChange("pages", e.target.value)}
          className={inputClass}
          placeholder="250"
          min="1"
          disabled={loading}
        />
        <FieldError msg={formErrors?.pages} />
      </div>

      {/* Activer */}
      <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
        <button
          type="button"
          onClick={() => onChange("isActive", !form.isActive)}
          disabled={loading}
          className="mt-0.5 shrink-0"
          aria-pressed={form.isActive}
        >
          {form.isActive ? (
            <CheckSquare className="h-5 w-5 text-indigo-600" />
          ) : (
            <Square className="h-5 w-5 text-gray-400" />
          )}
        </button>
        <div>
          <p className="text-sm font-semibold text-gray-800">
            Activer ce livre immédiatement
          </p>
          <p className="text-xs text-gray-500">
            Le livre sera visible et disponible à l'achat dès sa création.
          </p>
        </div>
      </div>

      {/* Bouton submit */}
      {error && (
        <p className="text-center text-sm text-rose-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-60"
      >
        {loading ? (
          <><Loader2 className="h-4 w-4 animate-spin" />Enregistrement…</>
        ) : (
          <><Save className="h-4 w-4" />{submitLabel}</>
        )}
      </button>
    </form>
  );
});

// ==================== BOOK NEW FORM ====================
export function BookNewForm() {
  const {
    form, bookPreview, page, offerings, handlePdfSelect, handleSubmit, handleChange,
    handleCoverImageSelect, handleDismissError,
  } = useAdminBookNewPage();

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Status Banner */}
      <AnimatePresence>
        {(page.error || page.success) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <StatusBanner
              error={page.error}
              success={page.success}
              onDismissError={handleDismissError}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grille formulaire + aperçu */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionShell
          title="Informations du livre"
          subtitle="Les champs avec * sont requis."
        >
          <BookFormNew
            offerings={offerings}
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            loading={page.loading}
            error={page.error ?? undefined}
            onCoverImageSelect={handleCoverImageSelect}
            onPdfSelect={handlePdfSelect}
          />
        </SectionShell>

        <SectionShell
          title="Aperçu en direct"
          subtitle="Prévisualisez la carte telle qu'elle apparaîtra."
          sticky
        >
          <BookPreview book={bookPreview} offerings={offerings} />
        </SectionShell>
      </div>

      {/* Bouton flottant mobile */}
      {!page.success && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 lg:hidden z-50"
        >
          <button
            type="button"
            onClick={handleSubmit}
            disabled={page.loading}
            className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-60"
          >
            {page.loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <BookPlus className="h-4 w-4" />
            )}
            Créer
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

// ==================== FOOTER ====================
interface AdminBookNewFooterProps {
  backUrl: string;
}

export function AdminBookNewFooter({ backUrl }: AdminBookNewFooterProps) {
  return (
    <motion.footer
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="mt-8 flex flex-wrap items-center justify-center gap-4 text-center text-xs text-gray-500"
    >
      <span>Les champs marqués <span className="font-bold text-rose-500">*</span> sont requis.</span>
      <span className="hidden text-gray-300 sm:inline">•</span>
      <span>L'aperçu se met à jour à chaque modification.</span>
      <span className="hidden text-gray-300 sm:inline">•</span>
      <a
        href={backUrl}
        className="font-medium text-indigo-600 transition-colors hover:text-indigo-700"
      >
        Annuler et retourner
      </a>
    </motion.footer>
  );
}

// ==================== BREADCRUMBS ====================
interface Breadcrumb {
  label: string;
  href?: string;
  current?: boolean;
}

interface AdminBookNewBreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
}

export function AdminBookNewBreadcrumbs({ breadcrumbs }: AdminBookNewBreadcrumbsProps) {
  return (
    <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
      {breadcrumbs.map((crumb, i) => (
        <div key={i} className="flex items-center gap-2">
          {i > 0 && <ChevronRight className="h-3 w-3 text-gray-300" />}
          {crumb.current ? (
            <span className="flex items-center gap-1 text-indigo-600 font-medium">
              <Sparkles className="h-3 w-3" />
              {crumb.label}
            </span>
          ) : (
            <a href={crumb.href} className="hover:text-indigo-600 transition-colors">
              {crumb.label}
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

// ==================== HEADER ====================
interface AdminBookNewHeaderProps {
  backUrl: string;
}

export function AdminBookNewHeader({ backUrl }: AdminBookNewHeaderProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="mb-6"
    >
      <div className="flex items-center justify-between">
        <motion.a
          whileHover={{ x: -4 }}
          href={backUrl}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:border-indigo-200 hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </motion.a>
      </div>

      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 px-3 py-1.5 mb-3">
          <BookPlus className="h-3.5 w-3.5 text-indigo-600" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
            Création
          </span>
        </div>
        <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
          Nouveau livre
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Remplissez le formulaire · l'aperçu se met à jour en direct
        </p>
      </div>
    </motion.div>
  );
}

// ==================== COMPOSANT PRINCIPAL ====================
export default function AdminBookNewPage() {
  const { backUrl, breadcrumbs } = useAdminBookNewPageMeta();

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <AdminBookNewHeader backUrl={backUrl} />
        <AdminBookNewBreadcrumbs breadcrumbs={breadcrumbs} />
        <BookNewForm />
        <AdminBookNewFooter backUrl={backUrl} />
      </div>
    </main>
  );
}