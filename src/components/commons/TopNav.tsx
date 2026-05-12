"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useRef, useSyncExternalStore, useState, useEffect } from "react";
import type { SVGProps } from "react";
import { DiambraLogo } from "@/components/commons/DiambraLogo";

const noopSubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

// Icônes optimisées avec animations
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

function IconGamepad(props: SVGProps<SVGSVGElement>) {
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
      {...props}
    >
      <path d="M6 11h4M8 9v4" />
      <path d="M15 12h.01M18 10h.01" />
      <path d="M2 9a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z" />
    </svg>
  );
}

const iconBtn = "relative inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-foreground/70 transition-all duration-300 outline-none hover:scale-110 hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 hover:text-purple-600 focus-visible:ring-2 focus-visible:ring-purple-500/45 active:scale-95";

function ThemeMenu() {
  const { theme, setTheme } = useTheme();
  const isClient = useIsClient();
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const pick = (value: string) => {
    setTheme(value);
    detailsRef.current?.removeAttribute("open");
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (detailsRef.current && !detailsRef.current.contains(e.target as Node)) {
        detailsRef.current.removeAttribute("open");
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (!isClient) {
    return (
      <div className={`${iconBtn} pointer-events-none opacity-40`} aria-hidden>
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
    <details
      ref={detailsRef}
      className="relative"
      onToggle={(e) => setIsOpen((e.currentTarget as HTMLDetailsElement).open)}
      open={isOpen}
    >
      <summary
        className={`${iconBtn} cursor-pointer list-none transition-all duration-300 hover:rotate-12 [&::-webkit-details-marker]:hidden`}
        aria-label="Choisir le thème"
      >
        {active}
      </summary>
      <div className="absolute right-0 z-50 mt-2 min-w-[12rem] animate-fade-in-up origin-top-right rounded-2xl border border-purple-100 bg-white/95 py-2 shadow-2xl shadow-purple-200/50 backdrop-blur-sm">
        <button
          type="button"
          role="menuitem"
          onClick={() => pick("light")}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:text-purple-600"
        >
          <IconSun className="size-4 shrink-0 opacity-70" />
          <span className="font-medium">☀️ Clair</span>
        </button>
        <button
          type="button"
          role="menuitem"
          onClick={() => pick("dark")}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:text-purple-600"
        >
          <IconMoon className="size-4 shrink-0 opacity-70" />
          <span className="font-medium">🌙 Sombre</span>
        </button>
        <button
          type="button"
          role="menuitem"
          onClick={() => pick("system")}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:text-purple-600"
        >
          <IconMonitor className="size-4 shrink-0 opacity-70" />
          <span className="font-medium">💻 Système</span>
        </button>
      </div>
    </details>
  );
}

function NotificationBadge() {
  const [hasNotifications, setHasNotifications] = useState(true);

  return (
    <div className="relative">
      <IconBell className="size-5" />
      {hasNotifications && (
        <span className="absolute -right-1 -top-1 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
        </span>
      )}
    </div>
  );
}

export function TopNav() {
  const pathname = usePathname();

  const linkClass = (href: string) => {
    const on = pathname === href;
    return [
      "relative rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 overflow-hidden group",
      on
        ? "text-purple-600 dark:text-purple-400"
        : "text-gray-600 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50",
    ].join(" ");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-purple-100 bg-white/95 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      {/* Barre de progression décorative */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 transition-all duration-300" style={{ width: "0%" }} />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-8">
          <Link
            href="/"
            className="shrink-0 rounded-xl outline-none transition-all duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-purple-500/45"
            aria-label="Accueil Diambra"
          >
            <DiambraLogo size="md" />
          </Link>

          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Navigation principale"
          >
            <Link href="/" className={linkClass("/")}>
              <span className="relative z-10">🏠 Accueil</span>
              {pathname === "/" && (
                <span className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-purple-100/80 to-indigo-100/80" />
              )}
            </Link>
            <Link href="/game" className={linkClass("/game")}>
              <span className="relative z-10 flex items-center gap-1.5">
                <IconGamepad className="size-4" />
                Jouer
              </span>
              {pathname === "/game" && (
                <span className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-purple-100/80 to-indigo-100/80" />
              )}
            </Link>
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <nav
            className="flex items-center md:hidden"
            aria-label="Navigation courte"
          >
            <Link
              href="/game"
              className={`${linkClass("/game")} flex items-center gap-1.5`}
            >
              <IconGamepad className="size-4" />
              <span>Jeu</span>
            </Link>
          </nav>

          <div className="h-6 w-px bg-gradient-to-b from-transparent via-purple-200 to-transparent mx-1" />

          {/* Messages avec tooltip */}
          <div className="group relative">
            <Link href="/messages" className={iconBtn} aria-label="Messages">
              <IconMessages className="size-5" />
            </Link>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 rounded-lg bg-gray-800 px-2 py-1 text-xs text-white transition-all group-hover:scale-100">
              Messages
            </div>
          </div>

          {/* Notifications avec badge */}
          <div className="group relative">
            <Link href="/notifications" className={iconBtn} aria-label="Notifications">
              <NotificationBadge />
            </Link>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 rounded-lg bg-gray-800 px-2 py-1 text-xs text-white transition-all group-hover:scale-100">
              Notifications
            </div>
          </div>

          {/* Profil avec avatar */}
          <div className="group relative">
            <Link href="/profile" className={iconBtn} aria-label="Profil">
              <IconUser className="size-5" />
            </Link>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 rounded-lg bg-gray-800 px-2 py-1 text-xs text-white transition-all group-hover:scale-100">
              Mon profil
            </div>
          </div>

          <div className="h-6 w-px bg-gradient-to-b from-transparent via-purple-200 to-transparent mx-1" />

          <ThemeMenu />
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.2s ease-out;
        }
      `}</style>
    </header>
  );
}