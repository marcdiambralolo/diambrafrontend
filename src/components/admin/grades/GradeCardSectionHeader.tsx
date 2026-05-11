import React from 'react';

interface GradeCardSectionHeaderProps {
  icon: React.ElementType;
  title: string;
  badge?: string | number;
  expanded: boolean;
  onToggle: () => void;
}

export default function GradeCardSectionHeader({ icon: Icon, title, badge, expanded, onToggle }: GradeCardSectionHeaderProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
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
        <svg className="w-4 h-4 text-slate-400 group-hover:text-[#4F83D1]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
      ) : (
        <svg className="w-4 h-4 text-slate-400 group-hover:text-[#4F83D1]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M6 15l6-6 6 6" /></svg>
      )}
    </button>
  );
}
