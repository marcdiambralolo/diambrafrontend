"use client";
import { cx } from "@/lib/functions";
import React, { memo, useMemo } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = { markdown: string };

const MARKDOWN_COMPONENTS: Components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      {...props}
      className={cx(
        "mt-1 mb-6",
        "text-xl sm:text-2xl font-extrabold tracking-tight",
        "text-slate-900 dark:text-white text-center"
      )}
    />
  ),

  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      {...props}
      className={cx(
        "mt-10 mb-4",
        "text-base sm:text-lg font-bold tracking-tight",
        "text-slate-900 dark:text-white text-center"
      )}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      {...props}
      className={cx(
        "mt-8 mb-3",
        "text-sm sm:text-base font-semibold tracking-tight",
        "text-slate-900 dark:text-white/95 text-center"
      )}
    />
  ),

  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      {...props}
      lang="fr"
      className={cx(
        "my-4 leading-relaxed",
        "text-[14px] sm:text-[15px]",
        "text-slate-700 dark:text-slate-200/90",
        "text-left sm:text-justify",
        "[text-wrap:pretty]",
        "hyphens-auto"
      )}
    />
  ),
  hr: () => (
    <div className="my-10 flex items-center justify-center" aria-hidden="true">
      <div className="h-px w-full max-w-md bg-gradient-to-r from-transparent via-slate-300/70 to-transparent dark:via-white/15" />
    </div>
  ),

  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      {...props}
      className={cx(
        "my-4",
        "pl-5 sm:pl-6",
        "space-y-2",
        "list-disc",
        "marker:text-slate-400 dark:marker:text-white/30",
        "text-left"
      )}
    />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      {...props}
      className={cx(
        "my-4",
        "pl-5 sm:pl-6",
        "space-y-2",
        "list-decimal",
        "marker:text-slate-400 dark:marker:text-white/30",
        "text-left"
      )}
    />
  ),

  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li
      {...props}
      className={cx(
        "text-[14px] sm:text-[15px] leading-relaxed",
        "text-slate-700 dark:text-slate-200/90",
        "text-left",
        "[&>p]:my-2",
        "[&>p]:text-left",
        "[&>p]:sm:text-left"
      )}
    />
  ),

  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      {...props}
      className={cx(
        "my-6",
        "border-l-2 border-slate-200 dark:border-white/10",
        "pl-4",
        "text-slate-700 dark:text-slate-200/90",
        "bg-black/[0.02] dark:bg-white/[0.04]",
        "rounded-r-xl"
      )}
    />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong {...props} className="font-semibold text-slate-900 dark:text-white" />
  ),
  em: (props: React.HTMLAttributes<HTMLElement>) => (
    <em {...props} className="text-slate-800 dark:text-slate-100" />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      {...props}
      className={cx(
        "rounded-md px-1.5 py-0.5 bg-black/5 dark:bg-white/10",
        "text-[12px] font-mono",
        "text-slate-800 dark:text-slate-100"
      )}
    />
  ),
} as const;

const MarkdownCard = memo(function MarkdownCard({ markdown }: Props) {

  const safeMarkdown = useMemo(
    () => (typeof markdown === "string" ? markdown.trim() : ""),
    [markdown]
  );

  return (
    <div
      className={cx(
        "mx-auto w-full max-w-4xl",
        "rounded-2xl border shadow-sm",
        "bg-white/80 dark:bg-slate-950/60",
        "border-slate-200/70 dark:border-white/10",
        "backdrop-blur-xl",
        "px-4 sm:px-6 py-5"
      )}
    >
      <article
        className={cx(
          "prose prose-slate dark:prose-invert max-w-none",
          "prose-p:my-0 prose-ul:my-0 prose-ol:my-0 prose-li:my-0 prose-hr:my-0",
          "prose-h1:my-0 prose-h2:my-0 prose-h3:my-0",
          "prose-strong:font-semibold"
        )}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={MARKDOWN_COMPONENTS}>
          {safeMarkdown || "Analyse indisponible pour le moment."}
        </ReactMarkdown>
      </article>
    </div>
  );
});

MarkdownCard.displayName = "MarkdownCard";

export default MarkdownCard;