'use client';
import { cn } from '@/lib/utils';
import { memo, useCallback, type ButtonHTMLAttributes, type ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'success' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

interface GlowButtonProps extends BaseButtonProps {
    variant?: Variant;
    size?: Size;
}

const VARIANT_STYLES: Record<Variant, { gradient: string; ring: string; hover: string }> = {
    primary: {
        gradient: 'from-purple-600 via-pink-600 to-blue-700',
        ring: 'ring-purple-400',
        hover: 'hover:from-purple-700 hover:via-pink-700 hover:to-blue-800',
    },
    secondary: {
        gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
        ring: 'ring-cyan-400',
        hover: 'hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-600',
    },
    success: {
        gradient: 'from-blue-800 via-blue-500 to-indigo-500',
        ring: 'ring-green-400',
        hover: 'hover:from-blue-900 hover:via-blue-600 hover:to-indigo-600',
    },
    danger: {
        gradient: 'from-red-500 via-rose-500 to-pink-500',
        ring: 'ring-red-400',
        hover: 'hover:from-red-600 hover:via-rose-600 hover:to-pink-600',
    },
} as const;

const SIZE_STYLES: Record<Size, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
} as const;

const BASE_BUTTON_STYLES = cn(
    'relative font-bold rounded-xl',
    'text-white shadow-md',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'active:scale-[0.98]',
    'transform-gpu'
);

/**
 * GlowButton - Bouton avec effet de brillance
 * @component
 */
export const GlowButton = memo(function GlowButton({
    children,
    onClick,
    disabled = false,
    variant = 'success',
    size = 'md',
    className,
    type = 'button',
    ...props
}: GlowButtonProps) {
    const styles = VARIANT_STYLES[variant];
    const sizeClass = SIZE_STYLES[size];

    const handleClick = useCallback(() => {
        if (!disabled && onClick) {
            onClick();
        }
    }, [disabled, onClick]);

    return (
        <button
            type={type}
            onClick={handleClick}
            disabled={disabled}
            className={cn(
                BASE_BUTTON_STYLES,
                sizeClass,
                'bg-gradient-to-r',
                styles.gradient,
                styles.hover,
                styles.ring,
                className
            )}
            {...props}
        >
            <span className="relative flex items-center justify-center gap-2">
                {children}
            </span>
        </button>
    );
});

GlowButton.displayName = 'GlowButton';

/**
 * NeonButton - Bouton avec effet néon
 * @component
 */
export const NeonButton = memo(function NeonButton({
    children,
    onClick,
    disabled = false,
    className,
    type = 'button',
    ...props
}: BaseButtonProps) {
    const handleClick = useCallback(() => {
        if (!disabled && onClick) {
            onClick();
        }
    }, [disabled, onClick]);

    return (
        <button
            type={type}
            onClick={handleClick}
            disabled={disabled}
            className={cn(
                BASE_BUTTON_STYLES,
                'px-8 py-4 text-lg',
                'bg-gradient-to-r from-purple-500 to-pink-500',
                'hover:from-purple-600 hover:to-pink-600',
                'focus:ring-purple-400',
                className
            )}
            {...props}
        >
            <span className="relative flex items-center gap-2">
                {children}
            </span>
        </button>
    );
});

/**
 * CardButton - Bouton avec effet carte 3D
 * @component
 */
export const CardButton = memo(function CardButton({
    children,
    onClick,
    disabled = false,
    className,
    type = 'button',
    ...props
}: BaseButtonProps) {
    const handleClick = useCallback(() => {
        if (!disabled && onClick) {
            onClick();
        }
    }, [disabled, onClick]);

    return (
        <button
            type={type}
            onClick={handleClick}
            disabled={disabled}
            className={cn(
                BASE_BUTTON_STYLES,
                'relative w-full px-6 py-3 overflow-hidden',
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />
            <div className="absolute inset-0 rounded-xl border border-white/20" />
            <span className="relative flex items-center justify-center gap-2">
                {children}
            </span>
        </button>
    );
});

/**
 * WaveButton - Bouton avec effet vague
 * @component
 */
export const WaveButton = memo(function WaveButton({
    children,
    onClick,
    disabled = false,
    className,
    type = 'button',
    ...props
}: BaseButtonProps) {
    const handleClick = useCallback(() => {
        if (!disabled && onClick) {
            onClick();
        }
    }, [disabled, onClick]);

    return (
        <button
            type={type}
            onClick={handleClick}
            disabled={disabled}
            className={cn(
                BASE_BUTTON_STYLES,
                'relative px-8 py-4 overflow-hidden',
                'bg-gradient-to-r from-blue-800 via-blue-600 to-indigo-800',
                'hover:brightness-110',
                'focus:ring-blue-400',
                className
            )}
            {...props}
        >
            <span className="relative flex items-center justify-center gap-2">
                {children}
            </span>
        </button>
    );
});

/**
 * ParticleButton - Bouton avec effet particules
 * @component
 */
export const ParticleButton = memo(function ParticleButton({
    children,
    onClick,
    disabled = false,
    className,
    type = 'button',
    ...props
}: BaseButtonProps) {
    const handleClick = useCallback(() => {
        if (!disabled && onClick) {
            onClick();
        }
    }, [disabled, onClick]);

    return (
        <button
            type={type}
            onClick={handleClick}
            disabled={disabled}
            className={cn(
                BASE_BUTTON_STYLES,
                'relative px-8 py-4 overflow-hidden',
                'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500',
                'hover:brightness-110',
                'focus:ring-red-400',
                className
            )}
            {...props}
        >
            <span className="relative flex items-center justify-center gap-2">
                {children}
            </span>
        </button>
    );
});

/**
 * SimpleButton - Bouton simple et épuré
 * @component
 */
export const SimpleButton = memo(function SimpleButton({
    children,
    onClick,
    disabled = false,
    className,
    type = 'button',
    ...props
}: BaseButtonProps) {
    const handleClick = useCallback(() => {
        if (!disabled && onClick) {
            onClick();
        }
    }, [disabled, onClick]);

    return (
        <button
            type={type}
            onClick={handleClick}
            disabled={disabled}
            className={cn(
                'px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl',
                'transition-all duration-200',
                'hover:bg-blue-700 hover:scale-[1.02]',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                'active:scale-[0.98]',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transform-gpu',
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
});

// === Export par défaut amélioré ===
const ButtonComponents = {
    GlowButton,
    NeonButton,
    CardButton,
    WaveButton,
    ParticleButton,
    SimpleButton,
} as const;

export default ButtonComponents;

export type { BaseButtonProps, GlowButtonProps, Variant, Size };