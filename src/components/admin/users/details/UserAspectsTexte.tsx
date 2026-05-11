import React from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { Copy } from "lucide-react";

interface UserAspectsTexteProps {
    aspectsTexte?: string | null;
}

export default function UserAspectsTexte({ aspectsTexte }: UserAspectsTexteProps) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
            <div className="border-b border-slate-200 px-4 py-3 flex items-center justify-between gap-2">
                <div className="text-xs font-extrabold text-slate-700">Carte du ciel</div>
                {aspectsTexte ? (
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-extrabold text-white hover:bg-slate-800"
                        onClick={async () => {
                            try {
                                await navigator.clipboard.writeText(String(aspectsTexte));
                            } catch { }
                        }}
                    >
                        <Copy className="h-4 w-4" />
                        Copier
                    </button>
                ) : null}
            </div>
            <div className="p-4 sm:p-5">
                {aspectsTexte ? (
                    <div className="prose prose-slate max-w-none">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                            components={{
                                h1: ({ children }) => (
                                    <h1 className="text-xl font-black tracking-tight text-slate-900">{children}</h1>
                                ),
                                h2: ({ children }) => (
                                    <h2 className="text-lg font-extrabold tracking-tight text-slate-900">{children}</h2>
                                ),
                                h3: ({ children }) => (
                                    <h3 className="text-base font-extrabold text-slate-900">{children}</h3>
                                ),
                                p: ({ children }) => (
                                    <p className="text-sm leading-relaxed text-slate-800">{children}</p>
                                ),
                                li: ({ children }) => (
                                    <li className="text-sm text-slate-800">{children}</li>
                                ),
                                code: ({ children }) => (
                                    <code className="rounded bg-slate-50 px-1.5 py-0.5 text-[12px] font-semibold text-slate-900 border border-slate-200">
                                        {children}
                                    </code>
                                ),
                                pre: ({ children }) => (
                                    <pre className="overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-[12px] text-slate-900">
                                        {children}
                                    </pre>
                                ),
                                a: ({ href, children }) => (
                                    <a
                                        href={href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-2 hover:decoration-slate-900"
                                    >
                                        {children}
                                    </a>
                                ),
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-2 border-slate-300 pl-3 italic text-slate-700">
                                        {children}
                                    </blockquote>
                                ),
                            }}
                        >
                            {String(aspectsTexte).replace(/\r\n/g, "\n")}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <div className="text-sm font-semibold text-slate-600">Aucun aspectsTexte.</div>
                )}
            </div>
        </div>
    );
}
