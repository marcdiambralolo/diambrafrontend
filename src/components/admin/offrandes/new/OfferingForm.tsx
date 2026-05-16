import { Loader2 } from "lucide-react";
import React from "react";
import { MobileHint } from './MobileHint';
 
export interface OfferingFormData {
  name: string;
  price: number; 
}

interface OfferingFormProps {
  formData: OfferingFormData;
  error: string | null;
  saving: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function OfferingForm({
  formData,
  error,
  saving,
  onChange,
  onSubmit,
  onCancel,
}: OfferingFormProps) {

  return (
    <>
      <MobileHint />
      <form onSubmit={onSubmit} className="theme-dark-panel mt-6 mx-auto flex max-w-xl flex-col items-center justify-center space-y-5 rounded-2xl border border-blue-200 bg-white p-6 shadow-xl animate-fade-in dark:border-[color:var(--theme-border)] dark:bg-[#0F1C3F]">
        <h1 className="text-center text-xl font-extrabold tracking-tight text-cosmic-indigo dark:text-[#DDE7FA] mb-2">Nouveau</h1>
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