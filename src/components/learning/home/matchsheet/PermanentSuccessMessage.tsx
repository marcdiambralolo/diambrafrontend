'use client';
import { CheckCircle, X } from 'lucide-react';
import { memo } from 'react';

interface PermanentSuccessMessageProps {
    competitionName: string;
    onClose: () => void;
}

const PermanentSuccessMessage = memo(function PermanentSuccessMessage({
    competitionName,
    onClose,
}: PermanentSuccessMessageProps) {
    return (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-4 mb-4 shadow-lg border border-green-400 w-full">
            <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                <div className="flex-1">
                    <p className="font-bold text-sm">✅ Jeu validé avec succès !</p>
                    <p className="text-xs text-green-100 mt-1">
                        Votre participation à <span className="font-semibold">{competitionName}</span> a été enregistrée.
                    </p>
                    <p className="text-xs text-green-100 mt-2">
                        🏆 Merci d&apos;avoir participé ! Veuillez patienter jusqu&apos;à la proclamation officielle des résultats.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="text-white/80 hover:text-white p-1 text-xs transition-colors"
                    aria-label="Fermer"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
});

export default PermanentSuccessMessage;