// components/atoms/ProgressBar/ProgressBar.tsx
'use client';

import { memo } from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  className?: string;
  showPercentage?: boolean;
}

export const ProgressBar = memo(({
  value,
  max,
  label = 'Progression',
  className = '',
  showPercentage = true,
}: ProgressBarProps) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{label}</span>
        <span>
          {value}/{max}
          {showPercentage && ` (${Math.round(percentage)}%)`}
        </span>
      </div>
      <div 
        className="w-full bg-gray-200 rounded-full h-2 overflow-hidden"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-blue-600 transition-all duration-150"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';