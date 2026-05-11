import { memo } from "react";

type CategoryKey = "animal" | "vegetal" | "beverage";

const CATEGORIES: Array<{
  value: CategoryKey;
  label: string;
  emoji: string;
  color: string;
}> = [
    { value: "animal", label: "Animaux", emoji: "🐓", color: "from-red-500 to-orange-500" },
    { value: "vegetal", label: "Végétaux", emoji: "🌾", color: "from-green-500 to-emerald-500" },
    { value: "beverage", label: "Boissons", emoji: "🥤", color: "from-blue-500 to-indigo-500" },
  ];

const AlternativePill = memo(function AlternativePill({
  category,
  offeringId,
  quantity,
}: {
  category: CategoryKey;
  offeringId: string;
  quantity: number;
}) {
  const c = CATEGORIES.find((x) => x.value === category);
  return (
    <div
      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-2.5 py-2 text-[12px] font-semibold text-slate-800 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-100"
    >
      <span className={`inline-flex items-center rounded-full bg-gradient-to-r ${c?.color ?? "from-slate-500 to-slate-700"} px-2 py-0.5 text-[11px] font-extrabold text-white`}>
        {c?.emoji ?? "🎁"} {c?.label ?? category}
      </span>
      <span className="truncate">
        ID: {offeringId.slice(0, 6)}… · x{quantity}
      </span>
    </div>
  );
});

export default AlternativePill;