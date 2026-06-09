'use client';
import { memo } from 'react';

interface GlowButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'success' | 'danger';
    size?: 'sm' | 'md' | 'lg';
}

interface BaseButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
}

const variantStyles = {
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

const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
} as const;

export const GlowButton = memo(({
    children,
    onClick,
    disabled = false,
    variant = 'success',
    size = 'md'
}: GlowButtonProps) => {
    const styles = variantStyles[variant];
    const sizeClass = sizeStyles[size];

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                relative w-full ${sizeClass}
                font-bold rounded-xl
                bg-gradient-to-r ${styles.gradient} ${styles.hover}
                text-white shadow-md
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.ring}
                disabled:opacity-50 disabled:cursor-not-allowed
            `}
            type="button"
        >
            <span className="relative flex items-center justify-center gap-2">
                {children}
            </span>
        </button>
    );
});

export const NeonButton = memo(({ children, onClick }: BaseButtonProps) => (
    <button
        onClick={onClick}
        className="relative px-8 py-4 text-lg font-bold text-white rounded-xl transition-colors duration-200 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
        type="button"
        style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
    >
        <span className="relative flex items-center gap-2">
            {children}
        </span>
    </button>
));

export const CardButton = memo(({ children, onClick }: BaseButtonProps) => (
    <button
        onClick={onClick}
        className="relative w-full px-6 py-3 text-white font-bold rounded-xl overflow-hidden transition-colors duration-200 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
        type="button"
    >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />
        <div className="absolute inset-0 rounded-xl border border-white/20" />
        <span className="relative flex items-center justify-center gap-2">
            {children}
        </span>
    </button>
));

export const WaveButton = memo(({ children, onClick }: BaseButtonProps) => (
    <button
        onClick={onClick}
        className="relative px-8 py-4 text-white font-bold rounded-xl overflow-hidden transition-colors duration-200 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        type="button"
        style={{
            background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)',
        }}
    >
        <span className="relative flex items-center justify-center gap-2">
            {children}
        </span>
    </button>
));

export const ParticleButton = memo(({ children, onClick }: BaseButtonProps) => (
    <button
        onClick={onClick}
        className="relative px-8 py-4 text-white font-bold rounded-xl overflow-hidden transition-colors duration-200 hover:brightness-110 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
        type="button"
    >
        <span className="relative flex items-center justify-center gap-2">
            {children}
        </span>
    </button>
));

export const SimpleButton = memo(({ children, onClick, disabled = false }: BaseButtonProps & { disabled?: boolean }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        type="button"
    >
        {children}
    </button>
));

export default { GlowButton, NeonButton, CardButton, WaveButton, ParticleButton, SimpleButton, };