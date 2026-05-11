'use client';
import { default as CacheLink } from '@/components/commons/CacheLink';
import { useRegisterForm } from '@/hooks/auth/register/useRegisterForm';
import { motion } from "framer-motion";
import { AlertCircle, Check, Eye, EyeOff, Loader2, Lock, Shield, User, X } from 'lucide-react';
import Image from "next/image";
import { memo, default as React } from 'react';

const PASSWORD_STRENGTH_CONFIG = {
  0: { color: 'bg-gray-200', text: '', textColor: '' },
  1: { color: 'bg-red-500', text: 'Faible', textColor: 'text-red-800' },
  2: { color: 'bg-orange-500', text: 'Moyen', textColor: 'text-orange-600' },
  3: { color: 'bg-yellow-500', text: 'Bon', textColor: 'text-yellow-600' },
  4: { color: 'bg-green-500', text: 'Excellent', textColor: 'text-green-600' },
} as const;

interface PasswordStrengthIndicatorProps {
  strength: number;
}

export const RegisterPasswordStrengthIndicator = memo<PasswordStrengthIndicatorProps>(({ strength }) => {
  const config = PASSWORD_STRENGTH_CONFIG[strength as keyof typeof PASSWORD_STRENGTH_CONFIG];

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">Force</span>
        <span className={`text-[10px] font-bold ${config.textColor}`}>
          {config.text}
        </span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1.5 flex-1 rounded-full transition-all ${level <= strength ? config.color : 'bg-gray-200 dark:bg-gray-700'}`}
          />
        ))}
      </div>
    </div>
  );
});

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  options: readonly { value: string; label: string }[] | string[];
}

export const RegisterSelectField = memo<SelectFieldProps>(({ label, name, value, onChange, error, options }) => (
  <div className="space-y-1.5">
    <label htmlFor={name} className="block text-xs font-semibold text-gray-700 dark:text-[#D1D5DB]">
      {label} <span className="text-red-500">*</span>
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className={`
        w-full py-2.5 px-4 text-sm border-2 rounded-xl 
        theme-dark-input bg-white dark:bg-[color:var(--theme-layer-3)]
        transition-all duration-200
        ${error
          ? 'border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-500'
          : 'border-gray-200 dark:border-[color:var(--theme-border)] focus:border-blue-500 dark:focus:border-[#4F83D1]'
        }
        focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-[#4F83D1]/25
      `}
    >
      {options.map((opt) =>
        typeof opt === 'string' ? (
          <option key={opt} value={opt}>
            {opt || 'Sélectionner'}
          </option>
        ) : (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        )
      )}
    </select>

    {error && (
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-600 dark:text-red-400 text-xs flex items-center gap-1"
      >
        <AlertCircle className="w-3 h-3" />
        {error}
      </motion.p>
    )}
  </div>
));

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  showSuccess?: boolean;
}

export const RegisterInputField = memo<InputFieldProps>(({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  icon,
  showPassword,
  onTogglePassword,
  showSuccess,
}) => (
  <div className="space-y-1.5">
    <label htmlFor={name} className="block text-xs font-semibold text-black dark:text-[#D1D5DB]">
      {label} <span className="text-red-500">*</span>
    </label>

    <div className="relative">
      {icon && (
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#9FB0D1]">
          {icon}
        </div>
      )}

      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`
          w-full ${icon ? 'pl-10' : 'pl-4'} ${onTogglePassword || showSuccess ? 'pr-10' : 'pr-4'} 
          py-2.5 text-sm text-black
          border-2 rounded-xl 
          theme-dark-input bg-white dark:bg-[color:var(--theme-layer-3)]
          transition-all duration-200
          placeholder:text-black dark:placeholder:text-[#9FB0D1]
          ${error
            ? 'border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-500'
            : 'border-gray-200 dark:border-[color:var(--theme-border)] focus:border-blue-500 dark:focus:border-[#4F83D1]'
          }
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-[#4F83D1]/25
        `}
        placeholder={placeholder}
      />

      {onTogglePassword && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 
                   text-gray-400 dark:text-[#9FB0D1] 
                   hover:text-gray-600 dark:hover:text-[#DDE7FA] 
                   transition-colors p-1"
          aria-label={showPassword ? 'Masquer' : 'Afficher'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      )}

      {showSuccess && !error && value && (
        <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
      )}
    </div>

    {error && (
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-600 dark:text-red-400 text-xs flex items-center gap-1"
      >
        <AlertCircle className="w-3 h-3" />
        {error}
      </motion.p>
    )}
  </div>
));

interface ErrorMessageProps {
  error: string;
  onClose: () => void;
}

export const RegisterErrorMessage = memo<ErrorMessageProps>(({ error, onClose }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-700/60 dark:bg-[#231631] 
               rounded-xl flex items-start gap-2"
  >
    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />

    <p className="flex-1 text-red-700 dark:text-red-300 text-xs leading-relaxed whitespace-pre-line">
      {error}
    </p>

    <button
      onClick={onClose}
      className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 
                 transition-colors p-0.5"
    >
      <X className="w-4 h-4" />
    </button>
  </motion.div>
));

const RegisterForm: React.FC = () => {
  const {
    showPassword, showConfirmPassword, isSubmitDisabled, isLoading, isPending,
    error, passwordStrength, formData, passwordsMatch, errors, mounted,
    handleChange, handleSubmit, setShowConfirmPassword, setShowPassword, setError,
  } = useRegisterForm();

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-white text-gray-900">
      <div className="w-full max-w-2xl">
        <div className="rounded-3xl border border-blue-200 bg-white p-6 shadow-[0_8px_32px_-18px_rgba(46,90,166,0.10)] backdrop-blur-xl sm:p-8">

          <div className="text-center mb-6">
            <CacheLink href="/" className="block mb-4 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex justify-center"
              >
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">

                  <Image
                    src="/logo.png"
                    alt="Mon Étoile"
                    fill
                    sizes="(max-width: 768px) 120px, 160px"
                    className="object-contain p-3"
                    priority
                  />

                </div>
              </motion.div>
            </CacheLink>
            <h1 className="mb-2 text-2xl font-bold text-blue-900 sm:text-3xl">
              Créer un compte
            </h1>

            <p className="mx-auto max-w-md text-xs text-gray-600 sm:text-sm">
              Créez votre compte en toute confidentialité. Vous pourrez demander une consultation
              pour vous ou un tiers.
            </p>
          </div>

          {error && <RegisterErrorMessage error={error} onClose={() => setError(null)} />}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <RegisterInputField
              label="Nom d'utilisateur"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              placeholder="Nom d'utilisateur unique"
              icon={<User className="w-4 h-4" />}
              showSuccess
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <RegisterInputField
                  label="Mot de passe"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder="••••••••"
                  icon={<Lock className="w-4 h-4" />}
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                />
                {formData.password && <RegisterPasswordStrengthIndicator strength={passwordStrength} />}
              </div>

              <RegisterInputField
                label="Confirmer"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                showPassword={showConfirmPassword}
                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                showSuccess={passwordsMatch}
              />
            </div>

            <button
              type="submit"
              disabled={mounted ? isSubmitDisabled : false}
              className={`
                w-full py-3 rounded-xl font-semibold text-sm
                shadow-md hover:shadow-lg
                flex items-center justify-center gap-2 transition-all duration-200
                ${mounted && isSubmitDisabled
                  ? 'bg-gray-200 text-gray-400 border border-blue-100 cursor-not-allowed'
                  : 'border border-blue-200 bg-gradient-to-r from-blue-100 to-blue-300 text-blue-900 hover:from-blue-200 hover:to-blue-400'
                }
              `}
            >
              {mounted && (isLoading || isPending) ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Inscription...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>S'inscrire maintenant</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-700">
                Déjà inscrit ?{' '}
                <CacheLink
                  href="/auth/login"
                  className="text-blue-700 font-semibold hover:underline transition-colors"
                >
                  Se connecter
                </CacheLink>
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-blue-400">
              <Shield className="w-3 h-3" />
              <span>Données sécurisées et cryptées.</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <CacheLink
            href="/terms"
            className="text-xs text-blue-700 hover:underline transition-colors"
          >
            Conditions générales d'utilisation
          </CacheLink>
        </div>

        <p className="mt-2 text-center text-xs mb-16 text-gray-400">
          © 2026 Mon Étoile. Tous droits réservés.
        </p>
      </div>
    </div>
  );
};

export default function RegisterPageClient() {
  return (<RegisterForm />);
}