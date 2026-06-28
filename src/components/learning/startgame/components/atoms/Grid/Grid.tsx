// components/atoms/Grid/Grid.tsx
'use client';

import { GridProps } from '@/lib/interfaces';
import { memo } from 'react';
 

export const Grid = memo(({ 
  cases, 
  columns, 
  renderCase, 
  className = '' 
}: GridProps) => {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gridTemplateRows: `repeat(${columns}, 1fr)`,
    gap: '4px',
  };

  return (
    <div 
      className={`w-full ${className}`} 
      style={gridStyle}
      role="grid"
      aria-label="Grille de jeu"
    >
      {cases.map((caseItem, index) => (
        <div key={caseItem.id || index} role="gridcell">
          {renderCase(caseItem, index)}
        </div>
      ))}
    </div>
  );
});

Grid.displayName = 'Grid';