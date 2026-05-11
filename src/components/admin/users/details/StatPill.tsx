import React from "react";

export function StatPill({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
      <div className="text-[11px] font-extrabold text-slate-600">{label}</div>
      <div className="mt-0.5 text-sm font-black text-slate-900 tabular-nums">{value}</div>
    </div>
  );
}
