'use client';
import { useEndGameGenerator } from "@/hooks/learning/endgame/useGameGenerator";
import { RotateCcw, Save } from "lucide-react";
import { memo } from 'react';

const InfoRow = memo(({ label, value }: { label: string; value: string | number | undefined }) => (
    <div className="flex justify-between py-2 border-b border-gray-200 last:border-0">
        <span className="font-semibold text-gray-700">{label}:</span>
        <span className="text-gray-900">{value ?? 'N/A'}</span>
    </div>
));

const SummaryCard = memo(({ details }: { details: any[] }) => (
    <div className="w-full bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-6 shadow-md">
        <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-0.5 bg-gradient-to-r from-purple-400 to-transparent" />
            <h3 className="text-lg font-bold text-center text-purple-700">📊 FEUILLE DE MATCHS</h3>
            <div className="w-12 h-0.5 bg-gradient-to-l from-purple-400 to-transparent" />
        </div>
        <div className="grid grid-cols-1 gap-1">
            {details.map((item) => <InfoRow key={item.label} label={item.label} value={item.value} />)}
        </div>
    </div>
));

export default function ResultatsPage() {
    const { displayMatches, isSubmitting, submitMessage, handleRecommencer, handleSubmitGame, summaryDetails } = useEndGameGenerator();

    if (!displayMatches?.length) return null;

    return (
        <div className="w-full max-w-md mx-auto py-4">
            {submitMessage && (
                <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl shadow-lg text-white text-sm font-medium ${submitMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                    {submitMessage.text}
                </div>
            )}

            <div className="flex justify-center gap-3 mb-6">
                <button onClick={handleSubmitGame} disabled={isSubmitting} className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 disabled:opacity-50">
                    <Save className="w-4 h-4" /> {isSubmitting ? 'Soumission...' : 'Soumettre mon jeu'}
                </button>

                <button onClick={handleRecommencer} className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-700">
                    <RotateCcw className="w-4 h-4" /> Recommencer
                </button>
            </div>

            <SummaryCard details={summaryDetails} />

            <div className="flex justify-center mt-6">
                <button onClick={handleRecommencer} className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700">
                    <RotateCcw className="w-5 h-5" /> Recommencer une partie
                </button>
            </div>
        </div>
    );
}