'use client';
import React, { memo } from 'react';

export interface DetailItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  color: string;
}

export interface DetailCardItemProps {
  item: DetailItem;
  index: number;
}

export const DetailCardItem = memo<DetailCardItemProps>(({ item, index }) => (
  <div
    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-all"
    style={{ transitionDelay: `${index * 50}ms` }}
  >
    <span className="text-gray-700 flex items-center gap-2 text-sm font-medium">
      <div className={`p-1 bg-${item.color}-100 rounded`}>
        <item.icon className={`w-3 h-3 text-${item.color}-600`} />
      </div>
      {item.label}
    </span>

    <span className="font-bold text-gray-900 text-sm">{item.value}</span>
  </div>
));

DetailCardItem.displayName = 'DetailCardItem';