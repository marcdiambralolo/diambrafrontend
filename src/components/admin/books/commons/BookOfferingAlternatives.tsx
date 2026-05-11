"use client";
import { cx } from "@/lib/functions";
import { Offering, OfferingAlternative } from "@/lib/interfaces";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  Bird,
  Droplets,
  Info,
  LayoutGrid,
  Leaf,
  Minus,
  PackagePlus,
  Plus,
  RefreshCcw,
  X
} from "lucide-react";
import { memo, useCallback, useMemo, useReducer, } from "react";

import Image from 'next/image';

function isUrl(s: string): boolean {
  return s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/");
}

const OfferingIcon = memo(function OfferingIcon({ icon, name, size = "md", }: {
  icon: string;
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeMap = {
    sm: "h-6 w-6 text-base",
    md: "h-8 w-8 text-xl",
    lg: "h-10 w-10 text-2xl",
  };
  const imageSizeMap = {
    sm: 24,
    md: 32,
    lg: 40,
  };

  if (icon && isUrl(icon)) {
    return (
      <div className={cx("relative overflow-hidden rounded-lg", sizeMap[size])}>
        <Image
          src={icon}
          alt={name}
          width={imageSizeMap[size]}
          height={imageSizeMap[size]}
          className="h-full w-full object-cover"
          sizes={`${imageSizeMap[size]}px`}
        />
      </div>
    );
  }
  return null;
});

export type OfferingCategory = "animal" | "vegetal" | "beverage";

export interface OfferingItem {
  _id: string;
  name: string;
  price: number;
  priceUSD: number;
  category: OfferingCategory;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  illustrationUrl?: string;
}

interface BookOfferingAlternativesProps {
  value?: OfferingAlternative[];
  onChange?: (alternatives: OfferingAlternative[]) => void;
  disabled?: boolean;
  error?: string | null;
  offerings: Offering[];
}

type CategoryFilter = OfferingCategory | "all";

const CATEGORIES = [
  {
    key: "all" as CategoryFilter,
    label: "Tout",
    Icon: LayoutGrid,
    color: "text-slate-600 dark:text-white/60",
    bg: "border-slate-200/70 bg-white/60 dark:border-white/10 dark:bg-white/5",
    activeBg: "border-slate-400/60 bg-slate-100 dark:border-white/20 dark:bg-white/10",
    activeText: "text-slate-900 dark:text-white",
    chipBorder: "border-slate-200/70 dark:border-white/10",
    dot: "bg-slate-400",
  },
  {
    key: "animal" as CategoryFilter,
    label: "Animal",
    Icon: Bird,
    color: "text-amber-600 dark:text-amber-400",
    bg: "border-amber-200/60 bg-amber-50/60 dark:border-amber-400/15 dark:bg-amber-500/5",
    activeBg: "border-amber-400/80 bg-amber-100/80 dark:border-amber-400/40 dark:bg-amber-500/15",
    activeText: "text-amber-800 dark:text-amber-300",
    chipBorder: "border-amber-200/60 dark:border-amber-400/20",
    dot: "bg-amber-500",
  },
  {
    key: "vegetal" as CategoryFilter,
    label: "Végétal",
    Icon: Leaf,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "border-emerald-200/60 bg-emerald-50/60 dark:border-emerald-400/15 dark:bg-emerald-500/5",
    activeBg: "border-emerald-400/80 bg-emerald-100/80 dark:border-emerald-400/40 dark:bg-emerald-500/15",
    activeText: "text-emerald-800 dark:text-emerald-300",
    chipBorder: "border-emerald-200/60 dark:border-emerald-400/20",
    dot: "bg-emerald-500",
  },
  {
    key: "beverage" as CategoryFilter,
    label: "Boisson",
    Icon: Droplets,
    color: "text-sky-600 dark:text-sky-400",
    bg: "border-sky-200/60 bg-sky-50/60 dark:border-sky-400/15 dark:bg-sky-500/5",
    activeBg: "border-sky-400/80 bg-sky-100/80 dark:border-sky-400/40 dark:bg-sky-500/15",
    activeText: "text-sky-800 dark:text-sky-300",
    chipBorder: "border-sky-200/60 dark:border-sky-400/20",
    dot: "bg-sky-500",
  },
] as const;

type CategoryMeta = (typeof CATEGORIES)[number];
const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c])
) as Record<CategoryFilter, CategoryMeta>;


function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

type State = { filter: CategoryFilter };
type Action = { type: "SET_FILTER"; filter: CategoryFilter };

function reducer(state: State, action: Action): State {
  if (action.type === "SET_FILTER" && state.filter !== action.filter) {
    return { filter: action.filter };
  }
  return state;
}

const AlternativeChip = memo(function AlternativeChip({
  alt,
  offering,
  onRemove,
  onChangeQty,
  disabled,
  reduce,
}: {
  alt: OfferingAlternative;
  offering: OfferingItem | undefined;
  onRemove: (id: string) => void;
  onChangeQty: (id: string, qty: number) => void;
  disabled?: boolean;
  reduce: boolean;
}) {
  const meta = CATEGORY_MAP[alt.category];

  return (
    <motion.div
      layout
      initial={reduce ? undefined : { opacity: 0, scale: 0.85, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, scale: 0.82, y: -4 }}
      transition={{ type: "spring", stiffness: 480, damping: 32 }}
      className={cx(
        "flex items-center gap-2 rounded-2xl border px-2.5 py-2",
        "bg-white/80 shadow-sm backdrop-blur dark:bg-white/5",
        meta.chipBorder
      )}
    >
      {/* Icône */}
      {offering ? (
        <OfferingIcon icon={offering.illustrationUrl!} name={offering.name} size="sm" />
      ) : (
        <PackagePlus className="h-4 w-4 text-slate-400" />
      )}

      {/* Nom + prix */}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className={cx("truncate text-[11px] font-bold leading-tight", meta.activeText)}>
          {offering?.name ?? alt.offeringId}
        </span>
      </div>

      {/* Stepper quantité */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          disabled={disabled || alt.quantity <= 1}
          onClick={() => onChangeQty(alt.offeringId, alt.quantity - 1)}
          className="flex h-5 w-5 items-center justify-center rounded-lg border border-slate-200/70 bg-white/80 text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-white/60"
          aria-label="Diminuer la quantité"
        >
          <Minus className="h-2.5 w-2.5" />
        </button>
        <span className="min-w-[18px] text-center text-[12px] font-extrabold tabular-nums text-slate-900 dark:text-white">
          {alt.quantity}
        </span>
        <button
          type="button"
          disabled={disabled || alt.quantity >= 99}
          onClick={() => onChangeQty(alt.offeringId, alt.quantity + 1)}
          className="flex h-5 w-5 items-center justify-center rounded-lg border border-slate-200/70 bg-white/80 text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-white/60"
          aria-label="Augmenter la quantité"
        >
          <Plus className="h-2.5 w-2.5" />
        </button>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onRemove(alt.offeringId)}
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
        aria-label={`Retirer ${offering?.name ?? alt.offeringId}`}
      >
        <X className="h-3 w-3" />
      </button>
    </motion.div>
  );
});


const OfferingCard = memo(function OfferingCard({
  item,
  selected,
  willReplace,   // ← une autre carte de la même catégorie est déjà sélectionnée
  onToggle,
  disabled,
  reduce,
  index,
}: {
  item: OfferingItem;
  selected: boolean;
  willReplace: boolean;
  onToggle: (item: OfferingItem) => void;
  disabled?: boolean;
  reduce: boolean;
  index: number;
}) {
  const meta = CATEGORY_MAP[item.category];

  return (
    <motion.button
      type="button"
      layout
      initial={reduce ? undefined : { opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.04, type: "spring", stiffness: 440, damping: 34 }}
      whileHover={reduce || disabled ? undefined : { y: -2, scale: 1.02 }}
      whileTap={reduce || disabled ? undefined : { scale: 0.97 }}
      onClick={() => onToggle(item)}
      disabled={disabled}
      aria-pressed={selected}
      title={
        selected
          ? "Cliquer pour désélectionner"
          : willReplace
            ? "Remplacera la sélection actuelle de cette catégorie"
            : "Sélectionner cette offrande"
      }
      className={cx(
        "relative flex flex-col gap-2 overflow-hidden rounded-2xl border p-3 text-left",
        "transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F83D1]/50 dark:focus-visible:ring-[#2E5AA6]/40",
        disabled && "cursor-not-allowed opacity-50",
        selected
          ? cx(meta.activeBg, meta.activeText, "shadow-md ring-1 ring-inset ring-current/20")
          : willReplace
            ? cx(
              meta.bg,
              "opacity-60 hover:opacity-90",
              "text-slate-700 dark:text-white/70"
            )
            : cx(meta.bg, "hover:shadow-md", "text-slate-700 dark:text-white/70")
      )}
    >
      {/* Badge ✓ sélectionné */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={reduce ? undefined : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={reduce ? undefined : { scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 600, damping: 30 }}
            className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 shadow-sm"
            aria-hidden
          >
            <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badge 🔄 "Remplacer" quand une autre est déjà sélectionnée dans la même catégorie */}
      <AnimatePresence>
        {willReplace && !selected && (
          <motion.div
            initial={reduce ? undefined : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={reduce ? undefined : { scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            className="absolute right-2 top-2 flex items-center gap-0.5 rounded-full border border-orange-300/60 bg-orange-50 px-1.5 py-0.5 dark:border-orange-400/20 dark:bg-orange-500/10"
            aria-hidden
          >
            <RefreshCcw className="h-2.5 w-2.5 text-orange-500 dark:text-orange-400" />
            <span className="text-[9px] font-bold text-orange-600 dark:text-orange-400">
              Remplacer
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ligne 1 : icône + catégorie */}
      <div className="flex items-center gap-2">
        <div className={cx(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          selected ? "bg-white/40 dark:bg-white/10" : "bg-white/70 dark:bg-white/5"
        )}>
          <OfferingIcon icon={item.illustrationUrl!} name={item.name} size="md" />
        </div>
        <span className={cx(
          "rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
          selected ? "bg-white/30 dark:bg-white/10" : "bg-white/50 dark:bg-white/5",
          meta.color
        )}>
          {meta.label}
        </span>
      </div>

      {/* Nom */}
      <p className="line-clamp-2 text-[12px] font-bold leading-snug pr-5">
        {item.name}
      </p>

      {/* Description */}
      <p className="line-clamp-2 text-[10px] leading-relaxed opacity-60">
        {item.description}
      </p>

      {/* Prix */}

    </motion.button>
  );
});


const BookOfferingAlternatives = memo(function BookOfferingAlternatives({
  value = [],
  onChange,
  disabled = false,
  error: externalError,
  offerings,
}: BookOfferingAlternativesProps) {
  const reduce = useReducedMotion() ?? false;
  const [{ filter }, dispatch] = useReducer(reducer, { filter: "all" });

  const offeringMap = useMemo(() => {
    const m = new Map<string, OfferingItem>();
    (offerings as OfferingItem[] | undefined)?.forEach((o) => m.set(o._id, o));
    return m;
  }, [offerings]);

  /** Map offeringId → OfferingAlternativeInput */
  const selectedById = useMemo(() => {
    const m = new Map<string, OfferingAlternative>();
    value.forEach((v) => m.set(v.offeringId, v));
    return m;
  }, [value]);

  /** Map category → offeringId sélectionné (1 max par catégorie) */
  const selectedByCategory = useMemo(() => {
    const m = new Map<OfferingCategory, string>();
    value.forEach((v) => m.set(v.category, v.offeringId));
    return m;
  }, [value]);

  // ── Filtrage ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const list = (offerings as OfferingItem[] | undefined) ?? [];
    return filter === "all" ? list : list.filter((o) => o.category === filter);
  }, [offerings, filter]);

  // ── Handlers ─────────────────────────────────────────────────────────

  const setFilter = useCallback(
    (f: CategoryFilter) => dispatch({ type: "SET_FILTER", filter: f }),
    []
  );

  const handleToggle = useCallback(
    (item: OfferingItem) => {
      if (disabled) return;

      if (selectedById.has(item._id)) {
        // Désélectionner
        onChange?.(value.filter((a) => a.offeringId !== item._id));
      } else {
        // Remplace tout autre choix de la même catégorie, puis ajoute ce choix
        const withoutCategory = value.filter((a) => a.category !== item.category);
        onChange?.([
          ...withoutCategory,
          { offeringId: item._id, category: item.category, quantity: 1, name: item.name, illustrationUrl: item.illustrationUrl, description: item.description, price: item.price, priceUSD: item.priceUSD, createdAt: item.createdAt, updatedAt: item.updatedAt },
        ]);
      }
    },
    [value, selectedById, onChange, disabled]
  );

  const handleRemove = useCallback(
    (offeringId: string) => {
      if (disabled) return;
      onChange?.(value.filter((a) => a.offeringId !== offeringId));
    },
    [value, onChange, disabled]
  );

  const handleChangeQty = useCallback(
    (offeringId: string, qty: number) => {
      if (disabled) return;
      onChange?.(
        value.map((a) =>
          a.offeringId === offeringId ? { ...a, quantity: clamp(qty, 1, 99) } : a
        )
      );
    },
    [value, onChange, disabled]
  );

  const selectedCount = value.length;
  const hasError = !!(externalError);

  return (
    <div className="flex flex-col gap-4">

      {/* ── Header + règle ── */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] text-white shadow-sm shadow-[#2E5AA6]/20">
            <PackagePlus className="h-3.5 w-3.5" />
          </div>
          <span className="text-[13px] font-extrabold text-slate-900 dark:text-white">
            Alternatives d'offrandes
          </span>
          <AnimatePresence>
            {selectedCount > 0 && (
              <motion.span
                key={selectedCount}
                initial={reduce ? undefined : { scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#EEF4FF] px-1.5 text-[10px] font-extrabold text-[#2E5AA6] dark:bg-[#2E5AA6]/15 dark:text-[#9BC2FF]"
              >
                {selectedCount}/3
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Règle info */}
        <div className="flex items-center gap-1.5 rounded-xl border border-blue-200/60 bg-blue-50/60 px-3 py-2 dark:border-blue-400/15 dark:bg-blue-500/5">
          <Info className="h-3.5 w-3.5 shrink-0 text-blue-500 dark:text-blue-400" />
          <p className="text-[11px] font-medium text-blue-700 dark:text-blue-300">
            <strong>1 seul choix par catégorie</strong> — Animal, Végétal, Boisson.
            Sélectionner une nouvelle offrande remplace automatiquement l'ancienne.
          </p>
        </div>
      </div>

      {/* ── Chips sélectionnées ── */}
      <AnimatePresence mode="popLayout">
        {selectedCount > 0 && (
          <motion.div
            key="chips-zone"
            initial={reduce ? undefined : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduce ? undefined : { opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 rounded-2xl border border-[#4F83D1]/25 bg-[#EEF4FF]/70 p-3 dark:border-[#4F83D1]/10 dark:bg-[#2E5AA6]/5">
              <AnimatePresence mode="popLayout">
                {value.map((alt) => (
                  <AlternativeChip
                    key={alt.offeringId}
                    alt={alt}
                    offering={offeringMap.get(alt.offeringId)}
                    onRemove={handleRemove}
                    onChangeQty={handleChangeQty}
                    disabled={disabled}
                    reduce={reduce}
                  />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Filtres catégorie ── */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par catégorie">
        {CATEGORIES.map((cat) => {
          const active = filter === cat.key;
          const Icon = cat.Icon;
          // Catégorie déjà pourvue d'un choix ?
          const hasPick =
            cat.key !== "all" &&
            selectedByCategory.has(cat.key as OfferingCategory);

          return (
            <motion.button
              key={cat.key}
              type="button"
              onClick={() => setFilter(cat.key)}
              whileHover={reduce ? undefined : { scale: 1.04 }}
              whileTap={reduce ? undefined : { scale: 0.95 }}
              aria-pressed={active}
              className={cx(
                "relative inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5",
                "text-[11px] font-bold transition-all",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F83D1]/50",
                active
                  ? cx(cat.activeBg, cat.activeText, "shadow-sm")
                  : cx(cat.bg, cat.color, "hover:shadow-sm")
              )}
            >
              <Icon className="h-3 w-3" />
              {cat.label}

              {/* Dot ✓ catégorie pourvue */}
              <AnimatePresence>
                {hasPick && (
                  <motion.span
                    initial={reduce ? undefined : { scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={reduce ? undefined : { scale: 0 }}
                    transition={{ type: "spring", stiffness: 600, damping: 28 }}
                    className={cx(
                      "absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-slate-900",
                      cat.dot
                    )}
                    aria-label="Choix effectué"
                  />
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* ── Grille ── */}
      <div
        className={cx(
          "min-h-[120px] rounded-2xl border p-3",
          hasError
            ? "border-red-300/60 bg-red-50/40 dark:border-red-400/20 dark:bg-red-500/5"
            : "border-slate-200/60 bg-slate-50/40 dark:border-white/10 dark:bg-white/[0.03]"
        )}
      >
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <PackagePlus className="h-8 w-8 text-slate-300 dark:text-white/20" />
            <p className="text-[12px] font-semibold text-slate-500 dark:text-white/40">
              Aucune offrande dans cette catégorie.
            </p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => {
                const o = item as OfferingItem;
                const isSelected = selectedById.has(o._id);
                // Une autre carte de même catégorie est sélectionnée
                const willReplace =
                  !isSelected && selectedByCategory.get(o.category) !== undefined;

                return (
                  <OfferingCard
                    key={o._id}
                    item={o}
                    selected={isSelected}
                    willReplace={willReplace}
                    onToggle={handleToggle}
                    disabled={disabled}
                    reduce={reduce}
                    index={i}
                  />
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* ── Erreur externe ── */}
      <AnimatePresence>
        {externalError && (
          <motion.p
            initial={reduce ? undefined : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-red-600 dark:text-red-400"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {externalError}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

BookOfferingAlternatives.displayName = "BookOfferingAlternatives";

export default BookOfferingAlternatives;