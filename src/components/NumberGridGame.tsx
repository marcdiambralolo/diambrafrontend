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
    <div className="mx-auto flex w-full max-w-lg flex-col gap-10 px-4 py-12">
      <header className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Quatre cases
        </h1>
        <p className="mt-2 text-sm text-foreground/70">
          Choisissez un chiffre (0–9), puis une case vide pour le placer. Un
          même chiffre ne peut pas être utilisé deux fois. Cliquez une case
          remplie pour la vider.
        </p>
      </header>

      <section aria-label="Cases" className="flex justify-center gap-3 sm:gap-4">
        {slots.map((value, i) => (
          <button
            key={i}
            type="button"
            onClick={() => placeInSlot(i)}
            className={[
              "flex h-20 w-16 shrink-0 items-center justify-center rounded-xl border-2 text-3xl font-semibold tabular-nums transition-colors sm:h-24 sm:w-20",
              value === null
                ? "border-dashed border-foreground/25 bg-foreground/[0.03] text-foreground/35 hover:border-foreground/40 hover:bg-foreground/[0.06]"
                : "border-foreground/20 bg-foreground/[0.08] text-foreground shadow-sm",
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

      <section aria-label="Chiffres" className="space-y-3">
        <p className="text-center text-xs font-medium uppercase tracking-wider text-foreground/50">
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
                  "flex h-11 items-center justify-center rounded-lg text-base font-semibold tabular-nums transition-colors disabled:cursor-not-allowed disabled:opacity-35",
                  isSelected
                    ? "bg-foreground text-background ring-2 ring-foreground/30 ring-offset-2 ring-offset-background"
                    : "border border-foreground/15 bg-foreground/[0.05] hover:bg-foreground/10",
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

      <div className="flex justify-center">
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-foreground/20 px-5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-foreground/10"
        >
          Tout effacer
        </button>
      </div>
    </div>
  );
}
