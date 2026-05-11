'use client';
import { countries } from '@/components/admin/users/countries';
import CacheLink from '@/components/commons/CacheLink';
import { useEditUserPage } from '@/hooks/admin/users/useEditUserPage';
import { Role, User } from '@/lib/interfaces';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, CheckCircle, Globe, Loader2, Phone, Save, Shield, Star, User as UserIcon, X } from 'lucide-react';
import React from 'react';

interface EditUserFormProps {
  formData: Partial<User>;
  setFormData: (data: Partial<User>) => void;
  saving: boolean;
  success: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function EditUserForm({ formData, setFormData, saving, success, onSubmit }: EditUserFormProps) {

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={onSubmit}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-[color:var(--theme-border)] dark:bg-[#0F1C3F]"
    >
      <div>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
          <UserIcon className="h-5 w-5 text-[#2E5AA6] dark:text-[#9BC2FF]" />
          Informations de base
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#DDE7FA]">
              Nom d'utilisateur *
            </label>
            <input
              type="text"
              value={formData.username || ''}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-[#4F83D1]"
              placeholder="Entrez le nom d'utilisateur"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#DDE7FA]">
              Téléphone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-[#7FA7E0]" />
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 transition-all focus:border-transparent focus:ring-2 focus:ring-[#4F83D1]"
                placeholder="+33 6 12 34 56 78"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#DDE7FA]">
              Pays
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-[#7FA7E0]" />
              <select
                value={formData.country || ''}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 transition-all focus:border-transparent focus:ring-2 focus:ring-[#4F83D1]"
              >
                <option value="">Sélectionner un pays</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#DDE7FA]">
              Genre
            </label>
            <select
              value={formData.gender || ''}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' | undefined })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-[#4F83D1]"
            >
              <option value="">Non spécifié</option>
              <option value="male">Masculin</option>
              <option value="female">Féminin</option>
            </select>
          </div>
        </div>

        <div>
          <label className="inline-flex items-center mt-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!!formData.premium}
              onChange={e => setFormData({ ...formData, premium: e.target.checked })}
              className="form-checkbox h-5 w-5 text-yellow-500 border-gray-300 rounded focus:ring-yellow-400"
            />
            <span className="ml-2 flex items-center gap-1 text-sm font-semibold text-yellow-700 dark:text-yellow-300">
              <Star className="w-4 h-4 text-yellow-500" /> Premium
            </span>
          </label>
        </div>
      </div>

      <div>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
          <Shield className="h-5 w-5 text-[#2E5AA6] dark:text-[#9BC2FF]" />
          Rôle et permissions
        </h2>
        <div className="space-y-4">
          {/* Role */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#DDE7FA]">
              Rôle
            </label>
            <select
              value={formData.role || Role.USER}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-[#4F83D1]"
            >
              <option value="USER">Utilisateur</option>
              <option value="ADMIN">Administrateur</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-3 border-t border-slate-200 pt-4 dark:border-[color:var(--theme-border)]">
        <CacheLink
          href={`/admin/users?r=${Date.now()}`}
          className="theme-dark-secondary-button flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-100 px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-200"
        >
          <X className="w-5 h-5" />
          Annuler
        </CacheLink>

        <button
          type="submit"
          disabled={saving || success}
          className="theme-dark-primary-button flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] px-6 py-3 font-semibold text-white transition-all hover:from-[#254A8B] hover:to-[#3F73BE] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Enregistrement...
            </>
          ) : success ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Enregistré
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Enregistrer
            </>
          )}
        </button>
      </div>
    </motion.form>
  );
}

export function EditUserLoading() {
  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-[#070B1A] dark:to-[#0F1C3F]">

      <div className="text-center">
        <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-[#2E5AA6] dark:text-[#9BC2FF]" />
        <p className="text-slate-600 dark:text-[#D1D5DB]">Chargement de l'utilisateur...</p>
      </div>

    </div>
  );
}

export function EditUserSuccessAlert() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"
    >
      <CheckCircle className="w-5 h-5 text-green-600" />

      <div>
        <p className="text-green-900 font-semibold">Modifications enregistrées</p>
        <p className="text-green-700 text-sm">Redirection en cours...</p>
      </div>
    </motion.div>
  );
}

export function EditUserHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <CacheLink
        href={`/admin/users?r=${Date.now()}`}
        className="mb-4 inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-[#AFC0DE] dark:hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux utilisateurs
      </CacheLink>

      <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white">
        <UserIcon className="h-8 w-8 text-[#2E5AA6] dark:text-[#9BC2FF]" />
        Modifier l'utilisateur
      </h1>

      <p className="mt-2 text-slate-600 dark:text-[#D1D5DB]">
        Modifiez les informations de l'utilisateur
      </p>
    </motion.div>
  );
}

interface EditUserErrorAlertProps {
  error: string;
  onClose: () => void;
}

export function EditUserErrorAlert({ error, onClose }: EditUserErrorAlertProps) {

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3"
    >
      <AlertCircle className="w-5 h-5 text-red-600" />
      <div className="flex-1">
        <p className="text-red-900 font-semibold">Erreur</p>
        <p className="text-red-700 text-sm">{error}</p>
      </div>
      <button
        onClick={onClose}
        className="text-red-600 hover:text-red-800"
      >
        <X className="w-5 h-5" />
      </button>
    </motion.div>
  );
}

export default function EditUserPageClient() {
  const {
    formData, loading, saving, error, success, setError, setFormData, handleSubmit
  } = useEditUserPage();

  if (loading) { return <EditUserLoading />; }

  return (
    <div className="mx-auto w-full max-w-4xl bg-gradient-to-br from-slate-50 to-blue-50 p-4 dark:from-[#070B1A] dark:to-[#0F1C3F] sm:p-6">
      <EditUserHeader />
      {success && <EditUserSuccessAlert />}
      {error && <EditUserErrorAlert error={error} onClose={() => setError(null)} />}

      <EditUserForm
        formData={formData}
        setFormData={setFormData}
        saving={saving}
        success={success}
        onSubmit={handleSubmit}
      />
    </div>
  );
}