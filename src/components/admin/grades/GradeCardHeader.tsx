import { Award, Hash } from 'lucide-react';
import { GRADE_NAMES } from '@/lib/types/grade.types';
import { GradeConfig } from '@/lib/types/grade-config.types';

interface GradeCardHeaderProps {
  grade: GradeConfig;
}

export default function GradeCardHeader({ grade }: GradeCardHeaderProps) {
  const gradeName = GRADE_NAMES[grade.grade] || grade.name;
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
    <div className={`bg-gradient-to-r ${getGradient(grade.level)} p-5 text-white`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
            <Award className="w-7 h-7" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-bold">{gradeName}</h3>
              <span className="bg-white/30 px-2.5 py-0.5 rounded-full text-xs font-medium">
                Niveau {grade.level}
              </span>
              <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-mono uppercase tracking-wider">
                {grade.grade}
              </span>
            </div>
            {grade.description && (
              <p className="text-white/80 text-sm mt-1 line-clamp-1">{grade.description}</p>
            )}
            <div className="flex items-center gap-3 mt-2 text-xs text-white/80">
              <span className="flex items-center gap-1">
                <Hash className="w-3 h-3" />
                {grade.requirements.consultations} consultations
              </span>
              <span>·</span>
              <span>{grade.requirements.rituels} rituels</span>
              <span>·</span>
              <span>{grade.requirements.livres} livres</span>
            </div>
          </div>          
        </div>
      </div>
    </div>
  );
}
