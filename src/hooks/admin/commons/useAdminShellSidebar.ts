import { usePathname } from 'next/navigation';
import { useAdminShell } from './useAdminShell';

export function useAdminShellSidebar() {
  const pathname = usePathname() || '/admin';
  
  const { isLoggingOut, showMobileSidebar, setShowMobileSidebar, handleLogout } = useAdminShell();

  return { isLoggingOut, showMobileSidebar, setShowMobileSidebar, handleLogout, pathname };
}