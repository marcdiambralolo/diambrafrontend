"use client";
import ErrorToast from '@/components/commons/ErrorToast';
import { FormErrorMessage } from '@/components/commons/FormErrorMessage';
import { FormFieldsGroupe } from '@/components/categorie/formgroupe/FormFieldsGroupe';
import { useCategoryFormClientGroupe } from '@/hooks/categorie/useCategoryFormClientGroupe';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Plus, Sparkles, Trash2, UserPlus } from 'lucide-react';
import { memo, useMemo } from 'react';
import { useCallback } from 'react';

interface FormActionsProps {
    onSubmit: () => void;
    onCancel: () => void;
    onSaveTierces?: () => void | boolean | Promise<void | boolean>;
    hasTierces?: boolean;
}

export const FormActionsGroupe = memo<FormActionsProps>(function FormActionsGroupe({
    onSubmit,
    onCancel,
    onSaveTierces,
    hasTierces = false,
}) {

    const handlePrimaryClick = useCallback(async () => {
        const result = onSaveTierces ? await onSaveTierces() : undefined;
        if (result === false) return;
        onSubmit();
    }, [onSaveTierces, onSubmit]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: 'spring' }}
            className="pt-3"
        >
            <div className="flex flex-col items-stretch justify-center gap-2.5 sm:flex-row">
                <motion.button
                    type="button"
                    onClick={handlePrimaryClick}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg overflow-hidden
                     bg-gradient-to-r from-[#2E5AA6] via-[#4F83D1] to-[#2E5AA6] hover:shadow-[#2E5AA6]/40
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9BC2FF] dark:focus-visible:ring-[#2E5AA6]/40 transition-all duration-300 sm:w-auto"
                >
                    {hasTierces ? 'Terminer et Soumettre' : 'Valider et Continuer'}
                </motion.button>
                <motion.button
                    type="button"
                    onClick={onCancel}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex w-full items-center justify-center rounded-xl border-2 border-[#DDE7FA] dark:border-[#2E5AA6]/40 bg-white dark:bg-gray-900 px-5 py-3 text-sm font-bold text-gray-700 dark:text-gray-200
                     hover:bg-[#EEF4FF] dark:hover:bg-[#0F1C3F]/35 hover:border-[#4F83D1] dark:hover:border-[#4F83D1]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9BC2FF] dark:focus-visible:ring-[#2E5AA6]/40 transition-all sm:w-auto"
                >
                    Annuler
                </motion.button>
            </div>
        </motion.div>
    );
});

interface CategoryContextBannerProps {
    rubriqueTitre?: string;
    choixTitre?: string;
    choixDescription?: string;
}

const CategoryContextBanner = memo<CategoryContextBannerProps>(function CategoryContextBanner({
    rubriqueTitre, choixTitre, choixDescription }) {
    const containerClasses = useMemo(
        () => "theme-dark-panel relative isolate mb-4 sm:mb-6 flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-50/80 via-slate-50/60 to-white/80 text-center backdrop-blur-xl dark:border-[color:var(--theme-border)] dark:from-[#0F1C3F]/78 dark:via-[#162A56]/64 dark:to-[#0F1C3F]/78",
        []
    );

    const contentClasses = useMemo(
        () => "relative z-10 px-4 py-3 sm:px-6 sm:py-4 w-full flex flex-col items-center justify-center text-center",
        []
    );

    return (
        <div className={containerClasses}>
            <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#2E5AA6]/10 via-[#4F83D1]/10 to-[#9BC2FF]/8 dark:from-[#2E5AA6]/10 dark:via-[#4F83D1]/8 dark:to-[#9BC2FF]/8"
                style={{
                    backgroundPosition: '0% 50%',
                    backgroundSize: '200% 200%',
                    animation: 'gradientAnimation 5s linear infinite',
                }}
            />

            <div className={contentClasses}>
                {rubriqueTitre && (
                    <div
                        className="max-w-8xl flex flex-col sm:flex-row items-center justify-center gap-2 mb-2"
                    >
                        <Sparkles className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-[#9BC2FF] sm:h-5 sm:w-5" />
                        <span className="text-xs font-medium text-blue-900/70 dark:text-[#AFC0DE] sm:text-sm">
                            Rubrique :
                        </span>

                        <span className="text-xs font-semibold text-blue-950 dark:text-white sm:text-sm">
                            {rubriqueTitre}
                        </span>
                    </div>
                )}

                {choixTitre && (
                    <div>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#2E5AA6] dark:text-[#9BC2FF] sm:h-5 sm:w-5" />
                            <span className="text-xs font-medium text-[#163A74]/70 dark:text-[#AFC0DE] sm:text-sm">
                                Consultation :
                            </span>

                            <span className="text-xs font-semibold text-[#163A74] dark:text-white sm:text-sm">
                                {choixTitre}
                            </span>
                        </div>

                        {choixDescription && (
                            <p className="mx-auto mt-1 dark:text-[#D1D5DB]">
                                {choixDescription}
                            </p>
                        )}
                    </div>
                )}
                <div className="pointer-events-none absolute -top-1 -right-1 h-20 w-20 rounded-full bg-gradient-to-br from-white/40 to-transparent dark:from-white/10 blur-2xl" />
            </div>
        </div>
    );
}, (prev, next) =>
    prev.rubriqueTitre === next.rubriqueTitre &&
    prev.choixTitre === next.choixTitre &&
    prev.choixDescription === next.choixDescription
);

type Tierce = {
    id: string;
    prenoms?: string;
    nom?: string;
    dateNaissance?: string;
    villeNaissance?: string;
};

const TierceRow = memo(function TierceRow({
    tierce,
    onRemove,
}: {
    tierce: Tierce;
    onRemove: (id: string) => void;
}) {
    const fullName = `${(tierce.prenoms || '').trim()} ${(tierce.nom || '').trim()}`.trim() || '—';
    const birthLine = tierce.dateNaissance
        ? `Né(e) le ${tierce.dateNaissance}${tierce.villeNaissance ? ` à ${tierce.villeNaissance}` : ''}`
        : 'Informations de naissance';
    return (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold text-slate-900">{fullName}</p>
                <p className="truncate text-xs font-semibold text-slate-600">{birthLine}</p>
            </div>

            <button
                type="button"
                onClick={() => onRemove(tierce.id)}
                className="shrink-0 rounded-xl p-2 text-rose-600 transition-colors hover:bg-rose-50"
                title="Supprimer cette personne"
                aria-label="Supprimer cette personne"
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    );
});

function CategoryFormClientGroupe() {
    const {
        handleChange, handleCitySelect, onChangeField, handleSubmit, handleAddTierceClick,
        handleAddTierceWrapper, handleOpenAddMore, handleCancelAddMore, handleRemove,
        resetSelection, handleCloseError, contextInfo, form, errors, apiError,
        showErrorToast, tiercesList, showAddMore, isFormValid, successMessage,
        countryOptions, cityApiUrl, cityApiKey, tiercesCountLabel, hasTierces,
        canAddMore, showTierceForm, title, maxTierces, tiercesCount, showForm,
    } = useCategoryFormClientGroupe();

    return (
        <div className="mt-8 py-6 sm:py-8 text-slate-900">
            <div className="mx-auto max-w-4xl px-3 sm:px-6">

                <div className="mb-6 text-center">
                    <h1 className="text-balance text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                        {title}
                    </h1>
                </div>

                <CategoryContextBanner
                    rubriqueTitre={contextInfo.rubrique?.titre}
                    choixTitre={contextInfo.choix?.title}
                    choixDescription={contextInfo.choix?.description}
                />

                {showForm ? (
                    <div className="mt-6">
                        <div className="relative mx-auto w-full rounded-[26px] border border-slate-200 bg-white p-4 sm:p-6 shadow-[0_22px_60px_-45px_rgba(2,6,23,0.35)]">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, type: 'spring' }}
                                className="mx-auto mb-6 flex flex-col items-center justify-center text-center bg-[#162A56] rounded-2xl shadow-[0_8px_32px_-18px_rgba(46,90,166,0.18)] p-6"
                            >
                                <motion.div
                                    className="mb-3 relative"
                                    animate={{ rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <div className="rounded-2xl bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] p-3 shadow-[0_8px_32px_-18px_rgba(46,90,166,0.18)]">
                                        <UserPlus className="w-7 h-7 text-white" />
                                    </div>
                                    <motion.div
                                        className="absolute inset-0 rounded-2xl bg-[#4F83D1]/30 blur-xl"
                                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </motion.div>

                                <h2 className="bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] bg-clip-text text-xl font-extrabold tracking-tight text-transparent sm:text-2xl">
                                    Informations sur les personnes concernées
                                </h2>

                                <p className="mt-2 text-sm text-white dark:text-gray-300 font-medium">
                                    Remplis les champs pour une consultation personnalisée et précise
                                </p>
                            </motion.div>

                            {apiError ? <FormErrorMessage message={apiError} /> : null}

                            {hasTierces ? (
                                <div className="mb-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <h3 className="text-sm font-black text-slate-900">{tiercesCountLabel}</h3>
                                        <div className="text-[11px] font-extrabold text-slate-600">
                                            {maxTierces ? `${tiercesCount}/${maxTierces}` : null}
                                        </div>
                                    </div>

                                    <div className="mt-3 space-y-2">
                                        {(tiercesList as Tierce[]).map((t) => (
                                            <TierceRow key={t.id} tierce={t} onRemove={handleRemove} />
                                        ))}
                                    </div>

                                    {!canAddMore ? (
                                        <p className="mt-3 text-xs font-semibold text-amber-700">
                                            Limite atteinte : {maxTierces} personnes maximum.
                                        </p>
                                    ) : null}
                                </div>
                            ) : null}

                            {successMessage ? (
                                <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-center text-sm font-extrabold text-emerald-800">
                                    {successMessage}
                                </div>
                            ) : null}

                            <form className="mx-auto mt-6 w-full max-w-xl space-y-3.5">
                                {!showAddMore && hasTierces && canAddMore ? (
                                    <div className="text-center">
                                        <button
                                            type="button"
                                            onClick={handleOpenAddMore}
                                            className="mx-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-slate-800"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Ajouter une autre personne
                                        </button>
                                    </div>
                                ) : null}

                                {showTierceForm ? (
                                    <div>
                                        {hasTierces ? (
                                            <h3 className="mb-3 text-sm font-black text-slate-900">Ajouter une nouvelle personne</h3>
                                        ) : null}

                                        <FormFieldsGroupe
                                            form={form}
                                            errors={errors}
                                            handleChange={handleChange}
                                            countryOptions={countryOptions}
                                            cityApiUrl={cityApiUrl}
                                            cityApiKey={cityApiKey}
                                            onChangeField={onChangeField}
                                            handleCitySelect={handleCitySelect}
                                        />

                                        <div className="mt-4 flex gap-3">
                                            {hasTierces ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={handleAddTierceClick}
                                                        disabled={!canAddMore || !isFormValid}
                                                        className="flex-1 rounded-2xl bg-[#2E5AA6] px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#3567B8] disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        Ajouter cette personne
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={handleCancelAddMore}
                                                        className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-900 transition hover:bg-slate-50"
                                                    >
                                                        Annuler
                                                    </button>
                                                </>
                                            ) : (
                                                <FormActionsGroupe
                                                    onSubmit={handleSubmit}
                                                    onCancel={resetSelection}
                                                    onSaveTierces={handleAddTierceWrapper}
                                                    hasTierces={hasTierces}
                                                />
                                            )}
                                        </div>
                                    </div>
                                ) : null}

                                {hasTierces && !showAddMore ? (
                                    <FormActionsGroupe onSubmit={handleSubmit} onCancel={resetSelection} hasTierces={hasTierces} />
                                ) : null}
                            </form>
                        </div>
                    </div>
                ) : null}

                <AnimatePresence>
                    {showErrorToast && (
                        <ErrorToast message={apiError!} onClose={handleCloseError} />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default function CategoryFormGroupePageWrapper() {

    return <CategoryFormClientGroupe />;
}