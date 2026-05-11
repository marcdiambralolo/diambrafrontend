'use client';
import { countries } from '@/components/admin/users/countries';
import { motion } from 'framer-motion';
import { Loader2, Save, User } from 'lucide-react';
import React from 'react';

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