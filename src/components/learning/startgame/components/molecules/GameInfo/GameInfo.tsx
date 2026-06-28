// components/molecules/GameInfo/GameInfo.tsx
'use client';

import { memo } from 'react';
import { Trophy, BarChart3 } from 'lucide-react';

interface GameInfoProps {
  gameType: string;
  level: number | string;
  className?: string;
}

export const GameInfo = memo(({ gameType, level, className = '' }: GameInfoProps) => {
  const infoItems = [
    {
      icon: Trophy,
      label: 'Jeu en cours',
      value: gameType,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
    {
      icon: BarChart3,
      label: 'Niveau du jeu',
      value: level,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      {infoItems.map(({ icon: Icon, label, value, iconBg, iconColor }) => (
        <div
          key={label}
          className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100"
        >
          <div className={`p-2 ${iconBg} rounded-lg`}>
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              {label}
            </p>
            <p className="font-semibold text-gray-800">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
});

GameInfo.displayName = 'GameInfo';