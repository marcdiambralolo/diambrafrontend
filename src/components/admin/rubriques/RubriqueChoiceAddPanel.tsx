'use client';
import { useChoiceEditorNewNavigation } from "@/hooks/admin/rubriques/useChoiceEditorNewNavigation";
import type { Offering, Rubrique } from "@/lib/interfaces";
import { ConsultationChoice } from "@/lib/interfaces";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Save, X } from "lucide-react";
import { useCallback, useState } from "react";
import ChoiceCreateView from "./ChoiceCreateView";
import ConsultationChoiceCard from "./ConsultationChoiceCard";

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
      frequence: undefined,
      participants: undefined,
      offering: {
        alternatives: [
          { category: "animal", offeringId: "", quantity: 1 },
          { category: "vegetal", offeringId: "", quantity: 1 },
          { category: "beverage", offeringId: "", quantity: 1 },
        ],
      },
      order: 0,
      choiceId: "",
      choiceTitle: "",
      buttonStatus: 'CONSULTER',
      consultButtonStatus: 'CONSULTER',
      hasActiveConsultation: false,
      consultationId: null,
      consultationCount: 0,
      gradeId: "",
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