"use client";
import { PrimaryBtn, SecondaryBtn, useBlogArticle } from "@/hooks/blog/useBlogArticle";
import { cx, formatDateFRTiret } from "@/lib/functions";
import { AlertTriangle, ArrowLeft, Calendar, Share2 } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

export function BlogLoading() {

    return (
        <main
            className="relative min-h-screen overflow-hidden bg-white text-slate-900 dark:bg-[color:var(--theme-layer-1)] dark:text-[#E5E7EB]"
            aria-busy="true"
            aria-live="polite"
        >
            <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
                <div className="absolute -top-44 -right-44 h-[36rem] w-[36rem] rounded-full bg-[#4F83D1]/10 blur-3xl" />
                <div className="absolute -bottom-52 -left-52 h-[38rem] w-[38rem] rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="absolute left-1/2 top-1/3 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-[#9BC2FF]/8 blur-3xl" />
                <div className="absolute inset-0 opacity-[0.14] mix-blend-multiply"
                    style={{
                        backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='.22'/%3E%3C/svg%3E\")",
                    }}
                />
            </div>

            <div className="mx-auto max-w-3xl px-4 py-10">
                <div className="rounded-[28px] bg-[conic-gradient(from_180deg,rgba(46,90,166,0.22),rgba(6,182,212,0.14),rgba(155,194,255,0.12),rgba(46,90,166,0.22))] p-[1px] shadow-[0_24px_70px_-40px_rgba(2,6,23,0.35)]">
                    <section className="theme-dark-panel relative overflow-hidden rounded-[27px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.75),transparent)]"
                        />

                        <div className="relative">
                            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-extrabold text-slate-700 shadow-sm dark:border-[color:var(--theme-border)] dark:bg-[color:var(--theme-layer-3)] dark:text-[#D1D5DB]">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-slate-900/25" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-slate-900/60 dark:bg-[#9BC2FF]" />
                                </span>
                                Chargement
                            </div>

                            <div className="mt-4 space-y-3">
                                <div className="h-3 w-44 rounded-full bg-slate-200/80 overflow-hidden">
                                    <div className="h-full w-full animate-shimmer2 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.65),transparent)]" />
                                </div>
                                <div className="h-2 w-full rounded-full bg-slate-200/80" />
                                <div className="h-2 w-5/6 rounded-full bg-slate-200/80" />
                            </div>

                            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="theme-dark-card relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-4"
                                    >
                                        <div
                                            aria-hidden="true"
                                            className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer2 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.7),transparent)]"
                                        />
                                        <div className="h-28 w-full rounded-2xl bg-slate-100" />
                                        <div className="mt-4 h-3 w-4/5 rounded-full bg-slate-200/80" />
                                        <div className="mt-2 h-3 w-2/3 rounded-full bg-slate-200/80" />
                                        <div className="mt-4 space-y-2">
                                            <div className="h-2.5 w-full rounded-full bg-slate-100" />
                                            <div className="h-2.5 w-11/12 rounded-full bg-slate-100" />
                                            <div className="h-2.5 w-9/12 rounded-full bg-slate-100" />
                                        </div>
                                        <div className="mt-5 h-10 w-full rounded-2xl bg-slate-900/10" />
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 text-center text-sm font-extrabold text-slate-700">
                                Chargement…
                                <span className="ml-2 inline-flex items-center gap-1 align-middle" aria-hidden="true">
                                    <span className="h-1.5 w-1.5 animate-dot rounded-full bg-slate-600" />
                                    <span className="h-1.5 w-1.5 animate-dot rounded-full bg-slate-600 [animation-delay:180ms]" />
                                    <span className="h-1.5 w-1.5 animate-dot rounded-full bg-slate-600 [animation-delay:360ms]" />
                                </span>
                            </div>

                            <p className="mt-1 text-center text-xs text-slate-600">
                                Préparation des articles, mise en page et pagination…
                            </p>
                        </div>

                        <span className="sr-only">Chargement du blog en cours…</span>
                    </section>
                </div>
            </div>

            <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-120%);
            opacity: 0.5;
          }
          100% {
            transform: translateX(120%);
            opacity: 0.5;
          }
        }
        .animate-shimmer {
          animation: shimmer 1.75s ease-in-out infinite;
        }

        @keyframes shimmer2 {
          0% {
            transform: translateX(-120%);
            opacity: 0.65;
          }
          100% {
            transform: translateX(120%);
            opacity: 0.65;
          }
        }
        .animate-shimmer2 {
          animation: shimmer2 1.45s ease-in-out infinite;
        }

        @keyframes dot {
          0%,
          80%,
          100% {
            transform: translateY(0);
            opacity: 0.35;
          }
          40% {
            transform: translateY(-2px);
            opacity: 0.9;
          }
        }
        .animate-dot {
          animation: dot 900ms ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-shimmer,
          .animate-shimmer2,
          .animate-dot {
            animation: none !important;
          }
        }
      `}</style>
        </main>
    );
}

export function BlogNotFound() {

    return (
        <main className="relative min-h-screen overflow-hidden bg-white text-slate-900">
            <div className="mx-auto max-w-3xl px-4 py-10">
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-700 shadow-sm">
                    Article introuvable
                </div>
            </div>
        </main>
    );
}

interface BlogErrorProps {
    error: string;
    onBack: () => void;
}

export function BlogError({ error, onBack }: BlogErrorProps) {

    return (
        <main className="relative min-h-screen overflow-hidden bg-white text-slate-900">
            <div className="mx-auto max-w-3xl px-4 py-10">
                <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-900 shadow-sm">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 mt-0.5" />

                        <div>
                            <div className="font-black">Erreur</div>
                            <div className="mt-1 text-sm">{error}</div>

                            <button
                                onClick={onBack}
                                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-extrabold text-white hover:bg-slate-800"
                                type="button"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Retour
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function BlogPostPage() {
    const {
        handleShare, handleBack, loading, post, error, normalizedContent, shareLabel,
    } = useBlogArticle();

    const mdComponents = useMemo(
        () => ({
            p: ({ children }: React.PropsWithChildren<object>) => (
                <p className="mb-2 last:mb-0 text-[13px] leading-relaxed text-slate-800 dark:text-[#E5E7EB] break-words">
                    {children}
                </p>
            ),
            h1: ({ children }: React.PropsWithChildren<object>) => (
                <h1 className="mb-2 text-[15px] font-black tracking-tight text-slate-950 dark:text-white">
                    {children}
                </h1>
            ),
            h2: ({ children }: React.PropsWithChildren<object>) => (
                <h2 className="mb-2 text-[14px] font-extrabold tracking-tight text-slate-950 dark:text-white">
                    {children}
                </h2>
            ),
            h3: ({ children }: React.PropsWithChildren<object>) => (
                <h3 className="mb-2 text-[13px] font-extrabold text-slate-950 dark:text-white">
                    {children}
                </h3>
            ),
            ul: ({ children }: React.PropsWithChildren<object>) => (
                <ul className="my-2 list-disc pl-5 text-[13px] text-slate-800 dark:text-[#E5E7EB]">
                    {children}
                </ul>
            ),
            ol: ({ children }: React.PropsWithChildren<object>) => (
                <ol className="my-2 list-decimal pl-5 text-[13px] text-slate-800 dark:text-[#E5E7EB]">
                    {children}
                </ol>
            ),
            li: ({ children }: React.PropsWithChildren<object>) => <li className="my-1">{children}</li>,
            a: ({ href, children }: React.ComponentProps<'a'>) => (
                <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className={cx(
                        "font-extrabold underline underline-offset-2",
                        "text-slate-950 decoration-slate-300 hover:decoration-slate-950",
                        "dark:text-[#4F83D1] dark:decoration-[#4F83D1]/50 dark:hover:decoration-[#4F83D1]"
                    )}
                >
                    {children}
                </a>
            ),
            blockquote: ({ children }: any) => (
                <blockquote
                    className={cx(
                        "my-3 border-l-2 pl-3 text-[13px] italic",
                        "border-slate-200 text-slate-700",
                        "dark:border-[rgba(79,131,209,0.25)] dark:text-[#D1D5DB]"
                    )}
                >
                    {children}
                </blockquote>
            ),
            code: ({ children }: any) => (
                <code
                    className={cx(
                        "rounded px-1 py-0.5 text-[12px] font-extrabold",
                        "border border-slate-200 bg-white text-slate-950",
                        "dark:border-[#1C3A6B] dark:bg-[#0F1C3F] dark:text-[#E5E7EB]"
                    )}
                >
                    {children}
                </code>
            ),
            pre: ({ children }: any) => (
                <pre
                    className={cx(
                        "my-3 overflow-auto rounded-2xl p-4 text-[12px]",
                        "border border-slate-200 bg-white text-slate-950",
                        "dark:border-[#1C3A6B] dark:bg-[#0F1C3F] dark:text-[#E5E7EB]"
                    )}
                >
                    {children}
                </pre>
            ),
            hr: () => <hr className="my-4 border-slate-200 dark:border-[rgba(79,131,209,0.25)]" />,
        }),
        []
    );

    if (loading) return <BlogLoading />;

    if (error) return <BlogError error={error} onBack={handleBack} />;

    if (!post) return <BlogNotFound />;

    return (
        <main
            className={cx(
                "relative w-full ",
                "dark:white dark:text-[#E5E7EB]"
            )}
        >
            <div className="mx-auto w-full max-w-3xl px-4 py-10">
                <div className="mb-6 flex items-center justify-between gap-3">
                    <button className={SecondaryBtn} onClick={handleBack} type="button">
                        <ArrowLeft className="h-4 w-4 text-slate-400 dark:text-[#4F83D1]" />
                        Retour
                    </button>
                    <button
                        className={PrimaryBtn}
                        onClick={handleShare}
                        type="button"
                        aria-label="Partager l’article"
                        title="Partager"
                    >
                        <Share2 className="h-4 w-4" />
                        {shareLabel}
                    </button>
                </div>

                <section>
                    <header
                        className={cx(
                            "group relative overflow-hidden bg-white",
                            "dark:border-[#1C3A6B] dark:bg-[#0F1C3F]"
                        )}
                    >
                        <div
                            className={cx(
                                "relative h-60 w-full dark:bg-[#0F1C3F]"
                            )}
                        >
                            <Image
                                src={post.illustrationUrl || "/initiatique.png"}
                                alt={post.illustrationUrl ? `Illustration de ${post.title}` : "Illustration"}
                                fill
                                sizes="(max-width: 768px) 100vw, 768px"
                                className={cx("object-contain p-3", "bg-white", "dark:bg-[#0F1C3F]")}
                                style={{ objectPosition: "center" }}
                                priority
                            />

                            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <div
                                    className={cx(
                                        "absolute -left-1/2 top-0 h-full w-1/2 -skew-x-12 translate-x-[-130%] transition-transform duration-700 group-hover:translate-x-[320%]",
                                        "bg-gradient-to-r from-transparent via-white/55 to-transparent",
                                        "dark:via-[#4F83D1]/14"
                                    )}
                                />
                            </div>
                        </div>

                        <div className="p-6">
                            <h1 className="text-balance text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                                {post.title}
                            </h1>

                            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-[#D1D5DB]">
                                <span className="inline-flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-slate-400 dark:text-[#4F83D1]" />
                                    {formatDateFRTiret(post.createdAt)}
                                </span>
                            </div>
                        </div>
                    </header>
                </section>

                <section className='mt-8'                >
                    <article
                        className={cx(
                            "relative overflow-hidden p-6 bg-white",
                            "dark:border-[#1C3A6B] dark:bg-[#162A56]"
                        )}
                    >
                        <div className="relative">
                            <div className="prose max-w-none prose-headings:font-black prose-a:font-extrabold">
                                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={mdComponents}>
                                    {normalizedContent || "—"}
                                </ReactMarkdown>
                            </div>

                            <div className="mt-8 flex justify-center border-t border-slate-200 pt-6 dark:border-[rgba(79,131,209,0.25)]">
                                <button
                                    className={cx(PrimaryBtn, "px-5 py-3")}
                                    onClick={handleShare}
                                    type="button"
                                    aria-label="Partager l’article"
                                    title="Partager"
                                >
                                    <Share2 className="h-4 w-4" />
                                    {shareLabel}
                                </button>
                            </div>
                        </div>
                    </article>
                </section>
                <p className="mt-6 text-center text-xs text-slate-500 dark:text-[#AFC0DE]">
                    Astuce : sur mobile, “Partager” ouvre les options de partage. Sinon, le lien est copié.
                </p>
            </div>
        </main>
    );
}