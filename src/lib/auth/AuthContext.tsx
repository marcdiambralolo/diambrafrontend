'use client';
import { AuthRequestError, authService } from '@/lib/api/services';
import { clearClientApplicationState } from '@/lib/cache/clientState';
import { config } from '@/lib/config';
import { Role } from '@/lib/interfaces';
import { useAuthStore } from '@/lib/store/auth.store';
import { useMonEtoileStore } from '@/lib/store/monetoile.store';
import type { LoginDto, Permission, RegisterDto } from '@/lib/types/auth.types';
import { logger } from '@/lib/utils/logger';
import { useRouter } from 'next/navigation';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from '../interfaces';

/**
 * Interface du contexte d'authentification
 */
interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (roles: Role | Role[]) => boolean;
  hasPermission: (permissions: Permission | Permission[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Hook personnalisé pour accéder au contexte d'authentification
 * @throws Error si utilisé en dehors d'un AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Provider d'authentification optimisé avec gestion des tokens et permissions
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
    const logoutStore = useAuthStore((s) => s.logout);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const persistLogin = useAuthStore((s) => s.login);
  const persistUser = useAuthStore((s) => s.updateUser);
  const persistLogout = useAuthStore((s) => s.logout);




  /**
   * Initialise l'authentification au montage du composant
   * Vérifie le token et récupère les données utilisateur
   */
  useEffect(() => {
    let isMounted = true;

    // Détection de route publique (login, register, logout)
    const isPublicRoute = () => {
      if (typeof window === 'undefined') return false;
      const publicRoutes = ['/auth/login', '/auth/register', '/auth/logout'];
      return publicRoutes.some((route) => window.location.pathname.startsWith(route));
    };

    const initAuth = async () => {
      // N'appelle pas /auth/me sur les routes publiques
      if (isPublicRoute()) {
        setIsLoading(false);
        return;
      }
      try {
        const currentUser = await authService.me();

        if (!isMounted) {
          return;
        }

        persistLogin(currentUser);

      } catch (error) {
        if (error instanceof AuthRequestError && error.status === 401) {
          // Supprime le cookie côté client si 401 (user supprimé ou token orphelin)
          try {
            if (typeof document !== 'undefined') {
              document.cookie = 'monetoile_access_token=; Max-Age=0; path=/;';
              document.cookie = 'monetoile_refresh_token=; Max-Age=0; path=/;';
              window.location.replace('/auth/login');
              return; // Stop further execution
            }
          } catch { }
          await clearClientApplicationState();
        } else {
          logger.warn('Auth initialization skipped after non-auth error:', error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void initAuth();

    return () => {
      isMounted = false;
    };
  }, [persistLogin, persistLogout]);

  /**
   * Connexion utilisateur avec gestion d'erreurs
   * @param credentials - Identifiants de connexion
   */
  const login = useCallback(async (credentials: LoginDto): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      persistLogin(response.user);
      if (response.accessToken) {
        setAccessToken(response.accessToken);
      } else {
        setAccessToken(null);
      }
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [persistLogin]);

  /**
   * Inscription utilisateur avec redirection
   * @param data - Données d'inscription
   */
  const register = useCallback(async (data: RegisterDto): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      persistLogin(response.user);

      router.replace(config.routes.dashboard);
      router.refresh();
    } catch (error) {
      logger.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [persistLogin, router]);

  /**
   * Déconnexion utilisateur avec nettoyage complet
   */
  const clearBlogArticles = useMonEtoileStore((s) => s.clearBlogArticles);
 

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    logoutStore(); // Clear client-side auth state immediately
    try {
      if (typeof document !== 'undefined') {
        document.cookie = 'monetoile_access_token=; Max-Age=0; path=/;';
        document.cookie = 'monetoile_refresh_token=; Max-Age=0; path=/;';
      }
      await authService.logout();
    } catch (error) {
      logger.error('Logout error:', error);
    } finally {
      // Suppression explicite des cookies d'authentification côté client
      try {
      } catch { }
      setAccessToken(null);
      clearBlogArticles();
      persistLogout();
      await clearClientApplicationState();
      setIsLoading(false);
    }
  }, [clearBlogArticles, logoutStore, persistLogout]);

  /**
   * Rafraîchit les données utilisateur depuis l'API
   */
  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const currentUser = await authService.me();
      persistUser(currentUser);
    } catch (error) {
      logger.error('Error refreshing user:', error);
      throw error;
    }
  }, [persistUser]);

  /**
   * Vérifie si l'utilisateur possède un ou plusieurs rôles
   * @param roles - Rôle(s) à vérifier
   * @returns true si l'utilisateur a au moins un des rôles
   */
  const hasRole = useCallback((roles: Role | Role[]): boolean => {
    if (!user?.role) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  }, [user]);

  /**
   * Vérifie si l'utilisateur possède une ou plusieurs permissions
   * @param permissions - Permission(s) à vérifier
   * @returns true si l'utilisateur a au moins une des permissions
   */
  const hasPermission = useCallback((permissions: Permission | Permission[]): boolean => {
    if (!user) return false;

    // Super Admin a toutes les permissions
    if (user.role === Role.SUPER_ADMIN) return true;

    const permissionArray = Array.isArray(permissions) ? permissions : [permissions];

    // Vérification dans les permissions personnalisées
    return user.customPermissions
      ? permissionArray.some(perm => user.customPermissions?.includes(perm))
      : false;
  }, [user]);

  /**
   * Calcul mémoïsé de l'état d'authentification
   */
  const isAuthenticated = useMemo(() => !!user, [user]);

  /**
   * Valeur du contexte mémoïsée pour éviter les re-renders inutiles
   */
  const value = useMemo<AuthContextType>(
    () => ({
      user,
      accessToken,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      refreshUser,
      hasRole,
      hasPermission,
    }),
    [user, accessToken, isAuthenticated, isLoading, login, register, logout, refreshUser, hasRole, hasPermission]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;