'use client';
import Loader from '@/app/loading';
import ErrorMessage from '@/components/learning/commons/ErrorMessage';
import { useLaMise } from '@/hooks/learning/lamise/useLaMise';
import { StatusBanner } from './lamise/StatusBanner';
import { TokenCard } from './lamise/TokenCard';
import { PlayButton, MarketButton } from './lamise/ActionButtons';
import { memo } from 'react';

const LaMise = () => {
  const {
    handlePlayClick, handleMarketClick,
    isSufficient, loading, requiredQuantity, error, availableQuantity, cardClasses,
  } = useLaMise();

  if (error) return <ErrorMessage />;
  if (loading) return <Loader />;

  return (
    <div className="w-full mx-auto max-w-md px-4 flex flex-col gap-2 space-y-3 items-center justify-center">
      <StatusBanner
        isSufficient={isSufficient}
        requiredQuantity={requiredQuantity}
        availableQuantity={availableQuantity}
      />

      <TokenCard
        isSufficient={isSufficient}
        requiredQuantity={requiredQuantity}
        availableQuantity={availableQuantity}
        cardClasses={cardClasses}
        onPlayClick={handlePlayClick}
        isPending={loading}
      />

      <PlayButton
        isSufficient={isSufficient}
        onClick={handlePlayClick}
        isPending={loading}
      />

      {!isSufficient && (
        <p className="text-center text-xs text-red-600 dark:text-red-400">
          Vous ne disposez pas d&apos;assez de jetons.
        </p>
      )}

      <MarketButton
        onClick={handleMarketClick}
        isPending={loading}
      />

      <div className="w-2 h-2 rounded-full bg-green-400" />
    </div>
  );
};

export default memo(LaMise);