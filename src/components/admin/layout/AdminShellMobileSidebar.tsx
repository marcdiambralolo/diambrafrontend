"use client";
import CacheLink from "@/components/commons/CacheLink";
import { cx } from "@/lib/functions";
import { AnimatePresence, motion, useReducedMotion, Variants } from "framer-motion";
import { ChevronRight, X } from "lucide-react";
import { memo, useCallback, useMemo } from "react";
import { AdminLogoutButton } from "../commons/AdminLogoutButton";
import { colorClasses, navItems } from "../commons/AdminNavConfig";
import { AdminSidebarHeader } from "./AdminSidebarHeader";
 

type Props = { pathname: string; onNav?: () => void; isMobile?: boolean };

const liVariants: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.14 } },
};

const activeBarTransition = { type: "spring", stiffness: 520, damping: 38, mass: 0.6 };

function computeIsActive(pathname: string, href: string) {
  const isRoot = href === "/admin";
  return isRoot ? pathname === href : pathname.startsWith(href);
}

export const AdminSidebarNav = memo(function AdminSidebarNav({ pathname, onNav, isMobile }: Props) {
  const reduce = useReducedMotion();

  const activeHref = useMemo(() => {
    for (const item of navItems) {
      if (computeIsActive(pathname, item.href)) return item.href;
    }
    return "";
  }, [pathname]);

  const itemsVM = useMemo(
    () =>
      navItems.map((item) => {
        const isActive = item.href === activeHref;
        const Icon = item.icon;
        const colorClass = colorClasses[item.color as keyof typeof colorClasses];
        return { ...item, isActive, Icon, colorClass };
      }),
    [activeHref]
  );

  const handleNav = useCallback(() => {
    onNav?.();
  }, [onNav]);

  return (
    <nav aria-label="Navigation admin" className="w-full">
      <ul
        className={cx(
          "flex w-full flex-col items-start justify-start gap-1",
          "max-w-sm"
        )}
      >
        {itemsVM.map((item, index) => {
          const { href, label, isActive, Icon, colorClass } = item;
          const base = cx(
            "relative w-full",
            "rounded-2xl",
            "outline-none"
          );

          const pill = cx(
            "group relative flex w-full items-center justify-start gap-2",
            "px-1 py-1", "rounded-xl", "text-sm font-extrabold",
            "transition-[background,transform,color,box-shadow] duration-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 dark:focus-visible:ring-[#2E5AA6]/40",
            !isActive &&
            "text-slate-700 hover:bg-slate-100 active:scale-[0.99] dark:text-zinc-200 dark:hover:bg-zinc-900/60",
            isActive && cx(colorClass, "shadow-sm")
          );

          const whileHover = reduce ? undefined : (isActive ? { scale: 1.01 } : { scale: 1.02 });
          const whileTap = reduce ? undefined : { scale: 0.99 };

          return (
            <motion.li
              key={href}
              variants={liVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: reduce ? 0 : index * 0.02 }}
              className={base}
            >
              <CacheLink href={href} onClick={isMobile ? handleNav : undefined} aria-current={isActive ? "page" : undefined}>
                <motion.div whileHover={whileHover} whileTap={whileTap} className={pill}>
                  <AnimatePresence>
                    {isActive && !reduce && (
                      <motion.div
                        key="glow"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="pointer-events-none absolute inset-0 rounded-2xl"
                        style={{
                          boxShadow:
                            "0 0 0 1px rgba(79,131,209,.24), 0 10px 30px rgba(46,90,166,.20)",
                        }}
                      />
                    )}
                  </AnimatePresence>

                  {isActive && (
                    <motion.div
                      layoutId="admin-active-bar"
                      className="absolute bottom-2 left-0 top-2 w-1.5 rounded-full bg-gradient-to-b from-[#4F83D1] to-[#2E5AA6]"
                    />
                  )}

                  <div
                    className={cx(
                      "flex h-9 w-9 items-center justify-center rounded-2xl",
                      isActive
                        ? "bg-white/15"
                        : "bg-slate-100 dark:bg-zinc-900"
                    )}
                  >
                    <Icon
                      className={cx(
                        "h-5 w-5",
                        isActive ? "text-white" : "text-slate-500 dark:text-zinc-400"
                      )}
                    />
                  </div>

                  {/* Label centré */}
                  <span className="truncate">{label}</span>

                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        key="chev"
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        transition={{ duration: 0.14 }}
                        className="absolute right-3"
                      >
                        <ChevronRight className={cx("h-4 w-4", isActive ? "text-white/90" : "text-slate-400")} />
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Underline active (soulignement centré) */}
                  {isActive && (
                    <motion.div
                      layoutId="admin-active-underline"
        
                      className="absolute bottom-1 left-1/2 h-[2px] w-16 -translate-x-1/2 rounded-full bg-white/70"
                    />
                  )}
                </motion.div>
              </CacheLink>
            </motion.li>
          );
        })}
      </ul>
    </nav>
  );
},
  // comparator anti-rerender : rerender uniquement si pathname/isMobile/onNav changent
  (prev, next) =>
    prev.pathname === next.pathname &&
    prev.isMobile === next.isMobile &&
    prev.onNav === next.onNav
);
 
interface AdminShellMobileSidebarProps {
  isLoggingOut: boolean;
  showMobileSidebar: boolean;
  setShowMobileSidebar: (show: boolean) => void;
  handleLogout: () => void;
  pathname: string;
}

export function AdminShellMobileSidebar({
  isLoggingOut,
  showMobileSidebar,
  setShowMobileSidebar,
  handleLogout,
  pathname,
}: AdminShellMobileSidebarProps) {

  if (!showMobileSidebar) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowMobileSidebar(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
      />

      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 shadow-2xl z-50 lg:hidden flex flex-col"
      >
        <div className="p-2 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
          <AdminSidebarHeader />
          <button
            onClick={() => setShowMobileSidebar(false)}
            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
        <div className="flex-1 p-2 overflow-y-auto">
          <AdminSidebarNav pathname={pathname} onNav={() => setShowMobileSidebar(false)} isMobile />
        </div>
        <div className="p-3 border-t border-gray-200 dark:border-slate-800">
          <AdminLogoutButton onLogout={handleLogout} isLoggingOut={isLoggingOut} />
        </div>
      </motion.div>
    </>
  );
}