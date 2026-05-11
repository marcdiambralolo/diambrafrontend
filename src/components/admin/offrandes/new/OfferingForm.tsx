import { CATEGORIES_OFFRANDES } from '@/lib/constants';
import { Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useRef } from "react";
import { MobileHint } from './MobileHint';

export interface OfferingFormData {
  name: string;
  price: number;
  priceUSD: number;
  category: 'animal' | 'vegetal' | 'beverage' | '';
  description: string;
  illustrationUrl?: string;
}

interface OfferingFormProps {
  formData: OfferingFormData;
  error: string | null;
  saving: boolean;
  priceUSD: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCategoryChange: (value: 'animal' | 'vegetal' | 'beverage') => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  illustrationFile: File | null;
  setIllustrationFile: (file: File | null) => void;
}

export function OfferingForm({
  formData,
  error,
  saving,
  priceUSD,
  onChange,
  onCategoryChange,
  onSubmit,
  onCancel,
  handleFileChange,
  illustrationFile,
  setIllustrationFile,
}: OfferingFormProps) {
  const categoryButtonBase = 'theme-dark-input py-2 px-2 rounded-lg font-bold text-xs transition-all outline-none focus:ring-2 focus:ring-[#4F83D1]';
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <MobileHint />
      <form onSubmit={onSubmit} className="theme-dark-panel mt-6 mx-auto flex max-w-xl flex-col items-center justify-center space-y-5 rounded-2xl border border-blue-200 bg-white p-6 shadow-xl animate-fade-in dark:border-[color:var(--theme-border)] dark:bg-[#0F1C3F]">
        <h1 className="text-center text-xl font-extrabold tracking-tight text-cosmic-indigo dark:text-[#DDE7FA] mb-2">Nouvelle offrande</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Nom *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder="ex: Poulet blanc"
              required
              className="theme-dark-input w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 transition-colors focus:border-[#4F83D1] dark:border-[color:var(--theme-border)] dark:bg-[#13274C] dark:text-white"
            />
          </div>
        </div>

        <div className="w-full">
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Catégorie *</label>
          <div className="grid grid-cols-3 gap-1">
            {CATEGORIES_OFFRANDES.map(cat => (
              <button
                key={cat.value}
                type="button"
                tabIndex={0}
                aria-pressed={formData.category === cat.value}
                onClick={() => onCategoryChange(cat.value as 'animal' | 'vegetal' | 'beverage')}
                className={`${categoryButtonBase} ${formData.category === cat.value ? 'scale-105 bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#13274C] dark:text-gray-300 dark:hover:bg-[#163A74]'}`}
              >
                <span className="text-lg block mb-0.5">{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prix (XOF) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={onChange}
              min="0"
              step="100"
              required
              className="theme-dark-input w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 transition-colors focus:border-[#4F83D1] dark:border-[color:var(--theme-border)] dark:bg-[#13274C] dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prix (USD)</label>
            <input
              type="number"
              name="priceUSD"
              value={priceUSD}
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500 dark:border-[color:var(--theme-border)] dark:bg-[#13274C] dark:text-gray-400"
            />
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Calculé automatiquement (1 USD = 563,90 XOF)</p>
          </div>
        </div>      

        <div className="w-full">
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Illustration (image)</label>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={saving}
              className="block w-full text-xs text-gray-700 dark:text-gray-300 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {illustrationFile && (
            <div className="mt-2 flex items-center gap-2">
              <Image
                src={URL.createObjectURL(illustrationFile)}
                alt="Aperçu illustration"
                width={80}
                height={80}
                className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                style={{ width: 80, height: 80 }}
                unoptimized
              />
              <button type="button" onClick={() => { setIllustrationFile(null); onChange({ target: { name: 'illustrationUrl', value: '', type: 'text' } } as any); }} className="text-xs text-red-500 underline">Supprimer</button>
            </div>
          )}

          {!illustrationFile && formData.illustrationUrl && (
            <div className="mt-2 flex items-center gap-2">
              <Image
                src={formData.illustrationUrl}
                alt="Aperçu illustration"
                width={80}
                height={80}
                className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                style={{ width: 80, height: 80 }}
                unoptimized
              />
              <button type="button" onClick={() => onChange({ target: { name: 'illustrationUrl', value: '', type: 'text' } } as any)} className="text-xs text-red-500 underline">Supprimer</button>
            </div>
          )}
        </div>

        <div className="w-full">
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            placeholder="Symbole de pureté et d'harmonie"
            rows={2}
            className="theme-dark-input w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 transition-colors focus:border-[#4F83D1] dark:border-[color:var(--theme-border)] dark:bg-[#13274C] dark:text-white"
          />
        </div>

        {error && <div className="text-red-600 text-xs font-bold mt-1 text-center animate-pulse">{error}</div>}

        <div className="flex gap-2 pt-2 w-full">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-900 transition-all text-xs"
          >
            Annuler
          </button>

          <button
            type="submit"
            disabled={saving}
            className="theme-dark-primary-button flex flex-1 items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] py-2 text-xs font-black text-white shadow-lg transition-all hover:from-[#254A8B] hover:to-[#3F73BE] active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" /> : '💾'}
            {saving ? "Sauvegarde..." : "Ajouter"}
          </button>
        </div>
      </form>
    </>
  );
}