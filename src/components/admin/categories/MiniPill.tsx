'use client';
import React, { memo } from "react";

export const MiniPill = memo(function MiniPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"    >
      {children}
    </span>
  );
});