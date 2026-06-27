'use client';
import { cn } from '@/lib/utils';
import { AlertCircle, AlertTriangle, ChevronLeft, Home, RefreshCw, WifiOff } from 'lucide-react';
import React, { memo, useCallback, useEffect, useRef, useState, type ComponentPropsWithoutRef } from 'react';

type ErrorType = 'error' | 'warning' | 'info' | 'offline';
type Size = 'sm' | 'md' | 'lg';
type Variant = 'default' | 'minimal' | 'fullscreen';

interface ErrorMessageProps extends ComponentPropsWithoutRef<'div'> {
  message?: string;
  description?: string;
  type?: ErrorType;
  title?: string;
  onRetry?: () => void | Promise<void>;
  onBack?: () => void;
  showHomeButton?: boolean;
  showRetryButton?: boolean;
  autoRetryCount?: number;
  onRetryFailed?: () => void;
  size?: Size;
  variant?: Variant;
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

const ERROR_CONFIGS: Record<ErrorType, ErrorConfig> = {
  error: {
    icon: <AlertCircle className="w-6 h-6" aria-hidden="true" />,
    bgGradient: "from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30",
    borderColor: "border-red-200 dark:border-red-800",
    iconBg: "bg-red-200 dark:bg-red-900/40",
    iconColor: "text-red-600 dark:text-red-400",
    titleColor: "text-red-800 dark:text-red-300",
    defaultTitle: "Une erreur est survenue"
  },
  warning: {
    icon: <AlertTriangle className="w-6 h-6" aria-hidden="true" />,
    bgGradient: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    iconColor: "text-amber-600 dark:text-amber-400",
    titleColor: "text-amber-800 dark:text-amber-300",
    defaultTitle: "Attention"
  },
  info: {
    icon: <AlertCircle className="w-6 h-6" aria-hidden="true" />,
    bgGradient: "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    titleColor: "text-blue-800 dark:text-blue-300",
    defaultTitle: "Information"
  },
  offline: {
    icon: <WifiOff className="w-6 h-6" aria-hidden="true" />,
    bgGradient: "from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/30",
    borderColor: "border-gray-200 dark:border-gray-700",
    iconBg: "bg-gray-100 dark:bg-gray-800",
    iconColor: "text-gray-600 dark:text-gray-400",
    titleColor: "text-gray-800 dark:text-gray-300",
    defaultTitle: "Pas de connexion"
  }
} as const;

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'p-3 text-sm',
  md: 'p-4 text-base',
  lg: 'p-6 text-lg'
} as const;

const BASE_CONTAINER_STYLES = "rounded-2xl border";
const BASE_ICON_STYLES = "rounded-full p-3 mb-4";
const BASE_BUTTON_STYLES = "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

interface UseErrorHandlerReturn {
  handleRetry: (onRetry?: () => void | Promise<void>) => Promise<void>;
  isRetrying: boolean;
  retryCount: number;
  shouldAutoRetry: boolean;
  clearRetryTimeout: () => void;
}

export const useErrorHandler = (autoRetryCount: number = 0): UseErrorHandlerReturn => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleRetry = useCallback(async (onRetry?: () => void | Promise<void>) => {
    if (!onRetry || isRetrying || !isMountedRef.current) return;

    setIsRetrying(true);
    try {
      await onRetry();
      if (isMountedRef.current) {
        setRetryCount(0);
      }
    } catch (error) {
      console.error('Retry failed:', error);
      if (isMountedRef.current) {
        setRetryCount(prev => prev + 1);
      }
    } finally {
      if (isMountedRef.current) {
        setIsRetrying(false);
      }
    }
  }, [isRetrying]);

  const clearRetryTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const shouldAutoRetry = retryCount < autoRetryCount;

  return {
    handleRetry,
    isRetrying,
    retryCount,
    shouldAutoRetry,
    clearRetryTimeout
  };
};

const RetryButton = memo(function RetryButton({
  onClick,
  isRetrying
}: {
  onClick: () => void;
  isRetrying: boolean;
}) {
  const handleClick = useCallback(() => {
    if (!isRetrying) onClick();
  }, [isRetrying, onClick]);

  return (
    <button
      onClick={handleClick}
      disabled={isRetrying}
      className={cn(
        BASE_BUTTON_STYLES,
        "bg-gradient-to-r from-blue-500 to-indigo-500 text-white",
        "hover:from-blue-600 hover:to-indigo-600",
        "focus:ring-blue-400 shadow-md"
      )}
      aria-busy={isRetrying}
    >
      {isRetrying ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          <span>Nouvelle tentative...</span>
        </>
      ) : (
        <>
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          <span>Réessayer</span>
        </>
      )}
    </button>
  );
});

const ActionButtons = memo(function ActionButtons({
  showRetryButton,
  onRetry,
  showHomeButton,
  onBack,
  isRetrying,
  handleRetryClick
}: {
  showRetryButton: boolean;
  onRetry?: () => void | Promise<void>;
  showHomeButton: boolean;
  onBack?: () => void;
  isRetrying: boolean;
  handleRetryClick: () => void;
}) {
  const handleHomeClick = useCallback(() => {
    window.location.href = '/star/learning';
  }, []);

  const handleBackClick = useCallback(() => {
    if (onBack) onBack();
  }, [onBack]);

  return (
    <div className="flex flex-wrap gap-3 justify-center mt-2">
      {showRetryButton && onRetry && (
        <RetryButton onClick={handleRetryClick} isRetrying={isRetrying} />
      )}

      {onBack && (
        <button
          onClick={handleBackClick}
          className={cn(
            BASE_BUTTON_STYLES,
            "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
            "hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-gray-400"
          )}
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          <span>Retour</span>
        </button>
      )}

      {showHomeButton && (
        <button
          onClick={handleHomeClick}
          className={cn(
            BASE_BUTTON_STYLES,
            "bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400",
            "hover:bg-purple-100 dark:hover:bg-purple-950/50",
            "focus:ring-purple-400"
          )}
        >
          <Home className="w-4 h-4" aria-hidden="true" />
          <span>Accueil</span>
        </button>
      )}
    </div>
  );
});

const ErrorMessage = memo(function ErrorMessage({
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
  variant = 'default',
  ...props
}: ErrorMessageProps) {
  const config = ERROR_CONFIGS[type];
  const { handleRetry, isRetrying, retryCount, shouldAutoRetry, clearRetryTimeout } = useErrorHandler(autoRetryCount);

  useEffect(() => {
    if (shouldAutoRetry && onRetry && !isRetrying) {
      const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
      const timer = setTimeout(() => {
        handleRetry(onRetry);
      }, delay);

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

  if (variant === 'fullscreen') {
    return (
      <div className={cn(
        "min-h-screen flex items-center justify-center",
        "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900",
        className
      )}>
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
      <div
        className={cn(
          BASE_CONTAINER_STYLES,
          config.bgGradient,
          config.borderColor,
          "p-3",
          className
        )}
        role="alert"
        {...props}
      >
        <div className="flex items-center gap-2">
          <div className={cn("rounded-full p-1", config.iconBg)}>
            <div className={config.iconColor}>{config.icon}</div>
          </div>
          <p className={cn("text-sm", config.titleColor)}>
            {title || config.defaultTitle}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        BASE_CONTAINER_STYLES,
        config.bgGradient,
        config.borderColor,
        SIZE_CLASSES[size],
        className
      )}
      role="alert"
      {...props}
    >
      <div className="flex flex-col items-center text-center">
        <div className={cn(BASE_ICON_STYLES, config.iconBg)}>
          <div className={config.iconColor}>{config.icon}</div>
        </div>

        <h3 className={cn("font-bold text-lg mb-2", config.titleColor)}>
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

        <ActionButtons
          showRetryButton={showRetryButton}
          onRetry={onRetry}
          showHomeButton={showHomeButton}
          onBack={onBack}
          isRetrying={isRetrying}
          handleRetryClick={handleRetryClick}
        />

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
    if (process.env.NODE_ENV === 'production') {
      console.error('ErrorBoundary caught :', { error, errorInfo });
    } else {
      console.error('ErrorBoundary caught an error :', error, errorInfo);
    }

    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

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
          description={process.env.NODE_ENV === 'development' ? this.state.error?.message : "Veuillez réessayer plus tard"}
          showRetryButton={true}
          onRetry={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
export default ErrorMessage;