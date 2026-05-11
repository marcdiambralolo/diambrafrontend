'use client';
import GradeCard from '@/components/admin/grades/GradeCard';
import { GradeConfig } from '@/lib/types/grade-config.types';

interface GradesListProps {
  gradeConfigs: GradeConfig[];
  gradesLoading: boolean;
  editingId: string | null;
  startEdit: (id: string) => void;
  stopEdit: () => void;
  updateGrade: React.ComponentProps<typeof GradeCard>['onSave'];
  gradesById: Map<string, GradeConfig>;
}

export default function GradesList({
  gradeConfigs,
  gradesLoading,
  editingId,
  startEdit,
  stopEdit,
  updateGrade,
  gradesById,
}: GradesListProps) {
  if (gradesLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-48 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (gradeConfigs.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-zinc-400">
        <p className="text-lg">Aucun grade configuré.</p>

        <p className="text-sm mt-2">Les grades sont automatiquement créés par le backend.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {gradeConfigs.map((grade, idx) => (
        <GradeCard
          key={grade._id || idx}
          grade={grade}
          isEditing={editingId === (grade._id  )}
          onEdit={() => startEdit(grade._id  )}
          onCancel={stopEdit}
          onSave={updateGrade}
          gradesById={gradesById}
        />
      ))}
    </div>
  );
}