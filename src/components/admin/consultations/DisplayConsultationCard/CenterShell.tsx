"use client";
import { cx } from "@/lib/functions";
import React, { memo } from "react";

const CenterShell = memo(function CenterShell({ children }: { children: React.ReactNode }) {
    return (
        <main className={cx("w-full  grid place-items-center",
            "relative overflow-hidden rounded-[28px] border",
            "border-slate-200/70 bg-white/75 shadow-xl shadow-black/5 backdrop-blur",
            "dark:border-zinc-800/70 dark:bg-zinc-950/45 dark:shadow-black/35"
        )}>
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900" />
            {children}
        </main>
    );
});

export default CenterShell;