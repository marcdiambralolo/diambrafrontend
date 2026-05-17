import { api } from "@/lib/api/client";
import { Offering } from "@/lib/interfaces";
import { getErrorMessage } from '@/lib/utils/errorHelpers';
import { QueryObserverResult, RefetchOptions, useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const CONSTANTS = {
  EXCHANGE_RATE: 563.5,
  DEBOUNCE_DELAY_MS: 500,
  MAX_RETRY_ATTEMPTS: 3,
  CACHE_TIME_MS: 5 * 60 * 1000, // 5 minutes
} as const;

interface UseEditOffrandeReturn {
  formData: Offering | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  isDirty: boolean;
  validationErrors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCategoryChange: (value: 'banque') => void;
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


  // Refs
  const submitLockRef = useRef(false);

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

      case 'price':
        const numPrice = Number(value);
        if (isNaN(numPrice)) return 'Le prix doit être un nombre';
        if (numPrice <= 0) return 'Le prix doit être supérieur à 0';
        if (numPrice > 10000000) return 'Le prix ne peut pas dépasser 10 000 000 F';
        return '';
      default:
        return '';
    }
  }, []);



  // Vérification si le formulaire a été modifié
  const isDirty = useMemo(() => {
    if (!formData || !originalData) return false;

    const basicDataChanged = JSON.stringify({
      name: formData.name,
      price: formData.price,
    }) !== JSON.stringify({
      name: originalData.name,
      price: originalData.price,
    });

    return basicDataChanged;
  }, [formData, originalData,]);

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

  const handleCategoryChange = useCallback((value: 'banque') => {
    if (!formData) return;
    const error = validateField('category', value);
    setValidationErrors(prev => ({ ...prev, category: error }));
  }, [formData, validateField]);

  const resetForm = useCallback(() => {
    if (originalData) {
      setFormData({ ...originalData });
      setValidationErrors({});
      setError(null);
      // Réinitialiser l'état de l'image
    }
  }, [originalData, setFormData, setValidationErrors, setError]);

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


  const buildSubmitFormData = useCallback((): FormData => {
    if (!formData) throw new Error('Aucune donnée de formulaire');

    const fd = new FormData();

    fd.append('name', formData.name.trim());
    fd.append('price', String(formData.price));

    return fd;
  }, [formData]);

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
        headers: {
          'Content-Type': 'application/json'  // ✅ JSON au lieu de multipart
        },
        withCredentials: true,
      });

       

      router.replace('/admin/offrandes');
      router.refresh();
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erreur lors de la sauvegarde");
      setError(errorMessage);

      if ((err as any)?.response?.status === 409) {
        setError("Un conflit de données est survenu. Veuillez recharger la page.");
      } else if ((err as any)?.response?.status === 413) {
        setError("Le fichier est trop volumineux. Maximum 5 MB.");
      }
    } finally {
      setSaving(false);
      submitLockRef.current = false;
    }
  }, [formData, id, saving, buildSubmitFormData, router]);

  // ==================== ANNULATION ====================
  const handleCancel = useCallback(() => {
    if (isDirty) {
      const confirmMessage = "Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter ?";
      if (window.confirm(confirmMessage)) {
        router.replace('/admin/offrandes');
      }
    } else {
      router.replace('/admin/offrandes');
    }
  }, [isDirty, router]);


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

  return {
    formData,
    loading: isLoading,
    saving,
    error: error || (isError ? (queryError?.message || 'Erreur de chargement') : null),
    isDirty,
    validationErrors,
    handleChange,
    handleCategoryChange,
    handleSubmit,
    handleCancel,
    fetchData: refetch,
    resetForm,
    validateField,
  };
}