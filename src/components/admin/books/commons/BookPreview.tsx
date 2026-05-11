"use client";
import { useBookPreview } from "@/hooks/admin/books/useBookPreview";
import { cx } from "@/lib/functions";
import type { Book, Offering, OfferingAlternative } from "@/lib/interfaces";
import { Banknote, BookOpen, Eye, EyeOff, FileText, Layers, User } from "lucide-react";
import Image from "next/image";
import React, { memo } from "react";

interface BookPreviewRowsProps {
  author: string;
  pages: string;
  price: string;
}

const Row = memo(function Row({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {

  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/8">
        <Icon className="h-3.5 w-3.5 text-slate-600 dark:text-white/55" />
      </div>

      <div className="min-w-0 flex-1">
        <span className="block text-[10px] uppercase tracking-widest text-slate-400 dark:text-white/35">
          {label}
        </span>
        <span className="block text-[13px] font-semibold text-slate-800 dark:text-white/90">
          {value || <span className="italic text-slate-400 dark:text-white/25">—</span>}
        </span>
      </div>
    </div>
  );
});

Row.displayName = "Row";

const BookPreviewRows = memo(function BookPreviewRows({ author, pages, price }: BookPreviewRowsProps) {

  return (
    <div className="mt-3 grid grid-cols-1 gap-2">
      <Row icon={User} label="Auteur" value={author} />
      {pages ? <Row icon={Layers} label="Pages" value={pages} /> : null}
      {price ? <Row icon={Banknote} label="Prix" value={price} /> : null}
    </div>
  );
});

interface BookPreviewOfferingsProps {
  alternatives: OfferingAlternative[];
}

export function BookPreviewOfferings({ alternatives }: BookPreviewOfferingsProps) {
  if (!alternatives || alternatives.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="mb-3 flex items-center gap-2">
        <Layers className="h-4 w-4 text-cosmic-indigo dark:text-cosmic-pink drop-shadow-glow" />
        <span className="text-xs uppercase tracking-widest font-bold bg-gradient-to-r from-cosmic-purple to-cosmic-indigo bg-clip-text text-transparent dark:from-cosmic-pink dark:to-cosmic-indigo">
          Offrandes sélectionnées
        </span>
      </div>
      <ul className="space-y-4">
        {alternatives.map((alt, idx) => (
          <li
            key={alt.category + idx}
            className="relative rounded-2xl border border-cosmic-indigo/20 dark:border-cosmic-pink/20 bg-white/60 dark:bg-cosmic-indigo/30 bg-clip-padding backdrop-blur-lg shadow-xl transition-transform hover:scale-[1.025] hover:shadow-2xl hover:border-cosmic-purple/40 dark:hover:border-cosmic-pink/40 p-4 flex flex-col gap-2 group overflow-hidden"
          >
            <span className="absolute top-3 right-4 z-10 rounded-full px-3 py-1 text-[10px] font-bold bg-gradient-to-r from-cosmic-purple to-cosmic-indigo text-white shadow-cosmic animate-glow">
              {alt.category}
            </span>
            <div className="flex items-center gap-4">
              <span className="inline-flex w-10 h-10 items-center justify-center rounded-xl bg-gradient-to-br from-cosmic-purple/30 to-cosmic-indigo/30 text-cosmic-indigo dark:bg-cosmic-purple/40 dark:text-cosmic-pink text-2xl shadow-cosmic">
                {alt.icon ? <span>{alt.icon}</span> : <span>{alt.category[0]}</span>}
              </span>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-extrabold text-lg bg-gradient-to-r from-cosmic-indigo to-cosmic-purple bg-clip-text text-transparent dark:from-cosmic-pink dark:to-cosmic-indigo truncate drop-shadow-glow">
                  {alt.name || alt.category}
                </span>
                {alt.description && (
                  <span className="mt-0.5 text-xs text-cosmic-indigo/80 dark:text-cosmic-pink/80 opacity-90 ">
                    {alt.description}
                  </span>
                )}
              </div>
              <span className="ml-2 text-xs font-bold text-cosmic-indigo/80 dark:text-cosmic-pink/80 bg-cosmic-indigo/10 dark:bg-cosmic-pink/10 rounded-lg px-2 py-1">
                x{alt.quantity}
              </span>
              {typeof alt.price === 'number' && (
                <span className="ml-3 font-extrabold mt-6 text-base bg-gradient-to-r from-cosmic-purple to-cosmic-indigo bg-clip-text text-transparent dark:from-cosmic-pink dark:to-cosmic-indigo drop-shadow-glow">
                  {(alt.price * alt.quantity).toLocaleString('fr-FR')} FCFA
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface BookPreviewHeaderProps {
  isActive: boolean;
}

export function BookPreviewHeader({ isActive }: BookPreviewHeaderProps) {

  return (
    <div className="relative flex items-center justify-between gap-3 border-b border-slate-200/60 px-4 py-3 dark:border-white/10">
      <div className="flex items-center gap-2">
        <div className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] text-white shadow-sm shadow-[#2E5AA6]/20">
          <Eye className="h-3.5 w-3.5" />
        </div>

        <span className="text-sm font-bold text-slate-900 dark:text-white">
          Aperçu en direct
        </span>
      </div>

      <span
        className={cx(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold",
          isActive
            ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200"
            : "border-slate-200 bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white/50",
        )}
      >
        {isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
        {isActive ? "Actif" : "Inactif"}
      </span>
    </div>
  );
}

interface BookPreviewDescriptionProps {
  description: string;
}

export function BookPreviewDescription({ description }: BookPreviewDescriptionProps) {

  if (!description) return null;

  return (
    <>
      <div className="h-px bg-slate-200/60 dark:bg-white/10" />
      <div>
        <div className="mb-2 flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-black dark:text-white/30" />
          <span className="text-[10px] uppercase tracking-widest text-black dark:text-white/35">
            Description
          </span>
          <span className="ml-auto text-[10px] tabular-nums text-black dark:text-white/25">
            {description.length} car.
          </span>
        </div>

        <div className="mb-2 h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
          <div
            className={cx(
              "h-full rounded-full transition-[width] duration-300",
              description.length >= 50
                ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                : "bg-gradient-to-r from-amber-400 to-orange-500",
            )}
            style={{ width: `${Math.min(100, Math.round((description.length / 50) * 100))}%` }}
          />
        </div>

        <p className="whitespace-pre-line text-[13px] leading-relaxed text-slate-700 dark:text-white/75">
          {description}
        </p>
      </div>
    </>
  );
}

interface BookPreviewCoverProps {
  src?: string;
  title: string;
}

const BookPreviewCover = memo(function BookPreviewCover({ src, title }: BookPreviewCoverProps) {

  if (src?.trim()) {
    return (
      <div className="relative mx-auto h-44 w-32 shrink-0 overflow-hidden rounded-2xl border border-black/10 shadow-lg dark:border-white/10">
        <Image
          src={src}
          alt={`Couverture : ${title}`}
          fill
          sizes="128px"
          className="object-cover"
          priority={false}
          unoptimized={src.startsWith("blob:") || src.startsWith("data:")}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-44 w-32 shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/80 dark:border-white/15 dark:bg-white/5">

      <BookOpen className="h-8 w-8 text-slate-400 dark:text-white/30" />
      <span className="text-center text-[11px] text-slate-400 dark:text-white/30">
        Pas de<br />couverture
      </span>
    </div>
  );
});


interface BookPreviewProps {
  book: Book;
  offerings?: Offering[];
}

const BookPreview = memo<BookPreviewProps>(function BookPreview({ book, offerings }) {
  const vm = useBookPreview(book, offerings);

  return (
    <section
      aria-label="Prévisualisation du livre"
      className={cx(
        "relative overflow-hidden rounded-3xl border-0 shadow-2xl w-full max-w-xl mx-auto my-0",
        "bg-gradient-to-br from-cosmic-purple/10 via-cosmic-indigo/10 to-cosmic-pink/10 backdrop-blur-xl",
        "shadow-cosmic-indigo/10 flex flex-col items-center justify-center"
      )}
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cosmic-indigo/20 blur-3xl dark:bg-cosmic-purple/20" />
      </div>

      <BookPreviewHeader isActive={vm.isActive} />

      <div className="relative z-10 p-6 sm:p-8 flex flex-col items-center w-full">
        {vm.isEmpty ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/8">
              <span className="inline-block h-6 w-6 bg-slate-400 dark:bg-white/30 rounded-full" />
            </div>

            <p className="max-w-[200px] text-sm text-slate-500 dark:text-white/45">
              Commence à remplir le formulaire pour voir l'aperçu.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5 w-full items-center">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start w-full">
              <BookPreviewCover src={vm.coverImage} title={vm.title} />

              <div className="min-w-0 flex-1 text-center sm:text-left">
                {vm.title ? (
                  <h3 className="line-clamp-3 text-base font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-lg">
                    {vm.title}
                  </h3>
                ) : (
                  <p className="italic text-sm text-slate-400 dark:text-white/30">
                    Sans titre
                  </p>
                )}

                {vm.subtitle ? (
                  <p className="mt-1 line-clamp-2 text-[13px] font-semibold text-indigo-600 dark:text-indigo-300">
                    {vm.subtitle}
                  </p>
                ) : null}
                {vm.category ? (
                  <span className="mt-2 inline-flex rounded-full border border-[#4F83D1]/30 bg-[#EEF4FF] px-2.5 py-0.5 text-[11px] font-bold text-[#2E5AA6] dark:border-[#4F83D1]/20 dark:bg-[#2E5AA6]/10 dark:text-[#9BC2FF]">
                    {vm.category}
                  </span>
                ) : null}
                <BookPreviewRows author={vm.author} pages={vm.pages} price={vm.price} />
              </div>
            </div>

            <BookPreviewDescription description={vm.description} />
            <BookPreviewOfferings alternatives={vm.offeringAlternatives} />
          </div>
        )}
      </div>
    </section>
  );
});

export default BookPreview;