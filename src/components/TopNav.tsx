"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useRef, useSyncExternalStore } from "react";
import type { SVGProps } from "react";
import { DiambraLogo } from "@/components/DiambraLogo";

const noopSubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

function IconMessages(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconBell(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function IconUser(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  );
}

function IconSun(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function IconMoon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function IconMonitor(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <path d="M8 21h8m-4-4v4" />
    </svg>
  );
}

const iconBtn =
  "relative inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-foreground/75 outline-none transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand-500/45";

function ThemeMenu() {
  const { theme, setTheme } = useTheme();
  const isClient = useIsClient();
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const pick = (value: string) => {
    setTheme(value);
    detailsRef.current?.removeAttribute("open");
  };

  if (!isClient) {
    return (
      <div
        className={`${iconBtn} pointer-events-none opacity-40`}
        aria-hidden
      >
        <IconMonitor className="size-5" />
      </div>
    );
  }

  const active =
    theme === "dark" ? (
      <IconMoon className="size-5" />
    ) : theme === "light" ? (
      <IconSun className="size-5" />
    ) : (
      <IconMonitor className="size-5" />
    );

  return (
    <details ref={detailsRef} className="relative">
      <summary
        className={`${iconBtn} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}
        aria-label="Choisir le thème"
      >
        {active}
      </summary>
      <div
        className="absolute right-0 z-50 mt-1 min-w-[11rem] rounded-xl border border-border-subtle bg-surface py-1 shadow-lg dark:bg-surface"
        role="menu"
      >
        <button
          type="button"
          role="menuitem"
          onClick={() => pick("light")}
          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-surface-muted"
        >
          <IconSun className="size-4 shrink-0 opacity-70" />
          Clair
        </button>
        <button
          type="button"
          role="menuitem"
          onClick={() => pick("dark")}
          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-surface-muted"
        >
          <IconMoon className="size-4 shrink-0 opacity-70" />
          Sombre
        </button>
        <button
          type="button"
          role="menuitem"
          onClick={() => pick("system")}
          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-surface-muted"
        >
          <IconMonitor className="size-4 shrink-0 opacity-70" />
          Système
        </button>
      </div>
    </details>
  );
}

export function TopNav() {
  const pathname = usePathname();

  const linkClass = (href: string) => {
    const on = pathname === href;
    return [
      "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      on
        ? "bg-brand-500/15 text-brand-600 dark:text-brand-400"
        : "text-foreground/70 hover:bg-surface-muted hover:text-foreground",
    ].join(" ");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:h-[3.75rem] sm:gap-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-6">
          <Link
            href="/"
            className="shrink-0 rounded-lg outline-none ring-brand-500/0 focus-visible:ring-2 focus-visible:ring-brand-500/45"
            aria-label="Accueil Diambra"
          >
            <DiambraLogo size="sm" />
          </Link>

          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Navigation principale"
          >
            <Link href="/" className={linkClass("/")}>
              Accueil
            </Link>
            <Link href="/game" className={linkClass("/game")}>
              Jouer
            </Link>
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <nav
            className="flex items-center md:hidden"
            aria-label="Navigation courte"
          >
            <Link href="/game" className={linkClass("/game")}>
              Jeu
            </Link>
          </nav>

          <Link
            href="/messages"
            className={iconBtn}
            aria-label="Messages"
            title="Messages"
          >
            <IconMessages className="size-5" />
          </Link>

          <Link
            href="/notifications"
            className={iconBtn}
            aria-label="Notifications"
            title="Notifications"
          >
            <IconBell className="size-5" />
          </Link>

          <Link
            href="/profile"
            className={iconBtn}
            aria-label="Profil"
            title="Profil"
          >
            <IconUser className="size-5" />
          </Link>

          <ThemeMenu />
        </div>
      </div>
    </header>
  );
}
