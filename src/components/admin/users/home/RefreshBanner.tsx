'use client';
import { memo } from 'react';
import { motion,Variants  } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

const bannerVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } }
};

interface RefreshBannerProps {
  loading: boolean;
  isRefreshing: boolean;
  hasUsers: boolean;
}

const RefreshBanner = memo<RefreshBannerProps>(({ loading, isRefreshing, hasUsers }) => {
  if ((!loading && !isRefreshing) || !hasUsers) return null;
  
  return (
    <motion.div
      variants={bannerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="mb-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-3 flex items-center justify-center gap-2 shadow-lg"
    >
      <RefreshCw className="w-4 h-4 animate-spin" />
      <span className="text-sm font-medium">Mise à jour des données en cours...</span>
    </motion.div>
  );
});

RefreshBanner.displayName = 'RefreshBanner';

export default RefreshBanner;
