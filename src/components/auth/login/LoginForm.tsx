'use client';
import CacheLink from '@/components/commons/CacheLink';
import { useLoginForm } from '@/hooks/auth/login/useLoginForm';
import { motion } from 'framer-motion';
import { AlertCircle, Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import Image from "next/image";
import React, { memo } from "react";

interface InputFieldProps {
  label: string;
  name: string;
  type: string;
  value: string;
  error?: string;
  placeholder: string;
  icon: React.ElementType;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LoginInputField = memo<InputFieldProps>(({
  label,
  name,
  type,
  value,
  error,
  placeholder,
  icon: Icon,
  showPasswordToggle,
  showPassword,
  onTogglePassword,
  onChange
}) => {

  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-xs font-semibold text-white dark:text-[#D1D5DB]">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-[#9FB0D1]" />

        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full pl-10 ${showPasswordToggle ? 'pr-10' : 'pr-4'} py-2.5 
            text-sm
            border-2 rounded-xl 
            theme-dark-input bg-white dark:bg-[color:var(--theme-layer-3)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]
            transition-all duration-200
            placeholder:text-gray-400 dark:placeholder:text-[#9FB0D1]
            ${error
              ? 'border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-500'
              : 'border-gray-200 dark:border-[color:var(--theme-border)] focus:border-blue-500 dark:focus:border-[#4F83D1]'
            }
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-[#4F83D1]/25
          `}
          autoComplete={name === 'username' ? 'username' : 'current-password'}
        />

        {showPasswordToggle && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 
                     text-gray-400 dark:text-[#9FB0D1] 
                     hover:text-gray-600 dark:hover:text-[#DDE7FA]
                     transition-colors p-1"
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-600 dark:text-red-400 text-xs mt-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

export const LoginErrorAlert = memo(({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-700/60 dark:bg-[#231631] 
               rounded-xl flex items-start gap-2"
  >
    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
    <p className="text-red-700 dark:text-red-300 text-xs leading-relaxed">{message}</p>
  </motion.div>
));

const LoginForm = () => {
  const { handleSubmit, error, isSubmitDisabled, isLoading, isPending, isHydrated, usernameProps, passwordProps, } = useLoginForm();

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-white text-gray-900">
      <div className="w-full max-w-2xl">
        <div className="rounded-3xl border border-blue-200 bg-white p-6 shadow-[0_8px_32px_-18px_rgba(46,90,166,0.10)] backdrop-blur-xl sm:p-8">
          <CacheLink href="/" className="block mb-6 group">
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

          <div className="text-center mb-6">
            <h1 className="mb-2 text-2xl font-bold text-blue-900 sm:text-3xl">
              Connexion
            </h1>

            <p className="mx-auto max-w-md text-xs text-gray-600 sm:text-sm">
              Accédez à votre espace personnel
            </p>
          </div>

          {error && <LoginErrorAlert message={error} />}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <LoginInputField {...usernameProps} />
            <LoginInputField {...passwordProps} />
            <motion.button
              type="submit"
              disabled={isSubmitDisabled}
              className={`
                w-full py-3 rounded-xl font-semibold text-sm
                shadow-md hover:shadow-lg
                flex items-center justify-center gap-2
                transition-all duration-200
                ${isSubmitDisabled
                  ? 'bg-gray-200 text-gray-400 border border-blue-100 cursor-not-allowed'
                  : 'border border-blue-200 bg-gradient-to-r from-blue-100 to-blue-300 text-blue-900 hover:from-blue-200 hover:to-blue-400'
                }
              `}
              whileHover={{ scale: isSubmitDisabled ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitDisabled ? 1 : 0.98 }}
            >
              {isHydrated && (isLoading || isPending) ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connexion...</span>
                </>
              ) : (
                'Se connecter'
              )}
            </motion.button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-700">
                Pas encore de compte ?{' '}
                <CacheLink
                  href="/auth/register"
                  className="text-blue-700 font-semibold hover:underline transition-colors"
                >
                  Inscription
                </CacheLink>
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-blue-400">
              <Lock className="w-3 h-3" />
              <span>Connexion sécurisée et cryptée.</span>
            </div>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-gray-400 mb-16">
          © 2026 Mon Étoile. Tous droits réservés.
        </p>
      </div>
    </div>
  );
};

export default LoginForm;