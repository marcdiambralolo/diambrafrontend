'use client';
import RubriqueEditor from "@/components/admin/rubriques/RubriqueEditor";
import { AnimatePresence } from "framer-motion";
import { Package } from "lucide-react";
import React from "react";

import type { Offering, Rubrique } from "@/lib/interfaces";

interface RubriquesEditorPanelProps {
  editingRubrique: Rubrique | null;
  setEditingRubrique: (rubrique: Rubrique | null) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  offerings: Offering[];
}

export function RubriquesEditorPanel({ editingRubrique, setEditingRubrique, onSave, onCancel, isSaving, offerings }: RubriquesEditorPanelProps) {
  return (
    <AnimatePresence mode="wait">
      {editingRubrique ? (
        <RubriqueEditor
          key={editingRubrique._id || "new"}
          rubrique={editingRubrique}
          onUpdate={setEditingRubrique}
          onSave={onSave}
          onCancel={onCancel}
          isSaving={isSaving}
          offerings={offerings}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 py-20"        >
          <Package className="w-16 h-16 mb-4 opacity-50" />
          <p>Sélectionnez une rubrique pour l'éditer</p>
        </div>
      )}
    </AnimatePresence>
  );
}