"use client"; 
 import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { useAdminShellSidebar } from '@/hooks/admin/commons/useAdminShellSidebar';
import { Role } from '@/lib/interfaces';
import { AnimatePresence } from 'framer-motion';
import React from 'react';
import { AdminShellDesktopSidebar } from './AdminShellDesktopSidebar';
import { AdminShellMainContent } from './AdminShellMainContent';
import { AdminShellMobileSidebar } from './AdminShellMobileSidebar';
import { AdminShellTopBar } from './AdminShellTopBar';
import { MobileNav } from './MobileNav';

import { useAuth } from '@/lib/hooks';
import { dispatchClientNavigation, dispatchLoginNavigation } from '@/lib/navigation/clientNavigation';
import { useAuthStore } from '@/lib/store/auth.store';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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