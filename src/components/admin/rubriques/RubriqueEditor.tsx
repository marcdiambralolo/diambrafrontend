'use client';
import type { Rubrique } from "@/lib/interfaces";
import { ConsultationType, Offering } from "@/lib/interfaces";
import { motion } from "framer-motion";
import { Loader2, Save, X } from "lucide-react";
import { memo } from "react";

const RubriqueEditor = memo(({
  rubrique,
  onUpdate,
  onSave,
  onCancel,
  isSaving }: {
    rubrique: Rubrique;
    onUpdate: (updated: Rubrique) => void;
    onSave: () => void;
    onCancel: () => void;
    isSaving: boolean;
    offerings: Offering[];
  }) => {

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="p-6 border-2 border-slate-200 rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-xl"
    >
      {/* Header */}
      <div className="mb-6 space-y-3">
        <input
          type="text"
          value={rubrique.titre}
          onChange={(e) => onUpdate({ ...rubrique, titre: e.target.value })}
          placeholder="Titre de la rubrique"
          className="w-full px-4 py-3 text-lg font-black rounded-xl border border-[#2E5AA6]/20 
                   focus:ring-2 focus:ring-[#2E5AA6]/40 focus:border-[#2E5AA6] dark:border-white/10 dark:bg-[#0F1C3F] dark:text-slate-100"
        />
        {/* Champ type ConsultationType */}
        <select
          value={rubrique.typeconsultation || ''}
          onChange={e => onUpdate({ ...rubrique, typeconsultation: e.target.value as ConsultationType })}
          className="w-full px-4 py-3 rounded-xl border border-[#2E5AA6]/20 focus:ring-2 focus:ring-[#2E5AA6]/40 focus:border-[#2E5AA6] bg-white text-base font-semibold dark:border-white/10 dark:bg-[#0F1C3F] dark:text-slate-100"
        >
          <option value="" disabled>Type de consultation</option>
          <option value="SPIRITUALITE">Spiritualité</option>
          <option value="VIE_PERSONNELLE">Vie personnelle</option>
          <option value="RELATIONS">Relations</option>
          <option value="PROFESSIONNEL">Professionnel</option>
          <option value="OFFRANDES">Offrandes</option>
          <option value="ASTROLOGIE_AFRICAINE">Astrologie africaine</option>
          <option value="HOROSCOPE">Horoscope</option>
          <option value="NOMBRES_PERSONNELS">Nombres personnels</option>
          <option value="CYCLES_PERSONNELS">Cycles personnels</option>
          <option value="CINQ_ETOILES">Cinq étoiles</option>
          <option value="NUMEROLOGIE">Numérologie</option>
          <option value="AUTRE">Autre</option>
        </select>
        <textarea
          value={rubrique.description}
          onChange={(e) => onUpdate({ ...rubrique, description: e.target.value })}
          placeholder="Description de la rubrique"
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 
                   focus:ring-2 focus:ring-[#2E5AA6]/40 focus:border-transparent dark:border-white/10 dark:bg-[#0F1C3F] dark:text-slate-100"
        />
      </div> 
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 
                   rounded-xl border-2 border-slate-300 hover:bg-slate-100 
                   transition-colors font-bold"
        >
          <X className="w-5 h-5" />
          Annuler
        </button>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 
                   rounded-xl bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] 
                   text-white font-bold hover:from-[#244A8A] hover:to-[#3E6FB5] 
                   disabled:opacity-50 transition-all shadow-lg shadow-[#2E5AA6]/25"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Enregistrer
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
});

RubriqueEditor.displayName = "RubriqueEditor";

export default RubriqueEditor;