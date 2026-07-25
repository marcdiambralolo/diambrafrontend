'use client';
import { memo } from 'react';

const BUTTON_BASE_STYLES = "px-6 py-2 font-semibold rounded-xl shadow-md transition-all duration-300";

interface ActionButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    variant: 'primary' | 'secondary';
    ariaLabel: string;
}

const ActionButton = memo(({ onClick, children, variant, ariaLabel }: ActionButtonProps) => {
    const variantStyles = {
        primary: "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white",
        secondary: "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
    };

    return (
        <button
            onClick={onClick}
            className={`${BUTTON_BASE_STYLES} ${variantStyles[variant]}`}
            aria-label={ariaLabel}
            role="button"
            tabIndex={0}
        >
            {children}
        </button>
    );
});

export default ActionButton;