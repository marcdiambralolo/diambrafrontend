import React from 'react';
import { Award } from 'lucide-react';
import { GRADE_NAMES } from '@/lib/types/grade.types';
import { GradeConfig } from '@/lib/types/grade-config.types';

interface GradeCardHierarchyProps {
  isEditing: boolean;
  nextGrade: GradeConfig | null;
  nextGradeOptions: GradeConfig[];
  selectedNextGradeId: string | null;
  setSelectedNextGradeId: (id: string | null) => void;
}

export default function GradeCardHierarchy({ isEditing, nextGrade, nextGradeOptions, selectedNextGradeId, setSelectedNextGradeId }: GradeCardHierarchyProps) {
  const getGradient = (level: number) => {
    const gradients = [
      'from-[#2E5AA6] to-[#4F83D1]',
      'from-blue-500 to-cyan-500',
      'from-teal-500 to-emerald-500',
      'from-yellow-500 to-amber-500',
      'from-cyan-500 to-sky-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-blue-500',
      'from-sky-500 to-cyan-500',
      'from-amber-500 to-yellow-500',
    ];
    return gradients[(level - 1) % gradients.length];
  };

  return (
    <div className="pb-4">
      {isEditing ? (
        <select
          value={selectedNextGradeId || ''}
          onChange={e => setSelectedNextGradeId(e.target.value || null)}
          className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F83D1]/50 dark:border-zinc-700 dark:bg-zinc-800"
        >
          <option value="">Aucun (dernier grade)</option>
          {nextGradeOptions.map(opt => (
            <option key={opt._id} value={opt._id}>
              {GRADE_NAMES[opt.grade]} (Niveau {opt.level})
            </option>
          ))}
        </select>
      ) : nextGrade ? (
        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-800 rounded-lg">
          <div className={`bg-gradient-to-r ${getGradient(nextGrade.level)} p-2 rounded-md`}>
            <Award className="w-4 h-4 text-white" />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-zinc-200">
              {GRADE_NAMES[nextGrade.grade]}
            </p>
            <p className="text-xs text-slate-500 dark:text-zinc-500">
              Niveau {nextGrade.level} — {nextGrade.requirements.consultations} consultations requises
            </p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-500 dark:text-zinc-500 italic">
          Dernier grade de la hiérarchie
        </p>
      )}
    </div>
  );
}