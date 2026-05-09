"use client";

import { useId } from "react";

type DiambraLogoProps = {
  className?: string;
  /** Hauteur du bloc logo (icône + texte) */
  size?: "sm" | "md" | "lg";
  /** Afficher uniquement le symbole (sans le mot DIAMBRA) */
  iconOnly?: boolean;
};

const sizeClasses = {
  sm: { wrap: "gap-2", text: "text-lg", icon: "h-8 w-8" },
  md: { wrap: "gap-2.5", text: "text-xl sm:text-2xl", icon: "h-9 w-9 sm:h-10 sm:w-10" },
  lg: { wrap: "gap-3", text: "text-2xl sm:text-3xl", icon: "h-11 w-11 sm:h-12 sm:w-12" },
} as const;

/**
 * Logo DIAMBRA : quadrillage 2×2 (écho au jeu « quatre cases ») + wordmark.
 */
export function DiambraLogo({
  className = "",
  size = "md",
  iconOnly = false,
}: DiambraLogoProps) {
  const s = sizeClasses[size];
  const uid = useId().replace(/:/g, "");
  const gradA = `diambra-grad-a-${uid}`;
  const gradB = `diambra-grad-b-${uid}`;

  return (
    <div
      className={`flex items-center ${s.wrap} ${className}`}
      aria-label={iconOnly ? "DIAMBRA" : undefined}
    >
      <svg
        className={`${s.icon} shrink-0`}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradA} x1="6" y1="6" x2="34" y2="34">
            <stop stopColor="var(--color-brand-400)" />
            <stop offset="1" stopColor="var(--color-brand-600)" />
          </linearGradient>
          <linearGradient id={gradB} x1="34" y1="6" x2="6" y2="34">
            <stop stopColor="var(--color-accent-400)" />
            <stop offset="1" stopColor="var(--color-accent-600)" />
          </linearGradient>
        </defs>
        <rect
          x="4"
          y="4"
          width="14"
          height="14"
          rx="3"
          fill={`url(#${gradA})`}
        />
        <rect
          x="22"
          y="4"
          width="14"
          height="14"
          rx="3"
          className="fill-foreground/15 dark:fill-white/20"
        />
        <rect
          x="4"
          y="22"
          width="14"
          height="14"
          rx="3"
          className="fill-foreground/12 dark:fill-white/15"
        />
        <rect
          x="22"
          y="22"
          width="14"
          height="14"
          rx="3"
          fill={`url(#${gradB})`}
        />
      </svg>
      {!iconOnly && (
        <span
          className={`bg-gradient-to-r font-semibold tracking-tight ${s.text} from-brand-600 to-accent-600 bg-clip-text text-transparent dark:from-brand-400 dark:to-accent-400`}
        >
          DIAMBRA
        </span>
      )}
    </div>
  );
}
