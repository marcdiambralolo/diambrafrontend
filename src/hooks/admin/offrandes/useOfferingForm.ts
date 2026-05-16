import { OfferingFormData } from "@/components/admin/offrandes/new/OfferingForm";
import { api } from "@/lib/api/client";
import { getErrorMessage } from '@/lib/utils/errorHelpers';
import { useRouter } from "next/navigation";
import { useState, useCallback, useMemo } from "react";

export function useOfferingForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<OfferingFormData>({
    name: '',
    price: 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Optimisé avec useCallback
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  }, []);

  const handleCategoryChange = useCallback((value: 'banque') => {
    setFormData(prev => ({ ...prev, category: value }));
  }, []);

  // ✅ Version corrigée - envoi en JSON au lieu de FormData
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      setError('Le nom est obligatoire');
      return;
    }

    if (!formData.price || formData.price <= 0) {
      setError('Le prix doit être supérieur à 0');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // ✅ CORRECTION : Envoyer en JSON, pas en FormData
      const payload = {
        name: formData.name.trim(),
        price: Number(formData.price)
      };

      console.log('📤 Envoi des données:', payload);

      const res = await api.post('/offerings', payload, {
        headers: {
          'Content-Type': 'application/json'  // ✅ JSON au lieu de multipart
        },
        withCredentials: true,
      });



      router.replace('/admin/offrandes');
      router.refresh();
    } catch (err: unknown) {
      console.error('❌ Erreur:', err);
      setError(getErrorMessage(err, 'Erreur lors de la sauvegarde'));
    } finally {
      setSaving(false);
    }
  }, [formData.name, formData.price, router]);

  const handleCancel = useCallback(() => {
    router.replace('/admin/offrandes');
  }, [router]);

  // ✅ Validation en temps réel memoized
  const isFormValid = useMemo(() => {
    return formData.name?.trim().length > 0 && (formData.price || 0) > 0;
  }, [formData.name, formData.price]);

  return {
    formData,
    saving,
    error,
    isFormValid,  // ✅ Ajouté pour désactiver le bouton si invalide
    handleChange,
    handleCategoryChange,
    handleSubmit,
    handleCancel,
  };
}