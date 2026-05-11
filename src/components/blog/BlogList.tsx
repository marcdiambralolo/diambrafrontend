"use client";
import CacheLink from "@/components/commons/CacheLink";
import { formatDateFR, useBlogList } from "@/hooks/blog/useBlogList";
import { BlogArticle } from "@/lib/api/services/blog.service";
import { cx, makeExcerpt } from "@/lib/functions";
import { ArrowLeft, ArrowRight, Calendar, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

export const ui = {
  card:
    "overflow-hidden rounded-3xl border transition-all duration-300 focus:outline-none " +
    "border-slate-200 bg-white shadow-[0_18px_50px_-35px_rgba(2,6,23,0.35)] hover:-translate-y-1 hover:shadow-[0_22px_60px_-40px_rgba(2,6,23,0.45)] " +
    "dark:border-[#1C3A6B] dark:bg-[#162A56] dark:shadow-[0_18px_60px_-45px_rgba(79,131,209,0.22)] dark:hover:shadow-[0_26px_70px_-48px_rgba(79,131,209,0.28)] " +
    "focus-visible:ring-2 focus-visible:ring-[#4F83D1] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#070B1A]",
  btnPrimary:
    "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-extrabold text-white transition duration-200 " +
    "bg-slate-900 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 " +
    "dark:bg-[#2E5AA6] dark:hover:bg-[#4F83D1]",
  page: "relative mx-auto w-full max-w-6xl px-4 py-10 sm:py-14 dark:white dark:text-[#E5E7EB]",
  panel: "bg-white dark:border-[#1C3A6B] dark:bg-[#0F1C3F] dark:shadow-[0_18px_60px_-45px_rgba(79,131,209,0.22)]",
  btnSecondary:
    "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-extrabold transition duration-200 " +
    "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 " +
    "dark:border-[#2E5AA6] dark:bg-[#162A56] dark:text-white dark:hover:brightness-110",
  pageButtonActive:
    "border-slate-900 bg-slate-900 text-white dark:bg-[#2E5AA6] dark:border-[#4F83D1]",
  pageButtonIdle:
    "border-slate-200 bg-white text-slate-900 hover:bg-slate-50 " +
    "dark:border-[#1C3A6B] dark:bg-[#162A56] dark:text-[#E5E7EB] dark:hover:bg-[#1B3568]",
};

const markdownComponents = {
  p: ({ children }: React.PropsWithChildren<object>) => (
    <p className="mb-2 last:mb-0 break-words text-[12px] leading-relaxed text-slate-700 dark:text-[#E5E7EB]">
      {children}
    </p>
  ),
  h1: ({ children }: React.PropsWithChildren<object>) => (
    <h1 className="mb-2 text-[13px] font-black tracking-tight text-slate-900 dark:text-white">
      {children}
    </h1>
  ),
  h2: ({ children }: React.PropsWithChildren<object>) => (
    <h2 className="mb-2 text-[13px] font-extrabold tracking-tight text-slate-900 dark:text-white">
      {children}
    </h2>
  ),
  h3: ({ children }: React.PropsWithChildren<object>) => (
    <h3 className="mb-2 text-[12px] font-extrabold text-slate-900 dark:text-white">
      {children}
    </h3>
  ),
  ul: ({ children }: React.PropsWithChildren<object>) => (
    <ul className="my-2 list-disc pl-5 text-[12px] text-slate-700 dark:text-[#E5E7EB]">
      {children}
    </ul>
  ),
  ol: ({ children }: React.PropsWithChildren<object>) => (
    <ol className="my-2 list-decimal pl-5 text-[12px] text-slate-700 dark:text-[#E5E7EB]">
      {children}
    </ol>
  ),
  li: ({ children }: React.PropsWithChildren<object>) => <li className="my-1">{children}</li>,
  a: ({ href, children }: React.ComponentProps<'a'>) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-2 hover:decoration-slate-900 dark:text-[#4F83D1] dark:decoration-[#4F83D1]/50 dark:hover:decoration-[#4F83D1]"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="my-2 border-l-2 border-slate-200 pl-3 text-[12px] italic text-slate-600 dark:border-[rgba(79,131,209,0.25)] dark:text-[#D1D5DB]">
      {children}
    </blockquote>
  ),
  code: ({ children }: any) => (
    <code className="rounded border border-slate-200 bg-white px-1 py-0.5 text-[11px] font-semibold text-slate-900 dark:border-[#1C3A6B] dark:bg-[#0F1C3F] dark:text-[#E5E7EB]">
      {children}
    </code>
  ),
  pre: ({ children }: any) => (
    <pre className="my-2 overflow-auto rounded-2xl border border-slate-200 bg-white p-3 text-[11px] text-slate-900 dark:border-[#1C3A6B] dark:bg-[#0F1C3F] dark:text-[#E5E7EB]">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-3 border-slate-200 dark:border-[rgba(79,131,209,0.25)]" />,
};

const MarkdownExcerpt = memo(function MarkdownExcerpt({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={markdownComponents}>
      {markdown}
    </ReactMarkdown>
  );
});

function firstLine(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

export const BlogArticleCard = memo(function BlogArticleCard({ post }: { post: BlogArticle }) {
  const title = useMemo(() => firstLine(post?.title || "Article"), [post?.title]);

  const excerpt = useMemo(() => {
    const raw = (post?.content ?? "").replace(/\r\n/g, "\n");
    return makeExcerpt(raw, 250) || "—";
  }, [post?.content]);

  return (
    <article className="group relative h-full">
      <div
        className={cx(
          "rounded-[28px] p-[1px] h-full",
          "bg-[conic-gradient(from_210deg,rgba(15,23,42,0.10),rgba(59,130,246,0.14),rgba(168,85,247,0.12),rgba(15,23,42,0.10))]",
          "dark:bg-[conic-gradient(from_210deg,rgba(79,131,209,0.55),rgba(46,90,166,0.55),rgba(79,131,209,0.30),rgba(79,131,209,0.55))]"
        )}
      >
        <CacheLink
          href={`/star/blog/${post._id}`}
          className={cx(ui.card, "block rounded-[27px] h-full flex flex-col")}
          aria-label={title}
        >
          <div
            className={cx(
              "relative min-h-52 h-52 w-full border-b flex-shrink-0",
              "border-slate-200 bg-slate-50",
              "dark:border-[rgba(79,131,209,0.25)] dark:bg-[#0F1C3F]"
            )}
          >
            {post.illustrationUrl ? (
              <Image
                src={post.illustrationUrl}
                alt={`Illustration de ${title}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className={cx("object-contain p-3", "bg-white", "dark:bg-[#0F1C3F]")}
                style={{ objectPosition: "center" }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400 dark:text-[#D1D5DB]">
                <ImageIcon className="h-8 w-8" />
              </div>
            )}

            <div className="absolute left-4 right-4 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-300/60 to-transparent dark:via-[#4F83D1]/55" />
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

          <div className="flex flex-col flex-1 p-6">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="line-clamp-2 text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  {title}
                </h2>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-slate-600 dark:text-[#D1D5DB]">
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400 dark:text-[#4F83D1]" />
                {post.createdAt ? formatDateFR(post.createdAt) : "—"}
              </span>
            </div>

            <div className="mt-3 line-clamp-3 text-sm leading-relaxed flex-1">
              <MarkdownExcerpt markdown={excerpt} />
            </div>

            <div className="mt-5 flex items-center justify-center">
              <span className={cx(ui.btnPrimary, "pointer-events-none")}>
                Lire l’article
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
        </CacheLink>
      </div>
    </article>
  );
});

export function BlogListError({ error }: { error: string }) {

  return (
    <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-900">
      <div className="font-black">Erreur</div>
      <div className="mt-1 text-sm opacity-90">{error}</div>
    </div>
  );
}

export function BlogListEmpty() {

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-700 shadow-sm">
      Aucun article pour le moment.
    </div>
  );
}

export function BlogListLoading() {

  return (
    <section
      aria-busy="true"
      aria-live="polite"
      className="theme-dark-card relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm sm:p-8"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#4F83D1]/10 blur-3xl" />
        <div className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-[#9BC2FF]/8 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.12] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='.22'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <div className="relative">
        <div className="mx-auto mb-3 h-2 w-32 rounded-full bg-slate-200 overflow-hidden">
          <div className="h-full w-full animate-shimmer bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.65),transparent)]" />
        </div>
        <div className="mx-auto h-2 w-56 rounded-full bg-slate-200 overflow-hidden">
          <div className="h-full w-full animate-shimmer bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.65),transparent)]" />
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm font-extrabold text-slate-800">
          <span>Chargement des articles</span>
          <span className="inline-flex items-center gap-1" aria-hidden="true">
            <span className="h-1.5 w-1.5 animate-dot rounded-full bg-slate-600" />
            <span className="h-1.5 w-1.5 animate-dot rounded-full bg-slate-600 [animation-delay:180ms]" />
            <span className="h-1.5 w-1.5 animate-dot rounded-full bg-slate-600 [animation-delay:360ms]" />
          </span>
        </div>
        <p className="mt-1 text-center text-xs text-slate-600">
          Préparation de la liste, filtrage et pagination…
        </p>
      </div>

      <div className="relative mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer2 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.75),transparent)]"
            />

            <div className="h-36 w-full rounded-2xl bg-slate-100" />
            <div className="mt-4 h-3 w-3/4 rounded-full bg-slate-200" />
            <div className="mt-2 h-3 w-2/3 rounded-full bg-slate-200" />

            <div className="mt-4 flex items-center gap-2">
              <div className="h-6 w-24 rounded-full bg-slate-100" />
              <div className="h-6 w-20 rounded-full bg-slate-100" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-2.5 w-full rounded-full bg-slate-100" />
              <div className="h-2.5 w-11/12 rounded-full bg-slate-100" />
              <div className="h-2.5 w-9/12 rounded-full bg-slate-100" />
            </div>

            <div className="mt-5 h-10 w-full rounded-2xl bg-slate-900/10" />
          </div>
        ))}
      </div>

      <span className="sr-only">Chargement en cours…</span>

      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(120%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.35s ease-in-out infinite;
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
          animation: shimmer2 1.65s ease-in-out infinite;
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
    </section>
  );
}

export default function BlogList() {
  const {
    onNext, onPage, onPrev, hasAccess, userLevel,
    paginatedPosts, totalPages, isLoading, currentPage, error, pages,
  } = useBlogList();

  if (isLoading) return <BlogListLoading />;

  if (!hasAccess) {
    return (
      <main className={ui.page}>
        <div className="max-w-xl mx-auto mt-16 text-center bg-white/80 dark:bg-slate-900/80 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-2 text-[#2E5AA6]">Accès réservé</h2>

          <p className="mb-2 text-lg">Cette page est accessible à partir du <span className="font-bold">niveau 2</span> (Contemplateur).</p>

          <p className="text-sm text-slate-500 dark:text-slate-300">Votre niveau actuel : <span className="font-semibold">{userLevel}</span></p>
        </div>
      </main>
    );
  }

  if (error) return <BlogListError error={error?.message || "Erreur inconnue"} />;

  if (!paginatedPosts?.length) return <BlogListEmpty />;

  return (
    <main className={ui.page}>
      <h1 className="text-balance text-3xl mb-8 text-center font-black tracking-tight sm:text-5xl">
        TESTAMENT DE LA CONNAISSANCE
      </h1>

      <section className="grid w-full grid-cols-1 gap-6 md:grid-cols-2" aria-label="Liste des articles">
        {paginatedPosts.map((post: BlogArticle) => (
          <BlogArticleCard key={post._id} post={post} />
        ))}
      </section>

      <section className="mt-12 flex justify-center">
        <div className={cx(ui.panel, "w-full max-w-2xl p-5 text-center")}>
          <nav className="flex flex-col items-center gap-4" aria-label="Pagination">

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                className={ui.btnSecondary}
                disabled={currentPage === 1}
                onClick={onPrev}
                type="button"
              >
                <ArrowLeft className="h-4 w-4 text-slate-400 dark:text-[#4F83D1]" />
                Précédent
              </button>

              <button
                className={ui.btnPrimary}
                disabled={currentPage === totalPages}
                onClick={onNext}
                type="button"
              >
                Suivant
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {pages.map((p, idx) =>
                p === 0 ? (
                  <span
                    key={`dots-${idx}`}
                    className="px-2 text-sm text-slate-400 dark:text-[#AFC0DE]"
                  >
                    …
                  </span>
                ) : (
                  <button key={p}
                    type="button"
                    onClick={() => onPage(p)}
                    className={cx(
                      "h-10 min-w-10 rounded-2xl border px-3 text-sm font-extrabold transition duration-200",
                      p === currentPage ? ui.pageButtonActive : ui.pageButtonIdle
                    )}
                    aria-current={p === currentPage ? "page" : undefined}
                    aria-label={`Aller à la page ${p}`}
                  >
                    {p}
                  </button>
                )
              )}
            </div>
          </nav>
        </div>
      </section>
    </main>
  );
}