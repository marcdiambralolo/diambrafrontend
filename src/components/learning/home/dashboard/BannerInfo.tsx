'use client';
import { memo } from 'react';

interface BannerInfoProps {
    endGameDate: string | null;
}

export const BannerInfo = memo(function BannerInfo({ endGameDate }: BannerInfoProps) {

    return (
        <div className="text-center">
            <p className="text-white font-bold text-xl">Résultats officiels disponibles !</p>
            <p className="text-white/80 text-sm mt-1">
                {endGameDate ? `Édition terminée le ${endGameDate}` : 'Merci pour votre participation'}
            </p>

            <p className="text-yellow-300 text-xs mt-2 font-semibold">
                ✓ Compétition officiellement clôturée
            </p>
        </div>
    );
});