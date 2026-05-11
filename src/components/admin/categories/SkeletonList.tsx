'use client';
import React, { memo } from "react";

export const SkeletonList = memo(function SkeletonList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 animate-pulse rounded-2xl bg-slate-200 dark:bg-zinc-800" />
              <div className="space-y-2">
                <div className="h-3 w-40 animate-pulse rounded bg-slate-200 dark:bg-zinc-800" />
                <div className="h-3 w-56 animate-pulse rounded bg-slate-200 dark:bg-zinc-800" />
              </div>
            </div>
            
            <div className="h-8 w-24 animate-pulse rounded-xl bg-slate-200 dark:bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  );
});