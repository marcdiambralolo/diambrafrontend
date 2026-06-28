// components/molecules/GameCase/GameCase.tsx
'use client';

import { memo, useMemo } from 'react';
import Image from 'next/image';
import { Case } from '../../atoms/Case/Case';
import type { GameCase } from '@/lib/interfaces';

interface GameCaseProps {
  caseItem: GameCase;
  size: number | string;
  mode: 'number' | 'color' | 'image' | 'letter';
  isSelected: boolean;
  isLocked: boolean;
  onClick?: (caseItem: GameCase) => void;
  image?: string;
  letterPairs?: string[];
}

export const GameCaseMolecule = memo(({
  caseItem,
  size,
  mode,
  isSelected,
  isLocked,
  onClick,
  image,
  letterPairs = [],
}: GameCaseProps) => {
  const content = useMemo(() => {
    const value = caseItem.value;
    const index = typeof value === 'number' ? value : parseInt(String(value), 10);

    switch (mode) {
      case 'number':
        return <span className="text-white text-2xl font-bold">{value}</span>;
      
      case 'color': {
        const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
        return (
          <div 
            className="w-full h-full rounded-lg" 
            style={{ backgroundColor: colors[index % colors.length] }}
            role="img"
            aria-label={`Couleur ${index % colors.length + 1}`}
          />
        );
      }
      
      case 'image':
        if (image) {
          return (
            <Image
              src={image}
              alt={`Case ${caseItem.position}`}
              width={100}
              height={100}
              className="object-cover w-full h-full rounded-lg"
              priority={false}
            />
          );
        }
        return null;
      
      case 'letter':
        return (
          <span className="text-white text-2xl font-bold">
            {letterPairs[index] || '?'}
          </span>
        );
      
      default:
        return <span className="text-white text-2xl font-bold">{value}</span>;
    }
  }, [caseItem, mode, image, letterPairs]);

  return (
    <Case
      caseItem={caseItem}
      size={size}
      onClick={onClick}
      isSelected={isSelected}
      isLocked={isLocked}
      content={content}
      ariaLabel={`Case ${caseItem.position} - ${isLocked ? 'Verrouillée' : 'Libre'}`}
    />
  );
}); 