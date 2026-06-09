'use client';
import { Calendar, PartyPopper } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { memo, useCallback } from 'react';
import { FooterSection, HeaderSection } from './Features';

const BackButton = memo(({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="mt-4 px-6 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
    type="button"
  >
    Retour à l'accueil
  </button>
));

const CelebrationIcon = memo(() => (
  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
    <PartyPopper className="w-8 h-8 text-white" />
  </div>
));

const NextEditionInfo = memo(() => (
  <div className="bg-white/10 rounded-lg p-3">
    <div className="flex items-center justify-center gap-2 text-white/90 text-xs">
      <Calendar className="w-3 h-3" />
      <span>Prochaine édition :</span>
      <span className="font-bold">Dans quelques jours</span>
    </div>
  </div>
));

const GameFinishedBanner = memo(() => {
  const router = useRouter();

  const handleBackToHome = useCallback(() => {
    router.push('/star/learning');
  }, [router]);

  return (
    <div className="w-full mx-auto max-w-md">
      <HeaderSection />

      <div className="w-full max-w-md mx-auto my-8 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 shadow-lg">
        <div className="relative p-6 text-center">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10">
            <CelebrationIcon />

            <h3 className="text-xl font-bold text-white mb-2">
              🎉 Édition terminée ! 🎉
            </h3>

            <p className="text-white/80 text-sm mb-4">
              Merci d'avoir participé à cette édition !
            </p>

            <NextEditionInfo />

            <BackButton onClick={handleBackToHome} />
          </div>
        </div>
      </div>

      <FooterSection />
    </div>
  );
});

export default GameFinishedBanner;