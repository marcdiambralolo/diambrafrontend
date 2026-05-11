"use client";
import React from "react";
import { Sparkles } from "lucide-react";

export default function TopBar({ counts }: { counts: { catCount: number; rubCount: number } }) {
  return (
    <div className="sticky top-0 z-20 -mx-3 mb-3 border-b border-slate-200/70 bg-white/80 px-3 py-3 backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/70 sm:-mx-4 sm:px-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] text-white shadow-sm">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            
            <div className="min-w-0">
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                Catégories
              </h1>
              
              <p className="mt-0.5 text-[11px] text-slate-600 dark:text-[#AFC0DE]">
                <span className="font-semibold">{counts.catCount}</span> catégorie(s) •{" "}
                <span className="font-semibold">{counts.rubCount}</span> rubrique(s)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}