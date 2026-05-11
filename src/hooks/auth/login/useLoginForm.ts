import { useAuth } from '@/lib/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { getErrorMessage } from '@/lib/utils/errorHelpers';
import { User, Lock } from 'lucide-react';

export interface FormData {
  username: string;
  password: string;
}

export interface FormErrors {
  username?: string;
  password?: string;
}

const MIN_PASSWORD_LENGTH = 6;

const validateForm = (data: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (!data.username.trim()) {
    errors.username = 'Nom d\'utilisateur requis';
  }

  if (!data.password) {
    errors.password = 'Mot de passe requis';
  } else if (data.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Au moins ${MIN_PASSWORD_LENGTH} caractères`;
  }

  return errors;
};

export function useLoginForm() {
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [isHydrated, setIsHydrated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
  });

  const returnTo = useMemo(() => {
    const param = searchParams?.get('returnTo');
    return param || '/star/profil';
  }, [searchParams]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => {
      if (!prev[name as keyof FormErrors]) return prev;
      const newErrors = { ...prev };
      delete newErrors[name as keyof FormErrors];
      return newErrors;
    });

    setError(null);
  }, []);

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      await login(formData);
      await new Promise(resolve => setTimeout(resolve, 10));

      startTransition(() => {
        router.replace(returnTo);
        router.refresh();
      });
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Nom d\'utilisateur ou mot de passe incorrect'));
    }
  }, [formData, login, returnTo, router]);

  const isSubmitDisabled = useMemo(() => {
    return isLoading || isPending || !formData.username.trim() || !formData.password;
  }, [isLoading, isPending, formData.username, formData.password]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const usernameProps = useMemo(() => ({
    label: "Nom Utilisateur",
    name: "username",
    type: "text",
    value: formData.username,
    error: errors.username,
    placeholder: "Votre nom d'utilisateur",
    icon: User as React.ElementType,
    onChange: handleChange,
  }), [formData.username, errors.username, handleChange]);

  const passwordProps = useMemo(() => ({
    label: "Mot de passe",
    name: "password",
    type: showPassword ? 'text' : 'password',
    value: formData.password,
    error: errors.password,
    placeholder: "••••••••",
    icon: Lock as React.ElementType,
    showPasswordToggle: true,
    showPassword,
    onTogglePassword: togglePassword,
    onChange: handleChange,
  }), [formData.password, errors.password, showPassword, togglePassword, handleChange]);

  return {
   handleSubmit, error, isSubmitDisabled, isLoading, isPending, isHydrated, usernameProps, passwordProps,
  };
}