'use client';
import { useEndGameGenerator } from "@/hooks/learning/endgame/useGameGenerator";
import { colorReference, Theme } from "@/lib/learning/data";
import { generateLetterPairs } from "@/lib/learning/functions";
import { Case, MatchInfo } from "@/lib/learning/interface";
import { RotateCcw, Save } from "lucide-react";
import Image from "next/image";
import { memo, useEffect, useRef, useState } from "react";

const GRID_STYLES = "w-full grid";
const BUTTON_STYLES = "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors";
const CARD_STYLES = "w-full shadow-lg rounded-xl bg-white overflow-hidden";

const UnecaseFixe = memo(({ tpsglobal, txt, isLocked, size, pieces, force }: Case & { pieces: string[] }) => {
    const letterPairs = generateLetterPairs();
    const caseRef = useRef<HTMLDivElement>(null);
    const txtIndex = parseInt(txt || "0", 10);

    useEffect(() => {
        const updateFontSize = () => {
            if (caseRef.current) {
                caseRef.current.style.fontSize = `${caseRef.current.clientWidth * 0.5}px`;
            }
        };
        updateFontSize();
        const observer = new ResizeObserver(updateFontSize);
        if (caseRef.current) observer.observe(caseRef.current);
        return () => observer.disconnect();
    }, []);

    const backgroundColor = (() => {
        if (tpsglobal === 1) return colorReference[txtIndex] || "black";
        if (isLocked) return Theme.coulfondcaseverouille;
        return "black";
    })();

    const backgroundImage = tpsglobal === 2 && pieces[txtIndex] ? `url(${pieces[txtIndex]})` : "none";

    const content = (() => {
        if (force) return <Image src="/momok.png" alt="OK" width={100} height={100} priority />;
        if (tpsglobal === 0) return txt;
        if (tpsglobal === 3) return letterPairs[txtIndex];
        if (isLocked && (tpsglobal === 1 || tpsglobal === 2)) {
            return <Image src="/momok.png" alt="OK" width={100} height={100} priority />;
        }
        return " ";
    })();

    return (
        <div
            ref={caseRef}
            className="text-white font-semibold flex items-center justify-center border border-white overflow-hidden aspect-square"
            style={{ width: size, height: size, backgroundColor, backgroundImage, backgroundSize: "cover" }}
        >
            <span className="overflow-hidden">{content}</span>
        </div>
    );
});

const PloaderEndGame = memo(({ match, initiale = false, force = false }: { match: MatchInfo; initiale?: boolean, force?: boolean }) => {
    const cases = initiale ? match?.listeCaseOpLabInitiale || [] : match?.listeCaseOpLab || [];
    const size = match?.niveau || Math.sqrt(cases.length) || 3;

    if (!cases.length) return <div className="text-center text-gray-500 py-8">Aucune case disponible</div>;

    return (
        <div className={GRID_STYLES} style={{ gridTemplateColumns: `repeat(${size}, 1fr)`, gridTemplateRows: `repeat(${size}, 1fr)` }}>
            {cases.map((c) => (
                <UnecaseFixe key={c.id} {...c} isLocked={!initiale} force={force} size="100%" pieces={match?.pieces || []} />
            ))}
        </div>
    );
});

const MatchView = memo(({ matchData, index }: { matchData: MatchInfo; index: number }) => {
    const [showFirstBoard, setShowFirstBoard] = useState(false);
    const gameType = ["Nombre", "Couleur", "Image", "Lettre", "Global"][matchData.tpsglobal ?? 0] || "Inconnu";

    return (
        <div className={CARD_STYLES}>
            <div className="p-4">
                <div className="mb-3 pb-2 border-b">
                    <h4 className="text-lg font-bold text-center text-purple-600">Match {index + 1}</h4>
                    <p className="text-xs text-center text-gray-500">Type: {gameType}</p>
                </div>
                <div className="mt-2">
                    {matchData.tpsglobal === 2 ? (
                        <>
                            {showFirstBoard ? <PloaderEndGame match={matchData} initiale /> : <PloaderEndGame match={matchData} initiale force />}
                        </>
                    ) : (
                        <>
                            {showFirstBoard ? <PloaderEndGame match={matchData} initiale /> : <PloaderEndGame match={matchData} />}
                        </>
                    )}
                </div>
                <button onClick={() => setShowFirstBoard(prev => !prev)} className={`${BUTTON_STYLES} w-full mt-4`}>
                    {showFirstBoard ? "🎯 Voir P1" : "👀 Voir P2"}
                </button>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-green-50 rounded-lg p-2"><span className="text-green-600 font-bold">{matchData.score?.toFixed(0) || 0}%</span><span className="text-gray-500 block">Score</span></div>
                    <div className="bg-blue-50 rounded-lg p-2"><span className="text-blue-600 font-bold">{matchData.trouves || 0}</span><span className="text-gray-500 block">Trouvés</span></div>
                    <div className="bg-orange-50 rounded-lg p-2"><span className="text-orange-600 font-bold">{matchData.rates || 0}</span><span className="text-gray-500 block">Ratés</span></div>
                </div>
            </div>
        </div>
    );
});

const InfoRow = ({ label, value }: { label: string; value: string | number | undefined }) => (
    <div className="flex justify-between py-2 border-b border-gray-200 last:border-0">
        <span className="font-semibold text-gray-700">{label}:</span>
        <span className="text-gray-900">{value ?? 'N/A'}</span>
    </div>
);

export default function ResultatsPage() {
    const {
        displayMatches: infomatch, isSubmitting, submitMessage,
        handleRecommencer, handleSubmitGame, summaryDetails,
    } = useEndGameGenerator();


    if (!infomatch || infomatch.length === 0) return null;

    return (
        <div className="w-full max-w-md px-0 py-0 m-0 p-0 mx-auto">
            {submitMessage && (
                <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl shadow-lg text-white text-sm font-medium ${submitMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                    {submitMessage.text}
                </div>
            )}

            <div className="flex justify-center gap-3 mb-4">
                <button
                    onClick={handleRecommencer}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-700 transition-colors"
                >
                    <RotateCcw className="w-4 h-4" />
                    Recommencer
                </button>

                <button
                    onClick={handleSubmitGame}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="w-4 h-4" />
                    {isSubmitting ? 'Soumission...' : 'Soumettre mon jeu'}
                </button>
            </div>

            <div className="w-full w-max-md mt-4 flex flex-col items-center justify-center px-0 py-0 m-0 p-0">
                <div className="w-full bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-1 mb-6 shadow-md">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="w-12 h-0.5 bg-gradient-to-r from-purple-400 to-transparent" />
                        <h3 className="text-lg font-bold text-center text-purple-700">📊 FEUILLE DE MATCHS</h3>
                        <div className="w-12 h-0.5 bg-gradient-to-l from-purple-400 to-transparent" />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                        {summaryDetails.map((item) => (
                            <InfoRow key={item.label} label={item.label} value={item.value} />
                        ))}
                    </div>
                </div>

                <div className="w-full space-y-4">
                    {infomatch.map((match, index) => (
                        <MatchView key={index} matchData={match} index={index} />
                    ))}
                </div>
            </div>

            <div className="flex justify-center mt-4 mb-8">
                <button
                    onClick={handleRecommencer}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors"
                >
                    <RotateCcw className="w-5 h-5" />
                    Recommencer une partie
                </button>
            </div>
        </div>
    );
}