"use client";
import { useEditOffrande } from "@/hooks/admin/offrandes/useEditOffrande";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowLeft, Loader2, Save, X } from "lucide-react";
import React, { memo, useCallback, useState } from "react";

const CONSTANTS = {
    MAX_NAME_LENGTH: 64,
    MIN_NAME_LENGTH: 2,
    MAX_DESCRIPTION_LENGTH: 256,
    MIN_DESCRIPTION_LENGTH: 4,
    EXCHANGE_RATE: 563.5,
    ANIMATION_DURATION: 0.3,
} as const;

// ==================== TYPES ====================
interface EditOffrandeFormProps {
    formData: {
        _id?: string;
        name: string;
        price: number;
    };
    saving: boolean;
    error: string | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onCancel: () => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
}

// ==================== COMPOSANTS ====================
const FormField = memo(({
    label,
    required,
    error,
    children,
    htmlFor
}: {
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
    htmlFor?: string;
}) => (
    <div className="w-full flex flex-col gap-2">
        <label
            htmlFor={htmlFor}
            className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1"
        >
            {label}
            {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {error && (
            <p className="text-[10px] text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                {error}
            </p>
        )}
    </div>
));

const ImagePreview = memo(({
    onRemove,
    isNew = false
}: {
    src: string;
    alt: string;
    onRemove: () => void;
    isNew?: boolean;
}) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative group"
    >

        {isNew && (
            <div className="absolute top-0 left-0 bg-green-500 text-white text-[8px] font-bold px-1 rounded-br-lg rounded-tl-lg">
                NOUVEAU
            </div>
        )}
        <button
            type="button"
            onClick={onRemove}
            className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition shadow-md"
        >
            <X className="w-3 h-3" />
        </button>
    </motion.div>
));

ImagePreview.displayName = 'ImagePreview';

// ==================== FORMULAIRE PRINCIPAL ====================
export const EditOffrandeForm = memo(({
    formData,
    saving,
    error,
    onChange,
    onCancel,
    onSubmit,
}: EditOffrandeFormProps) => {
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [uploadProgress, setUploadProgress] = useState(0);


    const validateField = useCallback((name: string, value: string | number) => {
        switch (name) {
            case 'name':
                if (!value || String(value).length < CONSTANTS.MIN_NAME_LENGTH) {
                    return `Minimum ${CONSTANTS.MIN_NAME_LENGTH} caractères`;
                }
                if (String(value).length > CONSTANTS.MAX_NAME_LENGTH) {
                    return `Maximum ${CONSTANTS.MAX_NAME_LENGTH} caractères`;
                }
                return '';
            case 'description':
                if (!value || String(value).length < CONSTANTS.MIN_DESCRIPTION_LENGTH) {
                    return `Minimum ${CONSTANTS.MIN_DESCRIPTION_LENGTH} caractères`;
                }
                if (String(value).length > CONSTANTS.MAX_DESCRIPTION_LENGTH) {
                    return `Maximum ${CONSTANTS.MAX_DESCRIPTION_LENGTH} caractères`;
                }
                return '';
            case 'price':
                if (!value || Number(value) <= 0) {
                    return 'Le prix doit être supérieur à 0';
                }
                return '';
            default:
                return '';
        }
    }, []);

    const handleLocalChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setFieldErrors(prev => ({ ...prev, [name]: error }));
        onChange(e);
    }, [onChange, validateField]);

    const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation complète
        const nameError = validateField('name', formData.name);
        const priceError = validateField('price', formData.price);

        if (nameError || priceError) {
            setFieldErrors({
                name: nameError,
                price: priceError,
            });
            return;
        }

        const interval = setInterval(() => {
            setUploadProgress(prev => Math.min(prev + 10, 90));
        }, 200);

        try {
            await onSubmit(e);
            clearInterval(interval);
            setUploadProgress(100);
        } catch (err) {
            console.error('Erreur lors de la sauvegarde :', err);
            clearInterval(interval);
            setUploadProgress(0);
        }
    }, [formData, validateField, onSubmit]);

    const isValid = formData.name.length >= CONSTANTS.MIN_NAME_LENGTH &&
        formData.price > 0;

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: CONSTANTS.ANIMATION_DURATION }}
            onSubmit={handleFormSubmit}
            className="w-full max-w-2xl mx-auto my-8"
        >
            <div className="bg-white dark:bg-[#0F1C3F] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-xl font-black text-white">Modifier</h1>
                            <p className="text-sm text-indigo-100">Mettez à jour les informations</p>
                        </div>
                    </div>
                </div>

                {/* Formulaire */}
                <div className="p-6 space-y-5">
                    {/* Nom */}
                    <FormField label="Nom" required htmlFor="offrande-name" error={fieldErrors.name}>
                        <input
                            id="offrande-name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleLocalChange}
                            placeholder="ex: Poulet blanc, Noix de cola..."
                            maxLength={CONSTANTS.MAX_NAME_LENGTH}
                            className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#13274C] px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 outline-none transition"
                            autoFocus
                        />
                    </FormField>



                    {/* Prix */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField label="Prix (XOF)" required htmlFor="offrande-price" error={fieldErrors.price}>
                            <input
                                id="offrande-price"
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleLocalChange}
                                min={0}
                                step={100}
                                className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#13274C] px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                            />
                        </FormField>


                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
                            >
                                <p className="text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={saving || !isValid}
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-sm font-bold text-white shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Sauvegarde...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Enregistrer
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </motion.form>
    );
});

// ==================== COMPOSANTS DE CHARGEMENT ET ERREUR ====================
export const EditOffrandeLoading = memo(() => (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
        >
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400 font-medium">Chargement de l'offrande...</p>
        </motion.div>
    </div>
));

export const EditOffrandeError = memo(({ error, onRetry }: { error: string; onRetry: () => void }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[50vh] p-8"
    >
        <div className="max-w-md w-full bg-white dark:bg-[#0F1C3F] rounded-2xl border border-red-200 dark:border-red-800 p-8 text-center shadow-xl">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Erreur de chargement
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                {error}
            </p>
            <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:from-indigo-700 hover:to-purple-700 transition shadow-md"
            >
                <Loader2 className="w-4 h-4" />
                Réessayer
            </button>
        </div>
    </motion.div>
));

EditOffrandeError.displayName = 'EditOffrandeError';

// ==================== COMPOSANT PRINCIPAL ====================
export default function EditOffrandePageClient() {
    const {
        formData,
        loading,
        saving,
        error,
        handleChange,
        handleSubmit,
        handleCancel,
        fetchData,
    } = useEditOffrande();

    if (loading) return <EditOffrandeLoading />;
    if (error) return <EditOffrandeError error={error} onRetry={fetchData} />;
    if (!formData) return null;

    return (
        <EditOffrandeForm
            formData={formData}
            saving={saving}
            error={error}
            onChange={handleChange}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
        />
    );
}