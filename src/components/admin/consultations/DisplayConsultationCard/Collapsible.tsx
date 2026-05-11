"use client";
import React, { memo } from "react";
import { cx } from "@/lib/functions";

const Collapsible = memo(function Collapsible({
  label,
  hint,
  defaultOpen = false,
  children,
}: {
  label: string;
  hint?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details
      className={cx(
        "group w-full",
        "rounded-2xl border",
        "border-slate-200/70 dark:border-white/10",
        "bg-white/60 dark:bg-white/[0.04]",
        "backdrop-blur-xl"
      )}
      open={defaultOpen}
    >
      <summary
        className={cx(
          "list-none cursor-pointer select-none",
          "px-4 py-3",
          "flex items-center justify-between gap-3",
          "text-left"
        )}
      >
        <div className="min-w-0">
          <div className="text-[12px] sm:text-[13px] font-semibold text-slate-900 dark:text-white">
            {label}
          </div>
          {hint ? (
            <div className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-300/80">
              {hint}
            </div>
          ) : null}
        </div>

        <span
          className={cx(
            "shrink-0",
            "h-8 w-8 rounded-xl grid place-items-center",
            "bg-black/5 dark:bg-white/10",
            "text-slate-800 dark:text-slate-200",
            "transition-transform duration-300",
            "group-open:rotate-180"
          )}
          aria-hidden="true"
        >
          ▾
        </span>
      </summary>

      <div className="px-3 pb-3">
        {children}
      </div>
    </details>
  );
});

export default Collapsible;