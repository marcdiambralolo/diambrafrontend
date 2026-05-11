import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

export function InfoRow({
    icon,
    label,
    value,
    copyValue,
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    copyValue?: string | null;
}) {
    const [copied, setCopied] = useState(false);

    return (
        <div className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex items-start gap-3 min-w-0">
                <div className="mt-0.5 shrink-0 text-slate-400">{icon}</div>
                <div className="min-w-0">
                    <div className="text-[11px] font-extrabold text-slate-600">{label}</div>
                    <div className="mt-0.5 text-sm font-semibold text-slate-900 break-words">{value}</div>
                </div>
            </div>

            {copyValue ? (
                <button
                    type="button"
                    className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-extrabold text-white hover:bg-slate-800"
                    onClick={async () => {
                        try {
                            await navigator.clipboard.writeText(copyValue);
                            setCopied(true);
                            window.setTimeout(() => setCopied(false), 900);
                        } catch {
                            // silencieux
                        }
                    }}
                    aria-label={`Copier ${label}`}
                    title={`Copier ${label}`}
                >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copié" : "Copier"}
                </button>
            ) : null}
        </div>
    );
}
