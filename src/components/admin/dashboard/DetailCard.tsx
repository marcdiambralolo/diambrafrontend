'use client';
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import CacheLink from '@/components/commons/CacheLink';
import { DetailCardItem, DetailItem } from './DetailCardItem';
import { ProgressBar } from './ProgressBar';

export interface DetailCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  items: DetailItem[];
  progressLabel: string;
  progressValue: string | number;
  progressColor: string;
  progressDelay: number;
  linkHref: string;
}

export const DetailCard = memo<DetailCardProps>(({
  title,
  icon: Icon,
  iconColor,
  items,
  progressLabel,
  progressValue,
  progressColor,
  progressDelay,
  linkHref
}) => (
  <motion.div
    whileHover={{ y: -3 }}
    className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 p-4 transition-all"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 bg-${iconColor}-50 rounded-lg`}>
          <Icon className={`w-4 h-4 text-${iconColor}-600`} />
        </div>
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
      </div>
      <CacheLink
        href={linkHref}
        className="text-blue-600 hover:text-blue-700 text-xs font-semibold hover:underline transition-colors"
      >
        Voir tout →
      </CacheLink>
    </div>
    
    <div className="space-y-2.5">
      {items.map((item, index) => (
        <DetailCardItem key={index} item={item} index={index} />
      ))}
    </div>
    <ProgressBar
      percentage={progressValue}
      label={progressLabel}
      delay={progressDelay}
      color={progressColor}
    />
  </motion.div>
));

DetailCard.displayName = 'DetailCard';