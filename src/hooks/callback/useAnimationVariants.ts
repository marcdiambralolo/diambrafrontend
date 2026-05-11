'use client';
import { useMemo } from 'react';

export function useAnimationVariants() {
  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          staggerChildren: 0.1,
        },
      },
      exit: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.3 },
      },
    }),
    []
  );

  const itemVariants = useMemo(
    () => ({
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0 },
    }),
    []
  );

  const pulseVariants = useMemo(
    () => ({
      pulse: {
        scale: [1, 1.05, 1],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut' as const,
        },
      },
    }),
    []
  );

  return { containerVariants, itemVariants, pulseVariants, };
}