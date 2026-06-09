'use client';
import { AlertCircle, AlertTriangle, ChevronLeft, Home, RefreshCw, WifiOff } from 'lucide-react';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';

interface ErrorMessageProps {
  message?: string;
  description?: string;
  type?: 'error' | 'warning' | 'info' | 'offline';
  title?: string;
  onRetry?: () => void | Promise<void>;
  onBack?: () => void;
  showHomeButton?: boolean;
  showRetryButton?: boolean;
  autoRetryCount?: number;
  onRetryFailed?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
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

const sizeClasses = {
  sm: 'p-3 text-sm',
  md: 'p-4 text-base',
  lg: 'p-6 text-lg'
} as const;

export const useErrorHandler = (autoRetryCount: number = 0) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const clearRetryTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const shouldAutoRetry = useCallback(() => {
    return retryCount < autoRetryCount;
  }, [retryCount, autoRetryCount]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    handleRetry,
    isRetrying,
    retryCount,
    shouldAutoRetry,
    clearRetryTimeout
  };
};

const RetryButton = memo(({
  onClick,
  isRetrying
}: {
  onClick: () => void;
  isRetrying: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={isRetrying}
    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
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
));

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
  const { handleRetry, isRetrying, retryCount, shouldAutoRetry, clearRetryTimeout } = useErrorHandler(autoRetryCount);

  useEffect(() => {
    if (shouldAutoRetry() && onRetry && !isRetrying) {
      const timer = setTimeout(() => {
        handleRetry(onRetry);
      }, 1000 * (retryCount + 1));

      return () => {
        clearTimeout(timer);
        clearRetryTimeout();
      };
    }

    if (retryCount >= autoRetryCount && retryCount > 0 && onRetryFailed) {
      onRetryFailed();
    }
  }, [shouldAutoRetry, onRetry, handleRetry, isRetrying, retryCount, autoRetryCount, onRetryFailed, clearRetryTimeout]);

  const handleRetryClick = useCallback(() => {
    handleRetry(onRetry);
  }, [handleRetry, onRetry]);

  const handleHomeClick = useCallback(() => {
    window.location.href = '/';
  }, []);

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
        <div className={`rounded-full ${config.iconBg} p-3 mb-4`}>
          <div className={config.iconColor}>{config.icon}</div>
        </div>

        <h3 className={`font-bold ${config.titleColor} text-lg mb-2`}>
          {title || config.defaultTitle}
        </h3>

        {message && (
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
            {message}
          </p>
        )}

        {description && (
          <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">
            {description}
          </p>
        )}

        <div className="flex flex-wrap gap-3 justify-center mt-2">
          {showRetryButton && onRetry && (
            <RetryButton onClick={handleRetryClick} isRetrying={isRetrying} />
          )}

          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>
          )}

          {showHomeButton && (
            <button
              onClick={handleHomeClick}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 text-sm font-medium rounded-xl hover:bg-purple-100 dark:hover:bg-purple-950/50 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Accueil</span>
            </button>
          )}
        </div>

        {autoRetryCount > 0 && retryCount > 0 && retryCount < autoRetryCount && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Tentative {retryCount}/{autoRetryCount}...
          </p>
        )}
      </div>
    </div>
  );
});

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render(): React.ReactNode {
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