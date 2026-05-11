'use client';
import type { Offering, OfferingAlternative } from "@/lib/interfaces";
import { ConsultationChoice, FrequenceConsultation, TypeParticipants } from "@/lib/interfaces";
import { useMonEtoileStore } from '@/lib/store/monetoile.store';
import { GradeConfig } from '@/lib/types/grade-config.types';
import { AnimatePresence, motion } from "framer-motion";
import { DollarSign, Package } from "lucide-react";
import { memo, useCallback, useMemo } from "react";
import { OfferingSelector } from "./OfferingSelector";
import RubriquePdfUpload from "./RubriquePdfUpload";

const ConsultationChoiceCard = memo(({ 
    choice, 
    onUpdate, 
    offerings, 
    onDelete, 
    onMoveUp, 
    onMoveDown 
}: {
    choice: ConsultationChoice;
    onUpdate: (updated: ConsultationChoice) => void;
    offerings: Offering[];   
    onDelete?: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
}) => {
    const grades = useMonEtoileStore(s => s.grades) as GradeConfig[];

    const handleAlternativeChange = useCallback((idx: number, updated: OfferingAlternative) => {
        const newAlternatives = [...choice.offering.alternatives];
        newAlternatives[idx] = updated;
        onUpdate({ ...choice, offering: { alternatives: newAlternatives } });
    }, [choice, onUpdate]);

    const totalCost = useMemo(() => {
        return choice.offering.alternatives.reduce((sum, alt) => {
            const offering = offerings.find(o => o._id === alt.offeringId);
            return sum + (offering ? offering.price * alt.quantity : 0);
        }, 0);
    }, [choice.offering.alternatives, offerings]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-2 border-slate-200 rounded-xl p-4 bg-white shadow-md hover:shadow-lg transition-shadow"
        >
            <div className="flex items-start gap-3 mb-3">
                <div className="flex-1 space-y-2">
                    <input
                        type="text"
                        value={choice.title}
                        onChange={(e) => onUpdate({ ...choice, title: e.target.value })}
                        placeholder="Titre du choix"
                        className="w-full px-3 py-2 text-sm font-bold rounded-lg border border-[#2E5AA6]/20 focus:ring-2 focus:ring-[#2E5AA6]/40 focus:border-[#2E5AA6] dark:border-white/10 dark:bg-[#0F1C3F] dark:text-slate-100"
                    />

                    <div className="flex flex-col gap-1 mt-1">
                        <div className="flex items-center gap-2">
                            <label className="text-xs font-semibold">Grade associé :</label>
                            <select
                                value={typeof choice.gradeId === 'string' ? choice.gradeId : (choice.gradeId && typeof choice.gradeId === 'object' ? choice.gradeId._id : '')}
                                onChange={async e => {
                                    const gradeId = e.target.value;
                                    onUpdate({ ...choice, gradeId });
                                }}
                                className={`px-2 py-1 text-xs rounded border bg-white ${!choice.gradeId ? 'border-red-400 focus:ring-red-400' : 'border-slate-300'}`}
                                required
                                aria-invalid={!choice.gradeId}
                            >
                                <option value="">-- Sélectionner un grade --</option>
                                {grades.map(grade => (
                                    <option key={grade._id} value={grade._id}>{grade.name}</option>
                                ))}
                            </select>
                        </div>
                        {!choice.gradeId && (
                            <span className="text-xs text-red-500 font-medium ml-1">Le grade est obligatoire</span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                        <label className="text-xs font-semibold">Fréquence:</label>
                        <select
                            value={choice.frequence || ''}
                            onChange={e => onUpdate({ ...choice, frequence: e.target.value as FrequenceConsultation })}
                            className="px-2 py-1 text-xs rounded border border-slate-300 bg-white"
                        >
                            <option value="">--</option>
                            <option value="UNE_FOIS_VIE">Une fois dans la vie</option>
                            <option value="ANNUELLE">Chaque année</option>
                            <option value="MENSUELLE">Chaque mois</option>
                            <option value="QUOTIDIENNE">Chaque jour</option>
                            <option value="LIBRE">À tout moment</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                        <label className="text-xs font-semibold">Participants:</label>
                        <select
                            value={choice.participants || ''}
                            onChange={e => onUpdate({ ...choice, participants: e.target.value as TypeParticipants })}
                            className="px-2 py-1 text-xs rounded border border-slate-300 bg-white"
                        >
                            <option value="">--</option>
                            <option value="SOLO">Solo (utilisateur seul)</option>
                            <option value="AVEC_TIERS">Avec une personne tierce</option>
                            <option value="POUR_TIERS">Pour une personne tierce</option>
                            <option value="GROUPE">En groupe (équipe)</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label htmlFor={`choice-desc-0`} className="text-xs font-semibold text-slate-700">
                            Description du choix
                        </label>
                        <p className="text-[10px] text-slate-500">
                            Décrivez ce choix de consultation en détail pour guider l'utilisateur
                        </p>

                        <textarea
                            id={`choice-desc-0`}
                            value={choice.description}
                            disabled={false}
                            onChange={(e) => onUpdate({ ...choice, description: e.target.value })}
                            placeholder="Décrivez les détails et bénéfices de ce choix..."
                            aria-label="Description du choix de consultation"
                            title="Entrez une description détaillée du choix de consultation"
                            rows={2}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#2E5AA6]/40 focus:border-transparent dark:border-white/10 dark:bg-[#0F1C3F] dark:text-slate-100"
                        />
                    </div>

                    <div className="space-y-1 mt-2">
                        <label htmlFor={`choice-prompt-0`} className="text-xs font-semibold text-slate-700">
                            Prompt pour l'IA (optionnel)
                        </label>
                        <p className="text-[10px] text-slate-500">
                            Saisissez un prompt personnalisé pour guider l'analyse IA de ce choix
                        </p>

                        <textarea
                            id={`choice-prompt-0`}
                            value={choice.prompt || ''}
                            onChange={(e) => onUpdate({ ...choice, prompt: e.target.value })}
                            placeholder="Prompt IA pour ce choix..."
                            aria-label="Prompt IA du choix de consultation"
                            title="Entrez un prompt IA personnalisé pour ce choix"
                            rows={2}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#2E5AA6]/40 focus:border-transparent dark:border-white/10 dark:bg-[#0F1C3F] dark:text-slate-100"
                        />
                    </div>

                    <div className="space-y-1 mt-2">
                        <RubriquePdfUpload
                            previewName={
                                choice.pdfFile
                                    ? typeof choice.pdfFile === 'string'
                                        ? 'PDF associé'
                                        : (choice.pdfFile as File).name
                                    : null
                            }
                            onFileSelect={file => onUpdate({ ...choice, pdfFile: file })}
                            label="PDF associé au choix (optionnel)"
                            maxSizeMb={20}
                            showPreviewLink={!!choice.pdfFile}
                            fileUrl={
                                typeof choice.pdfFile === 'string'
                                    ? choice.pdfFile
                                    : (choice.pdfFile ? URL.createObjectURL(choice.pdfFile as File) : null)
                            }
                        />
                    </div>
                </div>
            </div>
            {/* Actions: Delete, Move Up/Down */}
            {(onDelete || onMoveUp || onMoveDown) && (
                <div className="flex gap-2 mt-2">
                    {onMoveUp && (
                        <button type="button" onClick={onMoveUp} className="px-2 py-1 text-xs rounded bg-slate-100 hover:bg-slate-200 border border-slate-300">↑</button>
                    )}
                    {onMoveDown && (
                        <button type="button" onClick={onMoveDown} className="px-2 py-1 text-xs rounded bg-slate-100 hover:bg-slate-200 border border-slate-300">↓</button>
                    )}
                    {onDelete && (
                        <button type="button" onClick={onDelete} className="px-2 py-1 text-xs rounded bg-red-100 hover:bg-red-200 border border-red-300 text-red-700">Supprimer</button>
                    )}
                </div>
            )}

            {totalCost > 0 && (
                <div className="mb-3 flex items-center gap-2 rounded-lg border border-[#2E5AA6]/20 bg-gradient-to-r from-[#EEF4FF] to-[#DDE7FA] px-3 py-2 dark:border-white/10 dark:from-[#0F1C3F] dark:to-[#162A56]">
                    <DollarSign className="w-4 h-4 text-[#2E5AA6] dark:text-[#9BC2FF]" />
                    <span className="text-sm font-bold text-[#16315F] dark:text-[#DDE7FA]">
                        Coût total: {totalCost} FCFA
                    </span>
                </div>
            )}

            <AnimatePresence>
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3 overflow-hidden"
                >
                    <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Alternatives d'offrandes (3 requises)
                    </p>
                    {choice.offering.alternatives.map((alt, idx) => (
                        <OfferingSelector
                            key={alt.category}
                            alternative={alt}
                            offerings={offerings}
                            onChange={(updated) => handleAlternativeChange(idx, updated)}
                        />
                    ))}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
});

ConsultationChoiceCard.displayName = "ConsultationChoiceCard";

export default ConsultationChoiceCard;