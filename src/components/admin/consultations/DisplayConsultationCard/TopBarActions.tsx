import { cx } from "@/lib/functions";
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

const variants = {
  default: 'bg-cosmic-indigo text-white hover:bg-[#2E5AA6]',
  outline: 'border border-cosmic-indigo text-cosmic-indigo bg-white hover:bg-cosmic-indigo hover:text-white',
  ghost: 'bg-transparent text-cosmic-indigo hover:bg-cosmic-indigo/10',
  destructive: 'bg-red-600 text-white hover:bg-red-700',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', loading = false, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full inline-block" />
      ) : null}

      {children}
    </button>
  )
);

type DerivedConsultationDisplay = {
  isNotified: boolean;
  dateGenLabel?: string | null;
};

interface TopBarActionsProps {
  derived: DerivedConsultationDisplay;
  handleRefresh: () => void;
  handleNotify: () => void;
  onBack?: () => void;
}

export function TopBarActions({ derived, handleRefresh, handleNotify, onBack }: TopBarActionsProps) {

  return (
    <div className="sticky top-0 z-10 bg-white/70 dark:bg-zinc-950/35 backdrop-blur supports-[backdrop-filter]:backdrop-blur-xl border-b border-slate-200/60 dark:border-zinc-800/60">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-2 px-3 py-3 sm:flex-row sm:gap-3">
        {onBack && (
          <Button size="sm" variant="ghost" className="w-full sm:w-auto" onClick={onBack} aria-label="Retour">
            ← Retour
          </Button>
        )}
        <div className="flex w-full flex-col items-center justify-center gap-2 sm:w-auto sm:flex-row">
          <Button
            size="sm"
            variant="ghost"
            className="w-full sm:w-auto"
            onClick={handleRefresh}
            title="Rafraîchir / Re-générer"
            aria-label="Rafraîchir"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Modifier
          </Button>
          <div className="flex w-full items-center justify-center gap-2 sm:w-auto">
            <span
              className={cx(
                "inline-flex items-center justify-center gap-2 rounded-full px-3 py-1 text-[11px] font-extrabold",
                derived.isNotified
                  ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/25 dark:text-emerald-200"
                  : "bg-amber-50 text-amber-900 dark:bg-amber-900/25 dark:text-amber-200"
              )}
            >
              {derived.isNotified ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Notifié
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4" />
                  Non notifié
                </>
              )}
            </span>
            {!derived.isNotified && (
              <Button
                size="sm"
                variant="default"
                className="w-full sm:w-auto"
                onClick={handleNotify}
                aria-label="Notifier l'utilisateur"
              >
                Notifier
              </Button>
            )}
          </div>
        </div>
        {derived.dateGenLabel && (
          <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
            Généré le {derived.dateGenLabel}
          </span>
        )}
      </div>
    </div>
  );
}
