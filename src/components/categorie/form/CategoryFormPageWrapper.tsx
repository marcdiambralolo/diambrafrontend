"use client";
import { CitySelectField, CitySelectValue } from '@/components/commons/CitySelectField';
import { containerVariants } from '@/components/commons/errorBoundaryVariants';
import ErrorToast from '@/components/commons/ErrorToast';
import { FormErrorMessage } from '@/components/commons/FormErrorMessage';
import InputField from '@/components/commons/InputField';
import RegisterSelectField from '@/components/commons/RegisterSelectField';
import { useCategoryFormClient } from '@/hooks/categorie/useCategoryFormClient';
import { AnimatePresence, motion,Variants  } from "framer-motion";
import { CheckCircle2, Sparkles, UserPlus } from 'lucide-react';
import { memo, useMemo } from 'react';

export const fieldVariants: Variants = {
    initial: { opacity: 0, x: -20 },
    animate: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.05, type: 'spring', stiffness: 200 }
    }),
};

export const GENDER_OPTIONS = [
    { value: '', label: 'Sélectionner' },
    { value: 'male', label: 'Homme' },
    { value: 'female', label: 'Femme' },
] as const;

type FormState = {
    nom?: string;
    prenoms?: string;
    gender?: string;
    dateNaissance?: string;
    paysNaissance?: string;
    villeNaissance?: string;
    heureNaissance?: string;
};

type ChangeEvt =
    | React.ChangeEvent<HTMLInputElement>
    | React.ChangeEvent<HTMLSelectElement>
    | React.ChangeEvent<HTMLTextAreaElement>;

interface FormFieldsProps {
    form: FormState;
    errors: Record<string, string | undefined>;
    handleChange: (e: ChangeEvt) => void;
    countryOptions: string[];
    cityApiUrl: string;
    cityApiKey: string;
    onChangeField: (name: string, value: string) => void;
    handleCitySelect: (c: CitySelectValue) => void;
}

export const FormFields = memo<FormFieldsProps>(function FormFields({
    form,
    errors,
    handleChange,
    countryOptions,
    cityApiUrl,
    cityApiKey,
    onChangeField,
    handleCitySelect,
}) {
    return (
        <div className="grid grid-cols-1 gap-3.5">
            <motion.div custom={0} variants={fieldVariants} initial="initial" animate="animate">
                <InputField
                    label="Nom"
                    value={form.nom || ''}
                    onChange={handleChange}
                    placeholder="Nom"
                    error={errors?.nom}
                    name="nom"
                />
            </motion.div>

            <motion.div custom={1} variants={fieldVariants} initial="initial" animate="animate">
                <InputField
                    label="Prénoms"
                    value={form.prenoms || ''}
                    onChange={handleChange}
                    placeholder="Prénoms"
                    error={errors?.prenoms}
                    name="prenoms"
                />
            </motion.div>

            <motion.div custom={2} variants={fieldVariants} initial="initial" animate="animate">
                <RegisterSelectField
                    label="Genre"
                    name="gender"
                    value={form.gender || ''}
                    onChange={handleChange}
                    options={Array.from(GENDER_OPTIONS)}
                    error={errors?.gender}
                />
            </motion.div>

            <motion.div custom={3} variants={fieldVariants} initial="initial" animate="animate">
                <InputField
                    label="Date de naissance"
                    type="date"
                    value={form.dateNaissance || ''}
                    onChange={handleChange}
                    error={errors?.dateNaissance}
                    name="dateNaissance"
                />
            </motion.div>

            <motion.div custom={4} variants={fieldVariants} initial="initial" animate="animate">
                <RegisterSelectField
                    label="Pays de naissance"
                    name="paysNaissance"
                    value={form.paysNaissance || ''}
                    onChange={handleChange}
                    options={countryOptions.map((c) => ({ value: c, label: c || 'Sélectionner' }))}
                    error={errors?.paysNaissance}
                />
            </motion.div>

            <motion.div custom={5} variants={fieldVariants} initial="initial" animate="animate">
                {cityApiUrl ? (
                    <CitySelectField
                        id="villeNaissance"
                        label="Ville de naissance"
                        value={form.villeNaissance || ''}
                        countryValue={form.paysNaissance || ''}
                        cityApiUrl={cityApiUrl}
                        cityApiKey={cityApiKey || undefined}
                        onChangeText={(txt) => onChangeField('villeNaissance', txt)}
                        onSelectCity={handleCitySelect}
                        error={errors?.villeNaissance}
                        placeholder="Ex: abidjan"
                        fallbackCities={[
                            { name: 'Abidjan', countryName: "Côte d'Ivoire" },
                            { name: 'Jacqueville', countryName: "Côte d'Ivoire" },
                            { name: 'Yamoussoukro', countryName: "Côte d'Ivoire" },
                            { name: 'Bouaké', countryName: "Côte d'Ivoire" },
                            { name: 'San Pedro', countryName: "Côte d'Ivoire" },
                            { name: 'Daloa', countryName: "Côte d'Ivoire" },
                            { name: 'Korhogo', countryName: "Côte d'Ivoire" },
                            { name: 'Man', countryName: "Côte d'Ivoire" },
                            { name: 'Gagnoa', countryName: "Côte d'Ivoire" },
                            { name: 'Anyama', countryName: "Côte d'Ivoire" },
                            { name: 'Séguéla', countryName: "Côte d'Ivoire" },
                            { name: 'Odienné', countryName: "Côte d'Ivoire" },
                            { name: 'Bondoukou', countryName: "Côte d'Ivoire" },
                        ]}
                    />
                ) : (
                    <InputField
                        label="Ville de naissance"
                        value={form.villeNaissance || ''}
                        onChange={handleChange}
                        placeholder="Ex: Abidjan"
                        error={errors?.villeNaissance}
                        name="villeNaissance"
                    />
                )}
            </motion.div>

            <motion.div custom={6} variants={fieldVariants} initial="initial" animate="animate">
                <InputField
                    label="Heure de naissance"
                    type="time"
                    value={form.heureNaissance || ''}
                    onChange={handleChange}
                    error={errors?.heureNaissance}
                    name="heureNaissance"
                />
            </motion.div>
        </div>
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
    prev.choixDescription === next.choixDescription
);

export default function CategoryFormPageWrapper() {
    const {
        handleChange, handleSubmit, handleReset, handleCloseError, handleCitySelect,
        onChangeField, title, contextInfo, form, errors, apiError, showErrorToast,
        countryOptions, cityApiUrl, cityApiKey,
    } = useCategoryFormClient();

    return (
        <div className="max-w-4xl mx-auto mt-8 px-3 sm:px-6">
            <div                >
                <div className="mb-6">
                    <h1 className="bg-gradient-to-r from-[#163A74] via-[#2E5AA6] to-[#4F83D1] bg-clip-text text-center text-2xl font-bold text-transparent dark:from-white dark:via-[#DDE7FA] dark:to-[#9BC2FF] sm:text-3xl">
                        {title}
                    </h1>
                </div>
                <CategoryContextBanner
                    rubriqueTitre={contextInfo.rubrique?.titre}
                    choixTitre={contextInfo.choix?.title}
                    choixDescription={contextInfo.choix?.description}
                />
                < div className="mt-6">
                    <motion.div
                        variants={containerVariants}
                        initial="initial"
                        animate="animate"
                        className="relative mx-auto w-full max-w-4xl px-3 py-4 sm:px-4"
                    >
                        <div className="relative mx-auto w-full rounded-2xl border border-[#DDE7FA]/80 bg-gradient-to-br from-white via-[#EEF4FF]/60 to-blue-50/20 p-4 shadow-xl backdrop-blur-sm dark:border-[#2E5AA6]/30 dark:from-gray-900 dark:via-[#0F1C3F]/35 dark:to-blue-950/20 sm:p-6">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, type: 'spring' }}
                                className="mx-auto mb-6 flex max-6xl flex-col items-center justify-center text-center bg-[#162A56] rounded-2xl shadow-[0_8px_32px_-18px_rgba(46,90,166,0.18)] p-6"
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
                                    Informations sur la personne concernée
                                </h2>
                                <p className="mt-2  text-sm text-white dark:text-gray-300 font-medium">
                                    Remplis les champs pour une consultation personnalisée et précise
                                </p>
                            </motion.div>

                            <AnimatePresence mode="wait">
                                {apiError && <FormErrorMessage message={apiError} />}
                            </AnimatePresence>

                            <form onSubmit={handleSubmit} className="mx-auto mt-6 w-full max-w-xl space-y-3.5">
                                <FormFields
                                    form={form}
                                    errors={errors}
                                    handleChange={handleChange}
                                    countryOptions={countryOptions}
                                    cityApiUrl={cityApiUrl}
                                    cityApiKey={cityApiKey}
                                    onChangeField={onChangeField}
                                    handleCitySelect={handleCitySelect}
                                />

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, type: 'spring' }}
                                    className="pt-3"
                                >
                                    <div className="flex flex-col items-stretch justify-center gap-2.5 sm:flex-row">
                                        <motion.button
                                            type="submit"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="relative inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg overflow-hidden
                     bg-gradient-to-r from-[#2E5AA6] via-[#4F83D1] to-[#2E5AA6] hover:shadow-[#2E5AA6]/40
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9BC2FF] dark:focus-visible:ring-[#2E5AA6]/40 transition-all duration-300 sm:w-auto"
                                        >
                                            Valider et Continuer
                                        </motion.button>

                                        <motion.button
                                            type="button"
                                            onClick={handleReset}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="inline-flex w-full items-center justify-center rounded-xl border-2 border-[#DDE7FA] dark:border-[#2E5AA6]/40 bg-white dark:bg-gray-900 px-5 py-3 text-sm font-bold text-gray-700 dark:text-gray-200
                     hover:bg-[#EEF4FF] dark:hover:bg-[#0F1C3F]/35 hover:border-[#4F83D1] dark:hover:border-[#4F83D1]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9BC2FF] dark:focus-visible:ring-[#2E5AA6]/40 transition-all sm:w-auto"
                                        >
                                            Annuler
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>

            <AnimatePresence>
                {showErrorToast && (
                    <ErrorToast message={apiError!} onClose={handleCloseError} />
                )}
            </AnimatePresence>
        </div>
    );
}