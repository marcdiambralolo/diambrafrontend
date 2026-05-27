'use client';
import { caldure, formatDate } from "@/lib/learning/functions";
import { MatchInfo } from "@/lib/learning/interface";
import { Space } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useMemo } from "react";
import MatchView from "./MatchView";

interface FinMatchViewProps {
    niveau: number;
    option: number;
    datedebut: string;
    tpsglobal: number;
    infomatch: MatchInfo[];
}

const FinMatchView = memo(({
    niveau,
    option,
    datedebut,
    tpsglobal,
    infomatch
}: FinMatchViewProps) => {

    const { sommeScores, sommeTrouves, sommeRates } = useMemo(() => {
        let scores = 0, trouves = 0, rates = 0;
        for (const m of infomatch ?? []) {
            scores += m.score || 0;
            trouves += m.trouves || 0;
            rates += m.rates || 0;
        }
        return { sommeScores: scores, sommeTrouves: trouves, sommeRates: rates };
    }, [infomatch]);

    const datedefin = useMemo(() => new Date().toISOString(), []);

    const details = [
        { label: "Niveau", value: niveau },
        { label: "Score", value: sommeScores.toFixed(option === 0 ? 0 : 2) },
        { label: "Trouvés", value: `${sommeTrouves}/${infomatch.length * niveau ** 2}` },
        { label: "Ratés", value: sommeRates },
        { label: "Nombre de matchs", value: infomatch.length },
        { label: "Date de début", value: formatDate(datedebut) },
        { label: "Date de fin", value: formatDate(datedefin) },
        { label: "Temps écoulé", value: caldure(datedefin, datedebut || "01/01/1970") },
    ];

    const InfoRow = ({ label, value }: { label: string; value: string | number | undefined }) => (
        <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-semibold text-gray-700">{label}:</span>
            <span className="text-gray-900">{value ?? 'N/A'}</span>
        </div>
    );

    return (
        <div className="w-full flex flex-col items-center justify-center px-4">
            <div className="p-4 text-black max-w-md">
                {tpsglobal === 4 &&
                    details.map((item) => (
                        <InfoRow key={item.label} label={item.label} value={item.value} />
                    ))}
            </div>
            <AnimatePresence mode="wait">
                {infomatch && infomatch.length > 0 ? (
                    <Space direction="vertical" size="middle" className="w-full flex flex-col items-center">
                        {infomatch.map((match) => (
                            <MatchView
                                key={match.numeromatch || match.numordrep}
                                matchData={match}
                                option={option}
                                niveau={niveau}
                                datedebut={datedebut}
                                datefin={datedefin}
                            />
                        ))}
                    </Space>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-center text-gray-600 text-lg font-semibold mt-6 uppercase"
                        role="alert"
                        aria-live="polite"
                    >
                        Aucun jeu disponible
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

FinMatchView.displayName = "FinMatchView";

export default FinMatchView;