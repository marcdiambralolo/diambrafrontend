"use client";
import CacheLink from "@/components/commons/CacheLink";
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { useAdminShellSidebar } from '@/hooks/admin/commons/useAdminShellSidebar';
import { cx } from "@/lib/functions";
import { useAuth } from '@/lib/hooks';
import { Role } from '@/lib/interfaces';
import { dispatchClientNavigation, dispatchLoginNavigation } from '@/lib/navigation/clientNavigation';
import { useAuthStore } from '@/lib/store/auth.store';
import { AnimatePresence, motion, useReducedMotion, Variants } from 'framer-motion';
import { Activity, ChevronRight, Loader2, LogOut, Menu, ShieldAlert, Sparkles, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { colorClasses, navItems } from "../commons/AdminNavConfig";
import { AdminShellMobileSidebar } from './AdminShellMobileSidebar';
import { Shield } from 'lucide-react';

export const AdminSidebarHeader = React.memo(function AdminSidebarHeader() {
  const user = useAuthStore((state) => state.user);

  return (
    <CacheLink
      href="/"
      className="flex items-center gap-1 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-indigo/40 rounded-xl transition-shadow"
      title="Retour à l'accueil"
      prefetch={false}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] shadow-lg group-hover:scale-105 group-hover:shadow-xl transition-transform">
        <Shield className="w-6 h-6 text-white" />
      </div>
      <div>
        <h2 className="text-sm font-black text-gray-900 dark:text-white group-hover:text-cosmic-indigo transition-colors">Administration</h2>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{user?.username || 'Administrateur'}</p>
      </div>
    </CacheLink>
  );
});

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { logout } = useAuth();

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;

    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      setIsLoggingOut(true);
      try {
        await logout();
        handleClose();
        router.replace('/auth/login');
        router.refresh();
      } catch (error) {
        console.error('Erreur de déconnexion:', error);
        setIsLoggingOut(false);
      }
    }
  }, [isLoggingOut, logout, handleClose, router]);

  const menuVariants: Variants = {
    hidden: { x: '100%', opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 200,
        staggerChildren: 0.05
      }
    },
    exit: {
      x: '100%',
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  const itemVariants: Variants = {
    hidden: { x: 20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="lg:hidden fixed top-4 right-4 z-50 p-2.5 bg-white rounded-xl 
                   shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-5 h-5 text-gray-900" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-5 h-5 text-gray-900" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay avec blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleClose}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="lg:hidden fixed top-0 right-0 bottom-0 w-80 bg-white z-40 
                         shadow-2xl overflow-y-auto"
            >
              <div className="flex flex-col h-full">
                {/* Header avec Logo */}
                <motion.div
                  variants={itemVariants}
                  className="px-6 pt-10 pb-4 bg-gradient-to-r from-amber-50 to-orange-50 
                             border-b border-gray-200"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="relative w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 
                                 rounded-xl flex items-center justify-center shadow-lg"
                    >
                      <span className="text-white font-bold text-xl">M</span>
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-amber-400 rounded-xl blur-md opacity-50 -z-10"
                      />
                    </motion.div>
                    <div>
                      <h2 className="font-bold text-gray-900 flex items-center gap-1.5">
                        Diambra
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      </h2>
                      <p className="text-xs text-gray-600 font-medium">Administration</p>
                    </div>
                  </div>


                </motion.div>

                {/* Navigation */}
                <nav className="flex-1 px-6 py-4 space-y-1.5 overflow-y-auto">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <motion.div
                        key={item.href}
                        variants={itemVariants}
                        custom={index}
                      >
                        <CacheLink
                          href={item.href}
                          onClick={handleClose}
                          className="group block"
                        >
                          <motion.div
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg 
                                       transition-all duration-200 ${isActive
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                                : 'text-gray-700 hover:bg-gray-100'
                              }`}
                          >
                            <div className={`p-1.5 rounded-md ${isActive
                              ? 'bg-white/20'
                              : 'bg-gray-100 group-hover:bg-gray-200'
                              } transition-colors`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-sm">{item.label}</span>

                            {/* Badge "Active" */}
                            <AnimatePresence>
                              {isActive && (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  className="ml-auto"
                                >
                                  <Activity className="w-3.5 h-3.5" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        </CacheLink>
                      </motion.div>
                    );
                  })}
                </nav>

                <motion.div
                  variants={itemVariants}
                  className="px-6 py-4 border-t border-gray-200 bg-gray-50"
                >
                  <motion.button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 px-4 py-3 text-red-600 
                               hover:bg-red-50 rounded-lg w-full transition-all
                               disabled:opacity-50 disabled:cursor-not-allowed
                               border border-red-200 hover:border-red-300"
                  >
                    <div className="p-1.5 bg-red-50 rounded-md">
                      <LogOut className={`w-4 h-4 ${isLoggingOut ? 'animate-pulse' : ''}`} />
                    </div>
                    <span className="font-medium text-sm">
                      {isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}
                    </span>
                    {isLoggingOut && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="ml-auto w-4 h-4 border-2 border-red-600 border-t-transparent 
                                   rounded-full"
                      />
                    )}
                  </motion.button>
                </motion.div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

interface AdminShellTopBarProps {
  setShowMobileSidebar: (show: boolean) => void;
}

export function AdminShellTopBar({ setShowMobileSidebar }: AdminShellTopBarProps) {
  return (
    <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#1C3A6B] bg-[#0F1C3F]/94 px-4 py-3 shadow-sm backdrop-blur-md lg:hidden">
      <button
        onClick={() => setShowMobileSidebar(true)}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#162A56] border border-[#2E5AA6] text-[#E5E7EB] transition-colors hover:bg-[#2E5AA6] hover:text-white"
      >
        <Menu className="h-5 w-5 text-[#4F83D1]" />
      </button>

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] shadow-[0_12px_24px_-16px_rgba(79,131,209,0.9)]">
          <span className="inline-block w-5 h-5"><svg viewBox="0 0 24 24" fill="none" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 2l2 7h7l-5.5 4 2 7-5.5-4-5.5 4 2-7L3 9h7z"></path></svg></span>
        </div>
        <span className="text-sm font-black text-[#E5E7EB]">Admin</span>
      </div>

      <div className="w-10" />
    </div>
  );
}

export const AdminLogoutButton = React.memo(function AdminLogoutButton({ onLogout, isLoggingOut }: { onLogout: () => void, isLoggingOut: boolean }) {

  return (
    <motion.button
      onClick={onLogout}
      disabled={isLoggingOut}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 font-bold text-sm hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoggingOut ? (
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full" />
      ) : (
        <LogOut className="w-5 h-5" />
      )}
      {isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
    </motion.button>
  );
});

type Props = { pathname: string; onNav?: () => void; isMobile?: boolean };

const liVariants: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.14 } },
};

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


interface AdminShellDesktopSidebarProps {
  pathname: string;
  handleLogout: () => void;
  isLoggingOut: boolean;
}

export function AdminShellDesktopSidebar({ pathname, handleLogout, isLoggingOut, }: AdminShellDesktopSidebarProps) {

  return (
    <motion.nav
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="theme-dark-panel hidden w-16 flex-col border-r border-gray-200 bg-white shadow-sm transition-all duration-300 lg:flex lg:w-64 dark:bg-[color:var(--theme-layer-2)]"
    >
      <div className="flex flex-col items-center border-b border-gray-200 p-2 lg:items-start lg:p-3 dark:border-[color:var(--theme-separator)]">
        <AdminSidebarHeader />
      </div>

      <div className="flex-1 p-1 lg:p-2 overflow-y-auto">
        <AdminSidebarNav pathname={pathname} />
      </div>

      <div className="border-t border-gray-200 p-2 lg:p-2 dark:border-[color:var(--theme-separator)]">
        <AdminLogoutButton onLogout={handleLogout} isLoggingOut={isLoggingOut} />
      </div>
    </motion.nav>
  );
}

interface AdminShellMainContentProps {
  children: React.ReactNode;
}

export function AdminShellMainContent({ children }: AdminShellMainContentProps) {
  return (
    <main className="flex-1 overflow-y-auto bg-[#0F1C3F] text-[#E5E7EB] border-l border-[#1C3A6B]">
      <div className="p-2 sm:p-4 lg:p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {children}
        </motion.div>
      </div>
    </main>
  );
}

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role | Role[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  redirectTo,
  fallback,
}) => {
  const { isAuthenticated, isLoading, hasRole } = useAuth();

  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const hasRequiredRole = hasRole(rolesArray);

  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasRequiredRole && redirectTo) {
      dispatchClientNavigation({ href: redirectTo, replace: true, refresh: true });
    }
  }, [isAuthenticated, isLoading, hasRequiredRole, redirectTo]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && redirectTo) {
      dispatchLoginNavigation();
    }
  }, [isAuthenticated, isLoading, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-[#070B1A] dark:via-[#0F1C3F] dark:to-[#070B1A]">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-[#2E5AA6] dark:text-[#9BC2FF]" />
          <p className="text-lg text-slate-600 dark:text-[#D1D5DB]">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (redirectTo) {
      return null;
    }
    return fallback || <AccessDenied message="Vous devez être connecté" />;
  }

  if (!hasRequiredRole) {
    if (redirectTo) {
      return null;
    }
    return (
      fallback || (
        <AccessDenied
          message={`Accès réservé aux rôles : ${rolesArray.join(', ')}`}
        />
      )
    );
  }

  return <>{children}</>;
};

const AccessDenied: React.FC<{ message: string; }> = ({
  message, }) => {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-red-50 p-4 dark:from-[#070B1A] dark:via-[#0F1C3F] dark:to-[#1A0C16]">
      <div className="max-w-md w-full rounded-2xl border border-red-200 bg-white p-8 text-center shadow-xl dark:border-red-700/50 dark:bg-[#0F1C3F]">

        <ShieldAlert className="w-16 h-16 text-red-600 mx-auto mb-4" />
        <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
          Accès refusé
        </h2>
        <p className="mb-4 text-slate-600 dark:text-[#D1D5DB]">{message}</p>

        {user?.role && (
          <p className="text-sm text-slate-500 dark:text-[#AFC0DE]">
            Votre rôle actuel : <span className="font-semibold">{user.role}</span>
          </p>
        )}

        <button
          onClick={() => router.back()}
          className="theme-dark-secondary-button mt-6 rounded-xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-300"
        >
          Retour
        </button>
      </div>
    </div>
  );
};

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { isLoggingOut, showMobileSidebar, pathname, setShowMobileSidebar, handleLogout, } = useAdminShellSidebar();

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
        <div className="flex min-h-screen white text-[#E5E7EB]">
          <AdminShellDesktopSidebar
            pathname={pathname}
            handleLogout={handleLogout}
            isLoggingOut={isLoggingOut}
          />

          <AnimatePresence>
            <AdminShellMobileSidebar
              isLoggingOut={isLoggingOut}
              showMobileSidebar={showMobileSidebar}
              setShowMobileSidebar={setShowMobileSidebar}
              handleLogout={handleLogout}
              pathname={pathname}
            />
          </AnimatePresence>

          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <AdminShellTopBar setShowMobileSidebar={setShowMobileSidebar} />
            <AdminShellMainContent>{children}</AdminShellMainContent>
          </div>
          <MobileNav />
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}