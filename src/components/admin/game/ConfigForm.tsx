'use client';
import { GameConfiguration } from "@/lib/interfaces";
import { motion } from "framer-motion";
import { CheckIcon, XIcon } from "lucide-react";
import React, { useEffect, useMemo, useState } from 'react';
import { CustomDateTimePicker } from "./CustomPicker";

let toastId = 0;

type ToastType = 'success' | 'error' | 'info';
type ConfigStatus = 'pending' | 'active' | 'ended' | 'cancelled';
type DateLike = Date | string | number | null | undefined;
const DEFAULT_FORM_STATUS: ConfigStatus = 'pending';

function showToast(
    message: string,
    type: ToastType = 'info',
    duration = 3000
) {
    const id = ++toastId;
    const event = new CustomEvent('toast', {
        detail: { id, message, type, duration },
    });
    window.dispatchEvent(event);

    setTimeout(() => {
        const closeEvent = new CustomEvent('toast-close', { detail: { id } });
        window.dispatchEvent(closeEvent);
    }, duration);

    return id;
}

function toSafeDate(value: DateLike, fallback?: Date): Date {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return new Date(value);
    }

    if (typeof value === 'string' || typeof value === 'number') {
        const parsed = new Date(value);
        if (!Number.isNaN(parsed.getTime())) {
            return parsed;
        }
    }

    return fallback ? new Date(fallback) : new Date();
}

function normalizeStatus(value: unknown): ConfigStatus {
    if (
        value === 'pending' ||
        value === 'active' ||
        value === 'ended' ||
        value === 'cancelled'
    ) {
        return value;
    }
    return DEFAULT_FORM_STATUS;
}

function normalizeConfigDates(
    config?: Partial<GameConfiguration> | null
): Partial<GameConfiguration> {
    return {
        ...config,
        startgameDate: toSafeDate(config?.startgameDate, new Date()),
        endgameDate: toSafeDate(
            config?.endgameDate,
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        ),
        prizePool: Number(config?.prizePool ?? 0),
        isActive: Boolean(config?.isActive),
        status: normalizeStatus(config?.status),
    };
}

function buildDefaultForm(): Partial<GameConfiguration> {
    return {
        startgameDate: new Date(),
        endgameDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isActive: false,
        prizePool: 0,
        status: DEFAULT_FORM_STATUS,
    };
}

export default function ConfigForm({
    mode,
    initialData,
    onSubmit,
    onCancel,
}: {
    mode: 'create' | 'edit';
    initialData?: Partial<GameConfiguration>;
    onSubmit: (data: Partial<GameConfiguration>) => void;
    onCancel: () => void;
}) {
    const initialForm = useMemo(
        () => normalizeConfigDates(initialData ?? buildDefaultForm()),
        [initialData]
    );

    const [formData, setFormData] = useState<Partial<GameConfiguration>>(initialForm);

    useEffect(() => {
        setFormData(initialForm);
    }, [initialForm]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const startDate = toSafeDate(formData.startgameDate, new Date());
        const endDate = toSafeDate(
            formData.endgameDate,
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        );

        if (endDate.getTime() < startDate.getTime()) {
            showToast('La date de fin doit être postérieure à la date de début', 'error');
            return;
        }

        onSubmit({
            ...formData,
            startgameDate: startDate,
            endgameDate: endDate,
            prizePool: Number(formData.prizePool ?? 0),
            status: normalizeStatus(formData.status),
            isActive: Boolean(formData.isActive),
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            className="overflow-hidden rounded-[30px] border border-purple-200 bg-white shadow-[0_24px_80px_rgba(99,102,241,0.12)]"
        >
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 px-6 py-5">
                <h3 className="text-xl font-black text-white md:text-2xl">
                    {mode === 'create'
                        ? '✨ Nouvelle Configuration'
                        : '✏️ Modifier la Configuration'}
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
                                setFormData((prev) => ({ ...prev, startgameDate: date }))
                            }
                            minDate={new Date()}
                            placeholder="Sélectionner la date et l'heure"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            🏁 Date de fin
                        </label>
                        <CustomDateTimePicker
                            selected={formData.endgameDate}
                            onChange={(date: Date) =>
                                setFormData((prev) => ({ ...prev, endgameDate: date }))
                            }
                            minDate={new Date()}
                            placeholder="Sélectionner la date et l'heure"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            💰 Cagnotte
                        </label>
                        <input
                            type="number"
                            min={0}
                            value={Number(formData.prizePool ?? 0)}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    prizePool:
                                        e.target.value === '' ? 0 : Number(e.target.value),
                                }))
                            }
                            className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            📊 Status
                        </label>
                        <select
                            value={normalizeStatus(formData.status)}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    status: e.target.value as ConfigStatus,
                                }))
                            }
                            className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                        >
                            <option value="pending">⏳ En attente</option>
                            <option value="active">⚡ Actif</option>
                            <option value="ended">🏁 Terminé</option>
                            <option value="cancelled">❌ Annulé</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                        ✅ Active
                    </label>
                    <label className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-gray-200 p-4 transition hover:bg-gray-50">
                        <input
                            type="checkbox"
                            checked={Boolean(formData.isActive)}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    isActive: e.target.checked,
                                }))
                            }
                            className="h-5 w-5 rounded-lg text-purple-600 focus:ring-purple-500"
                        />
                        <span className="font-medium text-gray-700">
                            Configuration active
                        </span>
                    </label>
                </div>

                <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-bold text-white shadow-lg"
                    >
                        <CheckIcon className="h-5 w-5" />
                        {mode === 'create' ? 'Créer' : 'Mettre à jour'}
                    </motion.button>

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