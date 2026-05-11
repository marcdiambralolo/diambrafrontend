import { ChevronDown, ChevronRight } from 'lucide-react';
import React from 'react';

type SectionId = 'info' | 'requirements' | 'choices' | 'hierarchy';

interface SectionHeaderProps {
  id: SectionId;
  icon: React.ElementType;
  title: string;
  badge?: string | number;
  expanded: boolean;
  onToggle: (id: SectionId) => void;
}

export default function SectionHeader({ id, icon: Icon, title, badge, expanded, onToggle }: SectionHeaderProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(id)}
      className="w-full flex items-center justify-between py-3 px-1 text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:text-[#2E5AA6] dark:hover:text-[#9BC2FF] transition-colors group"
    >
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" />
        <span>{title}</span>
        {badge !== undefined && (
          <span className="px-2 py-0.5 text-xs bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-400 rounded-full">
            {badge}
          </span>
        )}
      </div>
      {expanded ? (
        <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-[#4F83D1]" />
      ) : (
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#4F83D1]" />
      )}
    </button>
  );
}