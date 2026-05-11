
import { useCallback, useMemo, useState } from 'react';
import { api } from '@/lib/api/client';
import { User } from '@/lib/interfaces';
import { Role } from '@/lib/interfaces';
import { useRouter } from 'next/navigation';
import { getErrorMessage } from '@/lib/utils/errorHelpers';

const validatePhone = (phone: string): boolean => {
  return /^\+?[\d\s-()]+$/.test(phone);
};

type FormErrors = Partial<Record<string, string>>;

export function useNewUserPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<Partial<User>>({
    username: '',
    phone: '',
    country: '',
    gender: undefined,
    role: Role.USER,
    isActive: true,
    credits: 0,
    password: '12345678',
    preferences: {
      notifications: true,
      newsletter: false,
    },
  });

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.username || formData.username.length < 3) {
      newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
    }
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = useCallback((field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setToast({ type: 'error', message: 'Veuillez corriger les erreurs' });
      return;
    }
    setSaving(true);
    try {
      await api.post('/admin/users', formData);
      setToast({ type: 'success', message: 'Utilisateur créé avec succès' });
      setTimeout(() => {
        router.replace('/admin/users');
        router.refresh();
      }, 1500);
    } catch (err) {
      setToast({
        type: 'error',
        message: getErrorMessage(err, 'Erreur lors de la création')
      });
    } finally {
      setSaving(false);
    }
  }, [formData, validateForm, router]);

  const isFormValid = useMemo(() => {
    return formData.username && (!formData.phone || validatePhone(formData.phone));
  }, [formData]);

  return {
    formData, saving, toast, isFormValid, errors, setToast, handleChange, handleSubmit,
  };
}