"use client";
import { normalizeKey, SYMBOL_ENTRIES_SORTED } from "@/lib/constants";
import { cx } from "@/lib/functions";
import { useAuthStore } from "@/lib/store/auth.store";
import { BookOpen, Star } from "lucide-react";
import React, { memo, useMemo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  markdown?: string | null;
};

function getSymbolPrefixForLine(line: string): string | null {
  const s = line.trim();
  if (!s) return null;

  const lowered = normalizeKey(s);

  for (let i = 0; i < SYMBOL_ENTRIES_SORTED.length; i++) {
    const [kNorm, sym] = SYMBOL_ENTRIES_SORTED[i];
    if (lowered.startsWith(kNorm)) return sym;
  }
  return null;
}

const splitLinesPreserve = (text: string) => text.split(/\r?\n/);

function enhanceMarkdownWithSymbols(md: string): string {
  const lines = splitLinesPreserve(md);
  let inCodeBlock = false;

  const out = lines.map((line) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      return line;
    }
    if (inCodeBlock) return line;

    const m = /^(\s*[-*•]\s+)(.+)$/.exec(line);
    if (m) {
      const [, bullet, contentRaw] = m;
      const content = contentRaw.trimStart();
      const sym = getSymbolPrefixForLine(content);
      if (!sym) return line;
      if (content.startsWith(sym)) return line;

      return `${bullet}${sym} ${content}`;
    }

    if (
      trimmed &&
      !trimmed.startsWith("#") &&
      !trimmed.startsWith(">") &&
      !trimmed.startsWith("|")
    ) {
      const sym = getSymbolPrefixForLine(trimmed);
      if (!sym) return line;
      if (trimmed.startsWith(sym)) return line;

      const indent = line.match(/^\s*/)?.[0] ?? "";
      return `${indent}${sym} ${trimmed}`;
    }

    return line;
  });

  return out.join("\n");
}

const markdownComponents: Components = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      {...props}
      className={cx(
        "mt-10 mb-4 scroll-mt-24",
        "text-base sm:text-lg font-semibold tracking-tight",
        "text-slate-900 dark:text-white",
        "flex items-center justify-center gap-2 text-center"
      )}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      {...props}
      className={cx(
        "mt-8 mb-3 scroll-mt-24",
        "text-sm sm:text-base font-semibold",
        "text-slate-900 dark:text-white/95",
        "text-center"
      )}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      {...props}
      className={cx(
        "my-3 leading-relaxed",
        "text-[14px] sm:text-sm",
        "text-slate-700 dark:text-slate-200/90",
        "text-left sm:text-justify",
        "[text-wrap:pretty] hyphens-auto"
      )}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      {...props}
      className={cx(
        "my-4 space-y-2",
        "mx-auto max-w-[62ch]",
        "pl-5 sm:pl-6",
        "list-disc marker:text-slate-400 dark:marker:text-white/30"
      )}
    />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li
      {...props}
      className={cx(
        "text-[14px] sm:text-sm leading-relaxed",
        "text-slate-700 dark:text-slate-200/90",
        "text-left",
        "[&>p]:my-2 [&>p]:text-left [&>p]:sm:text-justify"
      )}
    />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong {...props} className="font-semibold text-slate-900 dark:text-white" />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      {...props}
      className={cx(
        "rounded-md px-1.5 py-0.5",
        "bg-black/5 dark:bg-white/10",
        "text-[13px] font-mono",
        "text-slate-800 dark:text-slate-100"
      )}
    />
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr {...props} className="my-8 border-slate-200/60 dark:border-white/10" />
  ),
};

export const AspectsMarkdown = memo(function AspectsMarkdown({
  markdown
}: Props) {
  const aspectsTexte = useAuthStore((state) => state.user?.aspectsTexte);
  const safeMarkdown = String(aspectsTexte ?? markdown ?? "");

  const enhanced = useMemo(() => {
    const src = safeMarkdown.trim();
    if (!src) return "";
    return enhanceMarkdownWithSymbols(src);
  }, [safeMarkdown]);

  return (
    <div className="w-full mx-auto max-w-5xl  dark:border-white/10 dark:bg-white/5 dark:shadow-black/30">
      <div className="px-4 py-4 dark:border-white/10 dark:from-white/[0.07] dark:to-transparent sm:px-6">
        <div className="flex items-center justify-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-black/5 dark:bg-white/10">
            <Star className="h-4 w-4 text-[#2E5AA6] dark:text-[#9BC2FF]" />
          </span>

          <div className="text-center">
            <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
              La carte du ciel au moment de ma naissance
            </h2>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 sm:px-6 sm:py-6">
        {!enhanced ? (
          <div className="py-10 flex flex-col items-center justify-center text-center">
            <div className="h-10 w-10 rounded-2xl bg-black/5 dark:bg-white/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-slate-700 dark:text-slate-200" />
            </div>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300/80">
              Aucun contenu de carte du ciel à afficher.
            </p>
          </div>
        ) : (
          <div
            className={cx(
              "prose prose-slate dark:prose-invert",
              "max-w-none",
              "prose-p:my-3 prose-ul:my-4",
              "prose-h2:mt-10 prose-h3:mt-8",
              "prose-hr:my-8"
            )}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {enhanced}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
});


export default function CarteDuCielPageClient() {

  return (
    <main className="relative mx-auto flex w-full max-w-4xl flex-col items-center  sm:px-6 sm:py-10">
      <div className="mb-4 w-full max-w-4xl">
        <h1 className="mt-3 text-center text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Ma carte du ciel
        </h1>
      </div>

      <div className="w-full">
        <AspectsMarkdown />
      </div>
    </main>
  );
}