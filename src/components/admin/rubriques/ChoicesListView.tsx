"use client";
import type { ConsultationChoice, Offering } from "@/lib/interfaces";
import { Package } from "lucide-react";
import { memo } from "react";
import ConsultationChoiceCard from "./ConsultationChoiceCard";

interface ChoicesListViewProps {
  choices: ConsultationChoice[];
  onUpdateChoice: (index: number, updated: ConsultationChoice) => void;
  onDeleteChoice: (index: number) => void;
  onMoveChoice: (index: number, direction: 'up' | 'down') => void;
  offerings: Offering[];
}

const ChoicesListView = memo(function ChoicesListView({
  choices,
  onUpdateChoice,
  onDeleteChoice,
  onMoveChoice,
  offerings,
}: ChoicesListViewProps) {
  if (choices.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400">
        <Package className="mx-auto mb-3 h-12 w-12 opacity-50" />
        <p className="text-sm">Aucun choix ajouté</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
        {choices.map((choice, index) => (
          <ConsultationChoiceCard
            key={index}
            choice={choice}
            onUpdate={(updated) => onUpdateChoice(index, updated)}
            onDelete={() => onDeleteChoice(index)}
            onMoveUp={index > 0 ? () => onMoveChoice(index, 'up') : undefined}
            onMoveDown={index < choices.length - 1 ? () => onMoveChoice(index, 'down') : undefined}
            offerings={offerings}
          />
        ))}
    </div>
  );
});

ChoicesListView.displayName = "ChoicesListView";

export default ChoicesListView;