// lib/learning/configUtils.ts

import { LearningConfigStatus, LearningConfiguration, ToastType } from "../interfaces";

 
let toastId = 0;

export const statusConfig: Record<LearningConfigStatus, {
    color: string;
    bg: string;
    text: string;
    border: string;
    icon: string;
    label: string;
}> = {
    pending: {
        color: 'from-amber-400 to-yellow-500',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        icon: '⏳',
        label: 'En attente',
    },
    active: {
        color: 'from-emerald-400 to-green-500',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        icon: '⚡',
        label: 'Actif',
    },
    ended: {
        color: 'from-slate-400 to-gray-500',
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
        icon: '🏁',
        label: 'Terminé',
    },
    cancelled: {
        color: 'from-rose-400 to-red-500',
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        icon: '❌',
        label: 'Annulé',
    },
};

export function generateNumeromatch(): string {
    return Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
}

export function buildDefaultForm(): Partial<LearningConfiguration> {
    return {
        startgameDate: new Date(),
        endgameDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isActive: false,
        status: 'pending',
        niveau: 2,
        tpsglobal: 0,
        sequence: '',
        numeromatch: generateNumeromatch(),
        pieces: [],
    };
}

export function formatDateFR(value: Date | string | null | undefined): string {
    const date = toSafeDate(value, new Date());
    if (!isValidDate(date)) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} à ${hour}:${minute}:${second}`;
}

export function showToast(message: string, type: ToastType = 'info', duration = 3000) {
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

export function isValidDate(value: unknown): value is Date {
    return value instanceof Date && !Number.isNaN(value.getTime());
}

export function toSafeDate(value: Date | string | number | null | undefined, fallback?: Date): Date {
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

export function normalizeStatus(value: unknown): LearningConfigStatus {
    if (value === 'pending' || value === 'active' || value === 'ended' || value === 'cancelled') {
        return value;
    }
    return 'pending';
}

export function normalizeConfigDates(config?: Partial<LearningConfiguration> | null): Partial<LearningConfiguration> {
    return {
        ...config,
        startgameDate: toSafeDate(config?.startgameDate, new Date()),
        endgameDate: toSafeDate(config?.endgameDate, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
        isActive: Boolean(config?.isActive),
        status: normalizeStatus(config?.status),
        niveau: config?.niveau ?? 2,
        tpsglobal: config?.tpsglobal ?? 0,
        numeromatch: config?.numeromatch ?? generateNumeromatch(),
        pieces: config?.pieces ?? [],
        sequence: config?.sequence ?? '',
    };
}