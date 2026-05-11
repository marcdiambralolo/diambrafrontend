import { Variants } from 'framer-motion';
import { useMemo } from 'react';

export function useReportsHeaderAnimation() {
  const containerVariants: Variants = useMemo(() => ({
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1
      }
    }
  }), []);

  const itemVariants: Variants = useMemo(() => ({
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  }), []);

  return { containerVariants, itemVariants };
}