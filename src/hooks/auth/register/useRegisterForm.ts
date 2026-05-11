import { useAuth } from '@/lib/hooks';
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';

export interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
  gender: string;
  country: string;
  phone: string;
}

export interface FormErrors {
  [key: string]: string;
}

const PASSWORD_MIN_LENGTH = 6;

function getRegisterErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    const err = error as {
      response?: {
        status?: number;
        data?: {
          message?: string;
          errors?: Record<string, string>;
        };
      };
    };

    const status = err.response?.status;
    let errorMessage = err.response?.data?.message || "Erreur lors de l'inscription";

    if (status === 409) {
      errorMessage =
        "Un compte existe déjà avec cet email ou ce nom d'utilisateur. " +
        "Si tu as déjà un compte, connecte-toi ou utilise la fonction mot de passe oublié.";
    }

    const detailsSource = err.response?.data?.errors;
    if (detailsSource) {
      const details = Object.entries(detailsSource)
        .map(([field, msg]) => `• ${field} : ${msg}`)
        .join('\n');
      errorMessage += '\n' + details;
    }

    return errorMessage;
  }

  return "Erreur lors de l'inscription";
}

const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= PASSWORD_MIN_LENGTH) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  return strength;
};

const validateForm = (formData: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.username.trim()) {
    errors.username = "Nom d'utilisateur requis";
  } else if (formData.username.length < 2) {
    errors.username = 'Au moins 2 caractères requis';
  } else if (/\s/.test(formData.username)) {
    errors.username = "Le nom d'utilisateur ne peut pas contenir d'espaces";
  }

  if (!formData.gender) {
    errors.gender = 'Genre requis';
  }
  if (!formData.country) {
    errors.country = 'Pays requis';
  }
  if (!formData.phone) {
    errors.phone = 'Téléphone requis';
  }

  if (!formData.password) {
    errors.password = 'Mot de passe requis';
  } else if (formData.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `Au moins ${PASSWORD_MIN_LENGTH} caractères`;
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Confirmation requise';
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas';
  }

  return errors;
};

export function useRegisterForm() {
  const { register, isLoading } = useAuth();
  const [isPending] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    confirmPassword: '',
    gender: 'male',
    country: "Cote d'Ivoire",
    phone: '+2250758385387',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      if (name === 'username' && /\s/.test(value)) {
        return;
      }

      if (name === 'password') {
        setPasswordStrength(calculatePasswordStrength(value));
      }

      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => {
        if (!prev[name]) return prev;
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
      setError(null);
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      const validationErrors = validateForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      try {
        const toSend = {
          username: formData.username,
          password: formData.password,
          gender: formData.gender,
          country: formData.country,
          phone: formData.phone,
        };
        await register(toSend);
      } catch (err: unknown) {
        setError(getRegisterErrorMessage(err));
      }
    },
    [formData, register]
  );

  const passwordsMatch = useMemo(
    () => formData.password === formData.confirmPassword && formData.confirmPassword !== '',
    [formData.password, formData.confirmPassword]
  );

  const isSubmitDisabled = useMemo(() => {
    return isLoading || isPending;
  }, [isLoading, isPending]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []); 

  return {
    showPassword, showConfirmPassword, isSubmitDisabled, isLoading, isPending,
    error, passwordStrength, formData, passwordsMatch, errors, mounted,
    handleChange, handleSubmit, setShowConfirmPassword, setShowPassword, setError,
  };
}