// components/atoms/Case/Case.tsx
'use client';

import { CaseProps } from '@/lib/interfaces';
import { memo, useMemo } from 'react';
 

const BASE_CLASSES = [
  'relative',
  'flex items-center justify-center',
  'border border-white',
  'overflow-hidden',
  'aspect-square',
  'transition-colors duration-150',
  'select-none',
].join(' ');

export const Case = memo(({
  caseItem,
  size = '100%',
  onClick,
  isSelected = false,
  isLocked = false,
  content,
  style = {},
  className = '',
  ariaLabel,
}: CaseProps) => {
  const handleClick = () => {
    if (onClick && !isLocked) {
      onClick(caseItem);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  const caseStyle = useMemo(() => ({
    width: size,
    height: size,
    cursor: isLocked ? 'default' : 'pointer',
    ...style,
  }), [size, isLocked, style]);

  const statusClasses = useMemo(() => {
    const classes = [];
    if (isLocked) classes.push('bg-green-500');
    else if (isSelected) classes.push('bg-blue-500 ring-2 ring-blue-300');
    else classes.push('bg-gray-700 hover:bg-gray-600');
    return classes.join(' ');
  }, [isLocked, isSelected]);

  return (
    <div
      role="button"
      tabIndex={isLocked ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`${BASE_CLASSES} ${statusClasses} ${className}`}
      style={caseStyle}
      aria-label={ariaLabel || `Case ${caseItem.position}`}
      aria-disabled={isLocked}
    >
      {content}
    </div>
  );
});

Case.displayName = 'Case';