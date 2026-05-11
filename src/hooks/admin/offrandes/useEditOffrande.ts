import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useQuery } from '@tanstack/react-query';
import { api } from "@/lib/api/client";
import { useParams, useRouter } from "next/navigation";
import { Offering } from "@/lib/interfaces";
import { getErrorMessage } from '@/lib/utils/errorHelpers';

// ==================== CONSTANTES ====================
const CONSTANTS = {
  EXCHANGE_RATE: 563.5,
  DEBOUNCE_DELAY_MS: 500,
  MAX_RETRY_ATTEMPTS: 3,
  CACHE_TIME_MS: 5 * 60 * 1000, // 5 minutes
  MAX_FILE_SIZE_MB: 5,
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
} as const;

// ==================== TYPES ====================
interface ImageState {
  file: File | null;
  previewUrl: string | null;
  shouldRemove: boolean;
}

import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

interface UseEditOffrandeReturn {
  formData: Offering | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  priceUSD: number;
  isDirty: boolean;
  validationErrors: Record<string, string>;
  imageState: ImageState;
  setImageFile: (file: File | null) => void;
  markImageForRemoval: () => void;
  cancelImageRemoval: () => void;
  clearNewImage: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCategoryChange: (value: 'animal' | 'vegetal' | 'beverage') => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleCancel: () => void;
  fetchData: (options?: RefetchOptions) => Promise<QueryObserverResult<Offering, Error>>;
  resetForm: () => void;
  validateField: (name: string, value: any) => string;
}

// ==================== HOOK PRINCIPAL ====================
export function useEditOffrande(): UseEditOffrandeReturn {
  const router = useRouter();
  const params = useParams();
  const id = useMemo(() => {
    if (!params?.id) return null;
    return Array.isArray(params.id) ? params.id[0] : params.id;
  }, [params?.id]);

  // États
  const [formData, setFormData] = useState<Offering | null>(null);
  const [originalData, setOriginalData] = useState<Offering | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // État de l'image
  const [imageState, setImageState] = useState<ImageState>({
    file: null,
    previewUrl: null,
    shouldRemove: false,
  });

  // Refs
  const submitLockRef = useRef(false);

  // ==================== GESTION DES IMAGES ====================
  const setImageFile = useCallback((file: File | null) => {
    if (file) {
      // Nettoyer l'ancienne preview URL
      if (imageState.previewUrl && imageState.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageState.previewUrl);
      }

      const previewUrl = URL.createObjectURL(file);
      setImageState({
        file,
        previewUrl,
        shouldRemove: false,
      });
    } else {
      if (imageState.previewUrl && imageState.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageState.previewUrl);
      }
      setImageState({
        file: null,
        previewUrl: null,
        shouldRemove: false,
      });
    }
  }, [imageState.previewUrl]);

  const markImageForRemoval = useCallback(() => {
    // Nettoyer la nouvelle image si elle existe
    if (imageState.file) {
      if (imageState.previewUrl && imageState.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageState.previewUrl);
      }
      setImageState({
        file: null,
        previewUrl: null,
        shouldRemove: true,
      });
    } else {
      setImageState(prev => ({ ...prev, shouldRemove: true }));
    }

    // Mettre à jour formData pour refléter la suppression
    setFormData(prev => prev && ({ ...prev, illustrationUrl: undefined }));
  }, [imageState.file, imageState.previewUrl]);

  const cancelImageRemoval = useCallback(() => {
    setImageState(prev => ({ ...prev, shouldRemove: false }));
    // Restaurer l'URL d'image originale
    if (originalData?.illustrationUrl) {
      setFormData(prev => prev && ({ ...prev, illustrationUrl: originalData.illustrationUrl }));
    }
  }, [originalData?.illustrationUrl]);

  const clearNewImage = useCallback(() => {
    if (imageState.previewUrl && imageState.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageState.previewUrl);
    }
    setImageState({
      file: null,
      previewUrl: null,
      shouldRemove: false,
    });
  }, [imageState.previewUrl]);

  // ==================== VALIDATION ====================
  const validateField = useCallback((name: string, value: any): string => {
    switch (name) {
      case 'name':
        if (!value || typeof value !== 'string') return 'Le nom est requis';
        if (value.trim().length < 2) return 'Le nom doit contenir au moins 2 caractères';
        if (value.trim().length > 64) return 'Le nom ne peut pas dépasser 64 caractères';
        if (!/^[a-zA-ZÀ-ÿ0-9\s\-']+$/.test(value.trim())) {
          return 'Le nom contient des caractères invalides';
        }
        return '';

      case 'description':
        if (!value || typeof value !== 'string') return 'La description est requise';
        if (value.trim().length < 4) return 'La description doit contenir au moins 4 caractères';
        if (value.trim().length > 500) return 'La description ne peut pas dépasser 500 caractères';
        return '';

      case 'price':
        const numPrice = Number(value);
        if (isNaN(numPrice)) return 'Le prix doit être un nombre';
        if (numPrice <= 0) return 'Le prix doit être supérieur à 0';
        if (numPrice > 10000000) return 'Le prix ne peut pas dépasser 10 000 000 F';
        return '';

      case 'category':
        if (!value) return 'La catégorie est requise';
        if (!['animal', 'vegetal', 'beverage'].includes(value)) {
          return 'Catégorie invalide';
        }
        return '';

      case 'illustrationUrl':
        if (value && typeof value === 'string') {
          const urlPattern = /^(https?:\/\/|blob:|data:).+\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i;
          if (!urlPattern.test(value) && !value.startsWith('blob:') && !value.startsWith('data:')) {
            return 'URL d\'image invalide (jpg, png, webp, gif)';
          }
        }
        return '';

      default:
        return '';
    }
  }, []);

  

  // Vérification si le formulaire a été modifié
  const isDirty = useMemo(() => {
    if (!formData || !originalData) return false;

    // Comparer les données de base
    const basicDataChanged = JSON.stringify({
      name: formData.name,
      description: formData.description,
      price: formData.price,
      category: formData.category,
    }) !== JSON.stringify({
      name: originalData.name,
      description: originalData.description,
      price: originalData.price,
      category: originalData.category,
    });

    // Vérifier les changements d'image
    const imageChanged = imageState.file !== null || imageState.shouldRemove;

    return basicDataChanged || imageChanged;
  }, [formData, originalData, imageState.file, imageState.shouldRemove]);

  // ==================== PRIX USD ====================
  const priceUSD = useMemo(() => {
    if (!formData?.price || formData.price <= 0) return 0;
    return Number(((formData.price) / CONSTANTS.EXCHANGE_RATE).toFixed(2));
  }, [formData?.price]);

  // ==================== GESTION DES CHANGEMENTS ====================
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!formData) return;

    const { name, value, type } = e.target;
    const newValue = type === 'number' ? (value === '' ? 0 : Number(value)) : value;

    // Validation en temps réel
    const error = validateField(name, newValue);
    setValidationErrors(prev => ({ ...prev, [name]: error }));

    setFormData(prev => prev && ({
      ...prev,
      [name]: newValue,
    }));
  }, [formData, validateField]);

  const handleCategoryChange = useCallback((value: 'animal' | 'vegetal' | 'beverage') => {
    if (!formData) return;
    const error = validateField('category', value);
    setValidationErrors(prev => ({ ...prev, category: error }));
    setFormData(prev => prev && { ...prev, category: value });
  }, [formData, validateField]);

  // ==================== RÉINITIALISATION ====================
  const resetForm = useCallback(() => {
    if (originalData) {
      setFormData({ ...originalData });
      setValidationErrors({});
      setError(null);
      // Réinitialiser l'état de l'image
      clearNewImage();
      setImageState({ file: null, previewUrl: null, shouldRemove: false });
    }
  }, [originalData, clearNewImage]);

  // ==================== CHARGEMENT DES DONNÉES (TanStack Query) ====================
  const {
    data: queryData,
    isLoading,
    isError,
    error: queryError,
    refetch,
  } = useQuery<Offering, Error>({
    queryKey: ['offrande', id],
    queryFn: async () => {
      if (!id) throw new Error("ID de l'offrande manquant");
      const response = await api.get<Offering>(`/offerings/${id}`);
      return response.data;
    },
    enabled: !!id,
    retry: 3,
    staleTime: CONSTANTS.CACHE_TIME_MS,
  });

  useEffect(() => {
    if (queryData) {
      setFormData(queryData);
      setOriginalData(queryData);
    }
  }, [queryData]);

  // Remplacer fetchData par refetch dans le retour du hook

  // ==================== CONSTRUCTION DU FORM DATA ====================
  const buildSubmitFormData = useCallback((): FormData => {
    if (!formData) throw new Error('Aucune donnée de formulaire');

    const fd = new FormData();

    // Ajouter les champs texte
    fd.append('name', formData.name.trim());
    fd.append('price', String(formData.price));
    fd.append('priceUSD', String(priceUSD));
    fd.append('category', formData.category);
    fd.append('description', formData.description.trim());

    // Gestion de l'image (priorité au nouveau fichier)
    if (imageState.file) {
      // Nouvelle image sélectionnée - upload
      fd.append('illustration', imageState.file);
    } else if (imageState.shouldRemove) {
      // Suppression de l'image existante
      fd.append('removeIllustration', 'true');
    }
    // Si aucune des deux conditions, on garde l'image existante (rien à envoyer)

    return fd;
  }, [formData, priceUSD, imageState.file, imageState.shouldRemove]);

  // ==================== SOUMISSION ====================
  const handleSubmit = useCallback(async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!formData || !id) return;
    if (submitLockRef.current || saving) return;


   



    submitLockRef.current = true;
    setSaving(true);
    setError(null);

    try {
      const submitFormData = buildSubmitFormData();

      await api.put(`/offerings/${id}`, submitFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      // Invalider le cache

      // Nettoyer les preview URLs
      if (imageState.previewUrl && imageState.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageState.previewUrl);
      }

      // Navigation
      router.replace('/admin/offrandes');
      router.refresh();
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erreur lors de la sauvegarde");
      setError(errorMessage);

      // Gestion spécifique des erreurs
      if ((err as any)?.response?.status === 409) {
        setError("Un conflit de données est survenu. Veuillez recharger la page.");
      } else if ((err as any)?.response?.status === 413) {
        setError("Le fichier est trop volumineux. Maximum 5 MB.");
      }
    } finally {
      setSaving(false);
      submitLockRef.current = false;
    }
  }, [formData, id, saving, buildSubmitFormData, imageState.previewUrl, router]);

  // ==================== ANNULATION ====================
  const handleCancel = useCallback(() => {
    if (isDirty) {
      const confirmMessage = "Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter ?";
      if (window.confirm(confirmMessage)) {
        // Nettoyer les preview URLs
        if (imageState.previewUrl && imageState.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(imageState.previewUrl);
        }
        router.replace('/admin/offrandes');
      }
    } else {
      router.replace('/admin/offrandes');
    }
  }, [isDirty, imageState.previewUrl, router]);

  // ==================== NETTOYAGE ====================
  useEffect(() => {
    return () => {
      // Nettoyer les preview URLs au démontage
      if (imageState.previewUrl && imageState.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageState.previewUrl);
      }
    };
  }, [imageState.previewUrl]);

  // (plus besoin d'effet initial, useQuery gère le chargement)

  // ==================== PROTECTION CONTRE LA FERMETURE ====================
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter ?";
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // ==================== RETOUR ====================
  return {
    formData,
    loading: isLoading,
    saving,
    error: error || (isError ? (queryError?.message || 'Erreur de chargement') : null),
    priceUSD,
    isDirty,
    validationErrors,
    imageState,
    setImageFile,
    markImageForRemoval,
    cancelImageRemoval,
    clearNewImage,
    handleChange,
    handleCategoryChange,
    handleSubmit,
    handleCancel,
    fetchData: refetch,
    resetForm,
    validateField,
  };
}