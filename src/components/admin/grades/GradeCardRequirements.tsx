import React from 'react';

interface GradeCardRequirementsProps {
  isEditing: boolean;
  requirements: {
    consultations: number;
    rituels: number;
    livres: number;
  };
  editRequirements: {
    consultations: number;
    rituels: number;
    livres: number;
  };
  setEditRequirements: (req: (prev: {
    consultations: number;
    rituels: number;
    livres: number;
  }) => {
    consultations: number;
    rituels: number;
    livres: number;
  }) => void;
}

export default function GradeCardRequirements({ isEditing, requirements, editRequirements, setEditRequirements }: GradeCardRequirementsProps) {
  return (
    <div className="pb-4">
      {isEditing ? (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-[#EEF4FF] p-3 text-center dark:bg-[#162A56]/40">
            <label className="mb-2 block text-xs text-[#2E5AA6] dark:text-[#9BC2FF]">Consultations</label>
            <input
              type="number"
              min={0}
              value={editRequirements.consultations}
              onChange={e => setEditRequirements((prev) => ({ ...prev, consultations: Math.max(0, parseInt(e.target.value) || 0) }))}
              className="w-full rounded-lg border border-[#4F83D1]/40 bg-white px-2 py-1.5 text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#4F83D1]/50 dark:border-[#2E5AA6] dark:bg-zinc-800"
            />
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 text-center">
            <label className="text-xs text-indigo-500 dark:text-indigo-400 block mb-2">Rituels</label>
            <input
              type="number"
              min={0}
              value={editRequirements.rituels}
              onChange={e => setEditRequirements((prev) => ({ ...prev, rituels: Math.max(0, parseInt(e.target.value) || 0) }))}
              className="w-full text-center text-xl font-bold bg-white dark:bg-zinc-800 border border-indigo-300 dark:border-indigo-700 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-3 text-center">
            <label className="text-xs text-teal-500 dark:text-teal-400 block mb-2">Livres</label>
            <input
              type="number"
              min={0}
              value={editRequirements.livres}
              onChange={e => setEditRequirements((prev) => ({ ...prev, livres: Math.max(0, parseInt(e.target.value) || 0) }))}
              className="w-full text-center text-xl font-bold bg-white dark:bg-zinc-800 border border-teal-300 dark:border-teal-700 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-[#EEF4FF] p-3 text-center dark:bg-[#162A56]/40">
            <p className="text-2xl font-bold text-[#2E5AA6] dark:text-[#9BC2FF]">
              {requirements.consultations}
            </p>
            <p className="mt-1 text-xs text-[#2E5AA6] dark:text-[#9BC2FF]">Consultations</p>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {requirements.rituels}
            </p>
            <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-1">Rituels</p>
          </div>

          <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
              {requirements.livres}
            </p>
            <p className="text-xs text-teal-500 dark:text-teal-400 mt-1">Livres</p>
          </div>
        </div>
      )}
    </div>
  );
}