"use client";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { memo } from "react";

interface ChoicesListHeaderProps {
  choicesCount: number;
  onAddChoice: () => void;
}

const ChoicesListHeader = memo(function ChoicesListHeader({ choicesCount, onAddChoice }: ChoicesListHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-black text-slate-900 dark:text-white">
        Choix de consultations ({choicesCount})
      </h3>
      
      <motion.button
        onClick={onAddChoice}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] px-3 py-1.5 text-xs font-black text-white shadow-lg shadow-[#2E5AA6]/30 transition-all hover:from-[#244A8A] hover:to-[#3E6FB5]"
      >
        <Plus className="h-3.5 w-3.5" />
        Ajouter
      </motion.button>
    </div>
  );
});

ChoicesListHeader.displayName = "ChoicesListHeader";

export default ChoicesListHeader;