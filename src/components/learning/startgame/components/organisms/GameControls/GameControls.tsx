// components/organisms/GameControls/GameControls.tsx
'use client';

import { memo } from 'react';
 
import { formatTime } from '@/lib/learning/functions';
import { Button } from '../../atoms/Button/Button';

interface GameControlsProps {
  showReference: boolean;
  onToggleReference: () => void;
  onLockSelection: () => void;
  timeElapsed: number;
  isLockingDisabled?: boolean;
  className?: string;
}

export const GameControls = memo(({
  showReference,
  onToggleReference,
  onLockSelection,
  timeElapsed,
  isLockingDisabled = false,
  className = '',
}: GameControlsProps) => {
  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <h2 className="text-center text-sm font-bold text-blue-700 mb-3 tracking-wide">
        {showReference ? '📋 Plateau P1 (Référence)' : '🎮 Plateau P2'}
      </h2>

      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Button
          variant="secondary"
          size="md"
          onClick={onToggleReference}
        >
          {showReference ? 'Jouer' : 'Voir P1'}
        </Button>

        {!showReference && (
          <Button
            variant="primary"
            size="md"
            onClick={onLockSelection}
            disabled={isLockingDisabled}
          >
            Ajuster
          </Button>
        )}

        <div className="flex items-center gap-2 px-4 py-1.5 bg-white/80 rounded-full shadow-sm">
          <span className="text-sm" aria-hidden="true">⏱</span>
          <span className="font-mono font-bold text-blue-600">
            {formatTime(timeElapsed)}
          </span>
        </div>
      </div>
    </div>
  );
});

GameControls.displayName = 'GameControls';