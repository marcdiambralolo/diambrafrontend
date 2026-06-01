'use client';
import { useEndGameGenerator } from "@/hooks/learning/endgame/useGameGenerator";
import { Competition } from "@/lib/store/monetoile.store";
import { RotateCcw, Save, Trophy, Medal, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { memo, useState } from 'react';

interface MatchResult {
    matchNumber: number;
    type: string;
    score: number;
    totalCases: number;
    timeSpent?: number;
    isComplete: boolean;
}

interface CompetitionSummary {
    isComplete: any;
    id: string;
    name: string;
    startedAt: string;
    finishedAt?: string;
    totalMatches: number;
    completedMatches: number;
    totalScore: number;
    maxPossibleScore: number;
    percentage: number;
    matches: MatchResult[];
}

const InfoRow = memo(({ label, value, highlight = false }: { label: string; value: string | number | undefined; highlight?: boolean }) => (
    <div className="flex justify-between py-2 border-b border-gray-200 last:border-0">
        <span className="font-semibold text-gray-700">{label}:</span>
        <span className={`${highlight ? 'text-purple-600 font-bold text-lg' : 'text-gray-900'}`}>
            {value ?? 'N/A'}
        </span>
    </div>
));

const MatchCard = memo(({ match, index }: { match: MatchResult; index: number }) => (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-purple-100">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                {match.isComplete ? (
                    <Trophy className="w-4 h-4 text-yellow-500" />
                ) : (
                    <Medal className="w-4 h-4 text-gray-400" />
                )}
                <span className="font-semibold text-gray-700">
                    Match {index + 1}
                </span>
            </div>
            <span className="text-sm text-gray-500">{match.type}</span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-600">Score:</div>
            <div className="font-semibold text-purple-600 text-right">
                {match.score}/{match.totalCases}
            </div>
            {match.timeSpent && (
                <>
                    <div className="text-gray-600">Temps:</div>
                    <div className="text-gray-700 text-right">{match.timeSpent}s</div>
                </>
            )}
        </div>
        <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${(match.score / match.totalCases) * 100}%` }}
            />
        </div>
    </div>
));

const CompetitionCard = memo(({ 
    competition, 
    isActive, 
    onSelect 
}: { 
    competition: CompetitionSummary; 
    isActive: boolean;
    onSelect: () => void;
}) => (
    <div 
        onClick={onSelect}
        className={`cursor-pointer transition-all duration-300 ${
            isActive ? 'ring-2 ring-purple-500 shadow-lg scale-[1.02]' : 'hover:scale-[1.01]'
        }`}
    >
        <div className="w-full bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-4 shadow-md">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Trophy className={`w-5 h-5 ${competition.isComplete ? 'text-yellow-500' : 'text-purple-500'}`} />
                    <h3 className="text-lg font-bold text-purple-700">
                        {competition.name}
                    </h3>
                </div>
                {competition.isComplete && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Terminé
                    </span>
                )}
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
                <InfoRow label="Matchs complétés" value={`${competition.completedMatches}/${competition.totalMatches}`} />
                <InfoRow label="Score total" value={`${competition.totalScore}/${competition.maxPossibleScore}`} />
                <InfoRow label="Pourcentage" value={`${competition.percentage}%`} highlight />
                <InfoRow label="Date" value={new Date(competition.startedAt).toLocaleDateString()} />
            </div>
            
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${competition.percentage}%` }}
                />
            </div>
        </div>
    </div>
));

const CompetitionDetails = memo(({ competition }: { competition: CompetitionSummary }) => (
    <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-purple-700 flex items-center gap-2">
                <Trophy className="w-6 h-6" />
                Détails de la compétition
            </h3>
            <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{competition.percentage}%</div>
                <div className="text-xs text-gray-500">Taux de réussite</div>
            </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md mb-4">
            <InfoRow label="ID Compétition" value={competition.id.slice(0, 8)} />
            <InfoRow label="Date de début" value={new Date(competition.startedAt).toLocaleString()} />
            {competition.finishedAt && (
                <InfoRow label="Date de fin" value={new Date(competition.finishedAt).toLocaleString()} />
            )}
            <InfoRow label="Matchs joués" value={`${competition.completedMatches}/${competition.totalMatches}`} />
            <InfoRow label="Score total" value={`${competition.totalScore} / ${competition.maxPossibleScore}`} />
            <InfoRow label="Points obtenus" value={`${competition.totalScore}`} highlight />
        </div>

        <div>
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Medal className="w-4 h-4" />
                Résultats par match
            </h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {competition.matches.map((match, idx) => (
                    <MatchCard key={idx} match={match} index={idx} />
                ))}
            </div>
        </div>
    </div>
));

export default function ResultatsPage() {
    const { 
        competitions, 
        isSubmitting, 
        submitMessage, 
        handleRecommencer, 
        handleSubmitGame,
        currentCompetitionId 
    } = useEndGameGenerator();
    
    const [selectedCompetitionId, setSelectedCompetitionId] = useState<string | null>(currentCompetitionId);
    const [viewMode, setViewMode] = useState<'list' | 'details'>('list');

    if (!competitions?.length) {
        return (
            <div className="w-full max-w-md mx-auto py-4 text-center">
                <div className="bg-yellow-50 rounded-xl p-6">
                    <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                    <p className="text-gray-600">Aucune compétition terminée</p>
                    <button 
                        onClick={handleRecommencer} 
                        className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700"
                    >
                        <RotateCcw className="w-5 h-5" /> Commencer une partie
                    </button>
                </div>
            </div>
        );
    }

    const selectedCompetition = competitions.find((c: any) => c.id === selectedCompetitionId);
    // const totalScore = competitions.reduce(((sum), c) => sum + c.totalScore, 0);
    // const totalMaxScore = competitions.reduce((sum, c) => sum + c.maxPossibleScore, 0);
    // const overallPercentage = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;

    return (
        <div className="w-full max-w-md mx-auto py-4">
            {submitMessage && (
                <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl shadow-lg text-white text-sm font-medium transition-all duration-300 ${
                    submitMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                    {submitMessage.text}
                </div>
            )}

            {/* Actions principales */}
            <div className="flex justify-center gap-3 mb-6">
                <button 
                    onClick={handleSubmitGame} 
                    disabled={isSubmitting} 
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 transition-all"
                >
                    <Save className="w-4 h-4" /> {isSubmitting ? 'Soumission...' : 'Soumettre mon jeu'}
                </button>

                <button 
                    onClick={handleRecommencer} 
                    className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-700 transition-all"
                >
                    <RotateCcw className="w-4 h-4" /> Recommencer
                </button>
            </div>

            {/* Résumé global */}
            {competitions.length > 1 && (
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 mb-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm opacity-90">Total des compétitions</span>
                        <Star className="w-5 h-5" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <div className="text-2xl font-bold">{competitions.length}</div>
                            <div className="text-xs opacity-90">Compétitions</div>
                        </div>
                        {/* <div>
                            <div className="text-2xl font-bold">{totalScore}/{totalMaxScore}</div>
                            <div className="text-xs opacity-90">Points totaux</div>
                        </div>
                        <div className="col-span-2">
                            <div className="flex justify-between text-xs mb-1">
                                <span>Progression globale</span>
                                <span>{overallPercentage}%</span>
                            </div>
                            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                                    style={{ width: `${overallPercentage}%` }}
                                />
                            </div>
                        </div> */}
                    </div>
                </div>
            )}

            {/* Navigation */}
            {viewMode === 'details' && selectedCompetition && (
                <button 
                    onClick={() => setViewMode('list')}
                    className="flex items-center gap-1 text-purple-600 mb-4 hover:text-purple-700 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Retour à la liste
                </button>
            )}

            {/* Contenu principal */}
            {viewMode === 'list' ? (
                <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                    <h2 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        Mes compétitions
                    </h2>
                    {competitions.map((competition: any) => (
                        <CompetitionCard 
                            key={competition.id}
                            competition={competition}
                            isActive={competition.id === selectedCompetitionId}
                            onSelect={() => {
                                setSelectedCompetitionId(competition.id);
                                setViewMode('details');
                            }}
                        />
                    ))}
                </div>
            ) : (
                selectedCompetition && <CompetitionDetails competition={selectedCompetition} />
            )}

            {/* Bouton flottant pour rejouer */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
                <button 
                    onClick={handleRecommencer} 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-full shadow-lg hover:bg-purple-700 transition-all hover:scale-105"
                >
                    <RotateCcw className="w-5 h-5" /> Nouvelle compétition
                </button>
            </div>
        </div>
    );
}