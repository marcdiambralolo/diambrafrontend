'use client';
import { useChoiceEditorNewNavigation } from "@/hooks/admin/rubriques/useChoiceEditorNewNavigation";
import type { Offering, Rubrique } from "@/lib/interfaces";
import { ConsultationChoice } from "@/lib/interfaces";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Save, X } from "lucide-react";
import { useCallback, useState } from "react";  
import { ArrowLeft, Check } from "lucide-react";
import { memo } from "react"; 
import type { OfferingAlternative } from "@/lib/interfaces";
import { DollarSign, Package } from "lucide-react";
import { useMemo } from "react";
import { OfferingSelector } from "./OfferingSelector";

const ConsultationChoiceCard = memo(({
    choice,
    onUpdate,
    offerings,
    onDelete,
    onMoveUp,
    onMoveDown
}: {
    choice: ConsultationChoice;
    onUpdate: (updated: ConsultationChoice) => void;
    offerings: Offering[];
    onDelete?: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
}) => {


    const handleAlternativeChange = useCallback((updated: OfferingAlternative) => {
        onUpdate({ ...choice, offering: { alternative: updated } });
    }, [choice, onUpdate]);

    const totalCost = useMemo(() => {
        return choice.offering.alternative.quantity * (choice.offering.price || 0);
    }, [choice.offering,]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-2 border-slate-200 rounded-xl p-4 bg-white shadow-md hover:shadow-lg transition-shadow"
        >
            <div className="flex items-start gap-3 mb-3">
                <div className="flex-1 space-y-2">
                    <input
                        type="text"
                        value={choice.title}
                        onChange={(e) => onUpdate({ ...choice, title: e.target.value })}
                        placeholder="Titre du choix"
                        className="w-full px-3 py-2 text-sm font-bold rounded-lg border border-[#2E5AA6]/20 focus:ring-2 focus:ring-[#2E5AA6]/40 focus:border-[#2E5AA6] dark:border-white/10 dark:bg-[#0F1C3F] dark:text-slate-100"
                    />


                    <div className="space-y-1">
                        <label htmlFor={`choice-desc-0`} className="text-xs font-semibold text-slate-700">
                            Description du choix
                        </label>
                        <p className="text-[10px] text-slate-500">
                            Décrivez ce choix de consultation en détail pour guider l'utilisateur
                        </p>

                        <textarea
                            id={`choice-desc-0`}
                            value={choice.description}
                            disabled={false}
                            onChange={(e) => onUpdate({ ...choice, description: e.target.value })}
                            placeholder="Décrivez les détails et bénéfices de ce choix..."
                            aria-label="Description du choix de consultation"
                            title="Entrez une description détaillée du choix de consultation"
                            rows={2}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#2E5AA6]/40 focus:border-transparent dark:border-white/10 dark:bg-[#0F1C3F] dark:text-slate-100"
                        />
                    </div>



                </div>
            </div>
            {/* Actions: Delete, Move Up/Down */}
            {(onDelete || onMoveUp || onMoveDown) && (
                <div className="flex gap-2 mt-2">
                    {onMoveUp && (
                        <button type="button" onClick={onMoveUp} className="px-2 py-1 text-xs rounded bg-slate-100 hover:bg-slate-200 border border-slate-300">↑</button>
                    )}
                    {onMoveDown && (
                        <button type="button" onClick={onMoveDown} className="px-2 py-1 text-xs rounded bg-slate-100 hover:bg-slate-200 border border-slate-300">↓</button>
                    )}
                    {onDelete && (
                        <button type="button" onClick={onDelete} className="px-2 py-1 text-xs rounded bg-red-100 hover:bg-red-200 border border-red-300 text-red-700">Supprimer</button>
                    )}
                </div>
            )}

            {totalCost > 0 && (
                <div className="mb-3 flex items-center gap-2 rounded-lg border border-[#2E5AA6]/20 bg-gradient-to-r from-[#EEF4FF] to-[#DDE7FA] px-3 py-2 dark:border-white/10 dark:from-[#0F1C3F] dark:to-[#162A56]">
                    <DollarSign className="w-4 h-4 text-[#2E5AA6] dark:text-[#9BC2FF]" />
                    <span className="text-sm font-bold text-[#16315F] dark:text-[#DDE7FA]">
                        Coût total: {totalCost} FCFA
                    </span>
                </div>
            )}

            <AnimatePresence>
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3 overflow-hidden"
                >
                    <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Package className="w-4 h-4" />Jetons
                    </p>
                     <OfferingSelector
                            key={0}
                            alternative={choice.offering.alternative}
                            offerings={offerings}
                            onChange={(updated) => handleAlternativeChange(updated)}
                        /> 
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
}); 

interface ChoiceCreateViewProps {
  onSave: (choice: ConsultationChoice) => void;
  onCancel: () => void;
  offerings?: Offering[];
}

const ChoiceCreateView = memo(function ChoiceCreateView({ onSave, onCancel }: ChoiceCreateViewProps) {
  const [newChoice, setNewChoice] = useState<ConsultationChoice>({
    title: "",
    description: "",
    offering: {
      alternative:
        { offeringId: "", quantity: 1 },
    },
    choiceId: "",
    choiceTitle: "",
    consultationId: null,
  });

  const handleSave = () => {
    if (!newChoice.title.trim()) {
      alert("Le titre est requis");
      return;
    }
    onSave(newChoice);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4 rounded-2xl border border-[#2E5AA6]/20 bg-gradient-to-br from-[#EEF4FF] to-[#DDE7FA] p-4 dark:border-white/10 dark:from-[#0F1C3F] dark:to-[#162A56]"
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[#2E5AA6]/20 pb-3 dark:border-white/10">
        <motion.button
          onClick={onCancel}
          whileHover={{ scale: 1.1, x: -2 }}
          whileTap={{ scale: 0.9 }}
          className="rounded-lg p-2 text-slate-600 hover:bg-white/50 dark:text-slate-400 dark:hover:bg-zinc-800/50"
        >
          <ArrowLeft className="h-4 w-4" />
        </motion.button>
        <h4 className="text-sm font-black text-slate-900 dark:text-white">Nouveau choix de consultation</h4>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Titre *</label>
          <input
            type="text"
            value={newChoice.title}
            onChange={(e) => setNewChoice({ ...newChoice, title: e.target.value })}
            placeholder="Ex: Consultation simple"
            className="theme-dark-input w-full rounded-lg border px-3 py-2 text-sm font-semibold text-black"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">Description</label>
          <textarea
            value={newChoice.description}
            onChange={(e) => setNewChoice({ ...newChoice, description: e.target.value })}
            placeholder="Description du choix..."
            rows={3}
            className="theme-dark-input w-full rounded-lg px-3 py-2 text-sm text-black"
          />
        </div>


      </div>

      {/* Actions */}
      <div className="flex gap-2 border-t border-[#2E5AA6]/20 pt-3 dark:border-white/10">
        <motion.button
          onClick={onCancel}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-slate-300 px-3 py-2 text-xs font-bold transition-colors hover:bg-slate-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          <X className="h-4 w-4" />
          Annuler
        </motion.button>
        <motion.button
          onClick={handleSave}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] px-3 py-2 text-xs font-bold text-white shadow-lg shadow-[#2E5AA6]/25 transition-all hover:from-[#244A8A] hover:to-[#3E6FB5]"
        >
          <Check className="h-4 w-4" />
          Créer
        </motion.button>
      </div>
    </motion.div>
  );
});

 
interface RubriquesEditorPanelProps {
  editingRubrique: Rubrique;
  setEditingRubrique: (rubrique: Rubrique | null) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  offerings: Offering[];
}

export function RubriqueChoiceAddPanel({ editingRubrique, setEditingRubrique, onSave, onCancel, isSaving, offerings }: RubriquesEditorPanelProps) {
  const { view, showList } = useChoiceEditorNewNavigation();

  const handleAddChoice = useCallback((newChoice: ConsultationChoice) => {
    setChoice(newChoice);
    const choiceWithOrder = { ...newChoice, order: 0 };
    setEditingRubrique({ ...editingRubrique, consultationChoices: [choiceWithOrder] });
    showList();
  }, [editingRubrique, setEditingRubrique, showList]);

  const handleCreateChoice = useCallback((newChoice: ConsultationChoice) => {
    const choiceWithOrder = { ...newChoice, order: editingRubrique.consultationChoices.length };
    setEditingRubrique({
      ...editingRubrique,
      consultationChoices: [...editingRubrique.consultationChoices, choiceWithOrder],
    });
    showList();
  }, [editingRubrique, setEditingRubrique, showList]);


  const [choice, setChoice] = useState<ConsultationChoice>({
    title: "",
    description: "",
    offering: {
      alternative:
        { offeringId: "", quantity: 1 }
      ,
    },
    choiceId: "",
    choiceTitle: "",
    consultationId: null,
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="p-6 border-2 border-slate-200 rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-xl"
      >
        <div className="mb-6">

          <div className="mt-4">
            <AnimatePresence mode="wait">
              {view === "list" ? (

                <div className="space-y-3">
                  <ConsultationChoiceCard
                    choice={choice}
                    onUpdate={(updated) => handleCreateChoice(updated)}
                    offerings={offerings}
                  />
                </div>

              ) : (
                <ChoiceCreateView key="create" onSave={handleAddChoice} onCancel={showList} offerings={offerings} />
              )}
            </AnimatePresence>
          </div>
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
    </AnimatePresence>
  );
}