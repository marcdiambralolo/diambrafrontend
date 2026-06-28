// components/organisms/GameBoard/GameBoard.tsx
'use client';

import { memo, useMemo } from 'react';
 
import { Grid } from '../../atoms/Grid/Grid';
import type { GameCase as GameCaseType } from '@/lib/interfaces';
import { GameCaseMolecule } from '../../molecules/GameCase/GameCase';

interface GameBoardProps {
  cases: GameCaseType[];
  niveau: number;
  mode: 'number' | 'color' | 'image' | 'letter';
  selectedCase: GameCaseType | null;
  onSelectCase: (caseItem: GameCaseType) => void;
  isReference?: boolean;
  pieces?: string[];
  letterPairs?: string[];
  className?: string;
}

export const GameBoard = memo(({
  cases,
  niveau,
  mode,
  selectedCase,
  onSelectCase,
  isReference = false,
  pieces = [],
  letterPairs = [],
  className = '',
}: GameBoardProps) => {
  const renderCase = (caseItem: GameCaseType) => {
    const isSelected = selectedCase?.id === caseItem.id;
    const isLocked = caseItem.isLocked || false;

    return (
      <GameCaseMolecule
        caseItem={caseItem}
        size="100%"
        mode={mode}
        isSelected={isSelected}
        isLocked={isLocked}
        onClick={onSelectCase}
        image={pieces[caseItem.position]}
        letterPairs={letterPairs}
      />
    );
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <Grid
        cases={cases}
        columns={niveau}
        renderCase={renderCase}
      />
    </div>
  );
});

GameBoard.displayName = 'GameBoard';