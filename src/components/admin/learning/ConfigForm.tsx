// components/learning/LearningConfigForm.tsx
'use client';
 import { generateNumeromatch, normalizeConfigDates, normalizeStatus, showToast, toSafeDate } from '@/lib/learning/configUtils';
import { motion } from 'framer-motion';
import { CheckIcon, LockIcon, RefreshCwIcon, XIcon } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { CustomDateTimePicker } from '../game/CustomPicker';
import { LearningConfiguration } from '@/lib/interfaces';

interface LearningConfigFormProps {
    mode: 'create' | 'edit';
    initialData?: Partial<LearningConfiguration>;
    onSubmit: (data: Partial<LearningConfiguration>) => void;
    onCancel: () => void;
}

export default function LearningConfigForm({
    mode,
    initialData,
    onSubmit,
    onCancel,
}: LearningConfigFormProps) {
    const initialForm = useMemo(
        () => normalizeConfigDates(initialData ?? {}),
        [initialData]
    );

    const [formData, setFormData] = useState<Partial<LearningConfiguration>>(initialForm);
    const isEnded = initialData?.status === 'ended';

    useEffect(() => {
        setFormData(initialForm);
    }, [initialForm]);

    const regenerateNumeromatch = () => {
        setFormData(prev => ({ ...prev, numeromatch: generateNumeromatch() }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEnded) {
            showToast('Les éditions terminées ne peuvent pas être modifiées', 'error');
            return;
        }

        const startDate = toSafeDate(formData.startgameDate, new Date());
        const endDate = toSafeDate(
            formData.endgameDate,
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        );

        if (endDate.getTime() < startDate.getTime()) {
            showToast('La date de fin doit être postérieure à la date de début', 'error');
            return;
        }

        if (!formData.numeromatch) {
            showToast('Le numéro de match est requis', 'error');
            return;
        }

        onSubmit({
            ...formData,
            startgameDate: startDate,
            endgameDate: endDate,
            status: normalizeStatus(formData.status),
            isActive: Boolean(formData.isActive),
            niveau: formData.niveau ?? 2,
            tpsglobal: formData.tpsglobal ?? 0,
            numeromatch: formData.numeromatch,
            pieces: formData.pieces ?? [],
            sequence: formData.sequence ?? '',
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            className="overflow-hidden rounded-[30px] border border-purple-200 bg-white shadow-[0_24px_80px_rgba(99,102,241,0.12)]"
        >
            {isEnded && (
                <div className="bg-gradient-to-r from-gray-500 to-gray-600 px-6 py-3">
                    <div className="flex items-center justify-center gap-2 text-white">
                        <LockIcon className="w-5 h-5" />
                        <span className="text-sm font-semibold">Cette édition est terminée et ne peut plus être modifiée</span>
                    </div>
                </div>
            )}

            <div className={`px-6 py-5 ${isEnded ? 'bg-gradient-to-r from-gray-500 to-gray-600' : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600'}`}>
                <h3 className="text-xl font-black text-white md:text-2xl">
                    {mode === 'create'
                        ? '✨ Nouvelle Configuration Learning'
                        : isEnded
                            ? '🔒 Édition Terminée (Lecture seule)'
                            : '✏️ Modifier la Configuration Learning'}
                </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            📅 Date de début
                        </label>
                        <CustomDateTimePicker
                            selected={formData.startgameDate}
                            onChange={(date: Date) =>
                                !isEnded && setFormData((prev) => ({ ...prev, startgameDate: date }))
                            }
                            minDate={new Date()}
                            placeholder="Sélectionner la date et l'heure"
                            disabled={isEnded}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            🏁 Date de fin
                        </label>
                        <CustomDateTimePicker
                            selected={formData.endgameDate}
                            onChange={(date: Date) =>
                                !isEnded && setFormData((prev) => ({ ...prev, endgameDate: date }))
                            }
                            minDate={new Date()}
                            placeholder="Sélectionner la date et l'heure"
                            disabled={isEnded}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            🎮 Type de jeu
                        </label>
                        <select
                            value={formData.tpsglobal ?? 0}
                            onChange={(e) =>
                                !isEnded && setFormData((prev) => ({ ...prev, tpsglobal: parseInt(e.target.value) }))
                            }
                            disabled={isEnded}
                            className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                        >
                            <option value={0}>Nombre</option>
                            <option value={1}>Couleur</option>
                            <option value={2}>Image</option>
                            <option value={3}>Lettre</option>
                            <option value={4}>Global</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            📊 Niveau (2-10)
                        </label>
                        <input
                            type="number"
                            min={2}
                            max={10}
                            value={formData.niveau ?? 2}
                            onChange={(e) =>
                                !isEnded && setFormData((prev) => ({ ...prev, niveau: parseInt(e.target.value) }))
                            }
                            disabled={isEnded}
                            className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            🔢 Séquence
                        </label>
                        <input
                            type="text"
                            value={formData.sequence ?? ''}
                            onChange={(e) =>
                                !isEnded && setFormData((prev) => ({ ...prev, sequence: e.target.value }))
                            }
                            disabled={isEnded}
                            placeholder="Ex: 0,1,2,3"
                            className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            🆔 Numéro de match
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={formData.numeromatch ?? ''}
                                onChange={(e) =>
                                    !isEnded && setFormData((prev) => ({ ...prev, numeromatch: e.target.value }))
                                }
                                disabled={isEnded}
                                placeholder="9 chiffres"
                                maxLength={9}
                                className="flex-1 rounded-2xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                            />
                            {!isEnded && (
                                <button
                                    type="button"
                                    onClick={regenerateNumeromatch}
                                    className="rounded-2xl bg-purple-100 px-4 py-3 text-purple-600 hover:bg-purple-200 transition-colors"
                                    title="Générer un nouveau numéro"
                                >
                                    <RefreshCwIcon className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                        <p className="mt-1 text-xs text-gray-400">Identifiant unique du match (9 chiffres)</p>
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                        📊 Status
                    </label>
                    <select
                        value={normalizeStatus(formData.status)}
                        onChange={(e) =>
                            !isEnded && setFormData((prev) => ({
                                ...prev,
                                status: e.target.value as any,
                            }))
                        }
                        disabled={isEnded}
                        className={`w-full rounded-2xl border-2 px-4 py-3 transition-all focus:ring-4 ${isEnded
                            ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100'
                        }`}
                    >
                        <option value="pending">⏳ En attente</option>
                        <option value="active">⚡ Actif</option>
                        <option value="ended">🏁 Terminé</option>
                        <option value="cancelled">❌ Annulé</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                        ✅ Active
                    </label>
                    <label className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition ${isEnded
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        : 'border-gray-200 hover:bg-gray-50'
                        }`}>
                        <input
                            type="checkbox"
                            checked={Boolean(formData.isActive)}
                            onChange={(e) =>
                                !isEnded && setFormData((prev) => ({
                                    ...prev,
                                    isActive: e.target.checked,
                                }))
                            }
                            disabled={isEnded}
                            className="h-5 w-5 rounded-lg text-purple-600 focus:ring-purple-500 disabled:opacity-50"
                        />
                        <span className={`font-medium ${isEnded ? 'text-gray-400' : 'text-gray-700'}`}>
                            Configuration active
                        </span>
                    </label>
                </div>

                <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                    {!isEnded && (
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-bold text-white shadow-lg"
                        >
                            <CheckIcon className="h-5 w-5" />
                            {mode === 'create' ? 'Créer' : 'Mettre à jour'}
                        </motion.button>
                    )}

                    {isEnded && (
                        <div className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gray-100 px-6 py-3 font-bold text-gray-400">
                            <LockIcon className="h-5 w-5" />
                            Non modifiable
                        </div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={onCancel}
                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gray-100 px-6 py-3 font-bold text-gray-700 transition-colors hover:bg-gray-200"
                    >
                        <XIcon className="h-5 w-5" />
                        Annuler
                    </motion.button>
                </div>
            </form>
        </motion.div>
    );
}