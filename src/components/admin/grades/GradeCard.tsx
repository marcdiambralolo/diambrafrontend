'use client';
import { useGradeCardForm } from '@/hooks/admin/grades/useGradeCardForm';
import { GradeConfig } from '@/lib/types/grade-config.types';
import { GRADE_NAMES } from '@/lib/types/grade.types';
import { Award, Edit2, Hash, Layers, Save, Settings, X } from 'lucide-react';
import SectionHeader from './SectionHeader';

interface GradeCardProps {
  grade: GradeConfig;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (id: string, data: Partial<GradeConfig>) => Promise<void>;
  gradesById: Map<string, GradeConfig>;
}

export default function GradeCard({
  grade,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  gradesById,
}: GradeCardProps) {

  const {
    editName, editDescription, editRequirements, isSaving, expandedSections, gradeName,
    toggleSection, setEditName, getGradient, setEditDescription, handleSave, setEditRequirements,
  } = useGradeCardForm(grade, isEditing, gradesById, onSave);


  return (
    <div className="bg-white dark:bg-[#070B1A] rounded-2xl shadow-xl border border-slate-200 dark:border-[#162A56] overflow-hidden transition-all">
      {/* Header modernisé */}
      <div className={`relative bg-gradient-to-r ${getGradient(grade.level)} p-6 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4`}>  
        <div className="flex items-center gap-4">
          <div className="bg-white/30 dark:bg-[#2E5AA6]/30 shadow-lg p-4 rounded-xl flex items-center justify-center">
            <Award className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-2xl font-extrabold tracking-tight drop-shadow-sm text-white/95">{gradeName}</h3>
              <span className="bg-[#D1E9FF] text-[#2E5AA6] dark:bg-[#2E5AA6] dark:text-[#D1E9FF] px-3 py-0.5 rounded-full text-xs font-bold shadow-sm uppercase tracking-wide">
                Niveau {grade.level}
              </span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-mono uppercase tracking-wider border border-white/30">
                {grade.grade}
              </span>
            </div>
            {grade.description && (
              <p className="text-white/90 text-sm mt-1 line-clamp-2 font-medium italic max-w-xl">{grade.description}</p>
            )}
            {grade.requirements ? (
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="inline-flex items-center gap-1 bg-white/20 px-2.5 py-1 rounded-lg text-xs font-semibold text-white/90 shadow-sm">
                  <Hash className="w-3 h-3" />
                  <span className="font-bold text-base">{grade.requirements.consultations}</span> consultations
                </span>
                <span className="inline-flex items-center gap-1 bg-white/20 px-2.5 py-1 rounded-lg text-xs font-semibold text-white/90 shadow-sm">
                  <span className="font-bold text-base">{grade.requirements.rituels}</span> rituels
                </span>
                <span className="inline-flex items-center gap-1 bg-white/20 px-2.5 py-1 rounded-lg text-xs font-semibold text-white/90 shadow-sm">
                  <span className="font-bold text-base">{grade.requirements.livres}</span> livres
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3 mt-2 text-xs text-white/80 italic text-red-200">
                <span>Aucune exigence définie</span>
              </div>
            )}
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={onEdit}
            className="bg-white/30 hover:bg-white/50 dark:bg-[#2E5AA6]/40 dark:hover:bg-[#2E5AA6]/60 p-3 rounded-full transition-colors shadow-lg"
            title="Modifier ce grade"
          >
            <Edit2 className="w-5 h-5 text-[#2E5AA6] dark:text-[#D1E9FF]" />
          </button>
        )}
      </div>

      <div className="px-6 py-2 divide-y divide-slate-100 dark:divide-zinc-800">
        <div>
          <SectionHeader
            id="requirements"
            icon={Layers}
            title="Seuils Globaux"
            badge={`${grade.requirements.consultations}/${grade.requirements.rituels}/${grade.requirements.livres}`}
            expanded={expandedSections.has('requirements')}
            onToggle={toggleSection}
          />
          {expandedSections.has('requirements') && (
            <div className="pb-4">
              {isEditing ? (
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-[#EEF4FF] p-3 text-center dark:bg-[#162A56]/40">
                    <label className="mb-2 block text-xs text-[#2E5AA6] dark:text-[#9BC2FF]">Consultations</label>
                    <input
                      type="number"
                      min={0}
                      value={editRequirements.consultations}
                      onChange={(e) => setEditRequirements(prev => ({ ...prev, consultations: Math.max(0, parseInt(e.target.value) || 0) }))}
                      className="w-full rounded-lg border border-[#4F83D1]/40 bg-white px-2 py-1.5 text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#4F83D1]/50 dark:border-[#2E5AA6] dark:bg-zinc-800"
                    />
                  </div>
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 text-center">
                    <label className="text-xs text-indigo-500 dark:text-indigo-400 block mb-2">Rituels</label>
                    <input
                      type="number"
                      min={0}
                      value={editRequirements.rituels}
                      onChange={(e) => setEditRequirements(prev => ({ ...prev, rituels: Math.max(0, parseInt(e.target.value) || 0) }))}
                      className="w-full text-center text-xl font-bold bg-white dark:bg-zinc-800 border border-indigo-300 dark:border-indigo-700 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-3 text-center">
                    <label className="text-xs text-teal-500 dark:text-teal-400 block mb-2">Livres</label>
                    <input
                      type="number"
                      min={0}
                      value={editRequirements.livres}
                      onChange={(e) => setEditRequirements(prev => ({ ...prev, livres: Math.max(0, parseInt(e.target.value) || 0) }))}
                      className="w-full text-center text-xl font-bold bg-white dark:bg-zinc-800 border border-teal-300 dark:border-teal-700 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-[#EEF4FF] p-3 text-center dark:bg-[#162A56]/40">
                    <p className="text-2xl font-bold text-[#2E5AA6] dark:text-[#9BC2FF]">
                      {grade.requirements.consultations}
                    </p>
                    <p className="mt-1 text-xs text-[#2E5AA6] dark:text-[#9BC2FF]">Consultations</p>
                  </div>
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {grade.requirements.rituels}
                    </p>
                    <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-1">Rituels</p>
                  </div>
                  <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                      {grade.requirements.livres}
                    </p>
                    <p className="text-xs text-teal-500 dark:text-teal-400 mt-1">Livres</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <SectionHeader
            id="info"
            icon={Settings}
            title="Informations Générales"
            badge={undefined}
            expanded={expandedSections.has('info')}
            onToggle={toggleSection}
          />
          {expandedSections.has('info') && (
            <div className="pb-4 space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1">
                      Nom du grade
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Nom personnalisé du grade"
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F83D1]/50 focus:border-transparent dark:border-zinc-700 dark:bg-zinc-800"
                    />
                    <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
                      Nom par défaut : <span className="font-medium">{GRADE_NAMES[grade.grade]}</span> — Enum : <span className="font-mono">{grade.grade}</span>
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1">
                      Description
                    </label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Description du grade (optionnel)"
                      rows={3}
                      className="w-full resize-none rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F83D1]/50 focus:border-transparent dark:border-zinc-700 dark:bg-zinc-800"
                    />
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-zinc-400 block mb-1">Nom</span>
                    <p className="text-sm font-medium text-slate-800 dark:text-zinc-200">{grade.name}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-zinc-400 block mb-1">Enum</span>
                    <p className="text-sm font-mono text-slate-600 dark:text-zinc-400">{grade.grade}</p>
                  </div>
                  {grade.description && (
                    <div className="sm:col-span-2">
                      <span className="text-xs text-slate-500 dark:text-zinc-400 block mb-1">Description</span>
                      <p className="text-sm text-slate-700 dark:text-zinc-300">{grade.description}</p>
                    </div>
                  )}
                  {grade.createdAt && (
                    <div>
                      <span className="text-xs text-slate-500 dark:text-zinc-400 block mb-1">Créé le</span>
                      <p className="text-sm text-slate-600 dark:text-zinc-400">
                        {new Date(grade.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                  {grade.updatedAt && (
                    <div>
                      <span className="text-xs text-slate-500 dark:text-zinc-400 block mb-1">Modifié le</span>
                      <p className="text-sm text-slate-600 dark:text-zinc-400">
                        {new Date(grade.updatedAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="px-6 py-4 bg-slate-50 dark:bg-zinc-800/50 border-t border-slate-200 dark:border-zinc-700 flex flex-wrap gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving || !editName.trim()}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] px-5 py-2 text-sm text-white transition-colors shadow-sm hover:from-[#244A8A] hover:to-[#3E6FB5] disabled:from-[#9BC2FF] disabled:to-[#9BC2FF]"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 bg-slate-200 dark:bg-zinc-700 hover:bg-slate-300 dark:hover:bg-zinc-600 text-slate-800 dark:text-zinc-200 text-sm rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Annuler
          </button>
          <p className="w-full text-xs text-slate-400 dark:text-zinc-500 mt-1">
            Le bouton &quot;Enregistrer&quot; sauvegarde le nom, la description, les seuils, les choix et le grade suivant.
          </p>
        </div>
      )}
    </div>
  );
}