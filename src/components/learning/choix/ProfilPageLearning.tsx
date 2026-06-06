'use client';
import Loader from '@/app/loading';
import { useLaMise } from '@/hooks/learning/lamise/useLaMise';
import { memo, useMemo } from 'react';
import { HeaderSection } from '../commons/Features';
import FixedContent from '../commons/FixedContent';
import { InsufficientTokensMessage, MarketButton, PlayButton, StatusBanner, TokenCard } from './Features';

const ProfilPageLearning = () => {
  const {
    handlePlayClick, handleMarketClick, isSufficient, deferredIsSufficient, isPendingPlay, loading,
    isPendingMarket, requiredQuantity, availableQuantity, cardClasses,
  } = useLaMise();

  const statusBannerProps = useMemo(() => ({
    isSufficient: deferredIsSufficient,
    requiredQuantity,
    availableQuantity
  }), [deferredIsSufficient, requiredQuantity, availableQuantity]);

  const tokenCardProps = useMemo(() => ({
    isSufficient,
    requiredQuantity,
    availableQuantity,
    cardClasses,
    onPlayClick: handlePlayClick,
    isPending: isPendingPlay
  }), [isSufficient, requiredQuantity, availableQuantity, cardClasses, handlePlayClick, isPendingPlay]);

  if (loading) { return (<Loader />); }

  return (
    <div className="w-full mx-auto max-w-md dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col items-center justify-center px-4 py-6 space-y-4">

        <HeaderSection />
        <div className="w-full max-w-md mx-auto flex flex-col items-center space-y-3">
          <StatusBanner {...statusBannerProps} />
          <TokenCard {...tokenCardProps} />
          <PlayButton
            isSufficient={isSufficient}
            onClick={handlePlayClick}
            isPending={isPendingPlay}
          />

          {!isSufficient && <InsufficientTokensMessage />}
          <MarketButton
            onClick={handleMarketClick}
            isPending={isPendingMarket}
          />
        </div>

        <FixedContent />
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default memo(ProfilPageLearning);