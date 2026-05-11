import { Role } from '@/lib/interfaces';
import { useAuthStore } from '@/lib/store/auth.store';
import { useScroll, useTransform } from 'framer-motion';
import { FileText, LayoutDashboard, MessageCircle, Stars, User, Wallet } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function useHeaderState() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const user = useAuthStore((state) => state.user);

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { scrollY } = useScroll();
  const progressWidth = useTransform(scrollY, [0, 300], ['0%', '100%']);

  const hasRole = useCallback((roles: Role | Role[]): boolean => {
    if (!user?.role) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  }, [user]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showUserMenu && !(e.target as Element).closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserMenu]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLogout = useCallback(async () => {
    if (confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      setMobileMenuOpen(false);
      setShowUserMenu(false);
      document.cookie = 'monetoile_access_token=; Max-Age=0; path=/;';
      document.cookie = 'monetoile_refresh_token=; Max-Age=0; path=/;';
      router.replace('/auth/login');
      router.refresh();
    }
  }, [router]);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  const userBadge = useMemo(() => {
    if (user?.grade) {
      return { text: String(user.grade), label: `Grade: ${String(user.grade)}` };
    }
    if (hasRole(Role.ADMIN) || hasRole(Role.SUPER_ADMIN)) {
      return { text: 'Admin ⚡', label: 'Membre Admin' };
    }
    return { text: 'Premium ⭐', label: 'Membre Premium' };
  }, [user?.grade, hasRole]);

  // Menu items avec mémoïsation
  const navItems = useMemo(() => [
    ...(hasRole(Role.SUPER_ADMIN) || hasRole(Role.ADMIN) ? [
      { href: "/admin", label: "Admin", icon: LayoutDashboard }
    ] : []),
    { href: "/about", label: "A propos", icon: Stars },
    { href: "/star/monprofil", label: "Mon Profil", icon: User },
    { href: "/star/consultations", label: "Mes Consultations", icon: FileText },
    { href: "/star/messagerie", label: "Messagerie", icon: MessageCircle },
    { href: "/star/wallet", label: "Mon Panier", icon: Wallet },
  ], [hasRole]);

  const hasMountedUser = mounted && Boolean(user);

  return {
    handleLogout, setMobileMenuOpen, setShowUserMenu, closeMobileMenu, toggleTheme,
    user, theme, mounted, mobileMenuOpen, isScrolled, showUserMenu,
    scrollY, progressWidth, userBadge, navItems, hasMountedUser,
  };
}