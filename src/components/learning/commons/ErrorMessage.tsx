// components/ui/ErrorMessage.tsx
'use client';

import { memo, useCallback, useEffect, useState } from 'react';
import { AlertCircle, RefreshCw, Home, ChevronLeft, AlertTriangle, WifiOff } from 'lucide-react';
import React from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface ErrorMessageProps {
  /** Message d'erreur principal */
  message?: string;
  /** Description détaillée de l'erreur */
  description?: string;
  /** Type d'erreur pour le style et les actions */
  type?: 'error' | 'warning' | 'info' | 'offline';
  /** Titre personnalisé */
  title?: string;
  /** Action au clic sur le bouton principal */
  onRetry?: () => void | Promise<void>;
  /** Action au clic sur le bouton retour */
  onBack?: () => void;
  /** Afficher le bouton de retour à l'accueil */
  showHomeButton?: boolean;
  /** Afficher le bouton de rechargement */
  showRetryButton?: boolean;
  /** Nombre de tentatives automatiques */
  autoRetryCount?: number;
  /** Callback appelé après un échec de retry */
  onRetryFailed?: () => void;
  /** Classes CSS supplémentaires */
  className?: string;
  /** Taille du composant */
  size?: 'sm' | 'md' | 'lg';
  /** Variante d'affichage */
  variant?: 'default' | 'minimal' | 'fullscreen';
}

interface ErrorConfig {
  icon: React.ReactNode;
  bgGradient: string;
  borderColor: string;
  iconBg: string;
  iconColor: string;
  titleColor: string;
  defaultTitle: string;
}

// ============================================================================
// CONFIGURATIONS PAR TYPE D'ERREUR
// ============================================================================

const ERROR_CONFIGS: Record<NonNullable<ErrorMessageProps['type']>, ErrorConfig> = {
  error: {
    icon: <AlertCircle className="w-6 h-6" />,
    bgGradient: "from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30",
    borderColor: "border-red-200 dark:border-red-800",
    iconBg: "bg-red-100 dark:bg-red-900/40",
    iconColor: "text-red-600 dark:text-red-400",
    titleColor: "text-red-800 dark:text-red-300",
    defaultTitle: "Une erreur est survenue"
  },
  warning: {
    icon: <AlertTriangle className="w-6 h-6" />,
    bgGradient: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    iconColor: "text-amber-600 dark:text-amber-400",
    titleColor: "text-amber-800 dark:text-amber-300",
    defaultTitle: "Attention"
  },
  info: {
    icon: <AlertCircle className="w-6 h-6" />,
    bgGradient: "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    titleColor: "text-blue-800 dark:text-blue-300",
    defaultTitle: "Information"
  },
  offline: {
    icon: <WifiOff className="w-6 h-6" />,
    bgGradient: "from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/30",
    borderColor: "border-gray-200 dark:border-gray-700",
    iconBg: "bg-gray-100 dark:bg-gray-800",
    iconColor: "text-gray-600 dark:text-gray-400",
    titleColor: "text-gray-800 dark:text-gray-300",
    defaultTitle: "Pas de connexion"
  }
};

// ============================================================================
// HOOK DE GESTION D'ERREUR AVEC RETRY AUTOMATIQUE
// ============================================================================

export const useErrorHandler = (autoRetryCount: number = 0) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = useCallback(async (onRetry?: () => void | Promise<void>) => {
    if (!onRetry || isRetrying) return;
    
    setIsRetrying(true);
    try {
      await onRetry();
      setRetryCount(0);
    } catch (error) {
      console.error('Retry failed:', error);
      setRetryCount(prev => prev + 1);
    } finally {
      setIsRetrying(false);
    }
  }, [isRetrying]);

  const shouldAutoRetry = useCallback(() => {
    return retryCount < autoRetryCount;
  }, [retryCount, autoRetryCount]);

  return {
    handleRetry,
    isRetrying,
    retryCount,
    shouldAutoRetry
  };
};

// ============================================================================
// COMPOSANT PRINCIPAL D'ERREUR
// ============================================================================

const ErrorMessage = memo(({
  message,
  description,
  type = 'error',
  title,
  onRetry,
  onBack,
  showHomeButton = true,
  showRetryButton = true,
  autoRetryCount = 0,
  onRetryFailed,
  className = '',
  size = 'md',
  variant = 'default'
}: ErrorMessageProps) => {
  const config = ERROR_CONFIGS[type];
  const { handleRetry, isRetrying, retryCount, shouldAutoRetry } = useErrorHandler(autoRetryCount);

  // Retry automatique
  useEffect(() => {
    if (shouldAutoRetry() && onRetry && !isRetrying) {
      const timer = setTimeout(() => {
        handleRetry(onRetry);
      }, 1000 * (retryCount + 1));
      
      return () => clearTimeout(timer);
    }
    
    if (retryCount >= autoRetryCount && retryCount > 0 && onRetryFailed) {
      onRetryFailed();
    }
  }, [shouldAutoRetry, onRetry, handleRetry, isRetrying, retryCount, autoRetryCount, onRetryFailed]);

  const handleRetryClick = useCallback(() => {
    handleRetry(onRetry);
  }, [handleRetry, onRetry]);

  const handleHomeClick = useCallback(() => {
    window.location.href = '/';
  }, []);

  // Classes selon la taille
  const sizeClasses = {
    sm: 'p-3 text-sm',
    md: 'p-4 text-base',
    lg: 'p-6 text-lg'
  };

  // Classes selon la variante
  if (variant === 'fullscreen') {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 ${className}`}>
        <div className="max-w-md w-full mx-4">
          <ErrorMessage
            {...{ message, description, type, title, onRetry, onBack, showHomeButton, showRetryButton }}
            variant="default"
            size={size}
          />
        </div>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`rounded-xl ${config.bgGradient} border ${config.borderColor} p-3 ${className}`}>
        <div className="flex items-center gap-2">
          <div className={`rounded-full ${config.iconBg} p-1`}>
            <div className={config.iconColor}>{config.icon}</div>
          </div>
          <p className={`text-sm ${config.titleColor}`}>{title || config.defaultTitle}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl ${config.bgGradient} border ${config.borderColor} ${sizeClasses[size]} ${className}`}>
      <div className="flex flex-col items-center text-center">
        {/* Icône */}
        <div className={`rounded-full ${config.iconBg} p-3 mb-4`}>
          <div className={config.iconColor}>{config.icon}</div>
        </div>

        {/* Titre */}
        <h3 className={`font-bold ${config.titleColor} text-lg mb-2`}>
          {title || config.defaultTitle}
        </h3>

        {/* Message */}
        {message && (
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
            {message}
          </p>
        )}

        {/* Description */}
        {description && (
          <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">
            {description}
          </p>
        )}

        {/* Boutons d'action */}
        <div className="flex flex-wrap gap-3 justify-center mt-2">
          {showRetryButton && onRetry && (
            <button
              onClick={handleRetryClick}
              disabled={isRetrying}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isRetrying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Nouvelle tentative...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Réessayer</span>
                </>
              )}
            </button>
          )}

          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>
          )}

          {showHomeButton && (
            <button
              onClick={handleHomeClick}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 text-sm font-medium rounded-xl hover:bg-purple-100 dark:hover:bg-purple-950/50 transition-all duration-200"
            >
              <Home className="w-4 h-4" />
              <span>Accueil</span>
            </button>
          )}
        </div>

        {/* Indicateur de tentatives */}
        {autoRetryCount > 0 && retryCount > 0 && retryCount < autoRetryCount && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Tentative {retryCount}/{autoRetryCount}...
          </p>
        )}
      </div>
    </div>
  );
});

ErrorMessage.displayName = 'ErrorMessage';

// ============================================================================
// COMPOSANT DE BOUNDARY D'ERREUR
// ============================================================================

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean; error: Error | null }> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <ErrorMessage
          type="error"
          title="Erreur inattendue"
          message="Un problème technique est survenu"
          description={this.state.error?.message || "Veuillez réessayer plus tard"}
          showRetryButton={true}
          onRetry={() => window.location.reload()}
        />
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
export default ErrorMessage;