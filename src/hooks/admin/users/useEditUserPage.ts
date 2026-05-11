import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api/client';
import { User } from '@/lib/interfaces';
import { Role } from '@/lib/interfaces';

export function useEditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    username: '',
    phone: '',
    country: 'Côte d\'Ivoire',
    gender: "male",
    role: Role.USER,
    isActive: true,
    credits: 0,
    preferences: {
      notifications: true,
      newsletter: false,
    },
  });

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    api.get<User>(`/admin/users/${userId}`)
      .then(({ data }) => {
        // On ne garde que les champs utiles pour l'édition
        const {
          username = '',
          phone = '',
          country = 'Côte d\'Ivoire',
          gender = 'male',
          role = Role.USER,
          isActive = true,
          credits = 0,
          preferences = { notifications: true, newsletter: false },
        } = data || {};
        setFormData({ username, phone, country, gender, role, isActive, credits, preferences });
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || 'Erreur lors du chargement';
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        username: formData.username,
        phone: formData.phone,
        country: formData.country,
        gender: formData.gender,
        role: formData.role,
        isActive: formData.isActive,
        credits: formData.credits,
        preferences: formData.preferences,
      };
      await api.patch(`/admin/users/${userId}`, payload);
      setSuccess(true);
      setTimeout(() => {
        router.replace('/admin/users');
        router.refresh();
      }, 1500);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Erreur lors de la modification');
    } finally {
      setSaving(false);
    }
  };

  return {
    formData, loading, saving, error, success, setError, setFormData, handleSubmit
  };
}