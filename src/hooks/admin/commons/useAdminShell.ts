import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';

export function useAdminShell() {
  const { logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    
    try {
      await logout();
      router.replace('/auth/login');
      router.refresh();
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, logout, router]);

  return { isLoggingOut, showMobileSidebar, setShowMobileSidebar, handleLogout };
}