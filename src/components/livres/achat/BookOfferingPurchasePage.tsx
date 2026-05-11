'use client';
import ErrorToast from '@/components/commons/ErrorToast';
import { useBookOfferingPurchasePageAchat } from '@/hooks/livres/useBookOfferingPurchasePageAchat';
import type { Category, useOfferingStepState } from '@/hooks/livres/useOfferingStepState';
import { CATEGORY_CONFIG } from '@/lib/constants';
import { cx } from "@/lib/functions";
import type { Book, OfferingAlternative, WalletOffering } from '@/lib/interfaces';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Circle, Download, Loader2, Package, PartyPopper, Share2, ShoppingBag, Sparkles, Star, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { memo, useMemo, type ReactNode } from "react";

interface OfferingCardProps {
  offering: OfferingAlternative;
  isSelected: boolean;
  availableQuantity: number;
  onSelect: () => void;
  index: number;
  tabIndex?: number;
}

const OfferingCard: React.FC<OfferingCardProps> = memo(({ offering, isSelected, availableQuantity, onSelect, index }) => {
  const isSufficient = availableQuantity >= offering.quantity;
  const config = CATEGORY_CONFIG[offering.category];

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={isSufficient ? onSelect : undefined}
      disabled={!isSufficient}
      className={`
        w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left
        ${isSelected
          ? `border-[#4F83D1]  shadow-md`
          : isSufficient
            ? "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#9BC2FF] active:scale-[0.98]"
            : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-50 cursor-not-allowed"
        }
      `}
    >
      <div className="flex-shrink-0">
        {isSelected ? (
          <CheckCircle2 className="h-5 w-5 text-[#2E5AA6] dark:text-[#9BC2FF]" />
        ) : (
          <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
        )}
      </div>

      <div className={`
        w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 overflow-hidden
        ${isSelected
          ? `bg-gradient-to-br ${config.gradient} text-white shadow-sm`
          : "bg-gray-100 dark:bg-gray-700"
        }
      `}>
        {offering.illustrationUrl ? (
          <Image
            src={offering.illustrationUrl}
            alt={offering.name + ' illustration'}
            width={48}
            height={48}
            className="object-cover w-12 h-12 rounded-xl"
            unoptimized={offering.illustrationUrl.startsWith('blob:') || offering.illustrationUrl.startsWith('data:')}
          />
        ) : (
          <span className="text-gray-300 dark:text-gray-600 text-2xl">🖼️</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
          {offering.name || `${config.label} ${index + 1}`}
        </h4>

        <div className="text-[11px] text-gray-600 dark:text-gray-400">
          <div className="mb-0.5">Offrande(s) Requise(s) :  <strong>{offering.quantity}</strong></div>
          <div className={isSufficient ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
            <strong>{availableQuantity}</strong> disponible(s) dans votre panier d'offrandes
          </div>
        </div>
      </div>
    </motion.button>
  );
});

export function OfferingStepEmptyCategory() {

  return (
    <div className="text-center py-12 px-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
        <Package className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Aucune offrande dans cette catégorie
      </p>
    </div>
  );
}

interface TabButtonProps {
  category: Category;
  isActive: boolean;
  onClick: () => void;
  count: number;
}

const TabButton: React.FC<TabButtonProps> = memo(({ category, isActive, onClick }) => {
  const config = CATEGORY_CONFIG[category];

  return (
    <button
      onClick={onClick}
      className={`
        flex-1 relative py-3 px-4 rounded-xl font-semibold text-sm transition-all
        ${isActive
          ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg`
          : `${config.lightBg} ${config.darkBg} text-gray-700 dark:text-gray-300 hover:opacity-80`
        }
      `}
    >
      <span className="flex items-center justify-center gap-1.5">
        <span className="text-base">{config.icon}</span>
        <span>{config.label}</span>
      </span>
    </button>
  );
});

interface OfferingStepTabsProps {
  activeTab: Category;
  categoryCounts: Record<Category, number>;
  onTabChange: (cat: Category) => void;
}

export function OfferingStepTabs({ activeTab, categoryCounts, onTabChange }: OfferingStepTabsProps) {

  return (
    <div className="flex gap-2">
      {(['animal', 'vegetal', 'beverage'] as Category[]).map(cat => (
        <TabButton
          key={cat}
          category={cat}
          isActive={activeTab === cat}
          onClick={() => onTabChange(cat)}
          count={categoryCounts[cat]}
        />
      ))}
    </div>
  );
}

interface StatusBannerProps {
  hasSelection: boolean;
  isSufficient: boolean;
}

const StatusBanner: React.FC<StatusBannerProps> = memo(({ hasSelection, isSufficient }) => {
  if (!hasSelection) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-2 p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
      >
        <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-yellow-700 dark:text-yellow-300">
          Sélectionnez une alternative disponible pour continuer
        </p>
      </motion.div>
    );
  }

  if (!isSufficient) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
      >
        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-red-700 dark:text-red-300">
          Quantité insuffisante. Rendez-vous au marché des offrandes pour acquérir cette offrande.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-start gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
    >
      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
      <p className="text-xs text-green-700 dark:text-green-300">
        Alternative sélectionnée et disponible. Prêt à continuer !
      </p>
    </motion.div>
  );
});

const OfferingHintBanner = memo(function OfferingHintBanner() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[#4F83D1]/20
        bg-[#2E5AA6]/[0.08] px-4 py-3 backdrop-blur-sm "
    >
      <BookOpen className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#9BC2FF]" />
      <div>
        <p className="text-[13px] font-semibold">
          Cette acquisition nécessite une offrande spirituelle.
        </p>
        <p className="mt-0.5 text-[11.5px] leading-relaxed">
          Sélectionnez une offrande (animale, végétale ou boisson) de votre portefeuille.
        </p>
      </div>
    </div>
  );
});

const BookBanner = memo(function BookBanner({
  book, compact = false,
}: {
  book: Book;
  compact?: boolean;
}) {
  const isBlobLike =
    typeof book.coverImage === "string" &&
    (book.coverImage.startsWith("blob:") || book.coverImage.startsWith("data:"));

  return (
    <div
      className={cx(
        "group relative w-full",
        "transition-transform duration-300 hover:-translate-y-[1px]"
      )}
    >
      <div
        aria-hidden="true"
        className="
          absolute -inset-[1px] rounded-[18px]
         bg-[conic-gradient(from_180deg,rgba(46,90,166,0.22),rgba(79,131,209,0.16),rgba(155,194,255,0.14),rgba(46,90,166,0.22))]
          opacity-70 blur-[0px]
        "
      />

      <div className={cx(
        "relative flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm",
        "transition-shadow duration-300 group-hover:shadow-[0_20px_60px_-40px_rgba(2,6,23,0.35)]",
        compact ? "items-center" : "items-start"
      )}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute -top-20 -right-24 h-56 w-56 rounded-full bg-[#4F83D1]/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div
            className="absolute inset-0 opacity-[0.10] mix-blend-multiply"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='.22'/%3E%3C/svg%3E\")",
            }}
          />
        </div>

        <div
          className={cx(
            "relative z-10 shrink-0 overflow-hidden rounded-xl",
            "border border-slate-200 bg-slate-50",
            compact ? "h-16 w-12" : "h-28 w-20"
          )}
        >
          {book.coverImage ? (
            <>
              <Image
                src={book.coverImage}
                alt={book.title}
                fill
                className="object-cover"
                sizes={compact ? "48px" : "80px"}
                unoptimized={isBlobLike}
              />

              <div
                aria-hidden="true"
                className="
                  pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100
                  bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.55),transparent)]
                "
              />
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <BookOpen className="h-6 w-6 text-slate-400" />
            </div>
          )}
        </div>

        <div className="relative z-10 min-w-0 flex-1">
          <h2
            className={cx(
              "font-black leading-tight text-slate-900",
              compact ? "text-[14px]" : "text-[16px]"
            )}
            title={book.title}
          >
            {book.title}
          </h2>

          {book.subtitle && !compact && (
            <p className="mt-0.5 text-[12px] font-semibold text-slate-700">
              {book.subtitle}
            </p>
          )}

          <p className="mt-1 text-[12px] text-slate-700">
            <span className="text-slate-500">par</span>{" "}
            <span className="font-semibold text-slate-900">{book.author}</span>
          </p>

          {book.category && (
            <span className="
                mt-1.5 inline-flex items-center rounded-full
                border border-slate-200 bg-slate-50
                px-2 py-0.5 text-[10px] font-extrabold text-slate-900
              "
              title={book.category}
            >
              {book.category}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

interface BookOfferingStepProps {
  book: Book;
  state: ReturnType<typeof useOfferingStepState>;
  userOfferings: WalletOffering[];
}

export function BookOfferingStep({ book, state, }: BookOfferingStepProps) {
  const router = useRouter();
  const { handleNext, canProceed } = state;

  const handleGoToMarket = () => {
    const params = new URLSearchParams();
    if (book.id) params.set('bookId', book.id);
    const url = `/star/marcheoffrandes${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(url);
  };

  return (
    <motion.section
      key="offrandes"
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 70 }}
      aria-labelledby="offrande-step-main-title"
    >
      <h2 id="offrande-step-main-title" className="text-xl font-bold text-[#2E5AA6] dark:text-[#9BC2FF] mb-2 text-center">
        Sélection de l'offrande spirituelle
      </h2>
      <BookBanner book={book} />
      <OfferingHintBanner />
      <nav className="sticky top-0 z-40 -mx-1 rounded-2xl bg-slate-900/60 px-1 pb-2 pt-2 backdrop-blur-md" aria-label="Catégories d'offrandes">
        <OfferingStepTabs
          activeTab={state.activeTab}
          categoryCounts={state.categoryCounts}
          onTabChange={state.handleTabChange}
        />
      </nav>
      <StatusBanner
        hasSelection={Boolean(state.selectedOffering)}
        isSufficient={state.canProceed}
      />

      <section aria-label="Liste des alternatives d'offrandes">
        {state.currentOfferings.length === 0 ? (
          <OfferingStepEmptyCategory />
        ) : (
          state.currentOfferings.map((off, i) => (
            <OfferingCard
              key={off.offeringId}
              offering={off}
              index={i}
              isSelected={state.selectedId === off.offeringId}
              availableQuantity={state.walletMap?.get(off.offeringId) ?? 0}
              onSelect={() => state.handleSelect(off.offeringId)}
              tabIndex={0}
              aria-pressed={state.selectedId === off.offeringId}
            />
          ))
        )}
      </section>

      <div className="pb-6 pt-2">
        <div className="mx-auto max-w-2xl">
          <div className="w-full max-w-2xl mx-auto px-4 py-3 space-y-2">
            <div className="flex gap-2">
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className={`flex-1 h-11 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-accent-gold/40 ${canProceed ? "bg-gradient-to-r from-[#163A74] to-[#4F83D1] text-white shadow-lg shadow-[#2E5AA6]/20 hover:brightness-110" : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"}`}
                aria-label="Valider la sélection d'offrande"
              >
                <span>Valider</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleGoToMarket}
              className="w-full h-10 rounded-xl border-2 border-[#9BC2FF] dark:border-[#2E5AA6] bg-[#EEF4FF] dark:bg-[#13274C]/70 text-[#163A74] dark:text-[#DDE7FA] font-semibold text-sm hover:bg-[#DDE7FA] dark:hover:bg-[#163A74]/80 flex items-center justify-center gap-2 transition-all active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-accent-gold/40"
              aria-label="Accéder au marché des offrandes"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Marché des offrandes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export const DM = {
  shell: 'relative',
  page:
    'relative overflow-hidden rounded-[36px] border border-accent-gold/15 bg-[linear-gradient(180deg,rgba(255,250,244,0.92),rgba(247,243,238,0.98))] shadow-[0_24px_80px_rgba(122,92,160,0.10)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(7,17,34,0.96),rgba(4,10,22,0.98))] dark:shadow-[0_30px_120px_rgba(0,0,0,0.46)]',
  panel:
    'relative overflow-hidden rounded-[30px] border border-accent-violet/10 bg-white/70 shadow-[0_14px_44px_rgba(86,57,126,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05] dark:shadow-[0_18px_60px_rgba(0,0,0,0.28)]',
  softPanel:
    'rounded-[24px] border border-accent-violet/10 bg-white/60 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.045]',
  heroFrame:
    'relative overflow-hidden rounded-[34px] border border-accent-gold/15 bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(245,239,232,0.92))] shadow-[0_26px_70px_rgba(121,92,161,0.12)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(7,17,34,0.96),rgba(4,10,22,0.98))] dark:shadow-[0_30px_120px_rgba(0,0,0,0.46)]',
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

export const AmbientFx = memo(function AmbientFx() {
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

export const HeaderIntro = memo(function HeaderIntro({ onBack, }: { onBack: () => void; }) {

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

export const MetaPill = memo(function MetaPill({
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

export const BookCover = memo(function BookCover({
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

export const ReturnToCatalogButton = memo(function ReturnToCatalogButton({
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

export const PagesBadge = memo(function PagesBadge({ pages }: { pages?: number }) {
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

export const BookHero = memo(function BookHero({
  book,
  onStartPurchase,
  onShare,
}: BookHeroProps) {
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

export const SuccessView = memo(function SuccessView({
  book,
  reduce,
}: {
  book: Book;
  reduce: boolean | null;
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 180, damping: 20 }}
      className="relative overflow-hidden rounded-[32px] border border-accent-gold/15 bg-[linear-gradient(180deg,rgba(255,252,247,0.95),rgba(247,243,238,0.98))] px-5 py-8 text-center shadow-[0_24px_80px_rgba(122,92,160,0.12)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(10,22,41,0.96),rgba(6,14,28,0.98))] dark:shadow-[0_24px_90px_rgba(0,0,0,0.42)] sm:px-8 sm:py-10"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-[-10%] h-56 w-56 rounded-full bg-accent-gold/10 blur-3xl dark:bg-cyan-400/12" />
        <div className="absolute right-[-12%] top-[8%] h-64 w-64 rounded-full bg-accent-violet/12 blur-3xl dark:bg-indigo-500/14" />
        <div className="absolute bottom-[-16%] left-[20%] h-72 w-72 rounded-full bg-pastel-emerald/20 blur-3xl dark:bg-emerald-400/10" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,rgba(123,97,255,0.22)_1px,transparent_0)] [background-size:22px_22px] dark:opacity-[0.06]" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#D6A23D_0%,#7B61FF_50%,#9FE3C4_100%)] dark:bg-[linear-gradient(90deg,#8fe9ff_0%,#5fc0ff_36%,#34d399_72%,#f59e0b_100%)]" />

      <div className="relative flex flex-col items-center gap-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-200">
          <PartyPopper className="h-3.5 w-3.5" />
          Opération validée
        </div>

        <div className="relative">
          <motion.div
            initial={reduce ? false : { scale: 0.72, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.12, type: 'spring', stiffness: 260, damping: 16 }}
            className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-[linear-gradient(135deg,#34d399_0%,#10b981_48%,#059669_100%)] shadow-[0_18px_50px_rgba(16,185,129,0.28)]"
          >
            <div className="absolute inset-0 rounded-full bg-emerald-300/20 blur-2xl" />
            <PartyPopper className="relative z-10 h-11 w-11 text-white" />
          </motion.div>

          {!reduce &&
            [0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
              <motion.div
                key={deg}
                className="absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-full"
                style={{
                  x: '-50%',
                  y: '-50%',
                  background:
                    i % 2 === 0
                      ? 'linear-gradient(135deg,#D6A23D,#7B61FF)'
                      : 'linear-gradient(135deg,#9FE3C4,#8FD8FF)',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0.2],
                  opacity: [0, 1, 0],
                  x: `${Math.cos((deg * Math.PI) / 180) * 62 - 5}px`,
                  y: `${Math.sin((deg * Math.PI) / 180) * 62 - 5}px`,
                }}
                transition={{
                  delay: 0.28 + i * 0.04,
                  duration: 0.8,
                  ease: 'easeOut',
                }}
              />
            ))}
        </div>

        <div className="max-w-2xl">
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
          >
            Félicitations !
          </motion.h2>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="mx-auto mt-3 w-full text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base"
          >
            Vous pouvez maintenant télécharger la version numérique de votre livre en format PDF</motion.p>

        </div>
        <div className="rounded-2xl border border-accent-violet/10 bg-white/70 p-4 text-left dark:border-white/8 dark:bg-white/[0.04]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            Livre
          </div>
          <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
            {book.title}
          </div>
          {book.subtitle && (
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
              className="mx-auto mt-2 max-w-lg text-[13px] italic leading-6 text-slate-500 dark:text-slate-400"
            >
              {book.subtitle}
            </motion.p>
          )}
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex w-full max-w-md flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          {book.pdfFileName && (
            <a
              href={book.pdfFileName}
              target="_blank"
              rel="noopener noreferrer"
              className={`${DM.primaryBtn} w-full sm:w-auto justify-center`}
            >
              <Download className="h-4 w-4" />
              Télécharger le PDF
            </a>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
});

export function BooksError({ error }: { error: string }) {
  return (
    <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
      <p className="text-red-700 font-semibold">{error}</p>
      <p className="mt-2 text-sm text-red-500">Veuillez réessayer plus tard.</p>
    </div>
  );
}

export function BooksListLoading() {
  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-700 font-semibold">Chargement des livres...</p>
      </div>
    </div>
  );
}

export const SkeletonCard = memo(function SkeletonCard({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.4, 0.75, 0.4] }}
      transition={{ duration: 1.6, repeat: Infinity, delay: index * 0.1 }}
      className="flex flex-col overflow-hidden rounded-3xl border border-slate-200/60 bg-white/60 shadow-sm dark:border-white/10 dark:bg-white/5"
    >
      <div className="h-56 bg-slate-200/70 dark:bg-white/10" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-3/4 rounded-full bg-slate-200 dark:bg-white/10" />
        <div className="h-3 w-1/2 rounded-full bg-slate-200 dark:bg-white/10" />
        <div className="h-16 rounded-xl bg-slate-100/80 dark:bg-white/5" />
        <div className="h-8 rounded-xl bg-slate-200/60 dark:bg-white/10" />
      </div>
    </motion.div>
  );
});

export const EmptyState = memo(function EmptyState() {
  return (
    <div
      className="col-span-full flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-300/60 bg-white/50 py-20 text-center dark:border-white/10 dark:bg-white/3"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-500/10 dark:to-orange-500/10">
        <BookOpen className="h-8 w-8 text-amber-500/70 dark:text-amber-400/60" />
      </div>

      <div>
        <p className="text-base font-extrabold text-slate-700 dark:text-white/70">
          Aucun livre disponible
        </p>
        <p className="mt-1 text-[12px] text-slate-400 dark:text-white/30">
          La bibliothèque est vide pour le moment. Revenez bientôt !
        </p>
      </div>
    </div>
  );
});

export const BookNotFound = ({ error, onBack }: { error?: string; onBack: () => void }) => (
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
    clearError, goToCatalog, goToLivre, state, book, userOfferings,
    loading, step, purchaseError, showError, userOfferingsLoading,

  } = useBookOfferingPurchasePageAchat(bookId);

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
      <HeaderIntro onBack={goToLivre} />

      <section className="space-y-5" aria-labelledby="offrande-step-title">
        {userOfferingsLoading ? (
          <div className={`${DM.page} p-8 text-center`}>
            <AmbientFx />

            <div className="relative">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-accent-violet/15 bg-accent-violet/10 text-accent-violet dark:border-cyan-300/20 dark:bg-cyan-400/10 dark:text-cyan-200">
                <Sparkles className="h-6 w-6 animate-pulse" />
              </div>

              <h2 id="offrande-step-title" className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                Préparation de votre parcours d’offrande…
              </h2>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-7 text-slate-600 dark:text-slate-300">
                Nous rassemblons les éléments nécessaires pour finaliser l’acquisition du livre.
              </p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto flex w-full max-w-4xl flex-col items-center gap-5"
          >
            {step === 'offrandes' && <BookOfferingStep book={book} state={state} userOfferings={userOfferings} />}
            {step === 'succes' && (
              <div className="w-full" key="succes">
                <SuccessView book={book} reduce={false} />
              </div>
            )}
            <div className="flex justify-center w-full">
              <ReturnToCatalogButton onClick={goToCatalog} />
            </div>
          </motion.div>
        )}
      </section>

      <AnimatePresence>
        {showError && purchaseError && (
          <ErrorToast message={purchaseError} onClose={clearError} />
        )}
      </AnimatePresence>
    </motion.section>
  );
}

export default memo(BookOfferingPurchasePage);