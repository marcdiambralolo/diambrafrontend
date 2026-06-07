'use client';
import { memo } from 'react';

interface GlowButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'success' | 'danger';
    size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
    primary: {
        gradient: 'from-purple-600 via-pink-600 to-blue-700',
        glow: 'rgba(168, 85, 247, 0.7)',
        hoverGlow: 'rgba(168, 85, 247, 0.9)',
        ring: 'ring-purple-400',
    },
    secondary: {
        gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
        glow: 'rgba(6, 182, 212, 0.7)',
        hoverGlow: 'rgba(6, 182, 212, 0.9)',
        ring: 'ring-cyan-400',
    },
    success: {
        gradient: 'from-blue-800 via-blue-500 to-indigo-500',
        glow: 'rgba(34, 197, 94, 0.7)',
        hoverGlow: 'rgba(34, 197, 94, 0.9)',
        ring: 'ring-green-400',
    },
    danger: {
        gradient: 'from-red-500 via-rose-500 to-pink-500',
        glow: 'rgba(239, 68, 68, 0.7)',
        hoverGlow: 'rgba(239, 68, 68, 0.9)',
        ring: 'ring-red-400',
    },
};

const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
};

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
                relative group overflow-hidden
                ${sizeClass}
                font-bold rounded-xl
                bg-gradient-to-r ${styles.gradient}
                text-white shadow-xl w-full
                transition-all duration-300
                transform hover:scale-105 active:scale-95
                focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.ring}
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                before:absolute before:inset-0
                before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
                before:-translate-x-full before:skew-x-12
                hover:before:translate-x-full before:transition-transform before:duration-700
                after:absolute after:inset-0
                after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent
                after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300
            `}
            type="button"
        >
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

            <span className="absolute inset-0 overflow-hidden rounded-xl">
                <span className="absolute -top-10 -left-10 w-20 h-20 bg-white/30 rounded-full blur-xl group-hover:scale-300 transition-transform duration-700" />
                <span className="absolute -bottom-10 -right-10 w-20 h-20 bg-white/30 rounded-full blur-xl group-hover:scale-300 transition-transform duration-700 delay-100" />
            </span>

            <span className="relative flex items-center justify-center gap-2 group-hover:gap-3 transition-all duration-300">
                <span className="absolute left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:left-4 transition-all duration-300">
                    ✨
                </span>

                <span className="group-hover:translate-x-2 transition-transform duration-300">
                    {children}
                </span>

                <span className="absolute right-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:right-4 transition-all duration-300">
                    ⚡
                </span>
            </span>
        </button>
    );
});

GlowButton.displayName = 'GlowButton';

export const NeonButton = memo(({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <button
        onClick={onClick}
        className="relative px-8 py-4 text-lg font-bold text-white rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
        type="button"
        style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 0 20px rgba(102, 126, 234, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
        }}
    >
        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        <span className="relative flex items-center gap-2">
            <span className="animate-pulse">✨</span>
            {children}
            <span className="animate-pulse delay-150">⚡</span>
        </span>
    </button>
));

export const CardButton = memo(({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <button
        onClick={onClick}
        className="relative w-full px-6 py-3 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
        type="button"
    >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-xy" />

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        <div className="absolute inset-0 rounded-xl border-2 border-white/20 group-hover:border-white/40 transition-colors duration-300" />

        <span className="relative flex items-center justify-center gap-2">
            {children}
        </span>
    </button>
));

export const WaveButton = memo(({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <button
        onClick={onClick}
        className="relative px-8 py-4 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl group"
        type="button"
        style={{
            background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 50%, #1e3c72 100%)',
            backgroundSize: '200% auto',
        }}
    >
        <span className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity">
            <svg className="absolute bottom-0 w-full h-12 animate-wave" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,64L80,69C160,75,240,85,320,80C400,75,480,53,560,48C640,43,720,53,800,64C880,75,960,85,1040,80C1120,75,1200,53,1200,53L1200,120L0,120Z" fill="rgba(255,255,255,0.15)" />
            </svg>

            <svg className="absolute bottom-0 w-full h-16 animate-wave-delay" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,96L80,90C160,85,240,75,320,80C400,85,480,107,560,112C640,117,720,107,800,96C880,85,960,75,1040,80C1120,85,1200,107,1200,107L1200,120L0,120Z" fill="rgba(255,255,255,0.1)" />
            </svg>
        </span>
        <span className="relative flex items-center justify-center gap-2 group-hover:gap-3 transition-all duration-300">
            {children}
        </span>
    </button>
));

export const ParticleButton = memo(({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => {
    const createParticles = (e: React.MouseEvent<HTMLButtonElement>) => {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('span');
            particle.className = 'absolute w-1 h-1 bg-white rounded-full pointer-events-none';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.animation = `particle-fly 0.6s ease-out forwards`;
            particle.style.setProperty('--dx', `${(Math.random() - 0.5) * 100}px`);
            particle.style.setProperty('--dy', `${(Math.random() - 0.5) * 100 - 50}px`);
            button.appendChild(particle);

            setTimeout(() => particle.remove(), 600);
        }

        onClick();
    };

    return (
        <button
            onClick={createParticles}
            className="relative px-8 py-4 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 shadow-xl hover:shadow-2xl group"
            type="button"
        >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            <span className="relative flex items-center justify-center gap-2">
                {children}
            </span>
        </button>
    );
});

const styles = `
@keyframes particle-fly {
    0% {
        transform: translate(0, 0);
        opacity: 1;
    }
    100% {
        transform: translate(var(--dx), var(--dy));
        opacity: 0;
    }
}

@keyframes gradient-xy {
    0%, 100% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
}

@keyframes wave {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-100%);
    }
}

.animate-gradient-xy {
    background-size: 200% 200%;
    animation: gradient-xy 3s ease infinite;
}

.animate-wave {
    animation: wave 3s linear infinite;
}

.animate-wave-delay {
    animation: wave 3s linear infinite -1.5s;
}
`;