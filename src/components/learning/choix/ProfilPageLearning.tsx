'use client';

import Loader from '@/app/loading';
import { useLaMise } from '@/hooks/learning/lamise/useLaMise';
import { memo, useMemo } from 'react';
import { HeaderSection } from '../commons/Features';
import FixedContent from '../commons/FixedContent';
import { InsufficientTokensMessage, MarketButton, PlayButton, StatusBanner, TokenCard } from './Features';

const ProfilPageLearning = () => {
  // Destructurage aligné avec les données épurées du nouveau hook unifié
  const {
    handlePlayClick,
    handleMarketClick,
    isSufficient,
    loading,
    requiredQuantity,
    availableQuantity,
    cardClasses,
    error, // Ajouté au cas où tu souhaiterais afficher un toast ou une alerte en cas d'erreur de soumission
  } = useLaMise();

  // On passe directement l'état stable de suffisance (fin des interférences concurrentes)
  const statusBannerProps = useMemo(() => ({
    isSufficient,
    requiredQuantity,
    availableQuantity
  }), [isSufficient, requiredQuantity, availableQuantity]);

  const tokenCardProps = useMemo(() => ({
    isSufficient,
    requiredQuantity,
    availableQuantity,
    cardClasses,
    onPlayClick: handlePlayClick,
    isPending: loading // Utilisation de l'état de chargement agrégé
  }), [isSufficient, requiredQuantity, availableQuantity, cardClasses, handlePlayClick, loading]);

  // Bloque l'interaction utilisateur et affiche le loader principal si une action asynchrone est en cours
  if (loading) return <Loader />;

  return (
    <div className="w-full mx-auto max-w-md dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col items-center justify-center px-4 py-6 space-y-4">

        <HeaderSection />
        
        <div className="w-full max-w-md mx-auto flex flex-col items-center space-y-3">
          {/* Optionnel : Rendu d'une alerte d'erreur discrète si l'API de mise plante */}
          {error && (
            <div className="w-full p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl text-center">
              {error}
            </div>
          )}

          <StatusBanner {...statusBannerProps} />
          
          <TokenCard {...tokenCardProps} />
          
          <PlayButton
            isSufficient={isSufficient}
            onClick={handlePlayClick}
            isPending={loading}
          />

          {!isSufficient && <InsufficientTokensMessage />}
          
          <MarketButton
            onClick={handleMarketClick}
            isPending={loading}
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

ProfilPageLearning.displayName = 'ProfilPageLearning';

export default memo(ProfilPageLearning);