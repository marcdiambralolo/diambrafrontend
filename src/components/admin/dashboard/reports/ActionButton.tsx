"use client";
import { memo } from 'react';
import { motion,Variants  } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

const itemVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

const ActionButton = memo(({ icon: Icon, label, variant = 'outline' }: { icon: LucideIcon, label: string, variant?: 'outline' | 'primary' }) => (
  <motion.button
    variants={itemVariants}
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.95 }}
    className={`
      group relative flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-sm
      transition-all duration-300 shadow-lg backdrop-blur-sm overflow-hidden
      ${variant === 'primary' 
        ? 'bg-gradient-to-r from-cosmic-purple to-cosmic-indigo text-white hover:from-cosmic-indigo hover:to-cosmic-pink shadow-cosmic-indigo/40 hover:shadow-cosmic-pink/60' 
        : 'bg-white/80 dark:bg-[#162A56] text-cosmic-purple dark:text-cosmic-pink border border-cosmic-indigo dark:border-cosmic-pink hover:bg-ocean-50 dark:hover:bg-cosmic-indigo/30 hover:border-cosmic-pink dark:hover:border-cosmic-pink/80'
      }
    `}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
    <Icon className="w-4 h-4 relative z-10" />
    <span className="relative z-10 hidden sm:inline">{label}</span>
  </motion.button>
));

ActionButton.displayName = 'ActionButton';

export default ActionButton;