'use client';
import { RefreshCw } from 'lucide-react';

interface ReloadButtonsProps {
  fetchGrades: () => Promise<void>;
  gradesLoading: boolean;
}

export default function ReloadButtons({
  fetchGrades,
  gradesLoading,
}: ReloadButtonsProps) {

  return (
    <div className="flex justify-center gap-4 mb-4">
      <button
        onClick={fetchGrades}
        disabled={gradesLoading}
        className="flex items-center gap-2 rounded-lg bg-[#2E5AA6] px-4 py-2 text-white transition-colors hover:bg-[#244A8A] disabled:bg-[#9BC2FF]"
      >
        <RefreshCw className={`w-4 h-4 ${gradesLoading ? 'animate-spin' : ''}`} />
        Recharger les grades
      </button>
    </div>
  );
}