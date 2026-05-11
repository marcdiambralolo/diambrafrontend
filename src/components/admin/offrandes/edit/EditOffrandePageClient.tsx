"use client";
import { useEditOffrande } from "@/hooks/admin/offrandes/useEditOffrande";
import { CATEGORIES_OFFRANDES } from '@/lib/constants';
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowLeft, CheckCircle, Loader2, Save, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";

// ==================== CONSTANTES ====================
const CONSTANTS = {
    MAX_NAME_LENGTH: 64,
    MIN_NAME_LENGTH: 2,
    MAX_DESCRIPTION_LENGTH: 256,
    MIN_DESCRIPTION_LENGTH: 4,
    EXCHANGE_RATE: 563.5,
    ANIMATION_DURATION: 0.3,
    MAX_FILE_SIZE_MB: 5,
    ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as string[],
} as const;

// ==================== TYPES ====================
interface EditOffrandeFormProps {
    formData: {
        _id?: string;
        name: string;
        price: number;
        priceUSD: number;
        category: 'animal' | 'vegetal' | 'beverage' | '';
        description: string;
        illustrationUrl?: string;
    };
    priceUSD: number;
    saving: boolean;
    error: string | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onCategory: (cat: 'animal' | 'vegetal' | 'beverage') => void;
    onCancel: () => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    // États d'image provenant du hook
    imageState: {
        file: File | null;
        previewUrl: string | null;
        shouldRemove: boolean;
    };
    setImageFile: (file: File | null) => void;
    markImageForRemoval: () => void;
    cancelImageRemoval: () => void;
    clearNewImage: () => void;
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

FormField.displayName = 'FormField';

const CategoryButton = memo(({
    category,
    isActive,
    onClick
}: {
    category: typeof CATEGORIES_OFFRANDES[0];
    isActive: boolean;
    onClick: () => void;
}) => (
    <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`flex-1 py-2.5 px-2 rounded-xl font-bold text-sm transition-all outline-none focus:ring-2 focus:ring-[#4F83D1] flex flex-col items-center gap-1 ${isActive
            ? 'bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] text-white shadow-lg scale-105'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#13274C] dark:text-gray-300 dark:hover:bg-[#163A74]'
            }`}
    >
        <span className="text-xl">{category.emoji}</span>
        <span className="text-xs">{category.label}</span>
    </motion.button>
));

CategoryButton.displayName = 'CategoryButton';

const ImagePreview = memo(({
    src,
    alt,
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
        <Image
            src={src}
            alt={alt}
            width={80}
            height={80}
            className="w-20 h-20 object-cover rounded-xl border-2 border-indigo-200 dark:border-indigo-800 shadow-md"
            unoptimized={src.startsWith('blob:') || src.startsWith('data:')}
        />
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
    priceUSD,
    saving,
    error,
    onChange,
    onCategory,
    onCancel,
    onSubmit,
    imageState,
    setImageFile,
    markImageForRemoval,
    cancelImageRemoval,
    clearNewImage,
}: EditOffrandeFormProps) => {
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Nettoyer les preview URLs au démontage
    useEffect(() => {
        return () => {
            if (imageState.previewUrl && imageState.previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(imageState.previewUrl);
            }
        };
    }, [imageState.previewUrl]);

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

    const validateFile = useCallback((file: File): string | null => {
        if (!CONSTANTS.ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            return 'Format non supporté. Utilisez JPG, PNG, WebP ou GIF';
        }
        if (file.size > CONSTANTS.MAX_FILE_SIZE_MB * 1024 * 1024) {
            return `L'image ne doit pas dépasser ${CONSTANTS.MAX_FILE_SIZE_MB} MB`;
        }
        return null;
    }, []);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;

        if (file) {
            const error = validateFile(file);
            if (error) {
                setFieldErrors(prev => ({ ...prev, illustration: error }));
                return;
            }

            setImageFile(file);
            setFieldErrors(prev => {
                const { illustration, ...rest } = prev;
                console.log('File valid, clearing illustration error' + illustration);
                return rest;
            });
        } else {
            clearNewImage();
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [validateFile, setImageFile, clearNewImage]);

    const handleRemoveNewImage = useCallback(() => {
        clearNewImage();
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [clearNewImage]);

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
        const descError = validateField('description', formData.description);
        const priceError = validateField('price', formData.price);

        if (nameError || descError || priceError) {
            setFieldErrors({
                name: nameError,
                description: descError,
                price: priceError,
            });
            return;
        }

        if (!formData.category) {
            alert('Veuillez sélectionner une catégorie');
            return;
        }

        // Simuler la progression de l'upload
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

    const hasExistingImage = formData.illustrationUrl &&
        formData.illustrationUrl.trim() &&
        !imageState.shouldRemove &&
        !imageState.file;

    const showExistingImage = hasExistingImage && !imageState.shouldRemove;
    const isValid = formData.name.length >= CONSTANTS.MIN_NAME_LENGTH &&
        formData.description.length >= CONSTANTS.MIN_DESCRIPTION_LENGTH &&
        formData.price > 0 &&
        formData.category;

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
                            <h1 className="text-xl font-black text-white">Modifier l'offrande</h1>
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

                    {/* Catégorie */}
                    <FormField label="Catégorie" required>
                        <div className="flex gap-2">
                            {CATEGORIES_OFFRANDES.map(cat => (
                                <CategoryButton
                                    key={cat.value}
                                    category={cat}
                                    isActive={formData.category === cat.value}
                                    onClick={() => onCategory(cat.value as 'animal' | 'vegetal' | 'beverage')}
                                />
                            ))}
                        </div>
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

                        <div>
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                Prix (USD)
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type="text"
                                    value={`$${priceUSD.toLocaleString()}`}
                                    disabled
                                    className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#13274C] px-4 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-400 cursor-not-allowed"
                                />
                            </div>
                            <p className="text-[10px] text-slate-500 mt-1">
                                Taux: 1 USD = {CONSTANTS.EXCHANGE_RATE} F CFA
                            </p>
                        </div>
                    </div>

                    {/* Illustration */}
                    <FormField label="Illustration" error={fieldErrors.illustration}>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 flex-wrap">
                                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950 transition text-sm font-medium">
                                    <Upload className="w-4 h-4" />
                                    Choisir une nouvelle image
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                                <span className="text-xs text-slate-500">
                                    {CONSTANTS.MAX_FILE_SIZE_MB}MB max • JPG, PNG, WebP
                                </span>
                            </div>

                            <AnimatePresence mode="wait">
                                {/* Nouvelle image sélectionnée */}
                                {imageState.file && imageState.previewUrl && (
                                    <div className="flex items-center gap-3">
                                        <ImagePreview src={imageState.previewUrl} alt="Aperçu" onRemove={handleRemoveNewImage} isNew />
                                        <div className="flex-1">
                                            <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" />
                                                Nouvelle image prête à être uploadée
                                            </span>
                                            <p className="text-[10px] text-slate-500">
                                                {(imageState.file.size / 1024).toFixed(1)} KB • {imageState.file.type.split('/')[1].toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Image existante */}
                                {!imageState.file && showExistingImage && (
                                    <div className="flex items-center gap-3">
                                        <ImagePreview src={formData.illustrationUrl!} alt="Image actuelle" onRemove={markImageForRemoval} />
                                        <div className="flex-1">
                                            <span className="text-xs text-slate-500">Image actuelle</span>
                                        </div>
                                    </div>
                                )}

                                {/* Image supprimée - message de confirmation */}
                                {!imageState.file && imageState.shouldRemove && (
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                                        <Trash2 className="w-5 h-5 text-amber-600" />
                                        <div className="flex-1">
                                            <span className="text-xs text-amber-700 dark:text-amber-400">
                                                L'image sera supprimée lors de l'enregistrement
                                            </span>
                                            <button
                                                type="button"
                                                onClick={cancelImageRemoval}
                                                className="ml-2 text-xs text-indigo-500 hover:text-indigo-600 underline"
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </AnimatePresence>

                            {/* Barre de progression upload */}
                            {saving && uploadProgress > 0 && uploadProgress < 100 && (
                                <div className="w-full">
                                    <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${uploadProgress}%` }}
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-1 text-center">
                                        Upload en cours... {uploadProgress}%
                                    </p>
                                </div>
                            )}
                        </div>
                    </FormField>

                    {/* Description */}
                    <FormField label="Description" required error={fieldErrors.description}>
                        <textarea
                            id="offrande-description"
                            name="description"
                            value={formData.description}
                            onChange={handleLocalChange}
                            placeholder="Décrivez l'offrande et sa signification spirituelle..."
                            rows={3}
                            maxLength={CONSTANTS.MAX_DESCRIPTION_LENGTH}
                            className="w-full resize-none rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#13274C] px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                        />
                        <div className="flex justify-between items-center mt-1">
                            <p className="text-[10px] text-slate-500">
                                Minimum {CONSTANTS.MIN_DESCRIPTION_LENGTH} caractères
                            </p>
                            <p className={`text-[10px] ${formData.description.length > CONSTANTS.MAX_DESCRIPTION_LENGTH ? 'text-red-500' : 'text-slate-400'}`}>
                                {formData.description.length}/{CONSTANTS.MAX_DESCRIPTION_LENGTH}
                            </p>
                        </div>
                    </FormField>

                    {/* Erreur générale */}
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

EditOffrandeForm.displayName = 'EditOffrandeForm';

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

EditOffrandeLoading.displayName = 'EditOffrandeLoading';

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
        priceUSD,
        imageState,
        setImageFile,
        markImageForRemoval,
        cancelImageRemoval,
        clearNewImage,
        handleChange,
        handleCategoryChange,
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
            priceUSD={priceUSD}
            saving={saving}
            error={error}
            onChange={handleChange}
            onCategory={handleCategoryChange}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            imageState={imageState}
            setImageFile={setImageFile}
            markImageForRemoval={markImageForRemoval}
            cancelImageRemoval={cancelImageRemoval}
            clearNewImage={clearNewImage}
        />
    );
}