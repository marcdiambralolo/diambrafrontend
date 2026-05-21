'use client';
import CacheLink from '@/components/commons/CacheLink';
import { useNewUserPage } from '@/hooks/admin/users/useNewUserPage';
import { ArrowLeft, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import React from 'react';
import { countries } from '@/components/admin/users/countries';
import { Loader2, Save } from 'lucide-react';

interface NewUserFormProps {
  formData: Partial<{
    name: string;
    phone: string;
    country: string;
    role: string;
  }>;
  errors: Partial<Record<'name' | 'phone' | 'country' | 'role', string>>;
  saving: boolean;
  isFormValid: boolean;
  handleChange: (field: 'name' | 'phone' | 'country' | 'role', value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const roles = [
  { value: 'USER', label: 'Utilisateur' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
];

export function NewUserForm({ formData, errors, saving, isFormValid, handleChange, handleSubmit }: NewUserFormProps) {
  return (
    <motion.form
      onSubmit={handleSubmit}
      className="theme-dark-panel mx-auto max-w-md space-y-4 rounded-xl bg-white p-6 shadow-lg dark:bg-[#0F1C3F]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="mb-2 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
        <User className="h-5 w-5 text-[#2E5AA6] dark:text-[#9BC2FF]" /> Nouvel utilisateur
      </h2>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-[#DDE7FA]">Nom</label>
        <input
          type="text"
          value={formData.name}
          onChange={e => handleChange('name', e.target.value)}
          className="theme-dark-input w-full rounded border px-3 py-2 focus:border-[#4F83D1] focus:outline-none focus:ring"
          required
        />
        {errors.name && <div className="text-xs text-red-600 mt-1">{errors.name}</div>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-[#DDE7FA]">Téléphone</label>
        <div className="flex gap-2">
          <input
            type="tel"
            value={formData.phone}
            onChange={e => handleChange('phone', e.target.value)}
            className="theme-dark-input w-full rounded border px-3 py-2 focus:border-[#4F83D1] focus:outline-none focus:ring"
          />
        </div>
        {errors.phone && <div className="text-xs text-red-600 mt-1">{errors.phone}</div>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-[#DDE7FA]">Pays</label>
        <select
          value={formData.country}
          onChange={e => handleChange('country', e.target.value)}
          className="theme-dark-input w-full rounded border px-3 py-2 focus:border-[#4F83D1] focus:outline-none focus:ring"
          required
        >
          <option value="">Sélectionner un pays</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.country && <div className="text-xs text-red-600 mt-1">{errors.country}</div>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-[#DDE7FA]">Rôle</label>
        <select
          value={formData.role}
          onChange={e => handleChange('role', e.target.value)}
          className="theme-dark-input w-full rounded border px-3 py-2 focus:border-[#4F83D1] focus:outline-none focus:ring"
          required
        >
          {roles.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        {errors.role && <div className="text-xs text-red-600 mt-1">{errors.role}</div>}
      </div>
      <button
        type="submit"
        className="theme-dark-primary-button flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] py-2 font-semibold text-white shadow transition-all hover:from-[#254A8B] hover:to-[#3F73BE] disabled:opacity-60"
        disabled={saving || !isFormValid}
      >
        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} {saving ? 'Création...' : 'Créer'}
      </button>
    </motion.form>
  );
}

export function NewUserToast({ toast, onClose }: {
  toast: { type: 'success' | 'error'; message: string } | null;
  onClose: () => void;
}) {

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-xl shadow-2xl border
            ${toast.type === 'success'
              ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
              : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
            }`}
        >
          <div className="flex items-start gap-3">
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${toast.type === 'success' ? 'text-green-900' : 'text-red-900'
                }`}>
                {toast.type === 'success' ? 'Succès' : 'Erreur'}
              </p>
              <p className={`text-xs mt-0.5 ${toast.type === 'success' ? 'text-green-700' : 'text-red-700'
                }`}>
                {toast.message}
              </p>
            </div>

            <button
              onClick={onClose}
              className={`p-1 rounded-lg transition-colors ${toast.type === 'success'
                  ? 'hover:bg-green-100 text-green-600'
                  : 'hover:bg-red-100 text-red-600'
                }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function NewUserHeader() {

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 sm:mb-6"
    >
      <CacheLink
        href={`/admin/users?r=${Date.now()}`}
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 mb-3 sm:mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </CacheLink>

      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] p-2 shadow-lg sm:p-2.5">
          <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
            Nouvel utilisateur
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Créez un compte utilisateur
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function NewUserPageClient() {
  const {
    formData, saving, toast, isFormValid, errors, setToast, handleChange, handleSubmit,
  } = useNewUserPage();

  return (
    <div className="mx-auto w-full max-w-4xl bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-3 dark:from-[#070B1A] dark:via-[#0F1C3F] dark:to-[#162A56] sm:p-4 md:p-6">
      <NewUserHeader />

      <NewUserToast toast={toast} onClose={() => setToast(null)} />

      <NewUserForm
        formData={formData}
        errors={errors}
        saving={saving}
        isFormValid={!!isFormValid}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}