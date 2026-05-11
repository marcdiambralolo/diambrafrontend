"use client";
import React, { memo } from "react";

const SectionTitle = memo(function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="text-center">
      <h2 className="text-[13px] sm:text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
        {title}
      </h2>

      {subtitle ? (
        <p className="mt-1 text-[12px] leading-snug text-slate-600 dark:text-slate-300/85">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
});

export default SectionTitle;