'use client';
import { useBookOfferingPurchasePage } from '@/hooks/livres/useBookOfferingPurchasePage';
import type { Book } from '@/lib/interfaces';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, ChevronLeft, Loader2, Share2, Sparkles, Star, XCircle } from 'lucide-react';
import Image from 'next/image';
import { memo, useMemo, type ReactNode } from "react";

const DM = {
  shell: 'relative',
  page:
    'relative overflow-hidden rounded-[36px] border border-accent-gold/15 bg-[linear-gradient(180deg,rgba(255,250,244,0.92),rgba(247,243,238,0.98))] shadow-[0_24px_80px_rgba(122,92,160,0.10)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(7,17,34,0.96),rgba(4,10,22,0.98))] dark:shadow-[0_30px_120px_rgba(0,0,0,0.46)]',
  panel:
    'relative overflow-hidden rounded-[30px] border border-accent-violet/10 bg-white/70 shadow-[0_14px_44px_rgba(86,57,126,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05] dark:shadow-[0_18px_60px_rgba(0,0,0,0.28)]',
  softPanel:
    'rounded-[24px] border border-accent-violet/10 bg-white/60 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.045]',
  heroFrame:
    'relative overflow-hidden   dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(7,17,34,0.96),rgba(4,10,22,0.98))] dark:shadow-[0_30px_120px_rgba(0,0,0,0.46)]',
  badge:
    'inline-flex items-center gap-2 rounded-full border border-accent-gold/30 bg-accent-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-gold',
  subtleBadge:
    'inline-flex items-center gap-2 rounded-full border border-accent-violet/20 bg-accent-violet/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-violet',
  title:
    'tracking-tight text-slate-900 dark:text-[color:var(--accent-gold)]',
  text:
    'text-[color:var(--text-light)] dark:text-[color:var(--text-dark)]',
  textSoft:
    'text-slate-600 dark:text-slate-300',
  textMuted:
    'text-slate-500 dark:text-slate-400',
  primaryBtn:
    'inline-flex items-center justify-center gap-2 rounded-2xl border border-orange-400/40 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 px-5 py-3 text-[13px] font-extrabold text-white shadow-[0_14px_36px_rgba(255,140,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(255,140,0,0.28)]',
  secondaryBtn:
    'inline-flex items-center justify-center gap-2 rounded-2xl border border-accent-gold/20 bg-gradient-to-r from-white via-pastel-emerald/40 to-white px-5 py-3 text-[13px] font-semibold text-accent-violet transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-gold/40 hover:from-pastel-emerald/40 hover:to-pastel-rose/30 dark:from-white/[0.06] dark:via-pastel-emerald/10 dark:to-white/[0.04] dark:text-accent-gold',
  ghostBtn:
    'inline-flex items-center justify-center gap-2 rounded-2xl border border-black/60 bg-black px-5 py-3 text-[13px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-black hover:bg-neutral-900',
  iconWrap:
    'inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-accent-violet/15 bg-white/65 text-accent-violet shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.06] dark:text-white',
};

const AmbientFx = memo(function AmbientFx() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-[-10%] top-[-12%] h-72 w-72 rounded-full bg-accent-gold/10 blur-3xl dark:bg-[color:var(--accent-gold)]/10" />
      <div className="absolute right-[-10%] top-[8%] h-80 w-80 rounded-full bg-accent-violet/12 blur-3xl dark:bg-[color:var(--accent-violet)]/12" />
      <div className="absolute bottom-[-18%] left-[18%] h-80 w-80 rounded-full bg-pastel-emerald/20 blur-3xl dark:bg-[color:var(--pastel-emerald)]/8" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,rgba(214,162,61,0.55)_1px,transparent_0)] [background-size:22px_22px] dark:opacity-[0.06]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-violet/30 to-transparent" />
    </div>
  );
});

const HeaderIntro = memo(function HeaderIntro({ onBack, }: { onBack: () => void; }) {

  return (
    <motion.header
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 flex items-center gap-3"
    >
      <button
        onClick={onBack}
        aria-label="Retour au catalogue"
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-accent-violet/15 bg-white/75 text-accent-violet shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-gold/30 hover:bg-white active:scale-95 dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/[0.10]"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div>
        <h1 className="flex items-center gap-2 text-lg font-black tracking-tight text-slate-900 dark:text-white sm:text-xl">
          Acquérir le livre
          <Sparkles className="h-4 w-4 text-accent-gold" />
        </h1>
        <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
          avec offrande
        </p>
      </div>
    </motion.header>
  );
});

const MetaPill = memo(function MetaPill({
  children,
  tone = 'default',
}: {
  children: ReactNode;
  tone?: 'default' | 'gold' | 'emerald';
}) {
  const toneClass =
    tone === 'gold'
      ? 'border-accent-gold/25 bg-accent-gold/10 text-accent-gold'
      : tone === 'emerald'
        ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-700 dark:text-emerald-200'
        : 'border-accent-violet/12 bg-white/70 text-slate-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200';

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] ${toneClass}`}
    >
      {children}
    </span>
  );
});

const BookCover = memo(function BookCover({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  return (
    <div className="relative mx-auto aspect-[3/4] w-full max-w-[340px] overflow-hidden rounded-[22px] border border-accent-violet/10 bg-white/80 dark:border-white/10 dark:bg-slate-950/60">
      <Image
        src={src}
        alt={`Couverture de ${title}`}
        fill
        sizes="(max-width: 640px) 100vw, 40vw"
        className="object-contain p-2 transition-transform duration-500 hover:scale-[1.03]"
      />
    </div>
  );
});

const PagesBadge = memo(function PagesBadge({ pages }: { pages?: number }) {
  if (!pages) return null;

  return (
    <div className="absolute right-3 top-3 z-10 rounded-full border border-accent-violet/20 bg-white/80 px-3 py-1 text-xs font-bold text-accent-violet shadow-lg backdrop-blur-md dark:border-cyan-300/20 dark:bg-slate-950/60 dark:text-cyan-100">
      {pages} pages
    </div>
  );
});

interface BookHeroProps {
  book: Book;
  onStartPurchase: () => void;
  onShare: () => void;
}

const BookHero = memo(function BookHero({ book, onStartPurchase, onShare, }: BookHeroProps) {
  const coverSrc = book?.coverImage || '/initiatique.png';
  const title = String(book?.title ?? 'Livre');
  const author = String(book?.author ?? 'Auteur');
  const description = String(book?.description ?? '');
  const category = String(book?.category ?? '');
  const subtitle = String(book?.subtitle ?? '');

  const ratingStars = useMemo(() => {
    if (!book?.rating || book.rating <= 0) return null;
    return '★'.repeat(Math.min(5, Math.round(book.rating)));
  }, [book?.rating]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={`${DM.heroFrame} p-5 sm:p-7`}
    >
      <AmbientFx />
      <PagesBadge pages={book?.pages} />

      <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-[minmax(280px,380px)_1fr]">
        <BookCover src={coverSrc} title={title} />

        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2">
            {category && <MetaPill>{category}</MetaPill>}

            {typeof book?.rating === 'number' && book.rating > 0 && (
              <MetaPill tone="gold">
                <Star className="h-3.5 w-3.5 fill-current" />
                {ratingStars}
              </MetaPill>
            )}
          </div>

          <h1 className={`mt-4 text-balance text-3xl font-black sm:text-4xl ${DM.title}`}>
            {title}
          </h1>
          <div className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
            par <span className="font-bold text-slate-900 dark:text-white">{author}</span>
          </div>

          {subtitle && (
            <p className="mt-3 text-sm italic text-accent-violet/85 dark:text-cyan-100/85">
              {subtitle}
            </p>
          )}

          <div className="mt-6">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Description
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-200 sm:text-[15px]">
              {description || 'Aucune description disponible.'}
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onStartPurchase}
              className={DM.primaryBtn}
              aria-label="Lancer l’achat"
              title="ACQUÉRIR CE LIVRE"
            >
              <CheckCircle2 className="h-4 w-4" />
              ACQUÉRIR CE LIVRE
            </button>

            <button
              type="button"
              onClick={onShare}
              className={DM.ghostBtn}
              aria-label="Partager ce livre"
            >
              <Share2 className="h-4 w-4" />
              Partager
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
});

const ReturnToCatalogButton = memo(function ReturnToCatalogButton({
  onClick, }: { onClick: () => void; }) {

  return (
    <button
      type="button"
      onClick={onClick}
      className={DM.secondaryBtn}
      aria-label="Retour au catalogue"
    >
      <ChevronLeft className="h-4 w-4" />
      Retour au catalogue
    </button>
  );
});

export const InlineNotice = memo(function InlineNotice({
  message,
  tone = 'info',
}: {
  message: string;
  tone?: 'info' | 'success';
}) {
  const toneClass =
    tone === 'success'
      ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-700 dark:text-emerald-100'
      : 'border-accent-violet/20 bg-accent-violet/10 text-accent-violet dark:border-cyan-300/20 dark:bg-cyan-400/10 dark:text-cyan-100';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      className={`rounded-2xl border px-4 py-3 text-sm font-medium backdrop-blur-md ${toneClass}`}
    >
      {message}
    </motion.div>
  );
});

const BooksListLoading = () => {
  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-700 font-semibold">Chargement des livres...</p>
      </div>
    </div>
  );
}

const BookNotFound = ({ error, onBack }: { error?: string; onBack: () => void }) => (
  <div className="min-h-screen bg-gradient-to-br from-[#070B1A] via-[#0F1C3F] to-[#162A56] flex items-center justify-center p-4">
    <div className="text-center">
      <XCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />

      <p className="text-white font-bold">{error ?? 'Livre introuvable.'}</p>
      <button
        onClick={onBack}
        className="mt-4 px-5 py-2 rounded-xl bg-white/10 text-white text-[13px] hover:bg-white/20 transition-colors"
      >
        Retour au catalogue
      </button>
    </div>
  </div>
);

interface Props {
  bookId: string;
}

function BookOfferingPurchasePage({ bookId }: Props) {
  const {
    book, loading, shareMessage, goToCatalog, startPurchase, handleShare,
  } = useBookOfferingPurchasePage(bookId);

  if (loading) return <BooksListLoading />;

  if (!book) {
    return <BookNotFound error="Livre introuvable" onBack={goToCatalog} />;
  }

  return (
    <motion.section
      className="mx-auto w-full mt-8 max-w-4xl px-4 py-4 sm:py-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, type: 'spring', stiffness: 60 }}
      aria-label="Gestion des offrandes pour l'acquisition du livre"
    >
      <HeaderIntro onBack={goToCatalog} />

      <div className="mb-4">
        <AnimatePresence>
          {shareMessage && (
            <InlineNotice
              message={shareMessage}
              tone={shareMessage.includes('succès') ? 'success' : 'info'}
            />
          )}
        </AnimatePresence>
      </div>

      <section className="space-y-4" aria-labelledby="offrande-hero-title">
        <BookHero
          book={book}
          onStartPurchase={startPurchase}
          onShare={handleShare}
        />

        <div className="flex justify-center">
          <ReturnToCatalogButton onClick={goToCatalog} />
        </div>

      </section>
    </motion.section>
  );
}

export default memo(BookOfferingPurchasePage);