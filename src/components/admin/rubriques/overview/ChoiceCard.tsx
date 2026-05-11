'use client';
import { memo } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { getId, cleanText, clamp } from "@/lib/functions";
import type { ConsultationChoice } from "@/lib/interfaces";

const itemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.18 } },
};

const ChoiceCard = memo(function ChoiceCard({
  choice,
  onOpen,
}: {
  choice: ConsultationChoice;
  onOpen: (choiceId: string) => void;
}) {
  const cid = getId(choice);
  const frequence = cleanText(choice?.frequence || "");
  const participants = cleanText(choice?.participants || "");

  return (
    <motion.button
      type="button"
      variants={itemVariants}
      onClick={() => onOpen(cid)}
      aria-label={`Ouvrir le choix ${choice?.title}`}
      className={[
        "w-full rounded-3xl border border-slate-200 bg-white/70 p-3 text-left shadow-sm backdrop-blur transition",
        "hover:bg-white active:scale-[0.99]",
        "dark:border-zinc-800 dark:bg-zinc-950/40 dark:hover:bg-zinc-900/50",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-[13px] font-extrabold text-slate-900 dark:text-white">
            {choice?.title ?? "Choix"}
          </div>
          <div className="mt-0.5 line-clamp-2 text-[12px] text-slate-600 dark:text-zinc-300">
            {choice?.description ? clamp(choice.description, 180) : "—"}
          </div>

          {(frequence || participants) && (
            <div className="mt-2 flex flex-wrap gap-2">
              {frequence ? (
                <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-extrabold text-slate-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                  {frequence}
                </span>
              ) : null}
              
              {participants ? (
                <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-extrabold text-slate-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                  {participants}
                </span>
              ) : null}
            </div>
          )}
        </div>

        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white">
          <ChevronRight className="h-4 w-4" />
        </span>
      </div>
    </motion.button>
  );
});

export default ChoiceCard;