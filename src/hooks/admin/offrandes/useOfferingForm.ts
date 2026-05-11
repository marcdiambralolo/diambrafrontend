import { useState, useMemo } from "react";
import { api } from "@/lib/api/client";
import { OfferingFormData } from "@/components/admin/offrandes/new/OfferingForm";
import { useRouter } from "next/navigation";
import { getErrorMessage } from '@/lib/utils/errorHelpers';

export function useOfferingForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<OfferingFormData>({
    name: '',
    price: 0,
    priceUSD: 0,
    category: '',
    description: '',
    illustrationUrl: '',
  });

  const [illustrationFile, setIllustrationFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const priceUSD = useMemo(() => {
    if (!formData?.price) return 0;
    return Number(((formData.price || 0) / 563.90).toFixed(2));
  }, [formData?.price]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setIllustrationFile(file);
    setFormData(prev => ({ ...prev, illustrationUrl: '' }));
  }

  function handleCategoryChange(value: 'animal' | 'vegetal' | 'beverage') {
    setFormData(prev => ({ ...prev, category: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim() || !formData.price) {
      setError('Tous les champs sont obligatoires');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('name', formData.name.trim());
      form.append('price', String(formData.price));
      form.append('priceUSD', String(priceUSD));
      form.append('category', formData.category);
      form.append('description', formData.description.trim());
      // Si un fichier est sélectionné, on l'envoie
      if (illustrationFile) {
        form.append('illustration', illustrationFile);
      } else if (formData.illustrationUrl?.trim()) {
        form.append('illustrationUrl', formData.illustrationUrl.trim());
      }

      const res = await api.post('/offerings', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      if (!res || (res.status && res.status >= 400)) throw new Error('Erreur lors de la sauvegarde');

      router.replace('/admin/offrandes');
      router.refresh();
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Erreur lors de la sauvegarde'));
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    router.replace('/admin/offrandes');
  }

  return {
    formData, saving, error, priceUSD, illustrationFile,
    handleChange, handleCategoryChange, handleSubmit, handleCancel,
    handleFileChange, setIllustrationFile,
  };
}