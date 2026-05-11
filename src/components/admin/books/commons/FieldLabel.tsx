"use client";
import React, { memo } from "react";

const FieldLabel = memo(function FieldLabel({ htmlFor, children, required, hint, }: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
}) {

  return (
    <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline gap-2">
      <span className="block text-[12px] font-bold uppercase tracking-widest text-white dark:text-white/80">
        {children}
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </span>

      {hint ? (
        <span className="text-[11px] font-normal text-slate-400 dark:text-white/35">
          {hint}
        </span>
      ) : null}
    </label>
  );
});

FieldLabel.displayName = "FieldLabel";

export default FieldLabel;