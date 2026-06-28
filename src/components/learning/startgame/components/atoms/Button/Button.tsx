// components/atoms/Button/Button.tsx
'use client';

import { memo, forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const VARIANT_CLASSES = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500',
  outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
};

const SIZE_CLASSES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-base',
};

export const Button = memo(forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    children,
    ...props
  }, ref) => {
    const classes = `
      inline-flex items-center justify-center
      font-semibold rounded-xl
      transition-colors duration-150
      focus:outline-none focus:ring-2 focus:ring-offset-2
      ${VARIANT_CLASSES[variant]}
      ${SIZE_CLASSES[size]}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `;

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
));

Button.displayName = 'Button';