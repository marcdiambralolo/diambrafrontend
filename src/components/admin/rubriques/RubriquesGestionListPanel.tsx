'use client';
import { Rubrique } from '@/lib/interfaces';
import { motion } from 'framer-motion';
import { RubriquesList } from './RubriquesList';
import { Package } from "lucide-react";
import React from "react";

export function RubriquesEmptyState() {
  return (
    <div className="text-center py-12 text-slate-400">
      <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
      
      <p className="text-sm">Aucune rubrique</p>
    </div>
  );
}

interface RubriquesGestionListPanelProps {
  rubriques: Rubrique[];
  onList: (rub: Rubrique) => void;
}

export function RubriquesGestionListPanel({ rubriques, onList, }: RubriquesGestionListPanelProps) {

  return (
    <motion.section
      aria-label="Liste des rubriques"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 70 }}
      className="mt-2"
    >
      {rubriques.length > 0 ? (
        <div className="grid grid-cols-1  gap-6">
          {rubriques.map((rub, idx) => (
            <div key={rub._id! + idx} tabIndex={0} aria-label={`Rubrique ${rub.titre}`} className="outline-none focus:ring-4 focus:ring-accent-gold/40 rounded-xl">
              <RubriquesList
                rubriques={[rub]}
                onList={onList}
              />
            </div>
          ))}
        </div>
      ) : (
        <RubriquesEmptyState />
      )}
    </motion.section>
  );
}