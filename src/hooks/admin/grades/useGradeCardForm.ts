import { GradeConfig } from '@/lib/types/grade-config.types';
import { GRADE_NAMES } from '@/lib/types/grade.types';
import { useEffect, useState } from 'react';
type SectionId = 'info' | 'requirements' | 'choices' | 'hierarchy';

type GradeCardSavePayload = {
  name: string;
  description?: string;
  nextGradeId: string | null;
  requirements: GradeConfig['requirements'];
};

export function useGradeCardForm(grade: GradeConfig, isEditing: boolean, gradesById: Map<string, GradeConfig>, onSave: (id: string, data: GradeCardSavePayload) => Promise<void>) {
  const [editName, setEditName] = useState(grade.name);

  const [editDescription, setEditDescription] = useState(grade.description || '');
 
  const [selectedNextGradeId, setSelectedNextGradeId] = useState<string | null>(
    grade.nextGradeId || null
  );

  const [editRequirements, setEditRequirements] = useState({
    consultations: grade.requirements?.consultations ?? 0,
    rituels: grade.requirements?.rituels ?? 0,
    livres: grade.requirements?.livres ?? 0,
  });

  const [isSaving, setIsSaving] = useState(false);
  
  const [expandedSections, setExpandedSections] = useState<Set<SectionId>>(
    new Set(isEditing ? ['info', 'requirements', 'choices', 'hierarchy'] : [])
  );

  useEffect(() => {
    if (isEditing) {
      setEditName(grade.name);
      setEditDescription(grade.description || '');
      setSelectedNextGradeId(grade.nextGradeId || null);
      setEditRequirements({
        consultations: grade.requirements?.consultations ?? 0,
        rituels: grade.requirements?.rituels ?? 0,
        livres: grade.requirements?.livres ?? 0,
      });
      setExpandedSections(new Set(['info', 'requirements', 'choices', 'hierarchy']));
    }
  }, [isEditing, grade]);

  const gradeName = grade.name || GRADE_NAMES[grade.grade];

  const toggleSection = (section: SectionId) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const handleSave = async () => {
    if (!editName.trim()) return;

    if (selectedNextGradeId) {
      const nextGrade = gradesById.get(selectedNextGradeId);
      if (!nextGrade || nextGrade.level <= grade.level) return;
    }

    setIsSaving(true);
    try {
      await onSave(grade._id, {
        name: editName.trim(),
        description: editDescription.trim() || undefined,
        nextGradeId: selectedNextGradeId,
        requirements: editRequirements,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getGradient = (level: number) => {
    const gradients = [
      'from-red-500 to-indigo-500',
      'from-[#163A74] to-[#2E5AA6]',
      'from-blue-500 to-cyan-500',
      'from-teal-500 to-emerald-500',
      'from-yellow-500 to-amber-500',
      'from-[#2E5AA6] to-[#9BC2FF]',
      'from-orange-500 to-red-500',
      'from-[#0F1C3F] to-[#2E5AA6]',
      'from-[#163A74] to-[#4F83D1]',
      'from-amber-500 to-yellow-500',
    ];
    return gradients[(level) % gradients.length];
  };

  return {
    editName, editDescription, editRequirements, isSaving, expandedSections, gradeName,
    toggleSection, setEditName, getGradient, setEditDescription, handleSave, setEditRequirements,
  };
}