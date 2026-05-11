import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Section({
    icon,
    title,
    subtitle,
    children,
    defaultOpen = true,
}: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-full text-left px-5 sm:px-6 py-4 border-b border-slate-200 hover:bg-slate-50"
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400">{icon}</span>
                            <h2 className="text-sm sm:text-base font-black text-slate-900">{title}</h2>
                        </div>
                        {subtitle ? <p className="mt-1 text-xs text-slate-600">{subtitle}</p> : null}
                    </div>
                    <div className="shrink-0 text-slate-500">
                        {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                </div>
            </button>

            {open ? <div className="px-5 sm:px-6 py-5">{children}</div> : null}
        </section>
    );
}   
