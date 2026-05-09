"use client";

import { useCallback, useMemo, useState } from "react";

const SLOT_COUNT = 4;
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export function NumberGridGame() {
  const [slots, setSlots] = useState<(number | null)[]>(
    () => Array.from({ length: SLOT_COUNT }, () => null),
  );
  const [selected, setSelected] = useState<number | null>(null);

  const used = useMemo(
    () => new Set(slots.filter((v): v is number => v !== null)),
    [slots],
  );

  const placeInSlot = useCallback(
    (index: number) => {
      setSlots((prev) => {
        const next = [...prev];
        const current = next[index];

        if (current !== null) {
          next[index] = null;
          return next;
        }

        if (selected === null) return prev;
        if (used.has(selected)) return prev;

        next[index] = selected;
        return next;
      });
      setSelected(null);
    },
    [selected, used],
  );

  const reset = useCallback(() => {
    setSlots(Array.from({ length: SLOT_COUNT }, () => null));
    setSelected(null);
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8 px-4 sm:gap-10 sm:px-6">
      <div className="rounded-3xl border border-border-subtle bg-surface/90 p-6 shadow-[0_1px_0_rgb(0_0_0_/0.04),0_16px_48px_-12px_rgb(79_70_229_/0.12)] backdrop-blur-sm dark:bg-surface/80 dark:shadow-[0_1px_0_rgb(255_255_255_/0.06),0_20px_56px_-16px_rgb(99_102_241_/0.25)] sm:p-8">
        <header className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[1.65rem]">
            Quatre cases
          </h1>
          <p className="mx-auto mt-3 max-w-md text-pretty text-sm leading-relaxed text-foreground/65">
            Choisissez un chiffre (0–9), puis une case vide pour le placer. Un
            même chiffre ne peut pas être utilisé deux fois. Cliquez une case
            remplie pour la vider.
          </p>
        </header>

        <section
          aria-label="Cases"
          className="mt-8 flex justify-center gap-3 sm:mt-10 sm:gap-4"
        >
          {slots.map((value, i) => (
            <button
              key={i}
              type="button"
              onClick={() => placeInSlot(i)}
              className={[
                "flex h-20 w-16 shrink-0 items-center justify-center rounded-2xl border-2 text-3xl font-semibold tabular-nums transition-[color,background-color,border-color,box-shadow,transform] duration-150 sm:h-24 sm:w-20",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                value === null
                  ? "border-dashed border-foreground/20 bg-surface-muted/90 text-foreground/35 hover:border-brand-500/35 hover:bg-brand-500/[0.06] hover:text-foreground/50 active:scale-[0.98] dark:bg-surface-muted/40"
                  : "border-brand-500/25 bg-gradient-to-br from-brand-500/15 to-accent-500/10 text-foreground shadow-md shadow-brand-600/10 dark:shadow-brand-500/20",
              ].join(" ")}
              aria-label={
                value === null
                  ? `Case ${i + 1}, vide`
                  : `Case ${i + 1}, contient ${value}. Cliquer pour vider.`
              }
            >
              {value ?? "·"}
            </button>
          ))}
        </section>

        <section aria-label="Chiffres" className="mt-8 space-y-3 sm:mt-10">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-brand-600/90 dark:text-brand-400/95">
            Chiffre à placer
          </p>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-10 sm:gap-2">
            {DIGITS.map((d) => {
              const isUsed = used.has(d);
              const isSelected = selected === d;
              return (
                <button
                  key={d}
                  type="button"
                  disabled={isUsed}
                  onClick={() => setSelected(isSelected ? null : d)}
                  className={[
                    "flex h-11 items-center justify-center rounded-xl text-base font-semibold tabular-nums transition-[color,background-color,border-color,box-shadow,transform] duration-150 disabled:cursor-not-allowed disabled:opacity-35",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isSelected
                      ? "bg-gradient-to-br from-brand-600 to-accent-600 text-white shadow-md shadow-brand-600/25 ring-2 ring-brand-400/40 ring-offset-2 ring-offset-background dark:from-brand-500 dark:to-accent-500"
                      : "border border-border-subtle bg-surface-muted/70 hover:border-brand-500/25 hover:bg-brand-500/[0.08] active:scale-[0.96] dark:bg-surface-muted/50",
                  ].join(" ")}
                  aria-pressed={isSelected}
                  aria-label={`Chiffre ${d}${isUsed ? ", déjà utilisé" : ""}`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </section>

        <div className="mt-8 flex justify-center sm:mt-10">
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-border-subtle bg-background/60 px-6 py-2.5 text-sm font-medium text-foreground/80 backdrop-blur-sm transition-[background-color,border-color,color] hover:border-accent-500/30 hover:bg-accent-500/10 hover:text-foreground dark:bg-background/40"
          >
            Tout effacer
          </button>
        </div>
      </div>
    </div>
  );
}
