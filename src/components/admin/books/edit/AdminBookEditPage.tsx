"use client";
import BookPreview from "@/components/admin/books/commons/BookPreview";
import { useAdminBookEditPage } from "@/hooks/admin/books/useAdminBookEditPage";
import type { BookFormState } from "@/hooks/admin/books/useAdminBookNewPage";
import { useBookFormNew } from "@/hooks/admin/books/useBookFormNew";
import { cx } from "@/lib/functions";
import { Offering, OfferingAlternative } from "@/lib/interfaces";
import { AnimatePresence, motion,Variants } from 'framer-motion';
import { ArrowLeft, BookOpen, CheckSquare, ChevronRight, Loader2, Save, Sparkles, Square } from "lucide-react";
import React, { memo, useCallback, useMemo } from "react";
import { OfferingSelector } from "../../rubriques/OfferingSelector";
import StatusBanner from "../commons/StatusBanner";
import BookCoverUpload from "../commons/BookCoverUpload";
import { OfferingCategory } from "../commons/BookOfferingAlternatives";
import BookPdfUpload from "../commons/BookPdfUpload";
import FieldError from "../commons/FieldError";
import FieldLabel from "../commons/FieldLabel";

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

const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200";

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
            <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
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
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-60"
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

// ==================== CARD HEADER ====================
type IconComponent = React.ComponentType<{ className?: string }>;

export const CardHeader = memo(function CardHeader({
    icon: Icon,
    title,
    subtitle,
}: {
    icon: IconComponent;
    title: string;
    subtitle?: string;
}) {
    return (
        <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1.5 mb-3">
                <Icon className="h-3.5 w-3.5 text-indigo-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                    {title}
                </span>
            </div>
            {subtitle && (
                <p className="text-sm text-gray-500">{subtitle}</p>
            )}
        </div>
    );
});

// ==================== BREADCRUMB ====================
function buildBackUrl(): string {
    return `/admin/books?cb=${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
}

export const Breadcrumb = memo(function Breadcrumb() {
    return (
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <a href="/admin" className="hover:text-indigo-600 transition-colors">Admin</a>
            <ChevronRight className="h-3 w-3" />
            <a href={buildBackUrl()} className="hover:text-indigo-600 transition-colors">Livres</a>
            <ChevronRight className="h-3 w-3" />
            <span className="flex items-center gap-1 text-indigo-600 font-medium">
                <Sparkles className="h-3 w-3" />
                Modifier
            </span>
        </div>
    );
});

// ==================== LOADING STATE ====================
const BooksLoading = memo(() => (
    <div className="flex min-h-[80vh] w-full items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-gray-100 shadow-sm max-w-xs w-full">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                className="mb-4"
            >
                <Loader2 className="mx-auto h-10 w-10 text-indigo-500" />
            </motion.div>
            <p className="text-sm font-semibold text-gray-600">Chargement...</p>
        </div>
    </div>
));

// ==================== STATUS BANNER ====================
interface EditStatusBannerProps {
    error?: string;
    success?: boolean;
    dismissError: () => void;
}

export function EditStatusBanner({ error, success, dismissError }: EditStatusBannerProps) {
    return (
        <AnimatePresence>
            {(error || success) && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4"
                >
                    <StatusBanner error={error || null} success={!!success} onDismissError={dismissError} />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ==================== EDIT FORM CARD ====================
interface EditFormCardProps {
    formState: BookFormState;
    handleBookFormChange: BookFormProps['onChange'];
    handleSubmit: () => void;
    saving: boolean;
    error?: string;
    offerings: Offering[];
    handleCoverSelect: (file: File | null) => void;
    handlePdfSelect: (file: File | null) => void;
}

export function EditFormCard({
    formState,
    handleBookFormChange,
    handleSubmit,
    saving,
    error,
    offerings,
    handleCoverSelect,
    handlePdfSelect,
}: EditFormCardProps) {
    return (
        <div className="rounded-xl bg-white border border-gray-100 p-6 shadow-sm">
            <CardHeader
                icon={BookOpen}
                title="Informations du livre"
                subtitle="Les champs marqués d'un * sont requis."
            />
            <div className="mt-5">
                <BookFormNew
                    form={formState}
                    onChange={handleBookFormChange}
                    onSubmit={handleSubmit}
                    loading={saving}
                    error={error}
                    offerings={offerings}
                    onCoverImageSelect={handleCoverSelect}
                    onPdfSelect={handlePdfSelect}
                    submitLabel="Enregistrer les modifications"
                />
            </div>
        </div>
    );
}

// ==================== EDIT HEADER ====================
interface EditHeaderProps {
    backUrl: string;
}

export function EditHeader({ backUrl }: EditHeaderProps) {
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
                    <BookOpen className="h-3.5 w-3.5 text-indigo-600" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                        Édition
                    </span>
                </div>
                <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
                    Modifier le livre
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Gérez les informations et la couverture du livre avec précision.
                </p>
            </div>
        </motion.div>
    );
}

// ==================== COMPOSANT PRINCIPAL ====================
export default function AdminBookEditPage() {
    const {
        error, saving, success, loading, backUrl, offerings, formState, previewBook,
        handleBookFormChange, handleCoverSelect, handlePdfSelect, handleSubmit, dismissError,
    } = useAdminBookEditPage();

    if (loading) return <BooksLoading />;

    return (
        <main className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
            <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
                {/* Header */}
                <EditHeader backUrl={backUrl} />

                {/* Breadcrumb */}
                <Breadcrumb />

                {/* Status Banner */}
                <EditStatusBanner error={error ?? undefined} success={success} dismissError={dismissError} />

                {/* Message de succès */}
                <AnimatePresence>
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center"
                        >
                            <p className="text-sm font-medium text-emerald-700">
                                ✅ Livre modifié avec succès ! Redirection en cours…
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Contenu principal */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="mt-6 grid gap-6 lg:grid-cols-2"
                >
                    {/* Formulaire */}
                    <motion.div variants={fadeInUp}>
                        <EditFormCard
                            formState={formState}
                            handleBookFormChange={handleBookFormChange}
                            handleSubmit={handleSubmit}
                            saving={saving}
                            error={error ?? undefined}
                            offerings={offerings}
                            handleCoverSelect={handleCoverSelect}
                            handlePdfSelect={handlePdfSelect}
                        />
                    </motion.div>

                    {/* Aperçu */}
                    <motion.div variants={fadeInUp}>
                        <div className="rounded-xl bg-white border border-gray-100 p-6 shadow-sm sticky top-6">
                            <CardHeader
                                icon={BookOpen}
                                title="Aperçu"
                                subtitle="Visualisez le livre tel qu'il apparaîtra"
                            />
                            <div className="mt-5">
                                <BookPreview book={previewBook} offerings={offerings} />
                            </div>

                            {/* Bouton submit flottant (mobile) */}
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={saving}
                                className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-60 lg:hidden"
                            >
                                {saving ? (
                                    <><Loader2 className="h-4 w-4 animate-spin" />Enregistrement...</>
                                ) : (
                                    <><Save className="h-4 w-4" />Enregistrer les modifications</>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </main>
    );
}